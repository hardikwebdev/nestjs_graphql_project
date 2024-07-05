import { HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { GraphQLError } from 'graphql';
import * as bcrypt from 'bcrypt';
import { AuthService } from 'src/admin/auth/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  /**
   * Validate user
   * @param email
   * @param password
   * @returns
   */
  async validate(email: string, password: string) {
    const user = await this.authService.findUserByEmail(email);
    if (!user) {
      throw new GraphQLError('User not found!', {
        extensions: {
          statusCode: HttpStatus.NOT_FOUND,
        },
      });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      throw new GraphQLError('Invalid credentials!', {
        extensions: {
          statusCode: HttpStatus.BAD_REQUEST,
        },
      });
    }
    return user;
  }
}
