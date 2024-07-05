import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Users } from 'src/database/entities/user.entity';
import { HelperService } from 'src/helper.service';
import {
  Brackets,
  MoreThanOrEqual,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { Students } from 'src/database/entities/student.entity';
import { StudentInput } from './dto/student.input';
import { StudentObjectType } from './dto/student.object';
import { AwsService } from 'src/aws/aws.service';
import { UpdateStudentInput } from './dto/updateStudentProfile.input';
import { GraphQLError } from 'graphql';
import { MessageObject } from 'src/commonGqlTypes/message.object';
import {
  EventType,
  ExchangeOrReturnRequestType,
  MessageType,
  SORT_ORDER,
  STATUS,
  USER_ROLES,
} from 'src/constants';
import { GetTeacherOfSchoolInput } from './dto/getTeacherOfStudent.input';
import { UserSchoolMappings } from 'src/database/entities/user_school_mapping.entity';
import { ListAllLogEventsForParentInput } from './dto/listAllLogEventForParent.input';
import { LogEvents } from 'src/database/entities/log_events.entity';
import { UpdateEmergencyContactInput } from './dto/updateEmergencyContact.input';
import { ZoomCallTiming } from 'src/database/entities/zoom_call_timing.entity';
import { CreateZoomCallMeetingInput } from './dto/createZoomCallMeeting.input';
import { ZoomCallMeetings } from 'src/database/entities/zoom_call_meetings.entity';
import { ChatRooms } from 'src/database/entities/chat_room.entity';
import { ChatMessages } from 'src/database/entities/chat_messages.entity';
import { ChatGateway } from 'src/chat/chat.gateway';
import { ListClassesOfStudentInput } from './dto/listClassOfStudent.input';
import { Classes } from 'src/database/entities/classes.entity';
import { ListStudentOfClassInput } from './dto/listStudentOfClass.input';
import { StudentBasicData } from './dto/studentBasicData.object';
import { ListTeacherOfClassInput } from './dto/listTeacherOfClass.input';
import { Event } from 'src/database/entities/events.entity';
import * as moment from 'moment';
import { ExchangeReturnRequest } from 'src/database/entities/exchange_return_request.entity';
import { OrderDetails } from 'src/database/entities/order_details.entity';
import { CreateExchangeReturnRequestInput } from './dto/createExchangeReturnRequest.input';

@Injectable()
export class ParentsService {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userRespository: Repository<Users>,
    @Inject('STUDENTS_REPOSITORY')
    private readonly studentRepository: Repository<Students>,
    @Inject('USER_SCHOOL_MAPPING_REPOSITORY')
    private readonly userSchoolMappingRepository: Repository<UserSchoolMappings>,
    @Inject('LOG_EVENTS_REPOSITORY')
    private readonly logEventsRepository: Repository<LogEvents>,
    @Inject('ZOOM_CALL_TIMING_REPOSITORY')
    private readonly zoomCallTimingsRepository: Repository<ZoomCallTiming>,
    @Inject('ZOOM_CALL_MEETINGS_REPOSITORY')
    private readonly zoomCallMeetingsRepository: Repository<ZoomCallMeetings>,
    @Inject('CHAT_ROOM_REPOSITORY')
    private readonly chatRoomRepository: Repository<ChatRooms>,
    @Inject('CHAT_MESSAGE_REPOSITORY')
    private readonly chatMessageRepository: Repository<ChatMessages>,
    @Inject('CLASSES_REPOSITORY')
    private readonly classRepository: Repository<Classes>,
    @Inject('EVENTS_REPOSITORY')
    private readonly eventRepository: Repository<Event>,
    @Inject('ORDER_DETAILS_REPOSITORY')
    private readonly orderDetailsRepository: Repository<OrderDetails>,
    @Inject('EXCHANGE_RETURN_REQUESTS_REPOSITORY')
    private readonly exchangeReturnRequestRepository: Repository<ExchangeReturnRequest>,
    private readonly helperService: HelperService,
    private readonly awsService: AwsService,
    private readonly chatGateway: ChatGateway,
  ) { }

  async findParentById(id: number) {
    const user = await this.userRespository.findOneBy({
      id,
    });
    return user;
  }

  async UserProfile(context) {
    const userProfilePromise = this.userRespository.findOne({
      where: { id: context.req.user.id },
    });

    const studentsPromise = this.studentRepository.find({
      where: { parent_id: context.req.user.id },
    });

    const [userProfile, students] = await Promise.all([
      userProfilePromise,
      studentsPromise,
    ]);

    return { userProfile, students };
  }

  /**
   * Get Student Profile
   * @param id
   * @returns
   */

  /**
   * Add Student
   * @param StudentInput
   * @returns
   */
  async addStudent(
    studentData: StudentInput,
    parent_id: number,
  ): Promise<StudentObjectType> {
    const {
      firstName,
      lastName,
      birthdate,
      home_address,
      emergency_contact,
      potty_trained,
      transition_days,
      lunch_program,
      is_allergy,
      allergy_description,
      child_care_before,
      profile_img,
      payment_type,
    } = studentData;
    const parent_details = JSON.stringify(await this.findParentById(parent_id));

    let uploadedPdfUrl: string | undefined;
    if (profile_img) {
      if (!this.helperService.isBase64(studentData.profile_img)) {
        throw new GraphQLError('Invalid image format!', {
          extensions: {
            statusCode: HttpStatus.BAD_REQUEST,
          },
        });
      }
      const uploadedPdf = await this.awsService.uploadToAWS(
        'child_profile',
        profile_img,
        `${firstName}_${lastName}`,
      );
      uploadedPdfUrl = uploadedPdf.Location;
    }
    const studentDetails: any = {
      firstname: firstName,
      lastname: lastName,
      birthdate: birthdate,
      home_address: home_address,
      potty_trained: potty_trained,
      transition_days: transition_days,
      lunch_program: lunch_program,
      emergency_contact: emergency_contact,
      parent_id: parent_id,
      is_allergy: is_allergy,
      allergy_description: allergy_description,
      parent_details: parent_details,
      child_care_before: child_care_before,
      payment_type: payment_type,
    };
    if (uploadedPdfUrl) {
      studentDetails.profile_img = uploadedPdfUrl;
    }
    const result = await this.studentRepository.insert(studentDetails);
    const insertedId = result.identifiers[0].id;
    return {
      id: insertedId,
      firstname: studentData.firstName,
      lastname: studentData.lastName,
      birthdate: studentData.birthdate,
      profile_img: uploadedPdfUrl,
      message: 'Child onboarding successfully !',
    };
  }

  /**
   * Update Student Details
   * @param updateStudentDetails
   * @param id
   * @returns
   */
  async updateStudentProfile(
    context,
    updateStudentDetails: UpdateStudentInput,
    id: number,
  ): Promise<MessageObject> {
    const { firstname, profile_img, parent_firstname, parent_lastname } =
      updateStudentDetails;
    const student = await this.studentRepository.findOne({
      where: { id, parent_id: context.req.user.id },
    });

    if (!student) {
      throw new GraphQLError('Student not found!', {
        extensions: {
          statusCode: HttpStatus.NOT_FOUND,
        },
      });
    }
    Object.assign(student, updateStudentDetails);
    let uploadedPdfUrl: string | undefined;
    if (profile_img) {
      if (!this.helperService.isBase64(profile_img)) {
        throw new GraphQLError('Invalid image format!', {
          extensions: {
            statusCode: HttpStatus.BAD_REQUEST,
          },
        });
      }
      let pdfName: string;
      if (firstname) {
        pdfName = firstname;
      }
      pdfName = student.firstname;
      const uploadedPdf = await this.awsService.uploadToAWS(
        'child_profile',
        profile_img,
        pdfName,
      );
      uploadedPdfUrl = uploadedPdf.Location;
      student.profile_img = uploadedPdfUrl;
    }
    if (parent_firstname || parent_lastname) {
      const parentDetails = JSON.parse(student.parent_details);

      if (parent_firstname) {
        parentDetails['firstname'] = parent_firstname;
      }

      if (parent_lastname) {
        parentDetails['lastname'] = parent_lastname;
      }

      student.parent_details = JSON.stringify(parentDetails);
    }
    await this.studentRepository.save(student);

    return { message: 'Student details updated successfully!' };
  }

  /**
   * Delete Student
   * @param id
   * @returns
   */
  async deleteStudent(context, id: number): Promise<MessageObject> {
    const student = await this.studentRepository.findOne({
      where: { id, parent_id: context.req.user.id },
    });
    if (!student) {
      throw new GraphQLError('Student not found!', {
        extensions: {
          statusCode: HttpStatus.NOT_FOUND,
        },
      });
    }
    if (student.profile_img) {
      await this.awsService.removeFromBucket(student.profile_img);
    }
    await this.studentRepository.softDelete(student.id);
    return { message: 'Student deleted successfully!' };
  }

  /**
   * Get all teacher by school wise with search and pagination
   * @param getTeachersOfSchoolInput
   * @param userId
   * @returns
   */
  async getTeacherBySchoolId(
    getTeachersOfSchoolInput: GetTeacherOfSchoolInput,
    userId: number,
  ) {
    const skip =
      (getTeachersOfSchoolInput.page - 1) * getTeachersOfSchoolInput.pageSize;
    const userSchool = await this.getSchoolOfParent(userId);

    if (!userSchool) {
      throw new GraphQLError('School not found!', {
        extensions: {
          statusCode: HttpStatus.NOT_FOUND,
        },
      });
    }
    const query = this.userRespository
      .createQueryBuilder('users')
      .leftJoin('users.userSchoolMappings', 'userSchoolMappings')
      .where('users.role = :role AND users.status = :status', {
        role: USER_ROLES.TEACHER,
        status: STATUS.ACTIVE,
      })
      .andWhere('userSchoolMappings.schoolId = :schoolId', {
        schoolId: userSchool.schoolId,
      })
      .select([
        'users.id',
        'users.firstname',
        'users.lastname',
        'users.profile_img',
        'users.role',
      ]);
    if (getTeachersOfSchoolInput.search) {
      query.andWhere(
        '(CONCAT(users.firstname, " ", users.lastname) LIKE :search)',
        { search: `%${getTeachersOfSchoolInput.search}%` },
      );
    }
    const [teachers, total] = await query
      .skip(skip)
      .take(getTeachersOfSchoolInput.pageSize)
      .getManyAndCount();

    return { teachers, total };
  }

  async getSchoolOfParent(userId: number) {
    const userMappingSchool = await this.userSchoolMappingRepository.findOne({
      where: {
        userId: userId,
      },
      select: ['schoolId'],
    });
    return userMappingSchool;
  }

  /**
   * List All Log event for parent by student Id
   * @param listAllLogEventData
   * @param studentId
   * @returns
   */
  async listLogEventForParent(
    listAllLogEventData: ListAllLogEventsForParentInput,
    studentId: number,
  ) {
    const { page, pageSize, sortBy, search } = listAllLogEventData;
    const sortOrder: any = listAllLogEventData.sortOrder;
    const skip = (page - 1) * pageSize;
    let startDate;
    let endDate;

    if (listAllLogEventData.month) {
      const monthString = listAllLogEventData.month.split('-')[0];
      const month = parseInt(monthString, 10);
      const yearString = listAllLogEventData.month.split('-')[1];
      const year = parseInt(yearString, 10);

      startDate = new Date(year, month - 1, 2);
      endDate = new Date(year, month, 1);
    }

    const queryBuilder: SelectQueryBuilder<LogEvents> = this.logEventsRepository
      .createQueryBuilder('log_events')
      .leftJoinAndSelect('log_events.student', 'student')
      .leftJoinAndSelect('log_events.log_event_type', 'log_event_type')
      .leftJoinAndSelect('log_events.user', 'user')
      .where('log_events.student_id = :studentId', { studentId })
      .andWhere(
        new Brackets((qb) => {
          if (listAllLogEventData.month) {
            qb.where(
              'DATE(log_events.createdAt) BETWEEN :startDate AND :endDate',
              {
                startDate,
                endDate,
              },
            );
          }
          if (search) {
            qb.andWhere(
              'log_events.title LIKE :search OR log_events.description LIKE :search',
              { search: `%${search}%` },
            );
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
   * Update Emergency Contact of student
   * @param id
   * @param updateEmergencyContactInput
   * @returns
   */
  async updateEmergencyContact(
    context,
    studentId: number,
    updateEmergencyContactInput: UpdateEmergencyContactInput,
  ) {
    const student = await this.studentRepository.findOne({
      where: { id: studentId },
    });

    if (!student) {
      throw new GraphQLError('Student not found!', {
        extensions: {
          statusCode: HttpStatus.NOT_FOUND,
        },
      });
    }

    const parentOfStudent = student.parent_id;

    if (context.req.user.id !== parentOfStudent) {
      throw new GraphQLError(
        'You are not authorized user to access this student!',
        {
          extensions: {
            statusCode: HttpStatus.UNAUTHORIZED,
          },
        },
      );
    }

    await this.studentRepository.update(studentId, updateEmergencyContactInput);
    return { message: 'Emergency contact has been updated succeessfully!' };
  }

  /**
   * get zoom call meeting slots for teacher
   * @param teacher_id
   * @returns
   */
  async getSlotsOfZoomCallTimingsOfTeacher(teacher_id: number) {
    const currentDateStr: any = new Date().toISOString().split('T')[0];
    const slots = await this.zoomCallTimingsRepository.find({
      where: {
        teacher_id,
        date: MoreThanOrEqual(currentDateStr),
      },
      relations: {
        user: true,
      },
      withDeleted: false,
    });
    return slots;
  }

  async getMinutesSinceMidnight(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  }

  /**
   * get zoom call meeting slots for teacher
   * @param parent
   * @param createZoomCallMeetingInput
   * @returns
   */
  async createZoomCallMeetingWithAdminOrTeacher(
    parent: Users,
    createZoomCallMeetingInput: CreateZoomCallMeetingInput,
  ) {
    const { student_id, time_slots, date, chat_room_id, attendee_role } =
      createZoomCallMeetingInput;
    let user_id = createZoomCallMeetingInput.user_id;
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const todaysDate: any = `${year}-${month}-${day}`;

    const startTime = time_slots.start_time;
    const startTimeOf24Hr =
      await this.helperService.convert12hrTo24hr(startTime);
    const current = moment().local().format('HH:mm:ss');
    const endTime = time_slots.end_time;
    const endTimeOf24Hr = await this.helperService.convert12hrTo24hr(endTime);

    if (date.replaceAll('/', '-') < todaysDate) {
      throw new GraphQLError(
        'This meeting slot is expired. Please try with different meeting slot!',
        {
          extensions: {
            statusCode: HttpStatus.BAD_REQUEST,
          },
        },
      );
    }
    if (date.replaceAll('/', '-') === todaysDate) {
      if (startTimeOf24Hr < current) {
        throw new GraphQLError(
          'This meeting slot is expired. Please try with different meeting slot!',
          {
            extensions: {
              statusCode: HttpStatus.BAD_REQUEST,
            },
          },
        );
      }
    }
    if (attendee_role === USER_ROLES.SUPER_ADMIN) {
      const adminUser = await this.userRespository.findOne({
        where: {
          role: USER_ROLES.SUPER_ADMIN,
        },
      });
      user_id = adminUser.id;
    }
    const findZoomWithApprovedMeetingQuery = `zoom_meetings.user_id = ${user_id} AND zoom_meetings.is_approved = 1 AND date = "${date.replaceAll('/', '-')}" AND JSON_CONTAINS(zoom_meetings.time_slot, '{"start_time": "${time_slots.start_time}", "end_time": "${time_slots.end_time}"}')`;
    const findMeeting = await this.findZoomMeeting(
      findZoomWithApprovedMeetingQuery,
    );
    if (findMeeting) {
      throw new GraphQLError(
        'This meeting slot is already booked. Please select different meeting slot!',
        {
          extensions: {
            statusCode: HttpStatus.BAD_REQUEST,
          },
        },
      );
    }

    const checkPendingRequest = `zoom_meetings.user_id = ${user_id} AND zoom_meetings.is_approved = 0 AND date = "${date.replaceAll('/', '-')}" AND zoom_meetings.student_id = ${student_id} AND zoom_meetings.parent_id = ${parent.id} AND JSON_CONTAINS(zoom_meetings.time_slot, '{"start_time": "${time_slots.start_time}", "end_time": "${time_slots.end_time}"}')`;

    const pendingMeetingReuqest =
      await this.findZoomMeeting(checkPendingRequest);

    if (pendingMeetingReuqest) {
      throw new GraphQLError(
        'There is already pending meeting slot with this date and time!',
        {
          extensions: {
            statusCode: HttpStatus.BAD_REQUEST,
          },
        },
      );
    }
    const findStudent = await this.studentRepository.findOne({
      where: {
        id: student_id,
        parent_id: parent.id,
      },
    });
    if (!findStudent) {
      throw new GraphQLError('Student not found!', {
        extensions: {
          statusCode: HttpStatus.NOT_FOUND,
        },
      });
    }

    if (findStudent && findStudent.status === STATUS.INACTIVE) {
      throw new GraphQLError(
        'Student is not active. Please contact to admin!',
        {
          extensions: {
            statusCode: HttpStatus.BAD_REQUEST,
          },
        },
      );
    }

    let createChat = null;

    if (attendee_role === 2) {
      const teacher = await this.userRespository.findOneBy({
        id: user_id,
        role: USER_ROLES.TEACHER,
      });

      if (!teacher) {
        throw new GraphQLError('Teacher not found!', {
          extensions: {
            statusCode: HttpStatus.NOT_FOUND,
          },
        });
      }
      if (teacher && teacher.status === STATUS.INACTIVE) {
        throw new GraphQLError(
          'Teacher is not active. Please schedule meeting with other teacher!',
          {
            extensions: {
              statusCode: HttpStatus.BAD_REQUEST,
            },
          },
        );
      }
      const userRoom = await this.chatRoomRepository.findOne({
        where: {
          id: chat_room_id,
        },
      });

      if (!userRoom) {
        throw new GraphQLError('Chat room not found!', {
          extensions: {
            statusCode: HttpStatus.NOT_FOUND,
          },
        });
      }

      if (!teacher) {
        throw new GraphQLError('Teacher not found!', {
          extensions: {
            statusCode: HttpStatus.NOT_FOUND,
          },
        });
      }

      if (teacher && teacher.status === STATUS.INACTIVE) {
        throw new GraphQLError(
          'Teacher is not active. Please schedule meeting with other teacher!',
          {
            extensions: {
              statusCode: HttpStatus.BAD_REQUEST,
            },
          },
        );
      }

      createChat = await this.chatMessageRepository.save({
        is_read: 0,
        receiver_id: user_id,
        sender_id: parent.id,
        student_id: student_id,
        message_type: MessageType.MEETING,
        chat_room_id: chat_room_id,
        message: `${date} (${time_slots.start_time}-${time_slots.end_time})`,
      });
      await this.chatGateway.sendMeetingMessage(
        userRoom.id,
        userRoom.room,
        findStudent,
        parent,
        teacher,
        createChat,
        undefined,
      );
    }
    const zoomMeeting = await this.zoomCallMeetingsRepository.save({
      parent_id: parent.id,
      user_id: user_id,
      student_id: student_id,
      time_slot: {
        start_time: time_slots.start_time,
        end_time: time_slots.end_time,
      },
      date: date,
      chat_message_id: createChat === null ? null : createChat.id,
      attendee_role: attendee_role,
    });

    if (attendee_role === 0) {
      await this.eventRepository.save({
        event_date: date,
        event_type: EventType.MEETING,
        name: 'Zoom meeting with admin',
        description: 'You have zoom meeting with admin!',
        user_id: parent.id,
        start_time: startTimeOf24Hr,
        end_time: endTimeOf24Hr,
        zoom_call_meeting_id: zoomMeeting.id,
      });
    }
    return { message: 'Zoom call meeting invitation sent successfully!' };
  }

  async findZoomMeeting(whereQuery: string) {
    const findMeeting = this.zoomCallMeetingsRepository
      .createQueryBuilder('zoom_meetings')
      .where(whereQuery)
      .getOne();
    return findMeeting;
  }

  /**
   * get class list by student ID
   * @param studentId
   * @param parent
   * @param listClassesOfStudentInput
   * @returns
   */
  async getStudentWiseClassList(
    studentId: number,
    parent: Users,
    listClassesOfStudentInput: ListClassesOfStudentInput,
  ) {
    const { page, pageSize, sortBy } = listClassesOfStudentInput;
    const sortOrder: any = listClassesOfStudentInput.sortOrder;
    const skip = (page - 1) * pageSize;

    const student = await this.studentRepository.findOne({
      where: { id: studentId },
    });

    if (!student) {
      throw new GraphQLError('No student found with this ID!', {
        extensions: {
          statusCode: HttpStatus.NOT_FOUND,
        },
      });
    }
    const parentOfStudent = student.parent_id;
    if (parent.id !== parentOfStudent) {
      throw new GraphQLError(
        'You are not authorized to access this student details!',
        {
          extensions: {
            statusCode: HttpStatus.UNAUTHORIZED,
          },
        },
      );
    }

    const queryBuilder = await this.classRepository
      .createQueryBuilder('class')
      .leftJoin('class.student_class_mappings', 'student_class_mappings')
      .where('student_class_mappings.student_id = :studentId', {
        studentId,
      })

      .andWhere('class.status = :status', { status: STATUS.ACTIVE })
      .andWhere('student_class_mappings.status = :status', {
        status: STATUS.ACTIVE,
      })
      .skip(skip)
      .take(pageSize)
      .orderBy(
        `class.${sortBy}`,
        SORT_ORDER.includes(sortOrder) ? sortOrder.toUpperCase() : 'DESC',
      );
    if (listClassesOfStudentInput.search) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where(
            'class.name LIKE :search OR class.description LIKE :search',
            { search: `%${listClassesOfStudentInput.search}%` },
          );
        }),
      );
    }
    const [classes, total] = await queryBuilder.getManyAndCount();

    return { classes, total };
  }

  /**
   * get students list by class ID
   * @param classId
   * @param parent
   * @param listStudentsOfClassInput
   * @returns
   */
  async getStudentsListClassWise(
    classId: number,
    parent: Users,
    listStudentsOfClassInput: ListStudentOfClassInput,
  ) {
    const { page, pageSize, sortBy } = listStudentsOfClassInput;
    const sortOrder: any = listStudentsOfClassInput.sortOrder;
    const skip = (page - 1) * pageSize;

    const classData = await this.classRepository.findOne({
      where: { id: classId },
    });

    if (!classData) {
      throw new GraphQLError('No class found with this ID!', {
        extensions: {
          statusCode: HttpStatus.NOT_FOUND,
        },
      });
    }

    const queryBuilder = await this.studentRepository
      .createQueryBuilder('student')
      .leftJoin('student.student_class_mappings', 'student_class_mappings')
      .leftJoin('student_class_mappings.class', 'class')
      .where('student_class_mappings.class_id = :classId', { classId })
      .andWhere('student_class_mappings.status = :status', {
        status: STATUS.ACTIVE,
      })
      .andWhere('class.status = :status', { status: STATUS.ACTIVE })
      .andWhere('student.status = :status', { status: STATUS.ACTIVE })
      .skip(skip)
      .take(pageSize)
      .orderBy(
        `student.${sortBy}`,
        SORT_ORDER.includes(sortOrder) ? sortOrder.toUpperCase() : 'DESC',
      );
    if (listStudentsOfClassInput.search) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where(
            'student.firstname LIKE :search OR student.lastname LIKE :search',
            { search: `%${listStudentsOfClassInput.search}%` },
          );
          qb.orWhere(
            `JSON_UNQUOTE(JSON_EXTRACT(student.parent_details, '$.email')) LIKE :search`,
            {
              search: `%${listStudentsOfClassInput.search}%`,
            },
          );
        }),
      );
    }
    const [students, total] = await queryBuilder.getManyAndCount();
    const studentsWithData: StudentBasicData[] = students.map((student) => {
      const studentBasicData = new StudentBasicData();
      studentBasicData.firstname = student.firstname;
      studentBasicData.lastname = student.lastname;

      if (student.parent_details) {
        const parentDetailsObj = JSON.parse(student.parent_details);
        studentBasicData.email = parentDetailsObj.email || null;
      }

      return studentBasicData;
    });
    return { students: studentsWithData, total };
  }

  /**
   * get teachers list by class ID
   * @param classId
   * @param parent
   * @param listTeachersOfClassInput
   * @returns
   */
  async getTeacherListClassWise(
    classId: number,
    parent: Users,
    listTeachersOfClassInput: ListTeacherOfClassInput,
  ) {
    const { page, pageSize, sortBy } = listTeachersOfClassInput;
    const sortOrder: any = listTeachersOfClassInput.sortOrder;
    const skip = (page - 1) * pageSize;

    const classData = await this.classRepository.findOne({
      where: { id: classId },
    });

    if (!classData) {
      throw new GraphQLError('No class found with this ID!', {
        extensions: {
          statusCode: HttpStatus.NOT_FOUND,
        },
      });
    }
    const queryBuilder = await this.userRespository
      .createQueryBuilder('user')
      .leftJoin('user.teacher_class_mapping', 'teacher_class_mapping')
      .leftJoin('teacher_class_mapping.class', 'class')
      .where(
        'teacher_class_mapping.class_id = :classId AND teacher_class_mapping.status = :status',
        { classId, status: STATUS.ACTIVE },
      )
      .andWhere('class.status = :status', { status: STATUS.ACTIVE })
      .andWhere('user.status = :status', { status: STATUS.ACTIVE })
      .skip(skip)
      .take(pageSize)
      .orderBy(
        `user.${sortBy}`,
        SORT_ORDER.includes(sortOrder) ? sortOrder.toUpperCase() : 'DESC',
      );
    if (listTeachersOfClassInput.search) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where(
            'user.firstname LIKE :search OR user.lastname LIKE :search',
            { search: `%${listTeachersOfClassInput.search}%` },
          );
        }),
      );
    }
    const [teachers, total] = await queryBuilder.getManyAndCount();

    return { teachers, total };
  }

  async createExchangeReturnRequest(
    createExchangeReturnRequestInput: CreateExchangeReturnRequestInput,
    parent: Users,
  ) {
    const { order_details_id } = createExchangeReturnRequestInput;
    const request_type =
      createExchangeReturnRequestInput.request_type.toLowerCase();
    const orderDetails = await this.orderDetailsRepository.findOne({
      where: { id: order_details_id },
    });
    if (!orderDetails) {
      throw new GraphQLError('No order details found with this ID!', {
        extensions: {
          statusCode: HttpStatus.NOT_FOUND,
        },
      });
    }
    const exchangeReturnRequest =
      await this.exchangeReturnRequestRepository.findOne({
        where: { order_details_id: orderDetails.id, user_id: parent.id },
      });
    if (exchangeReturnRequest) {
      throw new GraphQLError(
        'Request for this order has already been submitted!',
        {
          extensions: {
            statusCode: HttpStatus.BAD_REQUEST,
          },
        },
      );
    }
    if (
      request_type !== ExchangeOrReturnRequestType.EXCHANGE &&
      request_type !== ExchangeOrReturnRequestType.RETURN
    ) {
      throw new GraphQLError('Please choose correct request type!', {
        extensions: {
          statusCode: HttpStatus.BAD_REQUEST,
        },
      });
    }
    await this.exchangeReturnRequestRepository.insert({
      ...createExchangeReturnRequestInput,
      user_id: parent.id,
    });

    return {
      message: `Yor request for product ${request_type} has been submitted successfully!`,
    };
  }
}
