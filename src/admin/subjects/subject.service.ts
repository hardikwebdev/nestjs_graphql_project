import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Subjects } from 'src/database/entities/subject.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateSubjectInput } from './dto/createSubject.input';
import { AwsService } from 'src/aws/aws.service';
import { HelperService } from 'src/helper.service';
import { GraphQLError } from 'graphql';
import { ListSubjectInput } from './dto/listSubject.input';
import { SORT_ORDER, STATUS } from 'src/constants';
import { SubjectClassMappings } from 'src/database/entities/subject_class_mapping.entity';
import { UpdateSubjectInput } from './dto/updateSubject.input';
import { LessonPlanAttachments } from 'src/database/entities/lesson_plan_attachments.entity';
import { LessonPlans } from 'src/database/entities/lesson_plans.entity';

@Injectable()
export class SubjectService {
  constructor(
    @Inject('SUBJECTS_REPOSITORY')
    private readonly subjectRepository: Repository<Subjects>,
    @Inject('SUBJECT_CLASS_MAPPINGS_REPOSITORY')
    private readonly subjectClassMapping: Repository<SubjectClassMappings>,
    @Inject('LESSON_PLAN_ATTACHMENTS_REPOSITORY')
    private readonly lessonPlanAttachmentsRepository: Repository<LessonPlanAttachments>,
    @Inject('LESSON_PLANS_REPOSITORY')
    private readonly lessonPlanRepository: Repository<LessonPlans>,
    private readonly awsService: AwsService,
    private readonly helperService: HelperService,
  ) { }

  /**
   * create subject
   * @param createSubject
   * @returns
   */
  async createSubject(createSubject: CreateSubjectInput) {
    const { image } = createSubject;
    if (!this.helperService.isBase64(image)) {
      throw new GraphQLError('Invalid image!', {
        extensions: {
          statusCode: HttpStatus.BAD_REQUEST,
        },
      });
    }
    const { Location } = await this.awsService.uploadToAWS(
      'subject',
      image,
      'subject',
    );

    createSubject.image = Location;
    await this.subjectRepository.save(createSubject);
    return { message: 'Subject created successfully!' };
  }

  /**
   * List all subject with pagination and search
   * @param listSubjectInput
   * @returns
   */
  async getAllSubjects(listSubjectInput: ListSubjectInput) {
    const { page, pageSize, sortBy, type } = listSubjectInput;
    const sortOrder: any = listSubjectInput.sortOrder;
    const skip = (page - 1) * pageSize;

    if (type && type === 'WITHOUT_PAGINATION') {
      const queryBuilder: SelectQueryBuilder<Subjects> = this.subjectRepository
        .createQueryBuilder('subjects')
        .where('subjects.status = :status', { status: STATUS.ACTIVE })
        .orderBy(
          `subjects.${sortBy}`,
          SORT_ORDER.includes(sortOrder) ? sortOrder.toUpperCase() : 'DESC',
        );
      const subject = await queryBuilder.getMany();
      return { subjects: subject };
    }

    const queryBuilder: SelectQueryBuilder<Subjects> = this.subjectRepository
      .createQueryBuilder('subjects')
      .skip(skip)
      .take(pageSize)
      .orderBy(
        `subjects.${sortBy}`,
        SORT_ORDER.includes(sortOrder) ? sortOrder.toUpperCase() : 'DESC',
      );

    if (listSubjectInput.search) {
      queryBuilder.andWhere(
        '( subjects.name LIKE :search OR subjects.sub_title LIKE :search OR subjects.description LIKE :search)',
        {
          search: `%${listSubjectInput.search}%`,
        },
      );
    }

    if (listSubjectInput.status === 0 || listSubjectInput.status === 1) {
      queryBuilder.andWhere('(subjects.status = :status)', {
        status: listSubjectInput.status,
      });
    }

    const [subjects, total] = await queryBuilder.getManyAndCount();
    return { subjects, total };
  }

  /**
   * update subject data
   * @param subject_id
   * @param updateSubjectData
   * @returns
   */
  async updateSubjectById(
    subject_id: number,
    updateSubjectData: UpdateSubjectInput,
  ) {
    const subject = await this.findSubject({ id: subject_id });
    const { image } = updateSubjectData;
    if (this.helperService.isBase64(image)) {
      const { Location } = await this.awsService.uploadToAWS(
        'subject',
        image,
        'subject',
      );
      if (subject.image) {
        await this.awsService.removeFromBucket(subject.image);
      }
      updateSubjectData.image = Location;
    }
    await this.updateSubject({ id: subject_id }, updateSubjectData);
    return { message: 'Subject updated successfully!' };
  }

  /**
   * Find subject by data
   * @param whereOptions
   * @returns
   */
  async findSubject(whereOptions: Partial<Subjects>) {
    const subject = await this.subjectRepository.findOne({
      where: whereOptions,
      withDeleted: false,
      relations: {
        lesson_plans: {
          lesson_plan_attachments: true,
        },
      },
    });
    if (!subject) {
      throw new GraphQLError('Subject not found!', {
        extensions: {
          statusCode: HttpStatus.NOT_FOUND,
        },
      });
    }
    return subject;
  }

  /**
   * update subject by whereOptions and updateOptions
   * @param whereOptions
   * @param updateOptions
   * @returns
   */
  async updateSubject(
    whereOptions: Partial<Subjects>,
    updateOptions: Partial<Subjects>,
  ) {
    await this.subjectRepository.update(whereOptions, updateOptions);
    return { message: 'Subject updated successfully!' };
  }

  /**
   * Delete subject by id
   * @param subject_id
   */
  async deleteSubjectById(subject_id: number) {
    const subject = await this.findSubject({ id: subject_id });
    if (subject.lesson_plans.length !== 0) {
      await Promise.allSettled(
        subject.lesson_plans.map(async (lessonPlan: LessonPlans) => {
          if (lessonPlan.lesson_plan_attachments.length !== 0) {
            await Promise.allSettled(
              lessonPlan.lesson_plan_attachments.map(
                async (lessonPlanAttachment: LessonPlanAttachments) => {
                  if (lessonPlanAttachment.pdf_url) {
                    await this.awsService.removeFromBucket(
                      lessonPlanAttachment.pdf_url,
                    );
                  }
                  await this.lessonPlanAttachmentsRepository.update(
                    { id: lessonPlanAttachment.id },
                    {
                      deletedAt: new Date(),
                    },
                  );
                },
              ),
            );
          }
        }),
      );
      await this.lessonPlanRepository.update(
        { subject_id: subject.id },
        { deletedAt: new Date() },
      );
    }
    await this.subjectClassMapping.update(
      {
        subject_id: subject_id,
      },
      { deletedAt: new Date() },
    );
    await this.updateSubject({ id: subject_id }, { deletedAt: new Date() });
    return { message: 'Subject deleted successfully!' };
  }
}
