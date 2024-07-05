import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpStatus, Injectable } from '@nestjs/common';
import { AuthService } from 'src/admin/auth/auth.service';
import { GraphQLError } from 'graphql';
import { USER_ROLES } from 'src/constants';

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(
  Strategy,
  'jwtAdminAuthGuard',
) {
  constructor(private readonly authService: AuthService) {
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
    if (userData.role !== USER_ROLES.SUPER_ADMIN) {
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
