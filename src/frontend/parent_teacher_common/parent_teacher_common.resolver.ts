import {
  Args,
  Context,
  ID,
  Int,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { FrontendParentTeacherCommonService } from './parent_teacher_common.service';
import { JwtTeacherParentAuthGuard } from 'src/guards/parent_teacher_guard/parent_teacher_jwt.guard';
import { UseGuards } from '@nestjs/common';
import { EnableDisableMFACommonObjectType } from './dto/enableDisableMfa.object';
import { UpdateParentTeacherProfileObject } from './dto/updateParetTeacherProfile.object';
import { UpdateParentTeacherProfileInput } from './dto/updateProfileParentTeacher.input';
import { CommonListingInputType } from 'src/commonGqlTypes/commonListing.object';
import { ListNewsletterParentTeacherObject } from './dto/listNewsletterParentTeacher.object';

@Resolver()
export class FrontendParentTeacherCommonResolver {
  constructor(
    private readonly parentTeacherCommonService: FrontendParentTeacherCommonService,
  ) {}

  /**
   * Enable or disable MFA feature for parent teacher
   * @param isMFAStatus
   * @param context
   * @returns
   */
  @Mutation(() => EnableDisableMFACommonObjectType)
  @UseGuards(JwtTeacherParentAuthGuard)
  async enableDisableMFAForParentTeacher(
    @Args('isMFAStatus', { type: () => Int!, nullable: false })
    isMFAStatus: number,
    @Context() context: any,
  ) {
    const userId = context.req.user.id;
    return await this.parentTeacherCommonService.enableOrDisableMFAForParentTeacher(
      userId,
      isMFAStatus,
    );
  }

  /**
   * Update profile for parent and teacher
   * @param context
   * @param updateParentTeacherProfileInput
   * @returns
   */
  @UseGuards(JwtTeacherParentAuthGuard)
  @Mutation(() => UpdateParentTeacherProfileObject)
  async updateParentTeacherProfile(
    @Context() context,
    @Args('updateParentTeacherProfileInput')
    updateParentTeacherProfileInput: UpdateParentTeacherProfileInput,
  ) {
    return await this.parentTeacherCommonService.updateProfile(
      context.req.user,
      updateParentTeacherProfileInput,
    );
  }

  /**
   * Get list newsletter for classes by parent and teacher
   * @param listNewsletterData
   * @param class_id
   * @param context
   * @returns
   */
  @UseGuards(JwtTeacherParentAuthGuard)
  @Query(() => ListNewsletterParentTeacherObject)
  async listNewsletterParentTeacher(
    @Args('listNewsletterInput') listNewsletterData: CommonListingInputType,
    @Args('class_id', { type: () => ID!, nullable: true })
    class_id: number,
    @Context() context: any,
  ) {
    return await this.parentTeacherCommonService.listNewsletter(
      listNewsletterData,
      class_id,
      context.req.user,
    );
  }
}
