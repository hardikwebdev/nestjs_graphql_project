import { Args, Mutation, Resolver, Context } from '@nestjs/graphql';
import { FrontEndAuthService } from './auth.service';
import { LoginTeacherParentObjectType } from './dto/loginTeacherParent.object';
import { LoginTeacherParentInput } from './dto/loginTeacherParent.input';
import { MessageObject } from 'src/commonGqlTypes/message.object';
import { ForgotPasswordInput } from './dto/forgotPassword.input';
import { ResetPasswordForTeacherParent } from './dto/resetPassword.input';
import { ForgotPasswordObjectType } from './dto/forgotPassword.object';
import { OTPObjectType } from './dto/verifyOtp.object';
import { UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from 'src/guards/local.guard';
import { ResendOTPObjectType } from './dto/resendOTP.object';
import { ParentsRegisterObjectType } from './dto/addParent.object';
import { AddParentInput } from './dto/addParent.input';
import { LogoutUserInput } from './dto/logoutUser.input';

@Resolver()
export class FrontEndResolver {
  constructor(private readonly authService: FrontEndAuthService) {}

  /**
   * login for teacher and parent
   * @param loginTeacherParentInputType
   * @returns
   */
  @Mutation(() => LoginTeacherParentObjectType)
  @UseGuards(LocalAuthGuard)
  async loginTeacherParent(
    @Args('loginTeacherParent') loginTeacherParent: LoginTeacherParentInput,
    @Context() context: any,
  ): Promise<LoginTeacherParentObjectType> {
    return await this.authService.login(
      context.req.user,
      loginTeacherParent.device_type,
      loginTeacherParent.device_token,
    );
  }

  /**
   * verify otp
   * @param email
   * @param enteredOtp
   * @returns
   */
  @Mutation(() => OTPObjectType)
  async verifyOTP(
    @Args('email') email: string,
    @Args('enteredOtp') enteredOtp: string,
    @Args('operationType') operationType: string,
    @Args('device_type') device_type: string,
    @Args('device_token') device_token: string,
  ): Promise<OTPObjectType> {
    return await this.authService.verifyOTP(
      email,
      enteredOtp,
      operationType,
      device_type,
      device_token,
    );
  }

  /**
   * Forgot password for user
   * @param forgotPasswordInput
   * @returns
   */
  @Mutation(() => ForgotPasswordObjectType)
  async forgotPassword(
    @Args('forgotPasswordInput') forgotPasswordInput: ForgotPasswordInput,
  ): Promise<ForgotPasswordObjectType> {
    return await this.authService.forgotPassword(forgotPasswordInput);
  }

  /**
   * Reset password for teacher & parents
   * @param resetPasswordInput
   * @returns
   */
  @Mutation(() => MessageObject)
  async resetPasswordForTeacherParent(
    @Args('resetPasswordInput')
    resetPasswordForTeacherParent: ResetPasswordForTeacherParent,
  ): Promise<MessageObject> {
    return await this.authService.resetPassword(resetPasswordForTeacherParent);
  }

  /**
   * Resend OTP
   * @param email
   * @returns
   */
  @Mutation(() => ResendOTPObjectType)
  async resendOTP(
    @Args('email') email: string,
    @Args('operationType') operationType: string,
  ): Promise<ResendOTPObjectType> {
    return await this.authService.resendOTP(email, operationType);
  }

  /**
   * parent registration
   * @param AddParentInput
   * @returns
   */
  @Mutation(() => ParentsRegisterObjectType)
  async registration(
    @Args('registration') registrationInput: AddParentInput,
  ): Promise<ParentsRegisterObjectType> {
    return await this.authService.registration(registrationInput);
  }

  /**
   * Logout parent teacher and remove device token
   * @param deviceToken
   * @returns
   */
  @Mutation(() => MessageObject)
  async logoutUser(
    @Args('deviceToken') logoutUserInput: LogoutUserInput,
  ): Promise<any> {
    return await this.authService.logoutUser(logoutUserInput.device_token);
  }
}
