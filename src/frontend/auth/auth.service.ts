import {
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { GraphQLError } from 'graphql';
import { USER_ROLES } from 'src/constants';
import { Users } from 'src/database/entities/user.entity';
import { EmailService } from 'src/email/email.service';
import { Repository } from 'typeorm';
import { MessageObject } from 'src/commonGqlTypes/message.object';
import { LoginTeacherParentObjectType } from './dto/loginTeacherParent.object';
import { ForgotPasswordObjectType } from './dto/forgotPassword.object';
import { HelperService } from 'src/helper.service';
import { RedisService } from 'src/redis/redis.service';
import { ForgotPasswordInput } from './dto/forgotPassword.input';
import * as bcrypt from 'bcrypt';
import { ResetPasswordForTeacherParent } from './dto/resetPassword.input';
import { OTPObjectType } from './dto/verifyOtp.object';
import { OperationType } from './constants';
import { STATUS, IS_MFA, IS_USER_VERIFIED } from 'src/constants';
import { UserDevice } from 'src/database/entities/user_devices.entity';
import { ResendOTPObjectType } from './dto/resendOTP.object';
import { Students } from 'src/database/entities/student.entity';
import { ParentsRegisterObjectType } from './dto/addParent.object';
import { AddParentInput } from './dto/addParent.input';
import { StudentInfo } from './dto/studentInfo.object';

@Injectable()
export class FrontEndAuthService {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userRespository: Repository<Users>,
    @Inject('USER_DEVICE_REPOSITORY')
    private readonly userDeviceRepository: Repository<UserDevice>,
    @Inject('STUDENTS_REPOSITORY')
    private readonly studentRepository: Repository<Students>,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly helperService: HelperService,
    private readonly redisService: RedisService,
  ) { }

  async setOtpRedis(key: string, value: any, operationType: string) {
    key = `${key.toLowerCase()}_${operationType.toLowerCase()}`;

    let alreadyExist: any = await this.redisService.getValue(key);

    if (alreadyExist) {
      alreadyExist = JSON.parse(alreadyExist);
      const curTime: any = new Date();

      const createdAt: any = new Date(alreadyExist.createdAt);

      const timeDiff: any = (curTime - createdAt) / 1000;

      if (timeDiff > 30 && alreadyExist.otpCount < 3) {
        value.otpCount = alreadyExist.otpCount + 1;
        await this.redisService.setValue(key, JSON.stringify(value), 1800);
      } else if (timeDiff < 30 && alreadyExist.otpCount < 3) {
        const seconds: string = (30 - timeDiff).toString();
        throw new GraphQLError(
          `Please wait for ${parseInt(seconds)} seconds!`,
          {
            extensions: {
              statusCode: HttpStatus.BAD_REQUEST,
            },
          },
        );
      } else if (alreadyExist.otpCount >= 3 && timeDiff > 600) {
        value.otpCount = 1;
        await this.redisService.setValue(key, JSON.stringify(value), 1800);
      } else if (alreadyExist.otpCount >= 3 && timeDiff < 600) {
        const seconds: string =
          600 - timeDiff <= 600
            ? `${parseInt((600 - timeDiff).toString())} seconds`
            : `${parseInt(((600 - timeDiff) / 60).toString())} minutes`;
        throw new GraphQLError(
          `You have exceed to resend otp limit please try again after ${seconds}!`,
          {
            extensions: {
              statusCode: HttpStatus.BAD_REQUEST,
            },
          },
        );
      } else {
        throw new GraphQLError('Failed to send otp try again!', {
          extensions: {
            statusCode: HttpStatus.BAD_REQUEST,
          },
        });
      }
    } else {
      value.otpCount = 1;
      await this.redisService.setValue(key, JSON.stringify(value), 1800);
    }
  }
  async findUserById(id: number): Promise<Users> {
    const user = await this.userRespository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  /**
   * Find user by email
   * @param email
   * @returns
   */
  async findUserByEmail(email: string) {
    const user = await this.userRespository.findOneBy({
      email,
    });
    return user;
  }
  async sendOTPByEmail(
    email: string,
    subject: string,
    otp: string,
  ): Promise<void> {
    const htmlData = await this.emailService.renderTemplate(
      './views/email/otp.hbs',
      {
        email: email,
        OTP: otp,
        mailTo: process.env.SUPPORT_EMAIL,
        logo: `${process.env.BACKEND_URL}/images/logo.png`,
      },
    );

    this.emailService.sendMail(email, subject, '', htmlData);
  }

  /**
   * login for teacher and parent
   * @param loginTeacherParentInputType
   * @returns
   */
  async login(
    user: Users,
    deviceType: string,
    deviceToken: string,
  ): Promise<LoginTeacherParentObjectType> {
    if (user.role !== USER_ROLES.TEACHER && user.role !== USER_ROLES.PARENT) {
      throw new GraphQLError('Unauthorized user!', {
        extensions: {
          statusCode: HttpStatus.UNAUTHORIZED,
        },
      });
    }

    if (user.status !== STATUS.ACTIVE) {
      throw new GraphQLError('User account is inactive!', {
        extensions: {
          statusCode: HttpStatus.UNAUTHORIZED,
        },
      });
    }
    const payload = {
      id: user.id,
      email: user.email,
    };

    const resendOtp = await this.redisService.getValue(
      `${payload.email}_login`,
    );

    if (resendOtp !== null) {
      await this.redisService.deleteValue(`${payload.email}_login`);
    }

    const otp = this.helperService.generateOTP();

    const jwtToken = this.jwtService.sign(payload, {
      secret:
        process.env.JWT_SCERET_KEY ||
        '3KfcgMUJSDFNhasreHJBXCAUuiqwerksac45rknsdfKJSBF',
      expiresIn: '48h',
    });
    const userId = (user as any)?.id;

    let subject = 'LOGIN OTP VERIFICATION';
    let message = 'Please check your email for login verification !';
    if (
      user.is_mfa === IS_MFA.FALSE &&
      user.is_verified === IS_USER_VERIFIED.TRUE
    ) {
      message = 'You are loggedIn successfully !';
      await this.userDeviceRepository.delete({
        device_token: deviceToken,
      });
      await this.userDeviceRepository.insert({
        device_token: deviceToken,
        device_type: deviceType,
        user_id: userId,
      });
      const students = await this.studentRepository.find({
        where: { parent_id: user.id },
      });

      return {
        ...user,
        students: students,
        token: jwtToken,
        message: message,
      };
    }

    if (user.is_verified !== IS_USER_VERIFIED.TRUE) {
      subject = 'REGESTRATION VERIFICATION';
      message = 'Please check your email for registration verification !';
    }

    Promise.all([
      await this.redisService.setValue(user.email, otp, 600),
      this.sendOTPByEmail(user.email, subject, otp),
    ]);

    return {
      ...user,
      otp: otp,
      message: message,
    };
  }

  /**
   * verify otp
   * @param email
   * @param enteredOtp
   * @returns
   */
  async verifyOTP(
    email: string,
    enteredOtp: string,
    operationType: string,
    device_type?: string,
    device_token?: string,
  ): Promise<OTPObjectType> {
    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new GraphQLError('No user found with this email!', {
        extensions: {
          statusCode: HttpStatus.UNAUTHORIZED,
        },
      });
    }
    let jwtResetToken: string;
    let students: StudentInfo[] | undefined;
    const payload = { id: user.id, email: user.email };
    let jwtToken: string;
    if (
      operationType === OperationType.LOGIN ||
      operationType === OperationType.REGISTRATION
    ) {
      jwtToken = this.jwtService.sign(payload, {
        secret:
          process.env.JWT_SCERET_KEY ||
          '3KfcgMUJSDFNhasreHJBXCAUuiqwerksac45rknsdfKJSBF',
        expiresIn: '48h',
      });
    }
    if (operationType === OperationType.FORGOT_PASSWORD) {
      const resetToken = await bcrypt.hash(
        user.firstname + process.env.JWT_SCERET_KEY,
        12,
      );

      await this.userRespository.update(user.id, {
        reset_token: resetToken,
      });

      jwtResetToken = this.jwtService.sign(
        {
          email: user.email,
          resetToken,
        },
        {
          secret: process.env.JWT_SECRET_KEY,
          expiresIn: '30m',
        },
      );
    }

    if (operationType === OperationType.REGISTRATION) {
      if (!device_type || !device_token) {
        throw new GraphQLError(
          'Device type and token are required for registration!',
          {
            extensions: {
              statusCode: HttpStatus.BAD_REQUEST,
            },
          },
        );
      }
      await this.userRespository.update(user.id, { is_verified: 1 });
    }
    if (operationType === OperationType.LOGIN) {
      if (!device_type || !device_token) {
        throw new GraphQLError(
          'Device type and token are required for registration!',
          {
            extensions: {
              statusCode: HttpStatus.BAD_REQUEST,
            },
          },
        );
      }
      students = await this.studentRepository.find({
        where: { parent_id: user.id },
      });
    }
    const resendotpkey = await this.redisService.getValue(
      `${email}_${operationType}`,
    );

    let key: string;
    if (resendotpkey !== null) {
      key = JSON.parse(resendotpkey).otp;
    }

    const storedOtp = key || (await this.redisService.getValue(email));

    if (storedOtp !== enteredOtp) {
      throw new GraphQLError('Invalid OTP!', {
        extensions: {
          statusCode: HttpStatus.BAD_REQUEST,
        },
      });
    }
    await this.userDeviceRepository.delete({
      device_token: device_token,
    });
    await this.userDeviceRepository.insert({
      device_token: device_token,
      device_type: device_type,
      user_id: user.id,
    });
    return {
      ...user,
      students,
      token: jwtToken || jwtResetToken,
      message: 'OTP verified successfully!',
    };
  }

  /**
   * Forgot password for user
   * @param userData
   * @returns
   */
  async forgotPassword(
    userData: ForgotPasswordInput,
  ): Promise<ForgotPasswordObjectType> {
    const userExists: Users = await this.findUserByEmail(userData.email);

    if (!userExists) {
      throw new GraphQLError('User not found!', {
        extensions: {
          statusCode: HttpStatus.NOT_FOUND,
        },
      });
    }

    if (
      userExists.role !== USER_ROLES.TEACHER &&
      userExists.role !== USER_ROLES.PARENT
    ) {
      throw new GraphQLError('Unauthorized user!', {
        extensions: {
          statusCode: HttpStatus.UNAUTHORIZED,
        },
      });
    }
    const resendOtp = await this.redisService.getValue(
      `${userExists.email}_forgot_password`,
    );

    if (resendOtp !== null) {
      await this.redisService.deleteValue(
        `${userExists.email}_forgot_password`,
      );
    }

    const otp = this.helperService.generateOTP();
    await this.redisService.setValue(userExists.email, otp, 600);
    await this.sendOTPByEmail(userExists.email, 'change password', otp);
    return {
      otp: otp,
      message: 'OTP sent successfully!',
    };
  }

  /**
   * Reset user password
   * @param userData
   * @returns
   */
  async resetPassword(
    userData: ResetPasswordForTeacherParent,
  ): Promise<MessageObject> {
    const jwtVerified = this.jwtService.verify(userData.reset_token, {
      secret: process.env.JWT_SECRET_KEY,
    });
    const userExists = await this.findUserByEmail(userData.email);

    if (!userExists) {
      throw new GraphQLError('User not found!', {
        extensions: {
          statusCode: HttpStatus.NOT_FOUND,
        },
      });
    }
    if (
      userExists.role !== USER_ROLES.TEACHER &&
      userExists.role !== USER_ROLES.PARENT
    ) {
      throw new GraphQLError('Unauthorized user!', {
        extensions: {
          statusCode: HttpStatus.UNAUTHORIZED,
        },
      });
    }

    if (
      !userExists.reset_token ||
      userExists.reset_token !== jwtVerified.resetToken
    ) {
      throw new GraphQLError(
        'Wrong reset token please generate new reset token!',
        {
          extensions: {
            statusCode: HttpStatus.CONFLICT,
          },
        },
      );
    }

    const newPassword = await bcrypt.hash(userData.new_password, 12);

    await this.userRespository.update(userExists.id, {
      password: newPassword,
    });

    return { message: 'Password reset successfully!' };
  }

  /**
   * Resend OTP
   * @param email
   * @returns
   */
  async resendOTP(
    email: string,
    operationType: string,
  ): Promise<ResendOTPObjectType> {
    const user: Users = await this.findUserByEmail(email);

    if (!user) {
      throw new GraphQLError('User not found!', {
        extensions: {
          statusCode: HttpStatus.NOT_FOUND,
        },
      });
    }

    if (user.role !== USER_ROLES.TEACHER && user.role !== USER_ROLES.PARENT) {
      throw new GraphQLError('Unauthorized user!', {
        extensions: {
          statusCode: HttpStatus.UNAUTHORIZED,
        },
      });
    }

    if (
      operationType !== OperationType.FORGOT_PASSWORD &&
      operationType !== OperationType.LOGIN &&
      operationType !== OperationType.REGISTRATION
    ) {
      throw new GraphQLError('Wrong operation type!', {
        extensions: {
          statusCode: HttpStatus.BAD_REQUEST,
        },
      });
    }

    const otp = this.helperService.generateOTP();
    const userData = {
      userId: user.id,
      userEmail: user.email,
      otp: otp,
      otpCount: 0,
      createdAt: new Date(),
    };

    await this.setOtpRedis(user.email, userData, operationType);
    await this.sendOTPByEmail(user.email, 'OTP', otp);
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstname,
      lastName: user.lastname,
      role: user.role,
      otp: otp,
      message: 'OTP sent successfully!',
    };
  }

  /**
   * parent registration
   * @param AddParentInput
   * @returns
   */
  async registration(
    userData: AddParentInput,
  ): Promise<ParentsRegisterObjectType> {
    const userExists = await this.userRespository.findOne({
      where: { email: userData.email },
    });
    if (userExists && userExists.is_verified === IS_USER_VERIFIED.TRUE) {
      throw new GraphQLError('user already exists!', {
        extensions: {
          statusCode: HttpStatus.UNAUTHORIZED,
        },
      });
    }
    let userdetail;
    if (userExists && !userData.token) {
      throw new GraphQLError('user already exists!', {
        extensions: {
          statusCode: HttpStatus.UNAUTHORIZED,
        },
      });
    }

    if (userData.password !== userData.confirm_password) {
      throw new GraphQLError('Password should match!', {
        extensions: {
          statusCode: HttpStatus.UNAUTHORIZED,
        },
      });
    }

    const hashedPassword = this.helperService.passwordHash(userData.password);

    const otp = this.helperService.generateOTP();
    const token = await bcrypt.hash(userData.firstname, 12);
    let userId: string;
    if (userData.token) {
      userId = await this.redisService.getValue(userData.token);

      if (!userId) {
        throw new GraphQLError('Invalid or expired token!', {
          extensions: {
            statusCode: HttpStatus.UNAUTHORIZED,
          },
        });
      }
    }

    if (userId) {
      await this.userRespository.update(userId, {
        username: userData.username,
        firstname: userData.firstname,
        lastname: userData.lastname,
        email: userData.email,
        password: hashedPassword,
        phone_number: userData.phone_number,
        role: 1,
      });

      await this.redisService.deleteValue(userData.token);
      await this.redisService.setValue(token, userId, 600);
    } else {
      userdetail = await this.userRespository.insert({
        username: userData.username,
        firstname: userData.firstname,
        lastname: userData.lastname,
        email: userData.email,
        password: hashedPassword,
        phone_number: userData.phone_number,
        role: 1,
      });

      await this.redisService.setValue(
        token,
        userdetail.generatedMaps[0].id,
        600,
      );
    }
    const resendOtp = await this.redisService.getValue(
      `${userData.email}_registration`,
    );

    if (resendOtp !== null) {
      await this.redisService.deleteValue(`${userData.email}_registration`);
    }
    await this.redisService.setValue(userData.email, otp, 600);
    await this.sendOTPByEmail(userData.email, 'OTP VERIFICATION', otp);
    const userIdFromUserDetail = userdetail
      ? userdetail.generatedMaps[0].id
      : null;
    const user = await this.findUserById(userIdFromUserDetail);
    return {
      ...user,
      otp: otp,
      token: token,
      message: 'Please check your email for registration verification!',
    };
  }

  /**
   * Remove device token in logout
   * @param deviceToken
   * @returns
   */
  async logoutUser(deviceToken: string) {
    await this.userDeviceRepository.delete({
      device_token: deviceToken,
    });
    return { message: 'Logout successfully!' };
  }
}
