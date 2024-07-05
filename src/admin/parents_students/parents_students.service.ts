import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Students } from 'src/database/entities/student.entity';
import { Users } from 'src/database/entities/user.entity';
import { UserSchoolMappings } from 'src/database/entities/user_school_mapping.entity';
import { EmailService } from 'src/email/email.service';
import { HelperService } from 'src/helper.service';
import { Brackets, In, Not, Repository, SelectQueryBuilder } from 'typeorm';
import { CreateParentInput } from './dto/createParent.input';
import { GraphQLError } from 'graphql';
import { SORT_ORDER, STATUS, USER_ROLES } from 'src/constants';
import { AddStudentsInput } from './dto/addStudents.input';
import { UpdateParentWithStudentsInput } from './dto/updateParent.input';
import { TeacherClassMappings } from 'src/database/entities/teacher_class_mappings.entity';
import { StudentClassMappings } from 'src/database/entities/student_class_mappings.entity';
import { ListParentsInput } from './dto/listParents.input';
import { Schools } from 'src/database/entities/schools.entity';
import { ListParentsPaperworkInput } from './dto/listPaperworks.input';
import { PaperWorks } from 'src/database/entities/paperworks.entity';
import { UpdateStudentsInput } from './dto/updateStudents.input';
import { SubscribedUser } from 'src/database/entities/subscribed_users.entity';
import { AssignClassesToTeacherInput } from '../teachers/dto/assignClassesToTeacher.input'; \
import { AssignSchoolToParentInput } from './dto/assignSchoolToParent.input';
import { GroupMembers } from 'src/database/entities/group_members.entity';
import { ChatRooms } from 'src/database/entities/chat_room.entity';
import { Classes } from 'src/database/entities/classes.entity';

@Injectable()
export class ParentsStudentsService {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userRepository: Repository<Users>,
    @Inject('USER_SCHOOL_MAPPING_REPOSITORY')
    private readonly userSchoolMappingRepository: Repository<UserSchoolMappings>,
    @Inject('STUDENTS_REPOSITORY')
    private readonly studentsRepository: Repository<Students>,
    @Inject('TEACHER_CLASS_MAPPINGS_REPOSITORY')
    private readonly teacherClassMappingsRepository: Repository<TeacherClassMappings>,
    @Inject('STUDENT_CLASS_MAPPINGS_REPOSITORY')
    private readonly studentClassMappingsRepository: Repository<StudentClassMappings>,
    @Inject('SCHOOL_REPOSITORY')
    private readonly schoolRepository: Repository<Schools>,
    @Inject('PAPERWORKS_REPOSITORY')
    private readonly paperworksRepository: Repository<PaperWorks>,
    @Inject('GROUP_MEMBERS_REPOSITORY')
    private readonly groupMembersRepository: Repository<GroupMembers>,
    @Inject('CHAT_ROOM_REPOSITORY')
    private readonly chatRoomsRepository: Repository<ChatRooms>,
    @Inject('SUBSCRIBED_USERS_REPOSITORY')
    private readonly subscribedUsersRepository: Repository<SubscribedUser>,
    @Inject('CLASSES_REPOSITORY')
    private readonly classesRepository: Repository<Classes>,
    private readonly helperService: HelperService,
    private readonly emailService: EmailService,
  ) { }

  /**
   * Add Parent with child by Admin
   * @param addParentWithStudentsData
   * @returns
   */
  async addParentWithStudents(addParentWithStudentsData: CreateParentInput) {
    const { students } = addParentWithStudentsData;

    const isParentExist = await this.userRepository.findOne({
      where: { email: addParentWithStudentsData.email },
    });

    if (isParentExist) {
      throw new GraphQLError('User with this email already exist', {
        extensions: { statusCode: HttpStatus.BAD_REQUEST },
      });
    }
    const studentSchoolIds = [];
    if (students && students.length !== 0) {
      for await (const student of students) {
        const { school_id } = student;
        if (school_id) {
          const isSchoolExist = await this.schoolRepository.findOne({
            where: {
              id: school_id,
              status: STATUS.ACTIVE,
            },
          });
          if (!isSchoolExist) {
            throw new GraphQLError('Selected school not found!', {
              extensions: { statusCode: HttpStatus.NOT_FOUND },
            });
          }
          studentSchoolIds.push(school_id);
        }
      }
    }

    let message: string;

    const password = this.helperService.generateRandomPassword();

    const hashedPassword = this.helperService.passwordHash(password);

    const newUser = await this.userRepository.save({
      password: hashedPassword,
      role: USER_ROLES.PARENT,
      username: addParentWithStudentsData.username,
      email: addParentWithStudentsData.email,
      firstname: addParentWithStudentsData.firstname,
      lastname: addParentWithStudentsData.lastname,
      phone_number: addParentWithStudentsData.phone_number || null,
    });
    delete newUser['password'];
    if (students && students.length !== 0) {
      const insertData = students.map((student) => ({
        parent_id: newUser.id,
        firstname: student.firstname,
        lastname: student.lastname,
        birthdate: student.birthdate,
        home_address: student.home_address,
        emergency_contact: student.emergency_contact,
        transition_days: student.transition_days,
        potty_trained: student.potty_trained,
        is_allergy: student.is_allergy,
        lunch_program: student.lunch_program,
        payment_type: student.payment_type,
        allergy_description: student.allergy_description,
        child_care_before: student.child_care_before,
        parent_details: JSON.stringify(newUser),
        school_id: student?.school_id ? student?.school_id : null,
      }));

      await this.studentsRepository.insert(insertData);
      message = 'Parent with student created successfully!';
    }

    if (studentSchoolIds.length) {
      for await (const studentSchoolId of studentSchoolIds) {
        await this.userSchoolMappingRepository.save({
          schoolId: studentSchoolId,
          userId: newUser.id,
        });
        const findRoom = await this.findRoomOfSchool(studentSchoolId);
        if (findRoom && studentSchoolId) {
          await this.addParentToSchoolGroup({
            chat_room_id: findRoom.id,
            user_id: newUser.id,
          });
        }
      }
    }

    const htmlData = await this.emailService.renderTemplate(
      './views/email/loginCredential.hbs',
      {
        email: addParentWithStudentsData.email,
        username: addParentWithStudentsData.username,
        password: password,
        mailTo: process.env.SUPPORT_EMAIL,
        loginUrl: `${process.env.FRONTEND_URL}/login`,
        logo: `${process.env.BACKEND_URL}/images/logo.png`,
      },
    );

    this.emailService.sendMail(
      addParentWithStudentsData.email,
      'Login Credential',
      'NOTE :- DO NOT SHARE YOUR LOGIN CREDENTIAL WITH ANYONE',
      htmlData,
    );
    return { message: message ? message : 'Parent created successfully!' };
  }

  /**
   * Add Students with Parent ID
   * @param addStudentsData
   * @param parentId
   * @returns
   */
  async addStudents(addStudentsData: AddStudentsInput, parentId: number) {
    const { students } = addStudentsData;
    const isParentExist = await this.getParentById(parentId);
    const studentSchoolIds = [];
    if (!isParentExist) {
      throw new GraphQLError('Parent not found!', {
        extensions: { statusCode: HttpStatus.NOT_FOUND },
      });
    }

    if (isParentExist.status === STATUS.INACTIVE) {
      throw new GraphQLError('Parent is inactive!', {
        extensions: { statusCode: HttpStatus.BAD_REQUEST },
      });
    }
    if (students && students.length !== 0) {
      for await (const student of students) {
        const { school_id } = student;
        if (school_id) {
          const isSchoolExist = await this.schoolRepository.findOne({
            where: {
              id: school_id,
              status: STATUS.ACTIVE,
            },
          });
          if (!isSchoolExist) {
            throw new GraphQLError('Selected school not found!', {
              extensions: { statusCode: HttpStatus.NOT_FOUND },
            });
          }
          studentSchoolIds.push(school_id);
        }
      }
    }

    const insertData = addStudentsData.students.map((student) => ({
      parent_id: parentId,
      firstname: student.firstname,
      lastname: student.lastname,
      birthdate: student.birthdate,
      home_address: student.home_address,
      emergency_contact: student.emergency_contact,
      transition_days: student.transition_days,
      potty_trained: student.potty_trained,
      is_allergy: student.is_allergy,
      lunch_program: student.lunch_program,
      payment_type: student.payment_type,
      allergy_description: student.allergy_description,
      child_care_before: student.child_care_before,
      parent_details: JSON.stringify(isParentExist),
      school_id: student?.school_id ? student?.school_id : null,
    }));

    if (studentSchoolIds.length) {
      for await (const studentSchoolId of studentSchoolIds) {
        await this.userSchoolMappingRepository.save({
          schoolId: studentSchoolId,
          userId: parentId,
        });
        const findRoom = await this.findRoomOfSchool(studentSchoolId);
        if (findRoom && studentSchoolId) {
          await this.addParentToSchoolGroup({
            chat_room_id: findRoom.id,
            user_id: parentId,
          });
        }
      }
    }

    await this.studentsRepository.insert(insertData);

    return { message: 'Students added successfully!' };
  }

  /**
   * Update Parent by id
   * @param updateParentData
   * @param parentId
   */
  async updateParentWithStudentsById(
    updateParentData: UpdateParentWithStudentsInput,
    parentId: number,
  ) {
    const { students } = updateParentData;
    const isParentExist = await this.getParentById(parentId);

    if (!isParentExist) {
      throw new GraphQLError('Parent not found!', {
        extensions: { statusCode: HttpStatus.NOT_FOUND },
      });
    }
    const studentSchoolIds = [];
    if (students && students.length !== 0) {
      for await (const student of students) {
        const { school_id } = student;
        if (school_id) {
          const isSchoolExist = await this.schoolRepository.findOne({
            where: {
              id: school_id,
              status: STATUS.ACTIVE,
            },
          });
          if (!isSchoolExist) {
            throw new GraphQLError('Selected school not found!', {
              extensions: { statusCode: HttpStatus.NOT_FOUND },
            });
          }
          studentSchoolIds.push(school_id);
        }
      }
    }

    isParentExist.username = updateParentData.username;
    isParentExist.firstname = updateParentData.firstname;
    isParentExist.lastname = updateParentData.lastname;
    isParentExist.phone_number = updateParentData.phone_number || null;

    await this.userRepository.save(isParentExist);

    delete isParentExist['password'];
    let message: string;

    if (updateParentData.students && updateParentData.students.length !== 0) {
      for (const student of updateParentData.students) {
        const updateData = {
          parent_id: parentId,
          firstname: student.firstname,
          lastname: student.lastname,
          birthdate: student.birthdate,
          home_address: student.home_address,
          emergency_contact: student.emergency_contact,
          transition_days: student.transition_days,
          potty_trained: student.potty_trained,
          is_allergy: student.is_allergy,
          lunch_program: student.lunch_program,
          payment_type: student.payment_type,
          allergy_description: student.allergy_description,
          child_care_before: student.child_care_before,
          parent_details: JSON.stringify(isParentExist),
          school_id: student?.school_id ? student.school_id : null,
        };
        await this.studentsRepository.update(student.id, updateData);

        if (student.class_ids && student.class_ids.length !== 0) {
          for (const class_id of student.class_ids) {
            const isClassMappingExist =
              await this.studentClassMappingsRepository.findOne({
                where: {
                  student_id: student.id,
                  class_id: class_id,
                },
              });
            if (!isClassMappingExist) {
              await this.studentClassMappingsRepository.insert({
                student_id: student.id,
                class_id: class_id,
              });
            }
          }
          await this.studentClassMappingsRepository
            .createQueryBuilder()
            .update(StudentClassMappings)
            .set({ deletedAt: new Date() })
            .where(
              'student_id = :studentId AND class_id NOT IN (:...classIds) AND deletedAt IS NULL',
              { studentId: student.id, classIds: student.class_ids },
            )
            .execute();
        }
      }

      message = 'Parent with student updated successfully!';
    }

    return { message: message ? message : 'Parent updated successfully!' };
  }

  /**
   * Delete Parent with Students
   * @param parentId
   * @returns
   */
  async deleteParentWithStudents(parentId: number) {
    const isParentExist = await this.getParentById(parentId);

    if (!isParentExist) {
      throw new GraphQLError('Parent not found!', {
        extensions: { statusCode: HttpStatus.NOT_FOUND },
      });
    }
    const students = await this.studentsRepository.find({
      where: { parent_id: parentId },
    });

    if (students.length !== 0) {
      for (const student of students) {
        await this.studentClassMappingsRepository.softDelete({
          student_id: student.id,
        });
      }
    }

    await this.userSchoolMappingRepository.softDelete({ userId: parentId });

    await this.studentsRepository.softDelete({ parent_id: parentId });

    await this.userRepository.softDelete({ id: parentId });

    await this.removeParentFromSchoolGroup(parentId);

    return { message: 'Parent with student deleted successfully!' };
  }

  /**
   * Delete Student by Id
   * @param studentId
   * @returns
   */
  async deleteStudent(studentId: number) {
    const isStudentExist = await this.studentsRepository.findOneBy({
      id: studentId,
    });

    if (!isStudentExist) {
      throw new GraphQLError('Student not found!', {
        extensions: { statusCode: HttpStatus.NOT_FOUND },
      });
    }

    await this.studentClassMappingsRepository.softDelete({
      student_id: studentId,
    });

    await this.studentsRepository.softDelete({ id: studentId });

    return { message: 'Student deleted successfully!' };
  }

  /**
   * Get All Class List by student school
   * @param schoolId
   * @param studentId
   * @returns
   */
  async getClassList(student_id: number) {
    const student = await this.studentsRepository.findOne({
      where: {
        id: student_id,
        status: STATUS.ACTIVE,
      },
    });
    if (!student) {
      throw new GraphQLError('Student not found!', {
        extensions: { statusCode: HttpStatus.NOT_FOUND },
      });
    }

    const classes: any = await this.classesRepository
      .createQueryBuilder('class')
      .where('class.school_id = :schoolId AND class.status = :status', {
        schoolId: student.school_id,
        status: STATUS.ACTIVE,
      })
      .getMany();

    if (student_id) {
      const studentClassMappings =
        await this.studentClassMappingsRepository.find({
          where: {
            student_id: student_id,
            status: STATUS.ACTIVE,
            class_id: In(classes.map((cls) => cls.id)),
          },
        });

      const assignedClassIds = new Set(
        studentClassMappings.map((mapping) => mapping.class_id),
      );

      classes.forEach((cls) => {
        cls.isAssign = assignedClassIds.has(cls.id);
      });
    }

    return { classes };
  }

  /**
   * Get All Parent List with Student Count with Pagination & Parent details with Students details by parent ID
   * @param listParentsData
   * @returns
   */
  async getParentsList(listParentsData: ListParentsInput) {
    const { page, pageSize, sortBy } = listParentsData;
    const sortOrder: any = listParentsData.sortOrder;
    const skip = (page - 1) * pageSize;

    if (listParentsData.type && listParentsData.type === 'WITHOUT_PAGINATION') {
      const users = await this.userRepository
        .createQueryBuilder('users')
        .leftJoinAndSelect('users.students', 'student')
        .leftJoinAndSelect('student.school', 'school')
        .where('users.id = :id', { id: listParentsData.parent_id })
        .getMany();

      return { users };
    } else {
      const queryBuilder: SelectQueryBuilder<Users> = this.userRepository
        .createQueryBuilder('users')
        .leftJoin('users.userSchoolMappings', 'userSchoolMappings')
        .leftJoin('userSchoolMappings.schools', 'schools')
        .leftJoin('users.students', 'student')
        .where(
          new Brackets((qb) => {
            qb.where('users.role = :role', { role: USER_ROLES.PARENT });
          }),
        )
        .andWhere(
          new Brackets((qb) => {
            if (listParentsData.search) {
              qb.where(
                '(users.username LIKE :search OR CONCAT(users.firstname, " ", users.lastname) LIKE :search OR users.email LIKE :search OR CONCAT(student.firstname, " ", student.lastname) LIKE :search)',
                { search: `%${listParentsData.search}%` },
              );
            }
            if (
              listParentsData.status === 0 ||
              listParentsData.status === 1 ||
              listParentsData.status === 2
            ) {
              qb.andWhere('users.status = :status', {
                status: listParentsData.status,
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

      const studentCountQuery = this.userRepository
        .createQueryBuilder('users')
        .leftJoin('users.students', 'students')
        .where('users.role = :role', { role: USER_ROLES.PARENT })
        .select('users.id')
        .addSelect('COUNT(students.id)', 'studentCount')
        .groupBy('users.id');

      const [users, counts, total] = await Promise.all([
        queryBuilder.getMany(),
        studentCountQuery.getRawMany(),
        queryBuilder.getCount(),
      ]);

      const usersWithCounts = users.map((user) => {
        const count = counts.find((count) => count.users_id === user.id);
        return {
          ...user,
          studentCount: count ? parseInt(count.studentCount) : 0,
        };
      });

      return { users: usersWithCounts, total };
    }
  }

  /**
   * Get All Paperworks created by Parents with pagination
   * @param listParentPaperworkData
   * @returns
   */
  async getAllParentsPaperwork(
    listParentPaperworkData: ListParentsPaperworkInput,
  ) {
    const { page, pageSize, sortBy } = listParentPaperworkData;
    const sortOrder: any = listParentPaperworkData.sortOrder;
    const skip = (page - 1) * pageSize;

    const queryBuilder: SelectQueryBuilder<PaperWorks> =
      this.paperworksRepository
        .createQueryBuilder('paperworks')
        .leftJoinAndSelect('paperworks.user', 'user')
        .leftJoinAndSelect('paperworks.student', 'student')
        .where(
          new Brackets((qb) => {
            if (listParentPaperworkData.parent_id) {
              qb.where('user.id = :teacherId', {
                teacherId: listParentPaperworkData.parent_id,
              });
            } else {
              qb.where('user.role = :role', { role: USER_ROLES.PARENT });
            }
          }),
        )
        .andWhere(
          new Brackets((qb) => {
            if (listParentPaperworkData.search) {
              qb.where(
                '(paperworks.title LIKE :search OR CONCAT(users.firstname, " ", users.lastname) LIKE :search OR user.username LIKE :search OR CONCAT(student.firstname, " ", student.lastname) LIKE :search)',
                { search: `%${listParentPaperworkData.search}%` },
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
   * Get Student by ID
   * @param studentId
   * @returns
   */
  async getStudentById(studentId: number) {
    const student = await this.studentsRepository.findOneBy({ id: studentId });

    if (!student) {
      throw new GraphQLError('Student not found!', {
        extensions: { statusCode: HttpStatus.NOT_FOUND },
      });
    }

    return student;
  }

  /**
   * Update Students
   * @param updateStudentsData
   * @returns
   */
  async updateStudents(
    updateStudentsData: UpdateStudentsInput,
    parent_id: number,
  ) {
    for await (const student of updateStudentsData.students) {
      if (!student?.school_id) {
        throw new GraphQLError('School selection is required!', {
          extensions: { statusCode: HttpStatus.BAD_REQUEST },
        });
      }
      const isSchoolExist = await this.schoolRepository.findOne({
        where: {
          id: student.school_id,
          status: STATUS.ACTIVE,
        },
      });
      if (!isSchoolExist) {
        throw new GraphQLError('Selected school not found!', {
          extensions: { statusCode: HttpStatus.NOT_FOUND },
        });
      }
      const getStudent = await this.getStudentById(student.id);

      // Remove parent from school group(room) and from userSchoolMapping
      if (getStudent?.school_id != student.school_id) {
        await this.userSchoolMappingRepository.softDelete({
          schoolId: getStudent.school_id,
          userId: parent_id,
        });

        const findRooms = await this.findChatRoomsBySchoolsIds([
          getStudent.school_id,
        ]);
        const roomIds = findRooms.map((roomData) => {
          return roomData.id;
        });
        if (roomIds.length) {
          await this.groupMembersRepository.softDelete({
            chat_room_id: roomIds[0],
            user_id: parent_id,
          });
          const findNewSchoolRoom = await this.findChatRoomsBySchoolsIds([
            student.school_id,
          ]);
          const newRoomIds = findNewSchoolRoom.map((room) => {
            return room.id;
          });
          if (newRoomIds.length) {
            await this.addParentToSchoolGroup({
              chat_room_id: newRoomIds[0],
              user_id: parent_id,
            });
          }
        }

        const classes = await this.classesRepository.find({
          where: { school_id: student.school_id },
        });

        const classIds = classes.map((classData) => {
          return classData.id;
        });
        await this.studentClassMappingsRepository.update(
          {
            class_id: Not(In(classIds)),
            student_id: student.id,
          },
          { deletedAt: new Date() },
        );
      }
      const updateData = {
        firstname: student.firstname,
        lastname: student.lastname,
        birthdate: student.birthdate,
        home_address: student.home_address,
        emergency_contact: student.emergency_contact,
        transition_days: student.transition_days,
        potty_trained: student.potty_trained,
        is_allergy: student.is_allergy,
        lunch_program: student.lunch_program,
        payment_type: student.payment_type,
        allergy_description: student.allergy_description,
        child_care_before: student.child_care_before,
        school_id: student.school_id,
      };
      await this.studentsRepository.update(student.id, updateData);
    }

    return { message: 'Students updated successfully!' };
  }

  /**
   * Get Subscription Plan Detail by Parent ID
   * @param parentId
   * @returns
   */
  async getSubscribedPlanDetail(parentId: number) {
    const isParentExist = await this.getParentById(parentId);

    if (!isParentExist) {
      throw new GraphQLError('Parent not found!', {
        extensions: { statusCode: HttpStatus.NOT_FOUND },
      });
    }

    const userSubscription = await this.subscribedUsersRepository
      .createQueryBuilder('subscribed_users')
      .leftJoin('subscribed_users.subscription_plan', 'subscription_plan')
      .where('subscribed_users.user_id = :userId', { userId: parentId })
      .select([
        'subscribed_users',
        'subscription_plan.id',
        'subscription_plan.name',
        'subscription_plan.description',
        'subscription_plan.price',
        'subscription_plan.interval',
      ])
      .getOne();

    return userSubscription;
  }

  /**
   * Assign Classes to Student
   * @param studentId
   * @param assignClassesData
   * @returns
   */
  async assignClassesToStudent(
    studentId: number,
    assignClassesData: AssignClassesToTeacherInput,
  ) {
    if (assignClassesData.classIds && assignClassesData.classIds.length !== 0) {
      assignClassesData.classIds.map(async (classId) => {
        const isStudentClassMappingExist =
          await this.studentClassMappingsRepository.findOne({
            where: { student_id: studentId, class_id: classId },
          });
        if (!isStudentClassMappingExist) {
          await this.studentClassMappingsRepository.insert({
            student_id: studentId,
            class_id: classId,
          });
        }
      });
      await this.studentClassMappingsRepository
        .createQueryBuilder()
        .update(StudentClassMappings)
        .set({ deletedAt: new Date() })
        .where(
          'student_id = :studentId AND class_id NOT IN (:...classIds) AND deletedAt IS NULL',
          { studentId, classIds: assignClassesData.classIds },
        )
        .execute();
    } else {
      throw new GraphQLError('Class Id is required!', {
        extensions: {
          statusCode: HttpStatus.BAD_REQUEST,
        },
      });
    }

    return { message: 'Classes assigned successfully to student!' };
  }

  /**
   * unAssign All Classes to Student
   * @param studentId
   * @returns
   */
  async unAssignAllClassesToStudent(studentId: number) {
    const isStudentClassMappingExist =
      await this.studentClassMappingsRepository.find({
        where: { student_id: studentId },
      });

    if (isStudentClassMappingExist.length !== 0) {
      await this.studentClassMappingsRepository
        .createQueryBuilder()
        .update(StudentClassMappings)
        .set({ deletedAt: new Date() })
        .where('student_id = :studentId AND deletedAt IS NULL', { studentId })
        .execute();
    } else {
      throw new GraphQLError('No class assigned found to student!', {
        extensions: {
          statusCode: HttpStatus.NOT_FOUND,
        },
      });
    }

    return { message: 'Unassign all classes to student successfully!' };
  }

  /**
   * Assign School to Parent & Students
   * @param parentId
   * @param assignSchoolData
   * @returns
   */
  async assignSchoolToParent(
    parentId: number,
    assignSchoolData: AssignSchoolToParentInput,
  ) {
    const isParentExist = await this.getParentById(parentId);

    if (!isParentExist) {
      throw new GraphQLError('Parent not found!', {
        extensions: { statusCode: HttpStatus.NOT_FOUND },
      });
    }

    const isSchoolsExist = await this.schoolRepository
      .createQueryBuilder()
      .where('id IN (:...schoolIds)', {
        schoolIds: assignSchoolData.schoolIds,
      })
      .andWhere('status = :status', { status: STATUS.ACTIVE })
      .getMany();

    if (isSchoolsExist.length !== assignSchoolData.schoolIds.length) {
      throw new GraphQLError('School not found!', {
        extensions: { statusCode: HttpStatus.NOT_FOUND },
      });
    }

    if (assignSchoolData.schoolIds && assignSchoolData.schoolIds.length !== 0) {
      const findRooms = await this.findChatRoomsBySchoolsIds(
        assignSchoolData.schoolIds,
      );
      const roomIds = findRooms.map((roomData) => {
        return roomData.id;
      });
      await this.groupMembersRepository.softDelete({
        chat_room_id: Not(In(roomIds)),
        user_id: parentId,
      });

      assignSchoolData.schoolIds.map(async (schoolId) => {
        const isSchoolMappingExist =
          await this.userSchoolMappingRepository.findOne({
            where: { userId: parentId, schoolId },
          });

        if (!isSchoolMappingExist) {
          const findRoom = await this.findRoomOfSchool(schoolId);
          await this.userSchoolMappingRepository.insert({
            userId: parentId,
            schoolId,
          });

          await this.studentsRepository.update(
            { parent_id: parentId, school_id: null },
            { school_id: schoolId },
          );

          if (findRoom) {
            const userGroupExist = await this.getGroupMemberByFindData({
              chat_room_id: findRoom.id,
              user_id: parentId,
            });

            if (!userGroupExist) {
              await this.addParentToSchoolGroup({
                chat_room_id: findRoom.id,
                user_id: parentId,
              });
            }
          }
        }
      });
      await this.userSchoolMappingRepository
        .createQueryBuilder()
        .update(UserSchoolMappings)
        .set({ deletedAt: new Date() })
        .where(
          'userId = :userId AND schoolId NOT IN (:...schoolIds) AND deletedAt IS NULL',
          { userId: parentId, schoolIds: assignSchoolData.schoolIds },
        )
        .execute();
    }

    return { message: 'School assigned successfully' };
  }

  /**
   * Update Parent with students status by Parent ID
   * @param parentId
   * @param status
   * @returns
   */
  async updateParentWithStudentsStatus(parentId: number, status: number) {
    const isParentExist = await this.getParentById(parentId);

    if (!isParentExist) {
      throw new GraphQLError('Parent not found!', {
        extensions: { statusCode: HttpStatus.NOT_FOUND },
      });
    }

    await this.userRepository.update(parentId, { status });

    await this.studentsRepository.update({ parent_id: parentId }, { status });

    return { message: 'Parent with students status updated successfully!' };
  }

  /**
   * Update Student Status by Student Id
   * @param studentId
   * @param status
   * @returns
   */
  async updateStudentStatus(studentId: number, status: number) {
    await this.getStudentById(studentId);

    await this.studentsRepository.update(studentId, { status });

    return { message: 'Student status updated successfully!' };
  }

  /**
   * Commen Get Parent By Id Function
   * @param id
   * @returns
   */
  async getParentById(id: number) {
    return await this.userRepository.findOneBy({ id });
  }

  async findRoomOfSchool(id: number) {
    const findRoom = await this.chatRoomsRepository.findOne({
      where: {
        school_id: id,
      },
      select: ['id'],
    });
    return findRoom;
  }

  /**
   * add parent to school group
   * @param memberData
   */
  async addParentToSchoolGroup(memberData: Partial<GroupMembers>) {
    await this.groupMembersRepository.save(memberData);
  }

  /**
   * get group member by find data
   * @param groupMemberData
   * @returns
   */
  async getGroupMemberByFindData(groupMemberData: Partial<GroupMembers>) {
    return await this.groupMembersRepository.findOneBy(groupMemberData);
  }

  /**
   * Remove parent from school group
   * @param parentId
   * @returns
   */
  async removeParentFromSchoolGroup(parentId: number) {
    return await this.groupMembersRepository.softDelete({
      user_id: parentId,
    });
  }
  /**
   * remove user from user school mapping
   * @param removeWhereData
   * @returns
   */
  async removeUserSchoolMapping(removeWhereData: Partial<UserSchoolMappings>) {
    return await this.userSchoolMappingRepository.softDelete(removeWhereData);
  }

  /**
   * Find chat rooms by school ids
   * @param schoolIds
   * @returns
   */
  async findChatRoomsBySchoolsIds(schoolIds: number[]) {
    const findRoom = await this.chatRoomsRepository.find({
      where: {
        school_id: In(schoolIds),
      },
      select: ['id', 'room', 'school_id'],
    });
    return findRoom;
  }
}
