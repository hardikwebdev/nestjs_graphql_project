import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateSchoolInput } from './dto/createSchool.input';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Schools } from 'src/database/entities/schools.entity';
import { HelperService } from 'src/helper.service';
import { AwsService } from 'src/aws/aws.service';
import { GraphQLError } from 'graphql';
import { ListSchoolInput } from './dto/listSchool.input';
import { SORT_ORDER, STATUS } from 'src/constants';
import { JwtService } from '@nestjs/jwt';
import { ChatRooms } from 'src/database/entities/chat_room.entity';
import { GroupMembers } from 'src/database/entities/group_members.entity';
import { UserSchoolMappings } from 'src/database/entities/user_school_mapping.entity';
import { GenerateQRCodeInput } from './dto/qrCode.input';
import { Classes } from 'src/database/entities/classes.entity';
import { Students } from 'src/database/entities/student.entity';
import { EventSchoolMappings } from 'src/database/entities/event_school_mappings.entity';

@Injectable()
export class SchoolsService {
  constructor(
    @Inject('SCHOOL_REPOSITORY')
    private readonly schoolRepository: Repository<Schools>,
    @Inject('CHAT_ROOM_REPOSITORY')
    private readonly chatRoomRepository: Repository<ChatRooms>,
    @Inject('GROUP_MEMBERS_REPOSITORY')
    private readonly groupMemberRepository: Repository<GroupMembers>,
    @Inject('USER_SCHOOL_MAPPING_REPOSITORY')
    private readonly userSchoolMappingRepository: Repository<UserSchoolMappings>,
    @Inject('CLASSES_REPOSITORY')
    private readonly classRepository: Repository<Classes>,
    @Inject('STUDENTS_REPOSITORY')
    private readonly studentRepository: Repository<Students>,
    @Inject('EVENT_SCHOOL_MAPPINGS_REPOSITORY')
    private readonly eventSchoolMappingsRepository: Repository<EventSchoolMappings>,
    private readonly helperService: HelperService,
    private readonly awsService: AwsService,
    private readonly jwtService: JwtService,
  ) { }

  /**
   * Add School
   * @param schoolData
   * @returns
   */
  async addSchool(schoolData: CreateSchoolInput, user: any) {
    const { school_gps, ...rest } = schoolData;

    const slug = this.helperService.generateRandomString(25);
    const payload = { slug };

    const jwtToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET_KEY,
      expiresIn: '30m',
    });

    const qr_code = await this.helperService.generateQrCode({
      token: jwtToken,
    });

    const qr_code_url = await this.awsService.uploadToAWS(
      'qrcode',
      qr_code,
      'qrCodeImage',
    );

    const formattedData = {
      ...rest,
      school_gps: {
        latitude: school_gps.latitude,
        longitude: school_gps.longitude,
      },
      qr_code: qr_code_url.Location,
      slug,
    };
    const school = await this.schoolRepository.save(formattedData);
    const room = this.helperService.passwordHash(school.name);
    const createRoom = await this.chatRoomRepository.save({
      room,
      school_id: school.id,
    });
    await this.groupMemberRepository.save({
      user_id: user.id,
      chat_room_id: createRoom.id,
    });
    return { message: 'School added successfully!' };
  }

  /**
   * Update School by ID
   * @param schoolId
   * @param schoolData
   * @returns
   */
  async updateSchoolById(schoolId: number, schoolData: CreateSchoolInput) {
    const isSchoolExist = await this.getSchoolByschoolId(schoolId);

    if (!isSchoolExist) {
      throw new GraphQLError('School not found!', {
        extensions: {
          statusCode: HttpStatus.NOT_FOUND,
        },
      });
    }

    await this.schoolRepository.update(schoolId, schoolData);

    return { message: 'School updated successfully!' };
  }

  /**
   * Delete School by ID
   * @param schoolId
   * @returns
   */
  async deleteSchoolById(schoolId: number) {
    const isSchoolExist = await this.getSchoolByschoolId(schoolId);

    if (!isSchoolExist) {
      throw new GraphQLError('School not found!', {
        extensions: {
          statusCode: HttpStatus.NOT_FOUND,
        },
      });
    }

    await this.userSchoolMappingRepository.softDelete({ schoolId });

    await this.classRepository.softDelete({ school_id: schoolId });
    const findRoom = await this.chatRoomRepository.findOne({
      where: {
        school_id: schoolId,
      },
    });

    if (findRoom) {
      await this.chatRoomRepository.softDelete({
        school_id: schoolId,
      });
    }
    await this.studentRepository.update(
      { school_id: schoolId },
      { school_id: null },
    );

    isSchoolExist.deletedAt = new Date();
    await this.schoolRepository.save(isSchoolExist);

    return { message: 'School deleted successfully!' };
  }

  /**
   * Get School by ID
   * @param schoolId
   * @returns
   */
  async getSchoolById(schoolId: number) {
    const isSchoolExist = await this.getSchoolByschoolId(schoolId);

    if (!isSchoolExist) {
      throw new GraphQLError('School not found!', {
        extensions: {
          statusCode: HttpStatus.NOT_FOUND,
        },
      });
    }

    return isSchoolExist;
  }

  /**
   * Get Schools list with Search, Sort and Pagination
   * @param listSchoolData
   * @returns
   */
  async getSchools(listSchoolData: ListSchoolInput) {
    const { page, pageSize, sortBy } = listSchoolData;
    const sortOrder: any = listSchoolData.sortOrder;
    const skip = (page - 1) * pageSize;

    if (listSchoolData.type && listSchoolData.type === 'WITHOUT_PAGINATION') {
      const schools = await this.schoolRepository.find({
        where: { status: STATUS.ACTIVE },
      });
      return { schools };
    } else {
      const queryBuilder: SelectQueryBuilder<Schools> = this.schoolRepository
        .createQueryBuilder('schools')
        .skip(skip)
        .take(pageSize)
        .orderBy(
          `schools.${sortBy}`,
          SORT_ORDER.includes(sortOrder) ? sortOrder.toUpperCase() : 'DESC',
        );

      if (listSchoolData.search) {
        queryBuilder.andWhere(
          '(schools.name LIKE :search OR schools.address LIKE :search OR schools.email LIKE :search)',
          {
            search: `%${listSchoolData.search}%`,
          },
        );
      }

      if (
        listSchoolData.status === 0 ||
        listSchoolData.status === 1 ||
        listSchoolData.status === 2
      ) {
        queryBuilder.andWhere('schools.status = :status', {
          status: listSchoolData.status,
        });
      }

      const [schools, total] = await queryBuilder.getManyAndCount();

      return { schools, total };
    }
  }

  /**
   * Generate All Schools QR code
   * @returns
   */
  async generateQrCode(qrCodeData: GenerateQRCodeInput) {
    if (!qrCodeData.school_id && !qrCodeData.slug) {
      throw new GraphQLError('You need to pass slug or school_id!', {
        extensions: {
          statusCode: HttpStatus.BAD_REQUEST,
        },
      });
    }
    const isSchoolsExist = await this.schoolRepository.findOne({
      where: [{ id: qrCodeData.school_id }, { slug: qrCodeData.slug }],
      select: ['id', 'name', 'qr_code', 'slug', 'status'],
    });

    if (!isSchoolsExist) {
      throw new GraphQLError('School not found!', {
        extensions: {
          statusCode: HttpStatus.NOT_FOUND,
        },
      });
    }

    if (isSchoolsExist.status !== STATUS.ACTIVE) {
      throw new GraphQLError('School is inactive!', {
        extensions: {
          statusCode: HttpStatus.BAD_REQUEST,
        },
      });
    }

    const payload = { slug: isSchoolsExist.slug };

    const jwtToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET_KEY,
      expiresIn: '30m',
    });

    const qr_code = await this.helperService.generateQrCode({
      token: jwtToken,
    });

    const qrCodeUrl = await this.awsService.uploadToAWS(
      'qrcode',
      qr_code,
      'qrCodeImage',
    );

    await this.awsService.removeFromBucket(isSchoolsExist.qr_code);
    isSchoolsExist.qr_code = qrCodeUrl.Location;

    await this.schoolRepository.save(isSchoolsExist);

    return isSchoolsExist;
  }

  /**
   * Update School Status
   * @param schoolId
   * @param status
   * @returns
   */
  async updateSchoolStatus(schoolId: number, status: number) {
    const isSchoolExist = await this.getSchoolByschoolId(schoolId);

    if (!isSchoolExist) {
      throw new GraphQLError('School not found!', {
        extensions: {
          statusCode: HttpStatus.NOT_FOUND,
        },
      });
    }

    await this.userSchoolMappingRepository.update(
      { schoolId: schoolId },
      { status },
    );

    await this.schoolRepository.update(schoolId, { status });

    return { message: 'School status updated successfully!' };
  }

  async getSchoolByschoolId(id: number) {
    return await this.schoolRepository.findOneBy({ id });
  }
}
