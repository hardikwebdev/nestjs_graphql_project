import { Inject, Injectable } from '@nestjs/common';
import { STATUS, USER_ROLES } from 'src/constants';
import { ReimbursementRequests } from 'src/database/entities/reimbursement_receipt.entity';
import { Schools } from 'src/database/entities/schools.entity';
import { Students } from 'src/database/entities/student.entity';
import { StudentClassMappings } from 'src/database/entities/student_class_mappings.entity';
import { Users } from 'src/database/entities/user.entity';
import {
  UserRecentLogs,
  UserRecentLogsType,
} from 'src/database/entities/user_recent_logs.entity';
import { IsNull, Repository } from 'typeorm';

@Injectable()
export class DashboardService {
  constructor(
    @Inject('SCHOOL_REPOSITORY')
    private readonly schoolRepository: Repository<Schools>,
    @Inject('USER_REPOSITORY')
    private readonly userRepository: Repository<Users>,
    @Inject('STUDENTS_REPOSITORY')
    private readonly studentsRepository: Repository<Students>,
    @Inject('STUDENT_CLASS_MAPPINGS_REPOSITORY')
    private readonly studentClassMappingRepository: Repository<StudentClassMappings>,
    @Inject('USER_RECENT_LOGS_REPOSITORY')
    private readonly userRecentLogsRepository: Repository<UserRecentLogs>,
    @Inject('REIMBURSEMENT_REQUESTS_REPOSITORY')
    private readonly reimbursementRequestsRepository: Repository<ReimbursementRequests>,
  ) {}

  /**
   * Get Total Schools, Teachers, Parents/Students, Unassigned Parents/Students, sick-time_off, reimbursement Count
   * @returns
   */
  async getTotalCount() {
    const schools_total = await this.schoolRepository.count({
      where: { status: STATUS.ACTIVE },
    });

    const teachers_total = await this.userRepository.count({
      where: { status: STATUS.ACTIVE, role: USER_ROLES.TEACHER },
    });

    const parents_total = await this.userRepository.count({
      where: { role: USER_ROLES.PARENT, status: STATUS.ACTIVE },
    });

    const students_total = await this.studentsRepository.count({
      where: { status: STATUS.ACTIVE },
    });

    const unassigned_students_school_total =
      await this.studentsRepository.count({
        where: {
          status: STATUS.ACTIVE,
          school_id: IsNull(),
        },
      });

    const unassigned_students_class_total = await this.studentsRepository
      .createQueryBuilder('students')
      .leftJoinAndSelect(
        'students.student_class_mappings',
        'student_class_mappings',
      )
      .where('student_class_mappings.id IS NULL')
      .getCount();

    const sick_request_total = await this.userRecentLogsRepository.count({
      where: [
        { type: UserRecentLogsType.SICK },
        { type: UserRecentLogsType.TIME_OFF },
      ],
    });

    const reimbursement_request_total =
      await this.reimbursementRequestsRepository.count();

    return {
      schools_total,
      teachers_total,
      parents_total,
      students_total,
      unassigned_students_school_total,
      unassigned_students_class_total,
      sick_request_total,
      reimbursement_request_total,
    };
  }
}
