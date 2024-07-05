// socket.guard.ts
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { AuthService } from 'src/admin/auth/auth.service';

@Injectable()
export class JwtSocketGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient();
    try {
      const user = await this.validateClient(client);
      client.data.user = user;
      return true;
    } catch (error) {
      console.error('Error on JwtSocketGuard', error.message);
      client.emit('on-error', {
        message: error.message ? error.message : 'Unauthorized!',
      });
      client.disconnect();
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Validate client and verify jwt token
   * @param client
   * @returns
   */
  private async validateClient(client: Socket) {
    try {
      const token = client.handshake.headers?.authorization?.split(' ')[1];
      if (!token) {
        client.emit('on-error', { message: 'Unauthorized!' });
        client.disconnect();
        throw new WsException('Unauthorized!');
      }
      const payload = await this.jwtService.verify(token, {
        ignoreExpiration: false,
        secret:
          process.env.JWT_SCERET_KEY ||
          '3KfcgMUJSDFNhasreHJBXCAUuiqwerksac45rknsdfKJSBF',
      });
      return await this.validate(payload);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Validate payload and get user
   * @param payload
   * @returns
   */
  async validate(payload: any) {
    try {
      if (!payload || !payload.email) {
        throw new WsException('Unauthorized user!');
      }
      const userData = await this.authService.findUserByEmail(payload.email);
      if (!userData) {
        throw new WsException('User not found!');
      }
      delete userData['password'];
      return { ...userData };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
