import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { AddClassInput } from './dto/addClass.input';
import { Users } from 'src/database/entities/user.entity';
import { Brackets, In, Repository, SelectQueryBuilder } from 'typeorm';
import { Classes } from 'src/database/entities/classes.entity';
import { GraphQLError } from 'graphql';
import { Category, Type } from 'src/database/entities/category.entity';
import { Schools } from 'src/database/entities/schools.entity';
import { SORT_ORDER, STATUS } from 'src/constants';
import { UpdateClassInput } from './dto/updateClass.input';
import { ListAllClassesInput } from './dto/listAllClasses.input';
import { TeacherClassMappings } from 'src/database/entities/teacher_class_mappings.entity';
import { StudentClassMappings } from 'src/database/entities/student_class_mappings.entity';
import { Subjects } from 'src/database/entities/subject.entity';
import { SubjectClassMappings } from 'src/database/entities/subject_class_mapping.entity';
import { AwsService } from 'src/aws/aws.service';
import { HelperService } from 'src/helper.service';
import { SuppliesList } from 'src/database/entities/supplies_list.entity';

@Injectable()
export class ClassService {
  constructor(
    @Inject('CLASSES_REPOSITORY')
    private readonly classRepository: Repository<Classes>,
    @Inject('CATEGORY_REPOSITORY')
    private readonly categoryRepository: Repository<Category>,
    @Inject('SCHOOL_REPOSITORY')
    private readonly schoolRepository: Repository<Schools>,
    @Inject('SUBJECTS_REPOSITORY')
    private readonly subjectRepository: Repository<Subjects>,
    @Inject('SUBJECT_CLASS_MAPPINGS_REPOSITORY')
    private readonly subjectClassMappingRepository: Repository<SubjectClassMappings>,
    @Inject('TEACHER_CLASS_MAPPINGS_REPOSITORY')
    private readonly teacherClassMappingsRepository: Repository<TeacherClassMappings>,
    @Inject('STUDENT_CLASS_MAPPINGS_REPOSITORY')
    private readonly studentClassMappingsRepository: Repository<StudentClassMappings>,
    @Inject('SUPPLIES_LIST_REPOSITORY')
    private readonly suppliesRepository: Repository<SuppliesList>,
    private readonly awsService: AwsService,
    private readonly helperService: HelperService,
  ) { }

  /**
   * Add Class by Admin
   * @param addClassData
   * @param user
   * @returns
   */
  async addClass(addClassData: AddClassInput, user: Users) {
    const { description, name, school_id, image_url } = addClassData;

    if (!this.helperService.isBase64(image_url)) {
      throw new GraphQLError('Invalid class image!', {
        extensions: {
          statusCode: HttpStatus.BAD_REQUEST,
        },
      });
    }
    const { Location } = await this.awsService.uploadToAWS(
      'class',
      image_url,
      'class',
    );

    const subject = await this.getMultipleSubjectByIds(
      addClassData?.subject_ids,
    );

    if (
      addClassData?.subject_ids &&
      subject?.length !== addClassData.subject_ids.length
    ) {
      throw new GraphQLError('Subject not found!', {
        extensions: {
          statusCode: HttpStatus.NOT_FOUND,
        },
      });
    }

    await this.findSchoolById(addClassData.school_id);

    const { id } = await this.classRepository.save({
      description,
      name,
      school_id,
      user_id: user.id,
      image_url: Location,
    });

    for await (const subject_id of addClassData.subject_ids) {
      await this.subjectClassMappingRepository.save({
        class_id: id,
        subject_id,
      });
    }

    return { message: 'Class created successfully!' };
  }

  /**
   * Update Class by Admin
   * @param classId
   * @param updateClassData
   */
  async updateClassById(classId: number, updateClassData: UpdateClassInput) {
    const { image_url } = await this.findClassById(classId);
    if (this.helperService.isBase64(updateClassData.image_url)) {
      const { Location } = await this.awsService.uploadToAWS(
        'class',
        updateClassData.image_url,
        'class',
      );
      updateClassData.image_url = Location;
      if (image_url) {
        await this.awsService.removeFromBucket(image_url);
      }
    }
    const subject = await this.getMultipleSubjectByIds(
      updateClassData?.subject_ids,
    );
    if (
      updateClassData?.subject_ids &&
      subject?.length !== updateClassData.subject_ids.length
    ) {
      throw new GraphQLError('Subject not found!', {
        extensions: {
          statusCode: HttpStatus.NOT_FOUND,
        },
      });
    }
    await this.findSchoolById(updateClassData.school_id);

    await this.classRepository.update(classId, {
      name: updateClassData.name,
      description: updateClassData.description,
      school_id: updateClassData.school_id,
      image_url: updateClassData.image_url,
    });

    updateClassData?.subject_ids.map(async (subject_id) => {
      const findSubjectWithClass = await this.findClassWithSubject(
        subject_id,
        classId,
      );
      if (!findSubjectWithClass) {
        await this.subjectClassMappingRepository.save({
          class_id: classId,
          subject_id: subject_id,
        });
      }
    });

    await this.subjectClassMappingRepository
      .createQueryBuilder()
      .update(SubjectClassMappings)
      .set({ deletedAt: new Date() })
      .where('class_id = :class_id AND subject_id NOT IN (:...subject_ids)', {
        class_id: classId,
        subject_ids: updateClassData?.subject_ids,
      })
      .execute();

    return { message: 'Class updated successfully!' };
  }

  /**
   * Get All Class list
   * @param listAllClassesData
   * @returns
   */
  async listAllClasses(listAllClassesData: ListAllClassesInput) {
    const { page, pageSize, sortBy, schoolId } = listAllClassesData;
    const sortOrder: any = listAllClassesData.sortOrder;
    const skip = (page - 1) * pageSize;

    if (
      listAllClassesData.type &&
      listAllClassesData.type === 'WITHOUT_PAGINATION'
    ) {
      const classQuery = this.classRepository
        .createQueryBuilder('classes')
        .leftJoinAndSelect('classes.schools', 'schools')
        .leftJoinAndSelect('classes.category', 'category')
        .leftJoinAndSelect(
          'classes.subject_class_mappings',
          'subject_class_mappings',
        )
        .leftJoinAndSelect('subject_class_mappings.subject', 'subject');
      if (listAllClassesData.classId) {
        classQuery.where('classes.id = :id', {
          id: listAllClassesData.classId,
        });
      }
      const classes = await classQuery.getMany();
      return { classes };
    } else {
      const queryBuilder: SelectQueryBuilder<Classes> = this.classRepository
        .createQueryBuilder('classes')
        .leftJoin('classes.schools', 'schools')
        .leftJoin('classes.category', 'category')
        .leftJoinAndSelect(
          'classes.subject_class_mappings',
          'subject_class_mappings',
        )
        .leftJoinAndSelect('subject_class_mappings.subject', 'subject')
        .addSelect(['schools.id', 'schools.name'])
        .addSelect(['category.id', 'category.name', 'category.type'])
        .skip(skip)
        .take(pageSize)
        .orderBy(
          `classes.${sortBy}`,
          SORT_ORDER.includes(sortOrder) ? sortOrder.toUpperCase() : 'DESC',
        );
      if (schoolId) {
        queryBuilder.where('classes.school_id = :schoolId', {
          schoolId,
        });
      }
      if (listAllClassesData.search) {
        queryBuilder.andWhere(
          new Brackets((qb) => {
            qb.where(
              'classes.name LIKE :search OR classes.description LIKE :search OR schools.name LIKE :search OR subject.name LIKE :search',
              { search: `%${listAllClassesData.search}%` },
            );
          }),
        );
      }
      if (listAllClassesData.status === 0 || listAllClassesData.status === 1) {
        queryBuilder.andWhere('classes.status = :status', {
          status: listAllClassesData.status,
        });
      }
      const [classes, total] = await queryBuilder.getManyAndCount();

      return { classes, total };
    }
  }

  /**
   * Update Class status By Id
   * @param classId
   * @param status
   * @returns
   */
  async updateClassStatusById(classId: number, status: number) {
    const isClassExist = await this.classRepository.findOne({
      where: { id: classId },
    });

    if (!isClassExist) {
      throw new GraphQLError('Class not found!', {
        extensions: {
          statusCode: HttpStatus.NOT_FOUND,
        },
      });
    }

    await this.classRepository.update(classId, { status });

    return { message: 'Class status updated successfully!' };
  }

  /**
   * Delete Class By Id
   * @param classId
   * @returns
   */
  async deleteClassById(classId: number) {
    await this.findClassById(classId);

    await this.studentClassMappingsRepository
      .createQueryBuilder()
      .update(StudentClassMappings)
      .set({ deletedAt: new Date() })
      .where('class_id = :class_id AND deletedAt IS NULL', {
        class_id: classId,
      })
      .execute();

    await this.teacherClassMappingsRepository.softDelete({ class_id: classId });

    await this.subjectClassMappingRepository.softDelete({ class_id: classId });

    await this.suppliesRepository.softDelete({ class_id: classId });
    await this.classRepository.softDelete(classId);

    return { message: 'Class deleted successfully!' };
  }

  /**
   * Find Class By Id Function
   * @param classId
   */
  async findClassById(classId: number) {
    const isClassExist = await this.classRepository.findOne({
      where: { id: classId },
    });

    if (!isClassExist) {
      throw new GraphQLError('Class not found!', {
        extensions: {
          statusCode: HttpStatus.NOT_FOUND,
        },
      });
    }
    return isClassExist;
  }

  /**
   * Find School By Id Function
   * @param schoolId
   */
  async findSchoolById(schoolId: number) {
    const isSchoolExist = await this.schoolRepository.findOne({
      where: { id: schoolId },
    });

    if (!isSchoolExist) {
      throw new GraphQLError('School not found!', {
        extensions: {
          statusCode: HttpStatus.NOT_FOUND,
        },
      });
    }

    if (isSchoolExist.status === STATUS.INACTIVE) {
      throw new GraphQLError('School is inactive!', {
        extensions: {
          statusCode: HttpStatus.BAD_REQUEST,
        },
      });
    }
  }

  /**
   * Find Category By Id Function
   * @param categoryId
   */
  async findCategoryById(categoryId: number) {
    const isCategoryExist = await this.categoryRepository.findOne({
      where: { id: categoryId, status: STATUS.ACTIVE },
    });

    if (!isCategoryExist) {
      throw new GraphQLError('Category not found!', {
        extensions: {
          statusCode: HttpStatus.NOT_FOUND,
        },
      });
    }

    if (isCategoryExist.type !== Type.CLASSES) {
      throw new GraphQLError('Invalid category type!', {
        extensions: {
          statusCode: HttpStatus.BAD_REQUEST,
        },
      });
    }
  }

  /**
   * Find Class By name & category id Function
   * @param className
   * @param categoryId
   */
  async findClassByNameAndCategoryId(
    className: string,
    categoryId: number,
    classId?: number,
  ) {
    const isClassExistWithName = await this.classRepository.findOne({
      where: { name: className, category_id: categoryId },
    });

    if (isClassExistWithName && isClassExistWithName.id != classId) {
      throw new GraphQLError(
        'Class already exist with this name and category!',
        {
          extensions: {
            statusCode: HttpStatus.BAD_REQUEST,
          },
        },
      );
    }
  }

  /**
   * Get multiple class by ids
   * @param subject_ids
   * @returns
   */
  async getMultipleSubjectByIds(subject_ids: number[]) {
    const subject = await this.subjectRepository.find({
      where: {
        id: In(subject_ids),
      },
    });
    return subject;
  }

  /**
   * Get multiple class by ids
   * @param subject_ids
   * @returns
   */
  async findClassWithSubject(subject_id: number, class_id: number) {
    const subjectClass = await this.subjectClassMappingRepository.findOne({
      where: {
        subject_id,
        class_id,
      },
    });
    return subjectClass;
  }
}
