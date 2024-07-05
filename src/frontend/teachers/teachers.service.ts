import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Students } from 'src/database/entities/student.entity';
import { Users } from 'src/database/entities/user.entity';
import { Brackets, In, Not, Repository, SelectQueryBuilder } from 'typeorm';
import { ListStudentInputType } from './dto/listStudent.input';
import {
  IMAGE_TYPES,
  MEETING_STATUS,
  MessageType,
  REQUEST_STATUS,
  RequestType,
  SORT_ORDER,
  STATUS,
  USER_ROLES,
} from 'src/constants';
import { GraphQLError } from 'graphql';
import { UserSchoolMappings } from 'src/database/entities/user_school_mapping.entity';
import { Classes } from 'src/database/entities/classes.entity';
import { TeacherClassMappings } from 'src/database/entities/teacher_class_mappings.entity';
import { Category } from 'src/database/entities/category.entity';
import { StudentClassMappings } from 'src/database/entities/student_class_mappings.entity';
import { ListClassInputType } from './dto/assignedClassList.input';
import {
  MediaType,
  ReimbursementRequests,
} from 'src/database/entities/reimbursement_receipt.entity';
import { AddReimbursmentRequest } from './dto/addReimbursmentRequest.input';
import { HelperService } from 'src/helper.service';
import { AwsService } from 'src/aws/aws.service';
import { ListReimbursmentRequest } from './dto/listReimbursment.input';
import { CreateTimeOffInputType } from './dto/createTimeOff.input';
import { SickRequests } from 'src/database/entities/sick_requests.entity';
import { ListTimeOffRequestInput } from './dto/listTimeOff.input';
import { UpdateTeacherProfileInput } from './dto/updateProfile.input';
import { UserOnboardingDocuments } from 'src/database/entities/user_onboarding_documents.entity';
import { AddOnboardingDocumentInput } from './dto/addOnboardingDocument.input';
import { AddLogEventInput } from './dto/addLogEvent.input';
import { LogEvents } from 'src/database/entities/log_events.entity';
import { UpdateTeacherProfileObject } from './dto/updateTeacherProfile.object';
import { UpdateLogEventInput } from './dto/updateLogEvent.input';
import { ListLogEventsInput } from './dto/listLogEvents.input';
import { LogEventType } from 'src/database/entities/log_event_type.entity';
import { Subjects } from 'src/database/entities/subject.entity';
import { ListSubjectInputType } from './dto/listSubject.input';
import { LessonPlans } from 'src/database/entities/lesson_plans.entity';
import { ListRecentLogsInput } from './dto/listRecentLogs.input';
import { UploadLessonPlanInput } from './dto/uploadLessonPlan.input';
import { LessonPlanAttachments } from 'src/database/entities/lesson_plan_attachments.entity';
import {
  UserRecentLogs,
  UserRecentLogsType,
} from 'src/database/entities/user_recent_logs.entity';
import { UserAttendence } from 'src/database/entities/user_attendance.entity';
import { AddNewsletterInput } from './dto/addNewsletter.input';
import { Newsletter } from 'src/database/entities/newsletter.entity';
import { NewsletterClassMappings } from 'src/database/entities/newsletter_class_mappings.entity';
import { CommonListingInputType } from 'src/commonGqlTypes/commonListing.object';
import * as fs from 'fs';
import { join } from 'path';
import { ChatMessages } from 'src/database/entities/chat_messages.entity';
import { ZoomCallMeetings } from 'src/database/entities/zoom_call_meetings.entity';
import { ChatGateway } from 'src/chat/chat.gateway';
import * as moment from 'moment';

@Injectable()
export class TeachersService {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userRespository: Repository<Users>,
    @Inject('STUDENTS_REPOSITORY')
    private readonly studentRepository: Repository<Students>,
    @Inject('USER_SCHOOL_MAPPING_REPOSITORY')
    private readonly userSchoolRespository: Repository<UserSchoolMappings>,
    @Inject('CLASSES_REPOSITORY')
    private readonly classRespository: Repository<Classes>,
    @Inject('SUBJECTS_REPOSITORY')
    private readonly subjectRepository: Repository<Subjects>,
    @Inject('TEACHER_CLASS_MAPPINGS_REPOSITORY')
    private readonly teacherClassRespository: Repository<TeacherClassMappings>,
    @Inject('LESSON_PLAN_ATTACHMENTS_REPOSITORY')
    private readonly lessonPlanAttachmentsRepository: Repository<LessonPlanAttachments>,
    @Inject('CATEGORY_REPOSITORY')
    private readonly categoryRespository: Repository<Category>,
    @Inject('STUDENT_CLASS_MAPPINGS_REPOSITORY')
    private readonly studentClassRespository: Repository<StudentClassMappings>,
    @Inject('REIMBURSEMENT_REQUESTS_REPOSITORY')
    private readonly reimbursmentRequestRepository: Repository<ReimbursementRequests>,
    @Inject('SICK_REQUESTS_REPOSITORY')
    private readonly sickRequestRepository: Repository<SickRequests>,
    @Inject('USER_ONBOARDING_DOCUMENTS_REPOSITORY')
    private readonly userOnboardingDocumentsRepository: Repository<UserOnboardingDocuments>,
    @Inject('LOG_EVENTS_REPOSITORY')
    private readonly logEventsRepository: Repository<LogEvents>,
    @Inject('LOG_EVENT_TYPE_REPOSITORY')
    private readonly logEventTypeRepository: Repository<LogEventType>,
    @Inject('LESSON_PLANS_REPOSITORY')
    private readonly lessonPlansRepository: Repository<LessonPlans>,
    @Inject('USER_RECENT_LOGS_REPOSITORY')
    private readonly userRecentLogsRepository: Repository<UserRecentLogs>,
    @Inject('USER_ATTENDANCE_REPOSITORY')
    private readonly userAttendanceRepository: Repository<UserAttendence>,
    @Inject('NEWSLETTER_REPOSITORY')
    private readonly newsletterRepository: Repository<Newsletter>,
    @Inject('NEWSLETTER_CLASS_MAPPINGS_REPOSITORY')
    private readonly newsletterClassMappingsRepository: Repository<NewsletterClassMappings>,
    @Inject('CHAT_MESSAGE_REPOSITORY')
    private readonly chatMessageRepository: Repository<ChatMessages>,
    @Inject('ZOOM_CALL_MEETINGS_REPOSITORY')
    private readonly zoomCallMeetingRepository: Repository<ZoomCallMeetings>,
    private readonly helperService: HelperService,
    private readonly awsService: AwsService,
    private readonly chatGateway: ChatGateway,
  ) { }
  /**
   * Find Class By id
   * @param id
   * @returns
   */
  async findClassById(id: number) {
    const classDetails = await this.classRespository.findOneBy({ id });
    return classDetails;
  }

  async getDatesInRange(startDate, endDate) {
    const dates = [];
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  }

  async teacherProfile(context: any) {
    const userId = context.req.user.id;

    const userProfile = await this.userRespository.findOne({
      where: { id: userId },
    });
    const schools = await this.userSchoolRespository.find({
      where: { userId: userProfile.id },
      relations: ['schools'],
    });

    const schoolData = schools.map(({ schools }) => ({
      id: schools.id,
      name: schools.name,
      address: schools.address,
      latitude: schools.school_gps.latitude,
      longitude: schools.school_gps.longitude,
    }));

    const documentCountQuery = this.userOnboardingDocumentsRepository
      .createQueryBuilder('user_onboarding_documents')
      .where(
        'user_onboarding_documents.user_id = :user_id AND user_onboarding_documents.document_url IS NULL',
        {
          user_id: userId,
        },
      );
    const documentCount = await documentCountQuery.getCount();

    return {
      user: userProfile,
      schoolData,
      remaining_document_count: documentCount,
    };
  }

  /**
   * Find url type is pdf or not
   * @param imageUrl
   * @returns
   */
  isPdf(imageUrl: string) {
    return /^data:application\/pdf;base64,/.test(imageUrl);
  }

  /**
   * Find url type is image or nor
   * @param imageUrl
   * @returns
   */
  isImage(imageUrl: string) {
    return /^data:image\/\w+;base64,/.test(imageUrl);
  }

  async updateStudentClassData(
    id: number,
    studentClassMappings: Partial<StudentClassMappings>,
  ) {
    await this.studentClassRespository.update({ id }, studentClassMappings);
  }

  /**
   * Get Assigned Class Details
   * @param id
   * @returns
   */
  async assignedClassDetail(user: Users, classId: number) {
    const teacherClassMapping = await this.teacherClassRespository.findOne({
      where: { teacher_id: user.id, class_id: classId, status: STATUS.ACTIVE },
    });
    if (!teacherClassMapping) {
      throw new GraphQLError('You are not authorized to access this class!', {
        extensions: {
          statusCode: HttpStatus.UNAUTHORIZED,
        },
      });
    }
    const classDetails = await this.classRespository.findOne({
      where: { id: classId },
      withDeleted: false,
      relations: {
        schools: true,
      },
    });
    return classDetails;
  }

  /**
   * Get Student Profile
   * @param id
   * @returns
   */
  async getStudentProfile(user: Users, studentId: number) {
    let student: Students;
    if (user.role === USER_ROLES.TEACHER) {
      const isStudentClassMappingExist =
        await this.studentClassRespository.find({
          where: { student_id: studentId, status: STATUS.ACTIVE },
        });

      const isTeacherClassMappingExist =
        await this.teacherClassRespository.find({
          where: {
            teacher_id: user.id,
            class_id: In(isStudentClassMappingExist.map((cls) => cls.class_id)),
            status: STATUS.ACTIVE,
          },
        });

      if (!isTeacherClassMappingExist.length) {
        throw new GraphQLError(
          'You are not authorized to view this student detail!',
          {
            extensions: {
              statusCode: HttpStatus.UNAUTHORIZED,
            },
          },
        );
      }

      student = await this.studentRepository.findOne({
        where: { id: studentId },
      });
    } else {
      student = await this.studentRepository.findOne({
        where: { id: studentId, parent_id: user.id },
      });

      if (!student) {
        throw new GraphQLError(
          'You are not authorized to view this student detail!',
          {
            extensions: {
              statusCode: HttpStatus.UNAUTHORIZED,
            },
          },
        );
      }
    }

    return student;
  }

  /**
   * Get All students inside a single class of teacher by class Id
   * @param class_id
   * @returns
   */
  async listStudentOfClass(
    user: Users,
    listStudentInputType: ListStudentInputType,
    class_id: number,
  ) {
    const { page, pageSize } = listStudentInputType;
    const skip = (page - 1) * pageSize;

    const isTeacherClassMappingExist =
      await this.teacherClassRespository.findOne({
        where: { teacher_id: user.id, class_id, status: STATUS.ACTIVE },
      });

    if (!isTeacherClassMappingExist) {
      throw new GraphQLError(
        'You are not authorized to view student list of this class !',
        {
          extensions: {
            statusCode: HttpStatus.UNAUTHORIZED,
          },
        },
      );
    }

    const queryBuilder: SelectQueryBuilder<Students> = this.studentRepository
      .createQueryBuilder('students')
      .leftJoinAndSelect(
        'students.student_class_mappings',
        'student_class_mappings',
      )
      .where(
        'students.status = :status AND student_class_mappings.class_id = :class_id AND student_class_mappings.status = :status',
        { class_id, status: STATUS.ACTIVE },
      )
      .skip(skip)
      .take(pageSize)
      .orderBy('students.firstname', 'ASC')
      .addOrderBy('students.lastname', 'ASC');

    const [students, total] = await queryBuilder.getManyAndCount();

    return { students, total };
  }

  /**
   * Get All classes assigned to teacher
   * @param user
   * @param listClassInputType
   * @returns
   */
  async assignedClassList(user: Users, listClassInputType: ListClassInputType) {
    const { page, pageSize, search } = listClassInputType;
    const skip = (page - 1) * pageSize;

    const queryBuilder: SelectQueryBuilder<Classes> = this.classRespository
      .createQueryBuilder('classes')
      .leftJoinAndSelect('classes.schools', 'schools')
      .leftJoinAndSelect(
        'classes.teacher_class_mappings',
        'teacher_class_mappings',
      )
      .where(
        'teacher_class_mappings.teacher_id = :teacher_id AND teacher_class_mappings.status = :status AND classes.status = :status',
        {
          teacher_id: user.id,
          status: STATUS.ACTIVE,
        },
      )
      .andWhere(
        new Brackets((qb) => {
          if (search) {
            qb.where('classes.name LIKE :search', { search: `%${search}%` });
          }
        }),
      )
      .skip(skip)
      .take(pageSize)
      .orderBy('classes.name', 'ASC');

    const [classes, total] = await queryBuilder.getManyAndCount();

    return { classes, total };
  }

  /**
   * Get All students list a part of teacher's class
   * @param user
   * @param listStudentInputType
   */
  async listStudentOfTeacher(
    user: Users,
    listStudentInputType: ListStudentInputType,
  ) {
    const { page, pageSize, type } = listStudentInputType;
    const skip = (page - 1) * pageSize;

    const isTeacherClassMappingExist = await this.teacherClassRespository.find({
      where: { teacher_id: user.id, status: STATUS.ACTIVE },
    });

    const classIds = isTeacherClassMappingExist.map((item) => item.class_id);

    if (classIds.length === 0) {
      return {
        total: 0,
        students: [],
      };
    }
    if (type && type === 'WITHOUT_PAGINATION') {
      const queryBuilder: SelectQueryBuilder<Students> = this.studentRepository
        .createQueryBuilder('students')
        .leftJoinAndSelect(
          'students.student_class_mappings',
          'student_class_mappings',
        )
        .leftJoinAndSelect('student_class_mappings.class', 'class')
        .where(
          'students.status = :status AND student_class_mappings.class_id IN (:...classIds) AND student_class_mappings.status = :status',
          {
            classIds,
            status: STATUS.ACTIVE,
          },
        )
        .andWhere(
          new Brackets((qb) => {
            if (listStudentInputType.search) {
              qb.where(
                'CONCAT(students.firstname, " ", students.lastname) LIKE :search',
                { search: `%${listStudentInputType.search}%` },
              );
            }
          }),
        )
        .orderBy('students.firstname', 'ASC')
        .addOrderBy('students.lastname', 'ASC');

      const students = await queryBuilder.getMany();
      return {
        students,
      };
    }
    const queryBuilder: SelectQueryBuilder<Students> = this.studentRepository
      .createQueryBuilder('students')
      .leftJoinAndSelect(
        'students.student_class_mappings',
        'student_class_mappings',
      )
      .leftJoinAndSelect('student_class_mappings.class', 'class')
      .where(
        'students.status = :status AND student_class_mappings.class_id IN (:...classIds) AND student_class_mappings.status = :status',
        {
          classIds,
          status: STATUS.ACTIVE,
        },
      )
      .andWhere(
        new Brackets((qb) => {
          if (listStudentInputType.search) {
            qb.where(
              'CONCAT(students.firstname, " ", students.lastname) LIKE :search',
              { search: `%${listStudentInputType.search}%` },
            );
          }
        }),
      )
      .skip(skip)
      .take(pageSize)
      .orderBy('students.firstname', 'ASC')
      .addOrderBy('students.lastname', 'ASC');

    const [students, total] = await queryBuilder.getManyAndCount();

    return { students, total };
  }

  /**
   * Create reimbursment request
   * @param user
   * @param reimbursmentRequest
   * @returns
   */
  async createReimbursmentRequest(
    user: Users,
    reimbursmentRequest: AddReimbursmentRequest,
  ) {
    if (!this.helperService.isBase64(reimbursmentRequest.image_url)) {
      throw new GraphQLError('Invalid pdf!', {
        extensions: {
          statusCode: HttpStatus.BAD_REQUEST,
        },
      });
    }
    let folderName;
    if (this.isPdf(reimbursmentRequest.image_url)) {
      folderName = 'reimbursment_pdf';
    }
    if (this.isImage(reimbursmentRequest.image_url)) {
      folderName = 'reimbursment_image';
    }

    const uploadedPdf = await this.awsService.uploadToAWS(
      folderName,
      reimbursmentRequest.image_url,
      'reimbursment_request',
    );

    reimbursmentRequest.image_url = uploadedPdf.Location;
    reimbursmentRequest.teacher_id = user.id;
    await this.reimbursmentRequestRepository.insert(reimbursmentRequest);
    return { message: `Reimbursment request generated successfully !` };
  }

  /**
   * List reimbursment request made by teacher
   * @param user
   * @param listReimbursmentRequest
   * @returns
   */
  async listReimbursmentRequest(
    user: Users,
    listReimbursmentRequest: ListReimbursmentRequest,
  ) {
    const { page, pageSize, sortBy } = listReimbursmentRequest;
    const sortOrder: any = listReimbursmentRequest.sortOrder;
    const skip = (page - 1) * pageSize;

    const queryBuilder: SelectQueryBuilder<ReimbursementRequests> =
      this.reimbursmentRequestRepository
        .createQueryBuilder('reimbursment')
        .where('reimbursment.teacher_id=:userId', { userId: user.id })
        .andWhere(
          new Brackets((qb) => {
            if (listReimbursmentRequest.search) {
              qb.where(
                '(reimbursment.title LIKE :search OR reimbursment.amount = :amount)',
                {
                  search: `%${listReimbursmentRequest.search}%`,
                  amount: parseFloat(listReimbursmentRequest.search),
                },
              );
            }

            if (
              listReimbursmentRequest.status === 0 ||
              listReimbursmentRequest.status === 1
            ) {
              qb.andWhere('(reimbursment.status = :status)', {
                status: listReimbursmentRequest.status,
              });
            }
            if (listReimbursmentRequest.date) {
              qb.andWhere('DATE(reimbursment.createdAt) = :date', {
                date: listReimbursmentRequest.date,
              });
            }
          }),
        )
        .skip(skip)
        .take(pageSize)
        .orderBy(
          `reimbursment.${sortBy}`,
          SORT_ORDER.includes(sortOrder) ? sortOrder.toUpperCase() : 'DESC',
        );
    const [reimbursment, total] = await queryBuilder.getManyAndCount();
    const type = Object.values(MediaType);
    return { type, reimbursment, total };
  }

  /**
   * Create Time-Off request made by teacher
   * @param user
   * @param createTimeOffRequestInput
   * @returns
   */
  async createTimeOffRequest(
    context,
    createTimeOffRequestInput: CreateTimeOffInputType,
  ) {
    const { start_date, end_date, start_time, end_time } =
      createTimeOffRequestInput;
    const type: any = createTimeOffRequestInput.type;
    const startDate = new Date(start_date);
    const formattedDate = startDate.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    });

    if (type !== RequestType.TIME_OFF && type !== RequestType.SICK) {
      throw new GraphQLError('Leave request type must be sick or tinme off!', {
        extensions: {
          statusCode: HttpStatus.BAD_REQUEST,
        },
      });
    }
    if (type === RequestType.TIME_OFF) {
      if (start_date.toDateString() !== end_date.toDateString()) {
        throw new GraphQLError(
          'Start date and end date must be same for time-off request!',
          {
            extensions: {
              statusCode: HttpStatus.BAD_REQUEST,
            },
          },
        );
      }
      if (!start_time || !end_time) {
        throw new GraphQLError(
          'Start time and end time must be provided for time-off request!',
          {
            extensions: {
              statusCode: HttpStatus.BAD_REQUEST,
            },
          },
        );
      }
    }

    if (type === RequestType.TIME_OFF) {
      const dateStr: any = start_date.toISOString().split('T')[0];

      const isSickExist = await this.userRecentLogsRepository.findOne({
        where: {
          type: UserRecentLogsType.SICK,
          date: dateStr,
          user_id: context.req.user.id,
          status: Not(REQUEST_STATUS.REJECTED),
        },
      });

      if (isSickExist) {
        throw new GraphQLError(
          `You have already taken a sick request for ${formattedDate}!`,
          {
            extensions: {
              statusCode: HttpStatus.BAD_REQUEST,
            },
          },
        );
      }
    }

    if (type === RequestType.SICK) {
      createTimeOffRequestInput.start_time = null;
      createTimeOffRequestInput.end_time = null;
    }
    const datesRange = await this.getDatesInRange(start_date, end_date);

    const leaveEntries = [];

    for await (const date of datesRange) {
      const dateStr: any = date.toISOString().split('T')[0];

      const isRequestExist = await this.userRecentLogsRepository.findOne({
        where: {
          type,
          user_id: context.req.user.id,
          date: dateStr,
          status: Not(REQUEST_STATUS.REJECTED),
        },
      });

      if (isRequestExist) {
        throw new GraphQLError(
          `You have already taken ${isRequestExist.type} request for ${formattedDate}`,
          {
            extensions: {
              statusCode: HttpStatus.BAD_REQUEST,
            },
          },
        );
      }

      const entry = {
        ...createTimeOffRequestInput,
        date,
        type,
      };
      entry.user_id = context.req.user.id;
      leaveEntries.push(entry);
    }
    await this.userRecentLogsRepository.save(leaveEntries);
    return {
      message: `${createTimeOffRequestInput.type.replace('_', ' ').charAt(0).toUpperCase() + createTimeOffRequestInput.type.replace('_', ' ').slice(1)} request submitted successfully!`,
    };
  }

  /**
   * List Time-Off request made by teacher
   * @param user
   * @param listTimeOffRequestInput
   * @returns
   */
  async listTimeOffRequest(
    user: Users,
    listTimeOffRequestInput: ListTimeOffRequestInput,
  ) {
    const { page, pageSize, sortBy, search, type, date, status } =
      listTimeOffRequestInput;
    const sortOrder: any = listTimeOffRequestInput.sortOrder;
    const skip = (page - 1) * pageSize;

    const queryBuilder: SelectQueryBuilder<SickRequests> =
      this.sickRequestRepository
        .createQueryBuilder('sickRequests')
        .where('sickRequests.teacher_id=:userId', { userId: user.id })
        .andWhere(
          new Brackets((qb) => {
            if (search) {
              qb.where('(sickRequests.reason LIKE :search)', {
                search: `%${search}%`,
              });
            }
            if (type) {
              qb.andWhere('(sickRequests.type = :type)', {
                type,
              });
            }
            if (date) {
              qb.andWhere(
                '(sickRequests.start_date = :date OR sickRequests.end_date = :date)',
                {
                  date,
                },
              );
            }
            if (status !== undefined) {
              qb.andWhere('(sickRequests.status = :status)', {
                status,
              });
            }
          }),
        )
        .skip(skip)
        .take(pageSize)
        .orderBy(
          `sickRequests.${sortBy}`,
          SORT_ORDER.includes(sortOrder) ? sortOrder.toUpperCase() : 'DESC',
        );
    const [timeOffRequests, total] = await queryBuilder.getManyAndCount();
    const requestTypes = Object.values(RequestType);
    return { requestTypes, timeOffRequests, total };
  }

  /**
   * Update Profile
   * @param user
   * @param updateProfileInput
   * @returns
   */
  async updateProfile(
    user: Users,
    updateProfileInput: UpdateTeacherProfileInput,
  ): Promise<UpdateTeacherProfileObject> {
    const teacher = await this.userRespository.findOne({
      where: { id: user.id },
    });
    Object.assign(teacher, updateProfileInput);
    let uploadedPdfUrl = teacher.profile_img;
    if (
      updateProfileInput.profile_image &&
      this.helperService.isBase64(updateProfileInput.profile_image)
    ) {
      let pdfName: string;
      if (updateProfileInput.firstname) {
        pdfName = updateProfileInput.firstname;
      }
      pdfName = teacher.firstname;
      const uploadedPdf = await this.awsService.uploadToAWS(
        'teacher_profile',
        updateProfileInput.profile_image,
        pdfName,
      );
      if (teacher?.profile_img) {
        await this.awsService.removeFromBucket(teacher.profile_img);
      }
      uploadedPdfUrl = uploadedPdf.Location;
    }
    teacher.profile_img = uploadedPdfUrl;
    const updatedUser = await this.userRespository.save(teacher);
    return {
      message: 'Your profile has been updated successfully!',
      firstname: updatedUser.firstname,
      lastname: updatedUser.lastname,
      phone_number: updatedUser.phone_number,
      position: updatedUser.position,
      profile_image: updatedUser.profile_img,
    };
  }

  /**
   * Get All List of teacher's Documents
   * @param user
   * @returns
   */
  async listTeacherOnboardingDocuments(user: Users) {
    const userOnboardingDocuments =
      await this.userOnboardingDocumentsRepository.find({
        where: { user_id: user.id },
        relations: ['onboarding_documents_list'],
      });

    return {
      userOnboardingDocuments,
      message: 'Document list fetched successfully!',
    };
  }

  /**
   * Add Onboarding document
   * @param addOnboardingDocumentData
   * @param user
   * @returns
   */
  async addOnboardingDocument(
    addOnboardingDocumentData: AddOnboardingDocumentInput,
    user: Users,
  ) {
    const isDocumentExist =
      await this.userOnboardingDocumentsRepository.findOne({
        where: {
          user_id: user.id,
          document_id: addOnboardingDocumentData.document_id,
        },
      });

    if (!isDocumentExist) {
      throw new GraphQLError('Onboarding document not found!', {
        extensions: {
          statusCode: HttpStatus.NOT_FOUND,
        },
      });
    }

    if (isDocumentExist.document_url !== null) {
      throw new GraphQLError('This onboarding document is already uploaded!', {
        extensions: {
          statusCode: HttpStatus.BAD_REQUEST,
        },
      });
    }

    if (!this.helperService.isBase64(addOnboardingDocumentData.document_url)) {
      throw new GraphQLError('Invalid pdf!', {
        extensions: {
          statusCode: HttpStatus.BAD_REQUEST,
        },
      });
    }

    const uploadToAWS = await this.awsService.uploadToAWS(
      'onboarding_pdf',
      addOnboardingDocumentData.document_url,
      'onboarding',
    );

    isDocumentExist.document_url = uploadToAWS.Location;

    const userOnboardingDocument =
      await this.userOnboardingDocumentsRepository.save(isDocumentExist);

    return {
      userOnboardingDocument,
      message: 'Document uploaded successfully!',
    };
  }

  /**
   * Delete Onboarding document
   * @param deleteOnboardingDocumentData
   * @param user
   * @returns
   */
  async deleteOnboardingDocument(document_id: number, user: Users) {
    const isDocumentExist =
      await this.userOnboardingDocumentsRepository.findOne({
        where: {
          user_id: user.id,
          document_id,
        },
      });

    if (!isDocumentExist) {
      throw new GraphQLError('Onboarding document not found!', {
        extensions: {
          statusCode: HttpStatus.NOT_FOUND,
        },
      });
    }

    if (isDocumentExist.document_url === null) {
      throw new GraphQLError('This onboarding document already deleted!', {
        extensions: {
          statusCode: HttpStatus.BAD_REQUEST,
        },
      });
    }

    await this.awsService.removeFromBucket(isDocumentExist.document_url);

    isDocumentExist.document_url = null;

    await this.userOnboardingDocumentsRepository.save(isDocumentExist);

    return { message: 'Onboarding document deleted successfully!' };
  }

  /**
   * Add log event for student by teacher
   * @param addLogEventData
   * @param user
   * @returns
   */
  async addLogEvent(
    addLogEventData: AddLogEventInput,
    user: Users,
    files: any,
  ) {
    const logEventType = await this.verifyLogEventType(
      addLogEventData.event_type_id,
    );
    const isTeacherClassMappingExist = await this.teacherClassRespository.find({
      where: { teacher_id: user.id, status: STATUS.ACTIVE },
    });

    const isStudentClassMappingExist =
      await this.studentClassRespository.findOne({
        where: {
          student_id: addLogEventData.student_id,
          class_id: In(isTeacherClassMappingExist.map((item) => item.class_id)),
          status: STATUS.ACTIVE,
        },
      });

    if (!isStudentClassMappingExist) {
      throw new GraphQLError(
        'You are not authorized to add log event for this student!',
        {
          extensions: {
            statusCode: HttpStatus.UNAUTHORIZED,
          },
        },
      );
    }
    const url_data = await this.uploadLogEventFiles(files);
    const logEvent = await this.logEventsRepository.save({
      teacher_id: user.id,
      ...addLogEventData,
      url_data: url_data,
    });

    return {
      logEvent: {
        ...logEvent,
        log_event_type: {
          type: logEventType.event_type,
          image_url: logEventType.image_url,
          id: logEvent.event_type_id,
        },
      },
      message: 'Log event added successfully!',
    };
  }

  /**
   * Update log event for student by teacher
   * @param updateLogEventData
   * @param logeventId
   * @param user
   * @returns
   */
  async updateLogEvent(
    updateLogEventData: UpdateLogEventInput,
    logeventId: number,
    user: Users,
    files: any,
  ) {
    let uploadedData: any[] = updateLogEventData?.url_data;
    const isLogEventExist = await this.logEventsRepository.findOne({
      where: { id: logeventId, teacher_id: user.id },
    });

    if (!isLogEventExist) {
      throw new GraphQLError('Log event not found!', {
        extensions: {
          statusCode: HttpStatus.NOT_FOUND,
        },
      });
    }

    const logEventType = await this.verifyLogEventType(
      updateLogEventData.event_type_id,
    );

    if (
      updateLogEventData.removed_url &&
      updateLogEventData.removed_url.length !== 0
    ) {
      await Promise.allSettled(
        updateLogEventData.removed_url.map(async (removedUrl: string) => {
          try {
            await this.awsService.removeFromBucket(removedUrl);
          } catch (error) {
            console.error('Error removing image :::', error);
          }
        }),
      );
    }
    if (files) {
      const uploadedUrlData = await this.uploadLogEventFiles(files);
      uploadedData = [...uploadedData, ...uploadedUrlData];
    }
    isLogEventExist.title = updateLogEventData.title;
    isLogEventExist.event_type_id = updateLogEventData.event_type_id;
    isLogEventExist.description = updateLogEventData.description;
    isLogEventExist.url_data = uploadedData;

    await this.logEventsRepository.save(isLogEventExist);

    return {
      logEvent: {
        ...isLogEventExist,
        url_data: uploadedData,
        log_event_type: {
          type: logEventType.event_type,
          image_url: logEventType.image_url,
          id: updateLogEventData.event_type_id,
        },
        type: logEventType.event_type,
        image_url: logEventType.image_url,
      },
      message: 'Log event updated successfully!',
    };
  }

  /**
   * List All log events by teacher Id
   * @param listAllLogEventsData
   * @param user
   * @returns
   */
  async listAllLogEventsForTeacher(
    listAllLogEventsData: ListLogEventsInput,
    user: Users,
  ) {
    const { page, pageSize, sortBy, student_id } = listAllLogEventsData;
    const sortOrder: any = listAllLogEventsData.sortOrder;
    const skip = (page - 1) * pageSize;
    let startDate;
    let endDate;

    if (listAllLogEventsData.event_type_id) {
      await this.verifyLogEventType(listAllLogEventsData.event_type_id);
    }

    if (listAllLogEventsData.month) {
      const monthString = listAllLogEventsData.month.split('-')[0];
      const month = parseInt(monthString, 10);
      const yearString = listAllLogEventsData.month.split('-')[1];
      const year = parseInt(yearString, 10);

      startDate = new Date(year, month - 1, 2);
      endDate = new Date(year, month, 1);
    }

    const queryBuilder: SelectQueryBuilder<LogEvents> = this.logEventsRepository
      .createQueryBuilder('log_events')
      .leftJoinAndSelect('log_events.student', 'student')
      .leftJoinAndSelect('log_events.log_event_type', 'log_event_type')
      .where('log_events.teacher_id = :teacherId', { teacherId: user.id })
      .andWhere(
        new Brackets((qb) => {
          if (listAllLogEventsData.search) {
            qb.where(
              'log_events.title LIKE :search OR log_events.description LIKE :search',
              { search: `%${listAllLogEventsData.search}%` },
            );
          }
          if (listAllLogEventsData.event_type_id) {
            qb.andWhere('log_event_type.id = :event_type_id', {
              event_type_id: listAllLogEventsData.event_type_id,
            });
          }
          if (listAllLogEventsData.month) {
            qb.andWhere(
              'DATE(log_events.createdAt) BETWEEN :startDate AND :endDate',
              {
                startDate,
                endDate,
              },
            );
          }
          if (student_id) {
            qb.andWhere('log_events.student_id = :student_id', {
              student_id,
            });
          }
        }),
      )
      .skip(skip)
      .take(pageSize)
      .orderBy(
        `log_events.${sortBy}`,
        SORT_ORDER.includes(sortOrder) ? sortOrder.toUpperCase() : 'DESC',
      );

    const [logevents, total] = await queryBuilder.getManyAndCount();

    return { logevents, total };
  }

  /**
   * Get Log event by Id
   * @param logeventId
   * @param user
   * @returns
   */
  async getLogEventByIdForTeacher(logeventId: number, user: Users) {
    const isLogEventExist = await this.logEventsRepository.findOne({
      where: { id: logeventId },
      relations: ['student', 'log_event_type'],
    });

    if (!isLogEventExist) {
      throw new GraphQLError('Log event not found!', {
        extensions: {
          statusCode: HttpStatus.NOT_FOUND,
        },
      });
    }

    if (isLogEventExist.teacher_id !== user.id) {
      throw new GraphQLError('You are not authorized to view this log event!', {
        extensions: {
          statusCode: HttpStatus.UNAUTHORIZED,
        },
      });
    }

    return isLogEventExist;
  }

  /**
   * Delete Log event by Id
   * @param logeventId
   * @param user
   * @returns
   */
  async deleteLogEvent(logeventId: number, user: Users) {
    const logEvent = await this.getLogEventByIdForTeacher(logeventId, user);

    await Promise.allSettled(
      logEvent.url_data.map(async (item) => {
        try {
          await this.awsService.removeFromBucket(item.url);
          if (item.type === 'video' && item.video_thumbnail != null) {
            await this.awsService.removeFromBucket(item.video_thumbnail);
          }
        } catch (error) {
          console.error('Error removing image :::', error);
        }
      }),
    );

    await this.logEventsRepository.softDelete({ id: logeventId });

    return { message: 'Log event deleted successfully!' };
  }

  /**
   * List All Log event type
   * @returns
   */
  async listAllLogEventType() {
    const logEventTypes = await this.logEventTypeRepository.find();

    return logEventTypes;
  }

  /**
   * Verify Log event type Function
   * @param log_event_id
   */
  async verifyLogEventType(log_event_id: number) {
    const isLogEventTypeExist = await this.logEventTypeRepository.findOne({
      where: { id: log_event_id },
    });

    if (!isLogEventTypeExist) {
      throw new GraphQLError('Log event type not found!', {
        extensions: {
          statusCode: HttpStatus.NOT_FOUND,
        },
      });
    }
    return isLogEventTypeExist;
  }

  /**
   * Enable or disable Teacher's MFA
   * @param userId
   * @param mfa
   * @returns
   */
  async enableOrDisableMFAForTeacher(userId: number, mfa: number) {
    let message = 'enabled';
    if (mfa === 0) {
      message = 'disabled';
    }
    await this.userRespository.update(
      { id: userId, role: USER_ROLES.TEACHER },
      { is_mfa: mfa },
    );
    return {
      message: `Multifactor authentication has been ${message} successfully!`,
      is_mfa: mfa,
    };
  }

  /**
   * List all subject of teacher's joined class
   * @param listSubjectInput
   * @returns
   */
  async getAllSubjects(
    listSubjectInput: ListSubjectInputType,
    user_id: number,
  ) {
    const { page, pageSize, sortBy } = listSubjectInput;
    const sortOrder: any = listSubjectInput.sortOrder;
    const skip = (page - 1) * pageSize;
    const queryBuilder: SelectQueryBuilder<Subjects> = this.subjectRepository
      .createQueryBuilder('subjects')
      .where('subjects.status = 1')
      .leftJoinAndSelect(
        'subjects.subject_class_mappings',
        'subject_class_mappings',
      )
      .leftJoinAndSelect('subject_class_mappings.class', 'class')
      .skip(skip)
      .take(pageSize)
      .orderBy(
        `subjects.${sortBy}`,
        SORT_ORDER.includes(sortOrder) ? sortOrder.toUpperCase() : 'DESC',
      );

    if (listSubjectInput.search) {
      queryBuilder.andWhere(
        '(subjects.name LIKE :search OR subjects.sub_title LIKE :search OR subjects.description LIKE :search)',
        {
          search: `%${listSubjectInput.search}%`,
        },
      );
    }

    if (listSubjectInput.class_id) {
      queryBuilder.andWhere(
        'subject_class_mappings.class_id IN (:...class_ids)',
        {
          class_ids: [listSubjectInput.class_id],
        },
      );
    } else {
      const isTeacherClassMappingExist =
        await this.teacherClassRespository.find({
          where: { teacher_id: user_id, status: STATUS.ACTIVE },
        });

      const classIds = isTeacherClassMappingExist.map((item) => item.class_id);
      if (classIds.length === 0) {
        throw new GraphQLError('You are not in any class!', {
          extensions: {
            statusCode: HttpStatus.BAD_REQUEST,
          },
        });
      }
      queryBuilder.andWhere(
        'subject_class_mappings.class_id IN (:...class_ids)',
        {
          class_ids: classIds,
        },
      );
    }
    const [subjects, total] = await queryBuilder.getManyAndCount();
    return { subjects, total };
  }

  /**
   * Get subject with lesson plans
   * @param subject_id
   * @returns
   */
  async getSubjectWithLessonPlans(subject_id: number) {
    const subject = await this.subjectRepository.findOne({
      where: {
        id: subject_id,
        status: STATUS.ACTIVE,
      },
      withDeleted: false,
    });
    if (!subject) {
      throw new GraphQLError('Subject not found!', {
        extensions: {
          statusCode: HttpStatus.NOT_FOUND,
        },
      });
    }
    const lessonPlans = await this.lessonPlansRepository.find({
      where: {
        status: STATUS.ACTIVE,
        subject_id: subject_id,
      },
    });
    subject['lesson_plans'] = lessonPlans;
    return subject;
  }

  async findLessonPlan(whereOptions: any) {
    const lessonPlan = await this.lessonPlansRepository.findOne({
      where: whereOptions,
      withDeleted: false,
      relations: {
        subject: true,
        lesson_plan_attachments: true,
      },
    });
    if (!lessonPlan) {
      throw new GraphQLError('Lesson plan not found!', {
        extensions: {
          statusCode: HttpStatus.NOT_FOUND,
        },
      });
    }
    return lessonPlan;
  }

  /**
   * Get lesson plan by id
   * @param lesson_plan_id
   * @returns
   */
  async getLessonPlanById(lesson_plan_id: number) {
    const lessonPlan = await this.findLessonPlan({
      id: lesson_plan_id,
      status: STATUS.ACTIVE,
    });
    return {
      ...lessonPlan,
      upload_lesson_plan_count: lessonPlan.lesson_plan_attachments.length,
    };
  }

  /**
   * Upload lesson plan by plan id
   * @param lesson_plan_id
   * @param lesson_plan
   * @param user_id
   * @returns
   */
  async uploadLessonPlanById(
    lesson_plan_id: number,
    lesson_plan_data: UploadLessonPlanInput,
    user_id: number,
  ) {
    const { lesson_plan_pdf, description, title } = lesson_plan_data;
    const lessonPlan = await this.lessonPlansRepository.findOne({
      where: {
        id: lesson_plan_id,
        status: STATUS.ACTIVE,
      },
    });
    if (!lessonPlan) {
      throw new GraphQLError('Lesson plan not found!', {
        extensions: {
          statusCode: HttpStatus.NOT_FOUND,
        },
      });
    }

    if (!this.helperService.isBase64(lesson_plan_pdf)) {
      throw new GraphQLError('Invalid lesson plan attachment!', {
        extensions: {
          statusCode: HttpStatus.BAD_REQUEST,
        },
      });
    }
    const { Location } = await this.awsService.uploadToAWS(
      'lesson_plan',
      lesson_plan_pdf,
      'lesson',
    );

    const lessonPlanAttachment = await this.createLessonPlanAttachment({
      description,
      title,
      user_id: user_id,
      lesson_plan_id,
      pdf_url: Location,
    });

    return {
      message: 'Lesson plan attachment uploaded successfully!',
      uploaded_lesson_plan: lessonPlanAttachment,
    };
  }

  /**
   * removed uploaded lesson plan
   * @param lesson_plan_attachment_id
   * @returns
   */
  async deleteLessonPlanById(lesson_plan_attachment_id: number) {
    const lessonPlanAttachment = await this.findLessonPlanAttachments({
      id: lesson_plan_attachment_id,
      status: STATUS.ACTIVE,
    });
    if (lessonPlanAttachment?.pdf_url) {
      await this.awsService.removeFromBucket(lessonPlanAttachment.pdf_url);
    }

    await this.lessonPlanAttachmentsRepository.update(
      {
        id: lesson_plan_attachment_id,
      },
      {
        pdf_url: null,
        deletedAt: new Date(),
      },
    );

    return {
      message: 'Lesson plan attachment removed successfully!',
    };
  }

  /**
   * Create lesson plan doc data
   * @param lesson_plan_attachments
   * @returns
   */
  async createLessonPlanAttachment(
    lesson_plan_attachments: Partial<LessonPlanAttachments>,
  ) {
    const lessonPlanDoc = await this.lessonPlanAttachmentsRepository.save(
      lesson_plan_attachments,
    );
    return lessonPlanDoc;
  }

  /**
   * Find lesson plan attachment
   * @param whereOptions
   * @returns
   */
  async findLessonPlanAttachments(whereOptions: any) {
    const lessonPlanAttachment =
      await this.lessonPlanAttachmentsRepository.findOneBy(whereOptions);
    if (!lessonPlanAttachment) {
      throw new GraphQLError('Lesson plan attachment not found!', {
        extensions: {
          statusCode: HttpStatus.NOT_FOUND,
        },
      });
    }
    return lessonPlanAttachment;
  }

  /**
   * Get All Recent Logs by Teacher id
   * @param listAllRecentLogsData
   * @param user
   * @returns
   */
  async listAllRecentLogsForTeacher(
    listAllRecentLogsData: ListRecentLogsInput,
    user: Users,
  ) {
    const { page, pageSize } = listAllRecentLogsData;
    const skip = (page - 1) * pageSize;
    let startDate;
    let endDate;
    let isCurrentMonth = false;

    if (listAllRecentLogsData.month) {
      const monthString = listAllRecentLogsData.month.split('-')[0];
      const month = parseInt(monthString, 10);
      const yearString = listAllRecentLogsData.month.split('-')[1];
      const year = parseInt(yearString, 10);

      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();

      if (month === currentMonth && year === currentYear) {
        isCurrentMonth = true;
      }

      startDate = new Date(Date.UTC(year, month - 1, 1));
      endDate = new Date(Date.UTC(year, month, 0));
    }

    const currentDate = new Date();
    const currentDateStr: any = currentDate.toISOString().split('T')[0];

    const isRecentLogsExist = await this.userRecentLogsRepository
      .createQueryBuilder('user_recent_logs')
      .where(
        'user_recent_logs.user_id = :userId AND user_recent_logs.date = :date',
        { userId: user.id, date: currentDateStr },
      )
      .andWhere(
        '(user_recent_logs.type = :type1 OR user_recent_logs.type = :type2 OR user_recent_logs.type = :type3 OR user_recent_logs.type = :type4)',
        {
          type1: UserRecentLogsType.CLOCK_IN,
          type2: UserRecentLogsType.BREAK_END,
          type3: UserRecentLogsType.BREAK_START, // Stop calculation
          type4: UserRecentLogsType.CLOCK_OUT, // Stop calculation
        },
      )
      .orderBy('user_recent_logs.createdAt', 'DESC')
      .getOne();

    if (
      isRecentLogsExist &&
      (isRecentLogsExist.type === UserRecentLogsType.CLOCK_IN ||
        isRecentLogsExist.type === UserRecentLogsType.BREAK_END)
    ) {
      const attendanceOfTheDay = await this.userAttendanceRepository.findOne({
        where: { date: currentDateStr, user_id: user.id },
      });
      const updatedAtTime = new Date(attendanceOfTheDay.updatedAt).getTime();

      const currentTime = new Date().getTime();

      const timeDifferenceInMillis = currentTime - updatedAtTime;

      const timeDifferenceInSeconds = Math.floor(timeDifferenceInMillis / 1000);

      attendanceOfTheDay.logged_hours =
        Number(attendanceOfTheDay.logged_hours) +
        Number(timeDifferenceInSeconds);

      await this.userAttendanceRepository.save(attendanceOfTheDay);
    }

    const queryBuilder: SelectQueryBuilder<UserAttendence> =
      this.userAttendanceRepository
        .createQueryBuilder('user_attendance')
        .where('user_attendance.user_id = :userId', { userId: user.id })
        .andWhere(
          new Brackets((qb) => {
            if (listAllRecentLogsData.month) {
              qb.where('user_attendance.date BETWEEN :startDate AND :endDate', {
                startDate: startDate,
                endDate: endDate,
              });
            } else {
              qb.where('user_attendance.date >= :currentDateStr', {
                currentDateStr,
              });
            }
          }),
        )
        .skip(skip)
        .take(pageSize)
        .orderBy(`user_attendance.date`, 'DESC');

    const [userRecentLogs, total] = await queryBuilder.getManyAndCount();

    const newData = [];

    const datesFromLogs: Date[] = userRecentLogs.map(
      (log) => new Date(log.date),
    );

    const end_date: Date = datesFromLogs[0];

    let CurrentDate: Date = new Date(currentDateStr);
    let endDatee: Date = new Date(end_date);
    const dateAfter30Days: Date = new Date(CurrentDate);
    dateAfter30Days.setDate(CurrentDate.getDate() + 30);

    if (listAllRecentLogsData.month) {
      CurrentDate = new Date(startDate.toISOString().split('T')[0]);
      if (
        endDatee < new Date(endDate.toISOString().split('T')[0]) &&
        !isCurrentMonth
      ) {
        endDatee = new Date(endDate.toISOString().split('T')[0]);
      }
    } else {
      if (!(new Date(endDatee) > dateAfter30Days)) {
        CurrentDate = new Date(currentDateStr);
        endDatee = dateAfter30Days;
      }
    }

    while (CurrentDate <= endDatee) {
      const index = userRecentLogs.findIndex((log) => {
        return (
          new Date(log.date).toISOString().split('T')[0] ===
          new Date(CurrentDate).toISOString().split('T')[0]
        );
      });

      if (index === -1) {
        const newObj = {
          id: null,
          type: null,
          date: CurrentDate.toISOString().split('T')[0],
          logged_hours: 0,
          timeOff_hours: 0,
          user_id: user.id,
        };

        newData.push(newObj);
      } else {
        const data = userRecentLogs[index];
        newData.push(data);
      }

      CurrentDate.setDate(CurrentDate.getDate() + 1);
    }

    return { userRecentLogs: newData, total };
  }

  /**
   * Add newsletter for classes by teacher
   * @param addNewsletterData
   * @param user
   * @returns
   */
  async addNewsletter(addNewsletterData: AddNewsletterInput, user: Users) {
    if (
      addNewsletterData.class_ids &&
      addNewsletterData.class_ids.length !== 0
    ) {
      await this.validateClassMapping(
        addNewsletterData.class_ids,
        user.id,
        'add',
      );
    }

    if (!this.helperService.isBase64(addNewsletterData.pdf_url)) {
      throw new GraphQLError('Invalid pdf!', {
        extensions: {
          statusCode: HttpStatus.BAD_REQUEST,
        },
      });
    }

    const { Location } = await this.awsService.uploadToAWS(
      'newsletter_pdf',
      addNewsletterData.pdf_url,
      'newsletter',
    );

    const newNewsletter = await this.newsletterRepository.save({
      ...addNewsletterData,
      pdf_url: Location,
      user_id: user.id,
    });

    if (
      addNewsletterData.class_ids &&
      addNewsletterData.class_ids.length !== 0
    ) {
      for await (const classId of addNewsletterData.class_ids) {
        await this.newsletterClassMappingsRepository.save({
          class_id: classId,
          newsletter_id: newNewsletter.id,
        });
      }
    }

    const newsletter = await this.newsletterRepository
      .createQueryBuilder('newsletter')
      .leftJoinAndSelect(
        'newsletter.newsletter_class_mappings',
        'newsletter_class_mappings',
      )
      .leftJoinAndSelect('newsletter_class_mappings.class', 'class')
      .where('newsletter.id = :newsletterId', {
        newsletterId: newNewsletter.id,
      })
      .getOne();

    return { newsletter, message: 'Newsletter added successfully!' };
  }

  /**
   * Update newsletter for classes by teacher
   * @param newsletter_id
   * @param updateNewsletterData
   * @param user
   * @returns
   */
  async updateNewsletter(
    newsletter_id: number,
    updateNewsletterData: AddNewsletterInput,
    user: Users,
  ) {
    const isNewsletterExist = await this.newsletterRepository.findOne({
      where: { id: newsletter_id },
    });

    if (!isNewsletterExist) {
      throw new GraphQLError('Newsletter not found!', {
        extensions: {
          statusCode: HttpStatus.NOT_FOUND,
        },
      });
    }

    if (
      updateNewsletterData.class_ids &&
      updateNewsletterData.class_ids.length !== 0
    ) {
      await this.validateClassMapping(
        updateNewsletterData.class_ids,
        user.id,
        'update',
      );
    }

    if (this.helperService.isBase64(updateNewsletterData.pdf_url)) {
      await this.awsService.removeFromBucket(isNewsletterExist.pdf_url);

      const { Location } = await this.awsService.uploadToAWS(
        'newsletter_pdf',
        updateNewsletterData.pdf_url,
        'newsletter',
      );

      updateNewsletterData.pdf_url = Location;
    }

    await this.newsletterRepository.update(
      { id: newsletter_id },
      {
        title: updateNewsletterData.title,
        description: updateNewsletterData.description,
        pdf_url: updateNewsletterData.pdf_url,
        publish_date_time: updateNewsletterData.publish_date_time,
      },
    );

    if (
      updateNewsletterData.class_ids &&
      updateNewsletterData.class_ids.length !== 0
    ) {
      for await (const classId of updateNewsletterData.class_ids) {
        const isNewsClassMappingExist =
          await this.newsletterClassMappingsRepository.findOne({
            where: { newsletter_id: newsletter_id, class_id: classId },
          });

        if (!isNewsClassMappingExist) {
          await this.newsletterClassMappingsRepository.save({
            class_id: classId,
            newsletter_id,
          });
        }
      }

      await this.newsletterClassMappingsRepository
        .createQueryBuilder()
        .update(NewsletterClassMappings)
        .set({ deletedAt: new Date() })
        .where(
          'newsletter_id = :newsletter_id AND class_id NOT IN (:...classIds) AND deletedAt IS NULL',
          {
            newsletter_id,
            classIds: updateNewsletterData.class_ids,
          },
        )
        .execute();
    } else {
      await this.newsletterClassMappingsRepository
        .createQueryBuilder()
        .update(NewsletterClassMappings)
        .set({ deletedAt: new Date() })
        .where('newsletter_id = :newsletter_id AND deletedAt IS NULL', {
          newsletter_id,
        })
        .execute();
    }

    const newsletter = await this.newsletterRepository
      .createQueryBuilder('newsletter')
      .leftJoinAndSelect(
        'newsletter.newsletter_class_mappings',
        'newsletter_class_mappings',
      )
      .leftJoinAndSelect('newsletter_class_mappings.class', 'class')
      .where('newsletter.id = :newsletterId', {
        newsletterId: newsletter_id,
      })
      .getOne();

    return { newsletter, message: 'Newsletter updated successfully!' };
  }

  /**
   * Get list newsletter for classes by teacher
   * @param listNewsletterData
   * @param class_id
   * @param user
   * @returns
   */
  async listNewsletter(
    listNewsletterData: CommonListingInputType,
    class_id: number,
    user: Users,
  ) {
    const { page, pageSize, sortBy } = listNewsletterData;
    const sortOrder: any = listNewsletterData.sortOrder;
    const skip = (page - 1) * pageSize;

    const queryBuilder: SelectQueryBuilder<Newsletter> =
      this.newsletterRepository
        .createQueryBuilder('newsletter')
        .leftJoinAndSelect(
          'newsletter.newsletter_class_mappings',
          'newsletter_class_mappings',
        )
        .leftJoinAndSelect('newsletter_class_mappings.class', 'class')
        .where('newsletter.status = :status', {
          status: STATUS.ACTIVE,
        })
        .andWhere(
          new Brackets((qb) => {
            if (class_id) {
              qb.where('newsletter_class_mappings.class_id = :class_id', {
                class_id,
              });
            } else {
              qb.where('newsletter.user_id = :userId', { userId: user.id });
            }
          }),
        )
        .skip(skip)
        .take(pageSize)
        .orderBy(
          `newsletter.${sortBy}`,
          SORT_ORDER.includes(sortOrder) ? sortOrder.toUpperCase() : 'DESC',
        );

    const [newsletter, total] = await queryBuilder.getManyAndCount();

    return { newsletter, total };
  }

  /**
   * Delete newsletter for classes by teacher
   * @param newsletter_id
   * @param class_id
   * @param user
   * @returns
   */
  async deleteNewsletter(newsletter_id: number, class_id: number, user: Users) {
    const isNewsletterExist = await this.newsletterRepository.findOne({
      where: { id: newsletter_id },
    });

    if (!isNewsletterExist) {
      throw new GraphQLError('Newsletter not found!', {
        extensions: {
          statusCode: HttpStatus.NOT_FOUND,
        },
      });
    }

    const isNewsClassMappingExist =
      await this.newsletterClassMappingsRepository.findOne({
        where: { newsletter_id, class_id },
      });

    if (isNewsClassMappingExist) {
      await this.validateClassMapping(
        [isNewsClassMappingExist.class_id],
        user.id,
        'delete',
      );
    } else {
      throw new GraphQLError('This newsletter not belongs to this class!', {
        extensions: {
          statusCode: HttpStatus.BAD_REQUEST,
        },
      });
    }

    await this.awsService.removeFromBucket(isNewsletterExist.pdf_url);

    await this.newsletterClassMappingsRepository.softDelete({
      newsletter_id,
    });

    await this.newsletterRepository.softDelete({ id: newsletter_id });

    return { message: 'Newsletter deleted successfully!' };
  }

  /**
   * Validate class mapping with teacher id Function
   * @param class_ids
   * @param userId
   */
  async validateClassMapping(
    class_ids: number[],
    userId: number,
    type: string,
  ) {
    let msg: string = 'add';
    if (type === 'update') {
      msg = type;
    } else if (type === 'delete') {
      msg = type;
    }

    for await (const classId of class_ids) {
      const isClassMappingExist = await this.teacherClassRespository.findOne({
        where: { class_id: classId, teacher_id: userId },
      });

      if (!isClassMappingExist) {
        throw new GraphQLError(
          `You are not authorised to ${msg} newsletter for this class!`,
          {
            extensions: {
              statusCode: HttpStatus.BAD_REQUEST,
            },
          },
        );
      }

      if (isClassMappingExist.status === STATUS.INACTIVE) {
        throw new GraphQLError(
          `Your access for this class has been revoked by admin!`,
          {
            extensions: {
              statusCode: HttpStatus.BAD_REQUEST,
            },
          },
        );
      }
    }
  }

  /**
   * upload log event of multipart data
   * @param files
   * @returns
   */
  async uploadLogEventFiles(files: any[]) {
    const url_data = [];
    await Promise.all(
      await files.map(async (file: any) => {
        const waitFile = await file;
        const mimeType = waitFile.mimetype;
        const fileName = waitFile.filename;
        const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1);
        let fileType = 'video';
        let video_thumbnail = null;
        let duration = null;

        if (IMAGE_TYPES.includes(fileExtension)) {
          fileType = 'image';
        }
        const readStream = waitFile.createReadStream();
        const path = `log_event_${fileType}/log_event_${this.helperService.generateRandomString(5)}.${fileExtension}`;
        const awsFile = await this.awsService.uploadReadStreadToAws(
          readStream,
          path,
          mimeType,
        );
        if (fileType === 'video') {
          const thumbnailFileName = `videoThumbnail_${this.helperService.generateRandomString(
            5,
          )}.png`;

          // Generating the video thumbnail
          await this.helperService.generateThumbnailFromVideo(
            awsFile.Location,
            join(process.cwd(), process.env.THUMBNAIL_PATH),
            thumbnailFileName,
          );

          const filePath = join(
            process.cwd(),
            process.env.THUMBNAIL_PATH,
            `/${thumbnailFileName}`,
          );

          const thumbnailCreated = this.helperService.fileExists(filePath);
          if (thumbnailCreated) {
            const fileReadStream = fs.createReadStream(filePath);
            // Uploading thumbnail to AWS
            const thumbnailImage = await this.awsService.uploadReadStreadToAws(
              fileReadStream,
              `video_thumbnail/${thumbnailFileName}`,
              'image/png',
            );
            video_thumbnail = thumbnailImage.Location;
            await this.helperService.deleteFile(filePath);
          }
          duration = await this.helperService.getVideoDuration(
            awsFile.Location,
          );
        }
        url_data.push({
          url: awsFile.Location,
          type: fileType,
          video_thumbnail,
          duration,
        });
      }),
    );
    return url_data;
  }

  /**
   * accept or reject chat message invitation
   * @param chat_message_id
   * @param teacher_id
   * @param status
   */
  async acceptRejectMeetingInvitaionOfParent(
    chat_message_id: number,
    teacher: Users,
    status: number,
  ) {
    const findMessage = await this.chatMessageRepository.findOne({
      where: {
        id: chat_message_id,
        message_type: MessageType.MEETING,
        receiver_id: teacher.id,
      },
      relations: {
        receiver_user: true,
        sender_user: true,
        student: true,
        chat_rooms: true,
      },
    });
    if (!findMessage) {
      throw new GraphQLError('Meeting invitation not found!', {
        extensions: {
          statusCode: HttpStatus.NOT_FOUND,
        },
      });
    }
    if (findMessage.is_approved === 2) {
      throw new GraphQLError('This invitations is already marked rejected!', {
        extensions: {
          statusCode: HttpStatus.NOT_FOUND,
        },
      });
    }
    const meeting = await this.zoomCallMeetingRepository.findOne({
      where: {
        chat_message_id: findMessage.id,
        user_id: teacher.id,
      },
    });
    if (!meeting) {
      throw new GraphQLError('Meeting invitation not found!', {
        extensions: {
          statusCode: HttpStatus.NOT_FOUND,
        },
      });
    }
    const currentDate = moment().local().format('YYYY-MM-DD');
    if (currentDate > String(meeting.date)) {
      status = MEETING_STATUS.EXPIRED;
    }
    const startTime = meeting.time_slot.start_time;
    const startTimeOf24Hr =
      await this.helperService.convert12hrTo24hr(startTime);
    const current = moment().local().format('HH:mm:ss');
    if (currentDate === String(meeting.date) && startTimeOf24Hr < current) {
      status = MEETING_STATUS.EXPIRED;
    }
    await this.updateZoomCallMeetings(
      {
        chat_message_id: chat_message_id,
        id: meeting.id,
      },
      { is_approved: status },
    );
    await this.updateChatMessage(
      {
        id: chat_message_id,
      },
      { is_approved: status },
    );
    if (status === MEETING_STATUS.APPROVED) {
      const checkPendingRequest = `zoom_meetings.user_id = ${teacher.id} AND zoom_meetings.is_approved = 0 AND date = "${meeting.date}" AND JSON_CONTAINS(zoom_meetings.time_slot, '{"start_time": "${meeting.time_slot.start_time}", "end_time": "${meeting.time_slot.end_time}"}')`;
      const findMeeting = await this.zoomCallMeetingRepository
        .createQueryBuilder('zoom_meetings')
        .where(checkPendingRequest)
        .getMany();
      const meetingIds = [];
      const chatMessageIds = [];
      const parentIds = [];
      findMeeting.forEach((data) => {
        meetingIds.push(data.id);
        chatMessageIds.push(data.chat_message_id);
        parentIds.push(data.parent_id);
      });
      if (meetingIds.length) {
        await this.updateZoomCallMeetings(
          {
            id: In(meetingIds),
          },
          { is_approved: MEETING_STATUS.REJECTED },
        );
        await this.updateChatMessage(
          {
            id: In(chatMessageIds),
          },
          { is_approved: MEETING_STATUS.REJECTED },
        );
      }

      if (meetingIds.length) {
        await this.chatGateway.rejectPendingMeetingStatus(chatMessageIds);
      }
    }
    findMessage.is_approved = status;
    await this.chatGateway.sendMeetingMessage(
      findMessage.chat_room_id,
      findMessage.chat_rooms.room,
      findMessage.student,
      findMessage.sender_user,
      findMessage.receiver_user,
      findMessage,
      status,
    );
    if (status === MEETING_STATUS.EXPIRED) {
      throw new GraphQLError(
        'This meeting slot is expired and it is marked as expired!',
        {
          extensions: {
            statusCode: HttpStatus.BAD_REQUEST,
          },
        },
      );
    }
    return true;
  }

  /**
   * Update zoom call meeting
   * @param whereOptions
   * @param updateOptions
   * @returns
   */
  async updateZoomCallMeetings(
    whereOptions: any,
    updateOptions: Partial<ZoomCallMeetings>,
  ) {
    await this.zoomCallMeetingRepository.update(whereOptions, updateOptions);
    return true;
  }

  /**
   * Update chat message
   * @param whereOptions
   * @param updateOptions
   * @returns
   */
  async updateChatMessage(
    whereOptions: any,
    updateOptions: Partial<ZoomCallMeetings>,
  ) {
    await this.chatMessageRepository.update(whereOptions, updateOptions);
    return true;
  }
}
