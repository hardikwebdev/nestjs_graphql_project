import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { LoginAdminInput } from './dto/loginAdmin.input';
import { AuthService } from './auth.service';
import { LoginAdminObjectType } from './dto/loginAdmin.object';
import { LocalAuthGuard } from 'src/guards/local.guard';
import { UseGuards } from '@nestjs/common';
import { ForgetPasswordInput } from './dto/forgetPassword.input';
import { MessageObject } from 'src/commonGqlTypes/message.object';
import { ResetPasswordInput } from './dto/resetPassword.input';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  /**
   * Login Admin user
   * @param LoginAdminInput
   * @returns
   */
  @Mutation(() => LoginAdminObjectType)
  @UseGuards(LocalAuthGuard)
  async adminLogin(
    @Args('loginAdmin') loginAdmin: LoginAdminInput,
    @Context() context: any,
  ): Promise<LoginAdminObjectType> {
    return await this.authService.login(context.req.user);
  }

  /**
   * Forget password for admin user
   * @param forgetPasswordInput
   * @returns
   */
  @Mutation(() => MessageObject)
  async adminForgetPassword(
    @Args('forgetPasswordInput') forgetPasswordInput: ForgetPasswordInput,
  ): Promise<MessageObject> {
    return await this.authService.forgotPassword(forgetPasswordInput);
  }

  /**
   * Reset password for admin
   * @param resetPasswordInput
   * @returns
   */
  @Mutation(() => MessageObject)
  async adminResetPassword(
    @Args('resetPasswordInput') resetPasswordInput: ResetPasswordInput,
  ): Promise<any> {
    return await this.authService.resetPassword(resetPasswordInput);
  }
}
