import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Users } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';
import { LoginAdminObjectType } from './dto/loginAdmin.object';
import { USER_ROLES } from 'src/constants';
import { GraphQLError } from 'graphql';
import { EmailService } from 'src/email/email.service';
import * as bcrypt from 'bcrypt';
import { ForgetPasswordInput } from './dto/forgetPassword.input';
import { ResetPasswordInput } from './dto/resetPassword.input';
import { MessageObject } from 'src/commonGqlTypes/message.object';
import { RolesPermissions } from 'src/database/entities/roles_permissions.entity';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userRespository: Repository<Users>,
    @Inject('ROLES_PERMISSIONS_REPOSITORY')
    private readonly rolePermissionRepository: Repository<RolesPermissions>,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

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

  /**
   * Login user
   * @param user
   * @returns
   */
  async login(user: Users): Promise<LoginAdminObjectType> {
    const payload = {
      id: user.id,
      email: user.email,
    };
    if (user.role !== USER_ROLES.SUPER_ADMIN) {
      throw new GraphQLError('Unauthorized user!', {
        extensions: {
          statusCode: HttpStatus.UNAUTHORIZED,
        },
      });
    }
    const jwtToken = this.jwtService.sign(payload, {
      secret:
        process.env.JWT_SCERET_KEY ||
        '3KfcgMUJSDFNhasreHJBXCAUuiqwerksac45rknsdfKJSBF',
      expiresIn: '48h',
    });

    const permissions = await this.rolePermissionRepository.find({
      where: { role_id: user.role },
    });

    return {
      token: jwtToken,
      id: user.id,
      email: user.email,
      firstName: user.firstname,
      lastName: user.lastname,
      role: user.role,
      message: 'Login successful!',
      permissions,
    };
  }

  /**
   * Forget password for admin user
   * @param userData
   * @returns
   */
  async forgotPassword(userData: ForgetPasswordInput) {
    const userExists: Users = await this.findUserByEmail(userData.email);

    if (!userExists) {
      throw new GraphQLError('User not found!', {
        extensions: {
          statusCode: HttpStatus.NOT_FOUND,
        },
      });
    }
    if (userExists.role !== USER_ROLES.SUPER_ADMIN) {
      throw new GraphQLError('Unauthorized user!', {
        extensions: {
          statusCode: HttpStatus.UNAUTHORIZED,
        },
      });
    }
    const resetToken = await bcrypt.hash(
      userExists.firstname + process.env.JWT_SCERET_KEY,
      12,
    );

    await this.userRespository.update(userExists.id, {
      reset_token: resetToken,
    });

    const jwtResetToken = this.jwtService.sign(
      {
        email: userExists.email,
        resetToken,
      },
      {
        secret: process.env.JWT_SECRET_KEY,
        expiresIn: '30m',
      },
    );
    const htmlData = await this.emailService.renderTemplate(
      './views/email/forgotPassword.hbs',
      {
        subject: 'reset password', // pass the required parameters on the hbs
        resetUrl: `${process.env.FRONTEND_URL}/admin/confirm-password/?email=${userExists.email}&&resetToken=${jwtResetToken}`,
        mailTo: process.env.SUPPORT_EMAIL,
        logo: `${process.env.BACKEND_URL}/images/logo.png`,
      },
    );

    await this.emailService.sendMail(
      userExists.email,
      'Reset Password',
      '',
      htmlData,
    );
    return { message: 'Reset password email sent successfully!' };
  }

  /**
   * Reset admin user password
   * @param userData
   * @returns
   */
  async resetPassword(userData: ResetPasswordInput): Promise<MessageObject> {
    const jwtVerified = this.jwtService.verify(userData.resetToken, {
      secret: process.env.JWT_SECRET_KEY,
    });
    const userExists = await this.findUserByEmail(jwtVerified.email);

    if (!userExists) {
      throw new GraphQLError('User not found!', {
        extensions: {
          statusCode: HttpStatus.NOT_FOUND,
        },
      });
    }
    if (userExists.role !== USER_ROLES.SUPER_ADMIN) {
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
        'Wrong reset token please generate new reset link!',
        {
          extensions: {
            statusCode: HttpStatus.CONFLICT,
          },
        },
      );
    }

    const newPassword = await bcrypt.hash(userData.newPassword, 12);

    await this.userRespository.update(userExists.id, {
      reset_token: null,
      password: newPassword,
    });

    return { message: 'Password reset successfully!' };
  }
}
