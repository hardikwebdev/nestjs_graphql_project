import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Brackets, In, Repository, SelectQueryBuilder } from 'typeorm';
import { Users } from 'src/database/entities/user.entity';
import { GraphQLError } from 'graphql';
import { HelperService } from 'src/helper.service';
import { EmailService } from 'src/email/email.service';
import { UserSchoolMappings } from 'src/database/entities/user_school_mapping.entity';
import {
  IS_USER_VERIFIED,
  REQUEST_STATUS,
  REQUEST_TYPE,
  SORT_ORDER,
  STATUS,
  USER_ROLES,
  YES_NO_OR_CURRENTLY,
} from 'src/constants';
import { CreateTeacherInput } from './dto/createTeacher.input';
import { UpdateTeacherInput } from './dto/updateTeacher.input';
import { ListTeacherInput } from './dto/listTeachers.input';
import { ListTeachersPaperworkInput } from './dto/listTeachersPaperwork.input';
import { PaperWorks } from 'src/database/entities/paperworks.entity';
import { Classes } from 'src/database/entities/classes.entity';
import { AssignClassesToTeacherInput } from './dto/assignClassesToTeacher.input';
import { TeacherClassMappings } from 'src/database/entities/teacher_class_mappings.entity';
import { Students } from 'src/database/entities/student.entity';
// import { AssignStudentsToTeacherInput } from './dto/assignStudentsToTeacher.input';
import { CreateZoomCallTimingInput } from './dto/createZoomCallTiming.input';
import {
  TimeSlot,
  ZoomCallTiming,
} from 'src/database/entities/zoom_call_timing.entity';
import { ListTeachersSickRequestInput } from './dto/listTeachersSickRequest.input';
import { ListTeachersReimbursementRequestInput } from './dto/listTeachersReimbursementRequest.input';
import { ReimbursementRequests } from 'src/database/entities/reimbursement_receipt.entity';
import { ListZoomCallTimingInput } from './dto/listZoomCallTiming.input';
import { ListClockInOutInput } from 'src/frontend/clock-in-out/dto/listClockInOut.input';
import { UpdateTimeOffRequestInput } from './dto/updateTimeOffStatus.input';
import { UserOnboardingDocuments } from 'src/database/entities/user_onboarding_documents.entity';
import { LessonPlans } from 'src/database/entities/lesson_plans.entity';
import {
  UserRecentLogs,
  UserRecentLogsType,
} from 'src/database/entities/user_recent_logs.entity';
import {
  UserAttendence,
  UserAttendenceType,
} from 'src/database/entities/user_attendance.entity';
import { OnboardingDocumentsList } from 'src/database/entities/onboarding_documents_list.entity';

@Injectable()
export class TeachersService {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userRepository: Repository<Users>,
    @Inject('USER_SCHOOL_MAPPING_REPOSITORY')
    private readonly userSchoolMappingRepository: Repository<UserSchoolMappings>,
    @Inject('PAPERWORKS_REPOSITORY')
    private readonly paperworksRepository: Repository<PaperWorks>,
    @Inject('CLASSES_REPOSITORY')
    private readonly classesRepository: Repository<Classes>,
    @Inject('TEACHER_CLASS_MAPPINGS_REPOSITORY')
    private readonly teacherClassMappingRepository: Repository<TeacherClassMappings>,
    @Inject('STUDENTS_REPOSITORY')
    private readonly studentsRepository: Repository<Students>,
    @Inject('ZOOM_CALL_TIMING_REPOSITORY')
    private readonly zoomCallTimingRepository: Repository<ZoomCallTiming>,
    @Inject('REIMBURSEMENT_REQUESTS_REPOSITORY')
    private readonly reimbursementRequestsRepository: Repository<ReimbursementRequests>,
    @Inject('USER_ONBOARDING_DOCUMENTS_REPOSITORY')
    private readonly userOnboardingDocumentsRepository: Repository<UserOnboardingDocuments>,
    @Inject('LESSON_PLANS_REPOSITORY')
    private readonly lessonPlanRepository: Repository<LessonPlans>,
    @Inject('USER_RECENT_LOGS_REPOSITORY')
    private readonly userRecentLogsRepository: Repository<UserRecentLogs>,
    @Inject('USER_ATTENDANCE_REPOSITORY')
    private readonly userAttendanceRepository: Repository<UserAttendence>,
    @Inject('ONBOARDING_DOCUMENTS_LIST_REPOSITORY')
    private readonly onboardingDocumentsListRepository: Repository<OnboardingDocumentsList>,
    private readonly helperService: HelperService,
    private readonly emailService: EmailService,
  ) { }

  /**
   * Add Teacher by Admin
   * @param addTeacherData
   * @returns
   */
  async addTeacher(addTeacherData: CreateTeacherInput) {
    const isTeacherExist = await this.userRepository.findOne({
      where: { email: addTeacherData.email },
    });

    if (isTeacherExist) {
      throw new GraphQLError('Teacher with this email already exist!', {
        extensions: {
          statusCode: HttpStatus.BAD_REQUEST,
        },
      });
    }

    const password = this.helperService.generateRandomPassword();

    const hashedPassword = this.helperService.passwordHash(password);

    const newUser = await this.userRepository.save({
      ...addTeacherData,
      password: hashedPassword,
      role: USER_ROLES.TEACHER,
      is_verified: IS_USER_VERIFIED.TRUE,
    });

    if (addTeacherData.schoolId) {
      if (addTeacherData.schoolId.length !== 0) {
        const insertData = addTeacherData.schoolId.map((schoolId) => ({
          schoolId,
          userId: newUser.id,
        }));
        await this.userSchoolMappingRepository
          .createQueryBuilder()
          .insert()
          .into(UserSchoolMappings)
          .values(insertData)
          .execute();
      } else {
        throw new GraphQLError('School selection is required!', {
          extensions: {
            statusCode: HttpStatus.BAD_REQUEST,
          },
        });
      }
    }

    await this.createUserOnboardingDocumentsForTeacher(newUser.id);

    const htmlData = await this.emailService.renderTemplate(
      './views/email/loginCredential.hbs',
      {
        email: addTeacherData.email,
        username: addTeacherData.username,
        password: password,
        mailTo: process.env.SUPPORT_EMAIL,
        loginUrl: `${process.env.FRONTEND_URL}/login`,
        logo: `${process.env.BACKEND_URL}/images/logo.png`,
      },
    );

    this.emailService.sendMail(
      addTeacherData.email,
      'Login Credential',
      'NOTE :- DO NOT SHARE YOUR LOGIN CREDENTIAL WITH ANYONE',
      htmlData,
    );

    return { message: 'Teacher created successfully!' };
  }

  /**
   * Update Teacher by id
   * @param updateTeacherData
   * @param teacherId
   */
  async updateTeacher(
    updateTeacherData: UpdateTeacherInput,
    teacherId: number,
  ) {
    const isTeacherExist = await this.getTeacherById(teacherId);

    if (!isTeacherExist) {
      throw new GraphQLError('Teacher not found!', {
        extensions: {
          statusCode: HttpStatus.NOT_FOUND,
        },
      });
    }

    if (updateTeacherData.schoolId) {
      if (updateTeacherData.schoolId.length !== 0) {
        updateTeacherData.schoolId.map(async (schoolId) => {
          const isSchoolMappingExist =
            await this.userSchoolMappingRepository.findOne({
              where: { schoolId, userId: teacherId },
            });

          if (!isSchoolMappingExist) {
            await this.userSchoolMappingRepository.insert({
              schoolId,
              userId: teacherId,
            });
          }
        });
        await this.userSchoolMappingRepository
          .createQueryBuilder()
          .update(UserSchoolMappings)
          .set({ deletedAt: new Date() })
          .where(
            'userId = :teacherId AND schoolId NOT IN (:...schoolIds) AND deletedAt IS NULL',
            {
              teacherId,
              schoolIds: updateTeacherData.schoolId,
            },
          )
          .execute();
      } else {
        throw new GraphQLError('School selection is required!', {
          extensions: {
            statusCode: HttpStatus.BAD_REQUEST,
          },
        });
      }
    }

    await this.userRepository.update(teacherId, {
      username: updateTeacherData.username,
      firstname: updateTeacherData.firstname,
      lastname: updateTeacherData.lastname,
      phone_number: updateTeacherData.phone_number || null,
      position: updateTeacherData.position || null,
      description: updateTeacherData.description || null,
    });

    return { message: 'Teacher updated successfully!' };
  }

  /**
   * Get All Teachers with Search, Filter and Pagination
   * @param listTeacherData
   * @returns
   */
  async getAllTeachers(listTeacherData: ListTeacherInput) {
    const { page, pageSize, sortBy, schoolId } = listTeacherData;
    const sortOrder: any = listTeacherData.sortOrder;
    const skip = (page - 1) * pageSize;
    if (listTeacherData.type && listTeacherData.type === 'WITHOUT_PAGINATION') {
      const teacherQuery = this.userRepository
        .createQueryBuilder('users')
        .where(
          new Brackets((qb) => {
            qb.where('users.role = :teacher', { teacher: USER_ROLES.TEACHER });
          }),
        );

      const users = await teacherQuery
        .select(['users.id', 'users.firstname', 'users.lastname'])
        .getMany();
      return { users };
    } else {
      const queryBuilder: SelectQueryBuilder<Users> = this.userRepository
        .createQueryBuilder('users')
        .leftJoin('users.userSchoolMappings', 'userSchoolMappings')
        .leftJoin('userSchoolMappings.schools', 'schools')
        .where(
          new Brackets((qb) => {
            qb.where('users.role = :teacher', { teacher: USER_ROLES.TEACHER });
          }),
        )
        .andWhere(
          new Brackets((qb) => {
            if (listTeacherData.search) {
              qb.where(
                '(users.username LIKE :search OR CONCAT(users.firstname, " ", users.lastname) LIKE :search OR users.email LIKE :search OR users.phone_number LIKE :search)',
                { search: `%${listTeacherData.search}%` },
              );
            }
            if (
              listTeacherData.status === 0 ||
              listTeacherData.status === 1 ||
              listTeacherData.status === 2
            ) {
              qb.andWhere('users.status = :status', {
                status: listTeacherData.status,
              });
            }
          }),
        )
        .addSelect(['userSchoolMappings.schoolId', 'userSchoolMappings.id'])
        .addSelect(['schools.name', 'schools.id'])
        .skip(skip)
        .take(pageSize)
        .orderBy(
          `users.${sortBy}`,
          SORT_ORDER.includes(sortOrder) ? sortOrder.toUpperCase() : 'DESC',
        );
      if (schoolId) {
        queryBuilder.andWhere('userSchoolMappings.schoolId = :schoolId', {
          schoolId: schoolId,
        });
      }
      const [users, total] = await queryBuilder.getManyAndCount();

      return { users, total };
    }
  }

  /**
   * Delete Teacher by id
   * @param teacherId
   * @returns
   */
  async deleteTeacherById(teacherId: number) {
    const isTeacherExist = await this.getTeacherById(teacherId);

    if (!isTeacherExist) {
      throw new GraphQLError('Teacher not found!', {
        extensions: {
          statusCode: HttpStatus.NOT_FOUND,
        },
      });
    }

    await this.userRepository.update(teacherId, {
      deletedAt: new Date(),
    });

    await this.lessonPlanRepository.update(
      {
        user_id: teacherId,
      },
      {
        deletedAt: new Date(),
      },
    );

    return { message: 'Teacher deleted successfully!' };
  }

  /**
   * Get Teacher by ID
   * @param teacherId
   * @returns
   */
  async getTeacherByID(teacherId: number) {
    const isTeacherExist = await this.userRepository
      .createQueryBuilder('users')
      .leftJoin('users.userSchoolMappings', 'userSchoolMappings')
      .select(['users', 'userSchoolMappings.schoolId', 'userSchoolMappings.id'])
      .where('users.id = :id', { id: teacherId })
      .getOne();

    if (!isTeacherExist) {
      throw new GraphQLError('Teacher not found!', {
        extensions: {
          statusCode: HttpStatus.NOT_FOUND,
        },
      });
    }

    return isTeacherExist;
  }

  /**
   * Update Teacher Status by Id
   * @param teacherId
   * @param status
   * @returns
   */
  async updateTeacherStatus(teacherId: number, status: number) {
    const isTeacherExist = await this.getTeacherById(teacherId);

    if (!isTeacherExist) {
      throw new GraphQLError('Teacher not found!', {
        extensions: {
          statusCode: HttpStatus.NOT_FOUND,
        },
      });
    }

    await this.userRepository.update(teacherId, { status });

    return { message: 'Teacher status updated successfully!' };
  }

  /**
   * Get All Paperworks created by Teachers with Pagination
   * @param listPaperworkData
   * @returns
   */
  async getAllTeachersPaperwork(listPaperworkData: ListTeachersPaperworkInput) {
    const { page, pageSize, sortBy } = listPaperworkData;
    const sortOrder: any = listPaperworkData.sortOrder;
    const skip = (page - 1) * pageSize;

    const queryBuilder: SelectQueryBuilder<PaperWorks> =
      this.paperworksRepository
        .createQueryBuilder('paperworks')
        .leftJoinAndSelect('paperworks.user', 'user')
        .leftJoinAndSelect('paperworks.student', 'student')
        .where(
          new Brackets((qb) => {
            if (listPaperworkData.teacherId) {
              qb.where('user.id = :teacherId', {
                teacherId: listPaperworkData.teacherId,
              });
            } else {
              qb.where('user.role = :role', { role: USER_ROLES.TEACHER });
            }
          }),
        )
        .andWhere(
          new Brackets((qb) => {
            if (listPaperworkData.search) {
              qb.where(
                '(paperworks.title LIKE :search OR CONCAT(user.firstname, " ", user.lastname) LIKE :search OR user.username LIKE :search OR CONCAT(student.firstname, " ", student.lastname) LIKE :search)',
                { search: `%${listPaperworkData.search}%` },
              );
            }
          }),
        )
        .select([
          'paperworks.id',
          'paperworks.title',
          'paperworks.paperwork_url',
          'paperworks.createdAt',
          'paperworks.updatedAt',
          'user.id',
          'user.firstname',
          'user.lastname',
          'user.email',
          'student.id',
          'student.firstname',
          'student.lastname',
        ])
        .skip(skip)
        .take(pageSize)
        .orderBy(
          `paperworks.${sortBy}`,
          SORT_ORDER.includes(sortOrder) ? sortOrder.toUpperCase() : 'DESC',
        );

    const [paperworks, total] = await queryBuilder.getManyAndCount();

    return { paperworks, total };
  }

  /**
   * Get All class list by teacher schools
   * @param teacherId
   * @returns
   */
  async getClassListByTeacherSchools(teacherId: number) {
    const userSchoolMappings = await this.userSchoolMappingRepository.find({
      where: { userId: teacherId, status: STATUS.ACTIVE },
    });

    if (userSchoolMappings.length === 0) {
      throw new GraphQLError('No school assigned!', {
        extensions: {
          statusCode: HttpStatus.NOT_FOUND,
        },
      });
    }

    const classes: any = await this.classesRepository.find({
      where: {
        status: STATUS.ACTIVE,
        school_id: In(userSchoolMappings.map((mapping) => mapping.schoolId)),
      },
      select: ['id', 'name'],
    });

    const teacherClassMappings = await this.teacherClassMappingRepository.find({
      where: {
        teacher_id: teacherId,
        class_id: In(classes.map((cls) => cls.id)),
        status: STATUS.ACTIVE,
      },
    });

    const assignedClassIds = new Set(
      teacherClassMappings.map((mapping) => mapping.class_id),
    );

    classes.forEach((cls) => {
      cls.isAssign = assignedClassIds.has(cls.id);
    });

    return { classes };
  }

  /**
   * Assign Classes to Teacher
   * @param teacherId
   * @param assignClassesData
   * @returns
   */
  async assignClassesToTeacher(
    teacherId: number,
    assignClassesData: AssignClassesToTeacherInput,
  ) {
    if (assignClassesData.classIds && assignClassesData.classIds.length !== 0) {
      assignClassesData.classIds.map(async (classId) => {
        const isTeacherClassMappingExist =
          await this.teacherClassMappingRepository.findOne({
            where: { class_id: classId, teacher_id: teacherId },
          });

        if (!isTeacherClassMappingExist) {
          await this.teacherClassMappingRepository.insert({
            class_id: classId,
            teacher_id: teacherId,
          });
        }
      });
      await this.teacherClassMappingRepository
        .createQueryBuilder()
        .update(TeacherClassMappings)
        .set({ deletedAt: new Date() })
        .where(
          'teacher_id = :teacherId AND class_id NOT IN (:...classIds) AND deletedAt IS NULL',
          {
            teacherId,
            classIds: assignClassesData.classIds,
          },
        )
        .execute();
    } else {
      throw new GraphQLError('Class selection is required', {
        extensions: {
          statusCode: HttpStatus.BAD_REQUEST,
        },
      });
    }

    return { message: 'Classes assigned successfully to teacher!' };
  }

  /**
   * UnAssign All Classes for particular Teacher
   * @param teacherId
   * @returns
   */
  async removeAllClassMappingbyTeacherId(teacherId: number) {
    const isClassMappingExist = await this.teacherClassMappingRepository.find({
      where: { teacher_id: teacherId },
    });

    if (isClassMappingExist.length !== 0) {
      await this.teacherClassMappingRepository
        .createQueryBuilder()
        .update(TeacherClassMappings)
        .set({ deletedAt: new Date() })
        .where('teacher_id = :teacherId AND deletedAt IS NULL', {
          teacherId,
        })
        .execute();
    } else {
      throw new GraphQLError('No class assigned to this teacher!', {
        extensions: {
          statusCode: HttpStatus.BAD_REQUEST,
        },
      });
    }

    return { message: 'All classes unassigned successfully to teacher!' };
  }

  /**
   * Get All Assign classes by TeacherID
   * @param teacherId
   * @returns
   */
  async getAssignClassesbyTeacherId(teacherId: number) {
    const queryBuilder: SelectQueryBuilder<TeacherClassMappings> =
      this.teacherClassMappingRepository
        .createQueryBuilder('teacher_class_mappings')
        .leftJoin('teacher_class_mappings.class', 'class')
        .where('teacher_class_mappings.teacher_id = :teacherId', { teacherId })
        .addSelect(['class.id', 'class.name']);

    const [teacherClassMappings, total] = await queryBuilder.getManyAndCount();

    return { teacherClassMappings, total };
  }

  /**
   * Restrict Class Access for particular Teacher
   * @param teacherId
   * @param classId
   * @param status
   * @returns
   */
  async restrictClassAccessbyTeacherId(
    teacherId: number,
    classId: number,
    status: number,
  ) {
    await this.teacherClassMappingRepository.update(
      { teacher_id: teacherId, class_id: classId },
      { status },
    );

    return { message: 'Class access updated successfully!' };
  }

  /**
   * Disable Chat Feature for particular Teacher
   * @param teacherId
   * @param status
   * @returns
   */
  async disableChatFeaturebyTeacherId(teacherId: number, status: number) {
    const isTeacherExist = await this.getTeacherById(teacherId);

    if (isTeacherExist.status === STATUS.INACTIVE) {
      throw new GraphQLError(
        "Teacher is inactive you can't update chat feature!",
        {
          extensions: {
            statusCode: HttpStatus.BAD_REQUEST,
          },
        },
      );
    }

    await this.userRepository.update(
      { id: teacherId, status: STATUS.ACTIVE },
      { chat_feature: status },
    );

    return { message: 'Chat feature updated successfully!' };
  }

  /**
   * Create Zoom Call Timing for particular Teacher
   * @param teacherId
   * @param createZoomCallTimingData
   * @returns
   */
  async createZoomCallTimingbyTeacherId(
    teacherId: number,
    createZoomCallTimingData: CreateZoomCallTimingInput,
  ) {
    const date = String(createZoomCallTimingData.date.getDate()).padStart(
      2,
      '0',
    );
    const month = String(createZoomCallTimingData.date.getMonth() + 1).padStart(
      2,
      '0',
    );
    const year = createZoomCallTimingData.date.getFullYear();

    const isZoomCallTimingExistByDate = await this.zoomCallTimingRepository
      .createQueryBuilder()
      .where('teacher_id = :teacherId AND date = :date', {
        teacherId,
        date: `${year}-${month}-${date}`,
      })
      .getOne();

    if (isZoomCallTimingExistByDate) {
      const updatedTimeSlots = await this.mergeUniqueTimeSlots(
        isZoomCallTimingExistByDate.time_slots,
        createZoomCallTimingData.time_slots,
      );

      isZoomCallTimingExistByDate.time_slots = updatedTimeSlots;
      await this.zoomCallTimingRepository.save(isZoomCallTimingExistByDate);
    } else {
      await this.zoomCallTimingRepository.save({
        teacher_id: teacherId,
        ...createZoomCallTimingData,
      });
    }

    return { message: 'Zoom call timing created successfully!' };
  }

  /**
   * Get All Sick Requests submitted by Teachers with Pagination
   * @param listTeachersSickRequest
   * @returns
   */
  async getAllSickRequests(
    listTeachersSickRequest: ListTeachersSickRequestInput,
  ) {
    const { page, pageSize, sortBy } = listTeachersSickRequest;
    const sortOrder: any = listTeachersSickRequest.sortOrder;
    const skip = (page - 1) * pageSize;

    const queryBuilder: SelectQueryBuilder<UserRecentLogs> =
      this.userRecentLogsRepository
        .createQueryBuilder('user_recent_logs')
        .leftJoinAndSelect('user_recent_logs.user', 'user')
        .where(
          new Brackets((qb) => {
            if (listTeachersSickRequest.teacherId) {
              qb.where('user.id = :teacherId', {
                teacherId: listTeachersSickRequest.teacherId,
              });
            } else {
              qb.where('user.role = :role', { role: USER_ROLES.TEACHER });
            }
          }),
        )
        .andWhere(
          new Brackets((qb) => {
            if (listTeachersSickRequest.search) {
              qb.where(
                '(user_recent_logs.reason LIKE :search OR CONCAT(user.firstname, " ", user.lastname) LIKE :search OR user.username LIKE :search)',
                { search: `%${listTeachersSickRequest.search}%` },
              );
            }
          }),
        )
        .select([
          'user_recent_logs.id',
          'user_recent_logs.user_id',
          'user_recent_logs.reason',
          'user_recent_logs.date',
          'user_recent_logs.start_time',
          'user_recent_logs.end_time',
          'user_recent_logs.status',
          'user_recent_logs.type',
          'user_recent_logs.createdAt',
          'user_recent_logs.updatedAt',
          'user.id',
          'user.firstname',
          'user.lastname',
          'user.email',
        ])
        .skip(skip)
        .take(pageSize)
        .orderBy(
          `user_recent_logs.${sortBy}`,
          SORT_ORDER.includes(sortOrder) ? sortOrder.toUpperCase() : 'DESC',
        );

    if (
      listTeachersSickRequest?.start_date &&
      listTeachersSickRequest?.end_date
    ) {
      queryBuilder.andWhere(
        'user_recent_logs.date BETWEEN :start_date AND :end_date',
        {
          start_date: listTeachersSickRequest.start_date,
          end_date: listTeachersSickRequest.end_date,
        },
      );
    }
    if (
      listTeachersSickRequest?.status !== null &&
      listTeachersSickRequest?.status >= 0
    ) {
      queryBuilder.andWhere('(user_recent_logs.status = :status)', {
        status: listTeachersSickRequest.status,
      });
    }
    if (listTeachersSickRequest?.type) {
      queryBuilder.andWhere('(user_recent_logs.type = :type)', {
        type: listTeachersSickRequest.type,
      });
    } else {
      queryBuilder.andWhere(
        '(user_recent_logs.type = :type1 OR user_recent_logs.type = :type2)',
        {
          type1: UserRecentLogsType.SICK,
          type2: UserRecentLogsType.TIME_OFF,
        },
      );
    }
    const [sick_requests, total] = await queryBuilder.getManyAndCount();

    return { sick_requests, total };
  }

  /**
   * Get All Reimbursement Requests submitted by Teachers with Pagination
   * @param listTeachersReimbursementRequest
   * @returns
   */
  async getAllReimbursementRequests(
    listTeachersReimbursementRequest: ListTeachersReimbursementRequestInput,
  ) {
    const { page, pageSize, sortBy } = listTeachersReimbursementRequest;
    const sortOrder: any = listTeachersReimbursementRequest.sortOrder;
    const skip = (page - 1) * pageSize;

    const queryBuilder: SelectQueryBuilder<ReimbursementRequests> =
      this.reimbursementRequestsRepository
        .createQueryBuilder('reimbursement_requests')
        .leftJoinAndSelect('reimbursement_requests.users', 'users')
        .where(
          new Brackets((qb) => {
            if (listTeachersReimbursementRequest.teacherId) {
              qb.where('users.id = :teacherId', {
                teacherId: listTeachersReimbursementRequest.teacherId,
              });
            } else {
              qb.where('users.role = :role', { role: USER_ROLES.TEACHER });
            }
          }),
        )
        .andWhere(
          new Brackets((qb) => {
            if (listTeachersReimbursementRequest.search) {
              qb.where(
                '(reimbursement_requests.title LIKE :search OR reimbursement_requests.amount LIKE :search OR reimbursement_requests.description LIKE :search OR CONCAT(users.firstname, " ", users.lastname) LIKE :search OR users.username LIKE :search OR users.email LIKE :search)',
                { search: `%${listTeachersReimbursementRequest.search}%` },
              );
            }

            if (listTeachersReimbursementRequest.date) {
              qb.where('(reimbursement_requests.date LIKE :date)', {
                date: `%${listTeachersReimbursementRequest.date}%`,
              });
            }

            if (
              listTeachersReimbursementRequest.status === 0 ||
              listTeachersReimbursementRequest.status === 1 ||
              listTeachersReimbursementRequest.status === 2
            ) {
              qb.andWhere('(reimbursement_requests.status = :status)', {
                status: listTeachersReimbursementRequest.status,
              });
            }
          }),
        )
        .select([
          'reimbursement_requests.id',
          'reimbursement_requests.teacher_id',
          'reimbursement_requests.title',
          'reimbursement_requests.description',
          'reimbursement_requests.amount',
          'reimbursement_requests.image_url',
          'reimbursement_requests.type',
          'reimbursement_requests.status',
          'reimbursement_requests.createdAt',
          'reimbursement_requests.updatedAt',
          'users.id',
          'users.firstname',
          'users.lastname',
          'users.email',
        ])
        .skip(skip)
        .take(pageSize)
        .orderBy(
          `reimbursement_requests.${sortBy}`,
          SORT_ORDER.includes(sortOrder) ? sortOrder.toUpperCase() : 'DESC',
        );

    const [reimbursement_requests, total] =
      await queryBuilder.getManyAndCount();

    return { reimbursement_requests, total };
  }

  /**
   * Get All Zoom Call Timings List by Teacher with Pagination
   * @param teacherId
   * @param zoomCallTimingData
   * @returns
   */
  async getAllZoomCallTimingsList(zoomCallTimingData: ListZoomCallTimingInput) {
    const { page, pageSize } = zoomCallTimingData;
    const sortOrder: any = zoomCallTimingData.sortOrder;
    const skip = (page - 1) * pageSize;
    const currentDate = new Date().toISOString().split('T')[0];

    if (
      zoomCallTimingData.type &&
      zoomCallTimingData.type === 'WITHOUT_PAGINATION'
    ) {
      const zoomCallTimings = await this.zoomCallTimingRepository
        .createQueryBuilder('zoom_call_timings')
        .leftJoin('zoom_call_timings.user', 'user')
        .where('zoom_call_timings.id = :id', {
          id: zoomCallTimingData.zoomCallTimingID,
        })
        .select([
          'zoom_call_timings',
          'user.id',
          'user.firstname',
          'user.lastname',
        ])
        .getOne();

      return { zoomCallTimings: zoomCallTimings ? [zoomCallTimings] : [] };
    } else {
      const queryBuilder: SelectQueryBuilder<ZoomCallTiming> =
        this.zoomCallTimingRepository
          .createQueryBuilder('zoom_call_timings')
          .leftJoin('zoom_call_timings.user', 'user')
          .where('zoom_call_timings.teacher_id = :teacherId', {
            teacherId: zoomCallTimingData.teacherID,
          })
          .andWhere('zoom_call_timings.date >= :currentDate', {
            currentDate,
          })
          .andWhere(
            new Brackets((qb) => {
              if (zoomCallTimingData.date) {
                qb.where('zoom_call_timings.date = :date', {
                  date: zoomCallTimingData.date,
                });
              }
            }),
          )
          .select([
            'zoom_call_timings',
            'user.id',
            'user.firstname',
            'user.lastname',
          ])
          .skip(skip)
          .take(pageSize)
          .orderBy(
            `zoom_call_timings.updatedAt`,
            SORT_ORDER.includes(sortOrder) ? sortOrder.toUpperCase() : 'DESC',
          );

      const [zoomCallTimings, total] = await queryBuilder.getManyAndCount();

      return { zoomCallTimings, total };
    }
  }

  /**
   * Update Zoom Call Timing Slots
   * @param zoomCallID
   * @param updateZoomCallTimingData
   * @returns
   */
  async updateZoomCallTimingSlots(
    zoomCallID: number,
    updateZoomCallTimingData: CreateZoomCallTimingInput,
  ) {
    const zoomCallTiming = await this.zoomCallTimingRepository.findOne({
      where: { id: zoomCallID },
    });

    if (!zoomCallTiming) {
      throw new GraphQLError('Zoom call timing not found!', {
        extensions: {
          statusCode: HttpStatus.NOT_FOUND,
        },
      });
    }

    await this.zoomCallTimingRepository.update(
      { id: zoomCallID },
      {
        time_slots: updateZoomCallTimingData.time_slots,
        date: updateZoomCallTimingData.date,
      },
    );

    return { message: 'Zoom call timing updated successfully!' };
  }

  /**
   * Delete Zoom Call Timing
   * @param zoomCallID
   * @returns
   */
  async deleteZoomCallTiming(zoomCallID: number) {
    const zoomCallTiming = await this.zoomCallTimingRepository.findOne({
      where: { id: zoomCallID },
    });

    if (!zoomCallTiming) {
      throw new GraphQLError('Zoom call timing not found!', {
        extensions: {
          statusCode: HttpStatus.NOT_FOUND,
        },
      });
    }
    await this.zoomCallTimingRepository.softDelete({ id: zoomCallID });

    return { message: 'Zoom call timing deleted successfully!' };
  }

  /**
   * Get All Clock In Out Logs History by TeacherID with Pagination
   * @param listClockInOutData
   * @param teacherId
   * @returns
   */
  async listClockInOutByTeacherID(
    listClockInOutData: ListClockInOutInput,
    teacherId: number,
  ) {
    const { page, pageSize, sortBy } = listClockInOutData;
    const sortOrder: any = listClockInOutData.sortOrder;
    const skip = (page - 1) * pageSize;

    const queryBuilder: SelectQueryBuilder<UserRecentLogs> =
      this.userRecentLogsRepository
        .createQueryBuilder('user_recent_logs')
        .leftJoin('user_recent_logs.user', 'user')
        .leftJoin('user_recent_logs.student', 'student')
        .where(
          'user_recent_logs.user_id = :userId AND user_recent_logs.reason IS NULL',
          { userId: teacherId },
        )
        .andWhere(
          new Brackets((qb) => {
            if (listClockInOutData.date) {
              qb.where('user_recent_logs.date = :date', {
                date: listClockInOutData.date,
              });
            }
          }),
        )
        .select([
          'user_recent_logs',
          'user.id',
          'user.firstname',
          'user.lastname',
          'student.id',
          'student.firstname',
          'student.lastname',
        ])
        .skip(skip)
        .take(pageSize)
        .orderBy(
          `user_recent_logs.${sortBy}`,
          SORT_ORDER.includes(sortOrder) ? sortOrder.toUpperCase() : 'DESC',
        );

    const [clockInOutLogs, total] = await queryBuilder.getManyAndCount();

    return { clockInOutLogs, total };
  }

  /**
   * Commen Get Teacher By Id function
   * @param id
   * @returns
   */
  async getTeacherById(id: number) {
    return await this.userRepository.findOneBy({ id });
  }

  /**
   * Approve or reject time-off request
   * @param timeOffId
   * @param updateSickRequestStatusInput
   * @returns
   */
  async approveOrRejectSickRequest(
    timeOffId: number,
    updateSickRequestStatusInput: UpdateTimeOffRequestInput,
  ) {
    const timeOffRequest = await this.userRecentLogsRepository.findOne({
      where: { id: timeOffId },
    });
    if (!timeOffRequest) {
      throw new GraphQLError('No request found!', {
        extensions: {
          statusCode: HttpStatus.NOT_FOUND,
        },
      });
    }
    const teacher = await this.userRepository.findOne({
      where: { id: updateSickRequestStatusInput.teacherId },
    });
    if (!teacher) {
      throw new GraphQLError('Teacher not found!', {
        extensions: {
          statusCode: HttpStatus.NOT_FOUND,
        },
      });
    }
    await this.userRecentLogsRepository.update(
      { id: timeOffId },
      { status: updateSickRequestStatusInput.status },
    );

    if (
      timeOffRequest.type === UserRecentLogsType.TIME_OFF &&
      updateSickRequestStatusInput.status === REQUEST_STATUS.APPROVED
    ) {
      const start_time = timeOffRequest.start_time.split(':').map(Number);
      const end_time = timeOffRequest.end_time.split(':').map(Number);

      const startDate = new Date();
      startDate.setHours(start_time[0], start_time[1], start_time[2] || 0, 0);
      const endDate = new Date();
      endDate.setHours(end_time[0], end_time[1], end_time[2] || 0, 0);

      const timeDifferenceInMillis = endDate.getTime() - startDate.getTime();

      const timeDifferenceInSeconds = Math.floor(timeDifferenceInMillis / 1000);

      const isAttendanceExist = await this.userAttendanceRepository.findOne({
        where: {
          user_id: updateSickRequestStatusInput.teacherId,
          date: timeOffRequest.date,
        },
      });

      if (isAttendanceExist) {
        await this.userAttendanceRepository.update(
          { id: isAttendanceExist.id },
          {
            timeOff_hours:
              Number(isAttendanceExist.timeOff_hours) +
              Number(timeDifferenceInSeconds),
          },
        );
      } else {
        await this.userAttendanceRepository.insert({
          type: UserAttendenceType.CLOCK_IN_OUT,
          date: timeOffRequest.date,
          timeOff_hours: timeDifferenceInSeconds,
          user_id: updateSickRequestStatusInput.teacherId,
        });
      }
    }

    if (
      timeOffRequest.type === UserRecentLogsType.SICK &&
      updateSickRequestStatusInput.status === REQUEST_STATUS.APPROVED
    ) {
      const isAttendanceExist = await this.userAttendanceRepository.findOne({
        where: {
          user_id: updateSickRequestStatusInput.teacherId,
          date: timeOffRequest.date,
        },
      });

      if (isAttendanceExist) {
        await this.userAttendanceRepository.update(
          { id: isAttendanceExist.id },
          {
            type: UserAttendenceType.SICK,
          },
        );
      } else {
        await this.userAttendanceRepository.insert({
          type: UserAttendenceType.SICK,
          date: timeOffRequest.date,
          user_id: updateSickRequestStatusInput.teacherId,
        });
      }
    }

    return {
      message: `${REQUEST_TYPE[timeOffRequest.type]} request has been ${REQUEST_STATUS[updateSickRequestStatusInput.status]}!`,
    };
  }

  /**
   * Update Reimbursement Request Status (1: approve OR 2: reject)
   * @param reimbursementId
   * @param status
   * @returns
   */
  async updateReimbursementRequestStatus(
    reimbursementId: number,
    status: number,
  ) {
    const isReimbursementExist =
      await this.reimbursementRequestsRepository.findOne({
        where: { id: reimbursementId },
      });

    if (!isReimbursementExist) {
      throw new GraphQLError('Reimbursement request not found!', {
        extensions: {
          statusCode: HttpStatus.NOT_FOUND,
        },
      });
    }

    const msg = REQUEST_STATUS[status];

    await this.reimbursementRequestsRepository.update(
      { id: reimbursementId },
      { status },
    );

    return { message: `Reimbursement request ${msg} successfully!` };
  }

  /**
   * Merge Unique Time Slots Function
   * @param existingTimeSlots
   * @param newTimeSlots
   * @returns
   */
  async mergeUniqueTimeSlots(
    existingTimeSlots: Partial<TimeSlot[]>,
    newTimeSlots: Partial<TimeSlot[]>,
  ): Promise<TimeSlot[]> {
    const mergedTimeSlots: any = [...existingTimeSlots];

    for (const newSlot of newTimeSlots) {
      const isDuplicate = existingTimeSlots.some(
        (existingSlot) =>
          newSlot.start_time === existingSlot.start_time &&
          newSlot.end_time === existingSlot.end_time,
      );

      if (!isDuplicate) {
        mergedTimeSlots.push(newSlot);
      }
    }

    return mergedTimeSlots;
  }

  /**
   * Insert multiple Entry In user onboarding documents table Function
   * @param teacherId
   * @param ItemNumber
   */
  async createUserOnboardingDocumentsForTeacher(teacherId: number) {
    const documentsToInsert = [];

    const documentsList = await this.onboardingDocumentsListRepository.find({
      where: { for_teachers: YES_NO_OR_CURRENTLY.YES },
    });

    for (const document of documentsList) {
      documentsToInsert.push({
        user_id: teacherId,
        document_id: document.id,
      });
    }

    await this.userOnboardingDocumentsRepository.insert(documentsToInsert);
  }
}
