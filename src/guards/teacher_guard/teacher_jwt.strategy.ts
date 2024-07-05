import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpStatus, Injectable } from '@nestjs/common';
import { FrontEndAuthService } from 'src/frontend/auth/auth.service';
import { GraphQLError } from 'graphql';
import { STATUS, USER_ROLES } from 'src/constants';

@Injectable()
export class TeacherJwtStrategy extends PassportStrategy(
  Strategy,
  'jwtTeacherAuthGuard',
) {
  constructor(private readonly authService: FrontEndAuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        process.env.JWT_SCERET_KEY ||
        '3KfcgMUJSDFNhasreHJBXCAUuiqwerksac45rknsdfKJSBF',
    });
  }

  async validate(payload: any) {
    if (!payload || !payload.email) {
      throw new GraphQLError('Unauthorized user!', {
        extensions: {
          statusCode: HttpStatus.UNAUTHORIZED,
        },
      });
    }

    const userData = await this.authService.findUserByEmail(payload.email);
    if (!userData) {
      throw new GraphQLError('User not found!', {
        extensions: {
          statusCode: HttpStatus.NOT_FOUND,
        },
      });
    }
    if (userData.status === STATUS.INACTIVE) {
      throw new GraphQLError(
        'Your account is inactive. Please contact to admin!',
        {
          extensions: {
            statusCode: HttpStatus.UNAUTHORIZED,
          },
        },
      );
    }
    if (userData.role !== USER_ROLES.TEACHER) {
      throw new GraphQLError('Unauthorized user!', {
        extensions: {
          statusCode: HttpStatus.UNAUTHORIZED,
        },
      });
    }
    delete userData['password'];
    return { ...userData };
  }
}
