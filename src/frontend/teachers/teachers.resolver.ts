import { UseGuards } from '@nestjs/common';
import {
  Args,
  Context,
  ID,
  Int,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { JwtTeacherAuthGuard } from 'src/guards/teacher_guard/teacher_jwt.guard';
import { TeachersService } from './teachers.service';
import { ListStudentInputType } from './dto/listStudent.input';
import { MessageObject } from 'src/commonGqlTypes/message.object';
import { ListAssignClassesByTeacherObject } from '../../admin/teachers/dto/listAssignClassesByTeacherId.object';
import { ListStudentOfClassObject } from './dto/listSutdentOfClass.object';
import { ListStudentOfTeacherObject } from './dto/listStudentOfTeacher.object';
import { Classes } from 'src/database/entities/classes.entity';
import { ListClassInputType } from './dto/assignedClassList.input';
import { JwtTeacherParentAuthGuard } from 'src/guards/parent_teacher_guard/parent_teacher_jwt.guard';
import { Students } from 'src/database/entities/student.entity';
import { AddReimbursmentRequest } from './dto/addReimbursmentRequest.input';
import { ListReimbursmentObjectType } from './dto/listReimbursment.object';
import { ListReimbursmentRequest } from './dto/listReimbursment.input';
import { CreateTimeOffInputType } from './dto/createTimeOff.input';
import { ListTimeOffRequestObjectType } from './dto/listTimeOff.object';
import { ListTimeOffRequestInput } from './dto/listTimeOff.input';
import { UpdateTeacherProfileInput } from './dto/updateProfile.input';
import { ListUserOnboardingDocumentsObject } from './dto/listUserOnboardingDocuments.object';
import { AddOnboardingDocumentInput } from './dto/addOnboardingDocument.input';
import { AddOnboardingDocumentObject } from './dto/addOnboardingDocument.object';
import { AddLogEventInput } from './dto/addLogEvent.input';
import { TeacherProfileObjectType } from './dto/teacherProfile.object';
import { EnableDisableObjectType } from './dto/enableDisableMFA.object';
import { UpdateTeacherProfileObject } from './dto/updateTeacherProfile.object';
import { UpdateLogEventInput } from './dto/updateLogEvent.input';
import { AddLogEventObject } from './dto/addLogEvent.object';
import { ListLogEventObject } from './dto/listLogEvent.object';
import { ListLogEventsInput } from './dto/listLogEvents.input';
import { LogEvents } from 'src/database/entities/log_events.entity';
import { LogEventType } from 'src/database/entities/log_event_type.entity';
import { ListSubjectObjectType } from 'src/admin/subjects/dto/listSubject.object';
import { Subjects } from 'src/database/entities/subject.entity';
import { ListSubjectInputType } from './dto/listSubject.input';
import { UploadOrRemoveLessonPlanObject } from './dto/uploadLessonPlan.object';
import { LessonPlans } from 'src/database/entities/lesson_plans.entity';
import { ListRecentLogsObject } from './dto/listRecentLogs.object';
import { ListRecentLogsInput } from './dto/listRecentLogs.input';
import { UploadLessonPlanInput } from './dto/uploadLessonPlan.input';
import { AddNewsletterObject } from './dto/addNewsletter.object';
import { AddNewsletterInput } from './dto/addNewsletter.input';
import { GraphQLUpload, FileUpload } from 'graphql-upload-ts';
import { CommonListingInputType } from 'src/commonGqlTypes/commonListing.object';
import { ListNewsletterObject } from './dto/listNewsletter.object';

@Resolver()
export class TeachersResolver {
  constructor(private readonly teachersService: TeachersService) {}
  @Query(() => TeacherProfileObjectType)
  @UseGuards(JwtTeacherAuthGuard)
  async getTeacherProfile(@Context() context: any) {
    return await this.teachersService.teacherProfile(context);
  }

  /**
   * Get Assigned Class Details
   * @param context
   * @param id
   * @returns
   */
  @UseGuards(JwtTeacherAuthGuard)
  @Query(() => Classes)
  async getClassDetails(
    @Context() context,
    @Args('classId', { type: () => ID! }) id: number,
  ) {
    return await this.teachersService.assignedClassDetail(context.req.user, id);
  }

  /**
   * Get Student Profile
   * @param context
   * @param id
   * @returns
   */
  @Query(() => Students)
  @UseGuards(JwtTeacherParentAuthGuard)
  async getStudentProfile(
    @Context() context,
    @Args('studentId', { type: () => ID! }) id: number,
  ) {
    return await this.teachersService.getStudentProfile(context.req.user, id);
  }

  /**
   * Get All classes assigned to teacher
   * @param context
   * @param assignedClassList
   * @returns
   */
  @UseGuards(JwtTeacherAuthGuard)
  @Query(() => ListAssignClassesByTeacherObject)
  async assignedClassList(
    @Context() context,
    @Args('assignedClassList') assignedClassList: ListClassInputType,
  ) {
    return await this.teachersService.assignedClassList(
      context.req.user,
      assignedClassList,
    );
  }

  /**
   * Get All students inside a single class of teacher by class Id
   * @param context
   * @param listStudentsInputType
   * @param classId
   * @returns
   */
  @UseGuards(JwtTeacherAuthGuard)
  @Query(() => ListStudentOfClassObject)
  async listStudentOfClass(
    @Context() context,
    @Args('listStudentsInputType') listStudentsInputType: ListStudentInputType,
    @Args('classId', { type: () => ID! }) id: number,
  ) {
    return await this.teachersService.listStudentOfClass(
      context.req.user,
      listStudentsInputType,
      id,
    );
  }

  /**
   * Get All students list a part of teacher's class
   * @param context
   * @param listStudentsInputType
   * @returns
   */
  @UseGuards(JwtTeacherAuthGuard)
  @Query(() => ListStudentOfTeacherObject)
  async listStudentOfTeacher(
    @Context() context,
    @Args('listStudentsInputType') listStudentsInputType: ListStudentInputType,
  ) {
    return await this.teachersService.listStudentOfTeacher(
      context.req.user,
      listStudentsInputType,
    );
  }

  /**
   * Create reimbursment request
   * @param context
   * @param addReimbursmentRequest
   * @returns
   */
  @UseGuards(JwtTeacherAuthGuard)
  @Mutation(() => MessageObject)
  async addReimbursmentRequest(
    @Context() context,
    @Args('addReimbursmentRequest')
    addReimbursmentRequest: AddReimbursmentRequest,
  ) {
    return await this.teachersService.createReimbursmentRequest(
      context.req.user,
      addReimbursmentRequest,
    );
  }

  /**
   * List reimbursment request made by teacher
   * @param context
   * @param listReimbursmentRequestInput
   * @returns
   */
  @UseGuards(JwtTeacherAuthGuard)
  @Query(() => ListReimbursmentObjectType)
  async listReimbursmentRequest(
    @Context() context,
    @Args('listReimbursmentRequestInput')
    listReimbursmentRequestInput: ListReimbursmentRequest,
  ) {
    return await this.teachersService.listReimbursmentRequest(
      context.req.user,
      listReimbursmentRequestInput,
    );
  }

  /**
   * Create Time-Off request made by teacher
   * @param context
   * @param createTimeOffInput
   * @returns
   */
  @UseGuards(JwtTeacherAuthGuard)
  @Mutation(() => MessageObject)
  async createTimeOff(
    @Context() context,
    @Args('createTimeOffInput') createTimeOffInput: CreateTimeOffInputType,
  ) {
    return await this.teachersService.createTimeOffRequest(
      context,
      createTimeOffInput,
    );
  }

  /**
   * List Time-Off request made by teacher
   * @param context
   * @param listTimeOffRequestsInput
   * @returns
   */
  @UseGuards(JwtTeacherAuthGuard)
  @Query(() => ListTimeOffRequestObjectType)
  async listTimeOffRequests(
    @Context() context,
    @Args('listTimeOffRequestsInput')
    listTimeOffRequestsInput: ListTimeOffRequestInput,
  ) {
    return await this.teachersService.listTimeOffRequest(
      context.req.user,
      listTimeOffRequestsInput,
    );
  }

  /**
   * Update Profile
   * @param context
   * @param updateTeacherProfileInput
   * @returns
   */
  @UseGuards(JwtTeacherAuthGuard)
  @Mutation(() => UpdateTeacherProfileObject)
  async updateTeacherProfile(
    @Context() context,
    @Args('updateTeacherProfileInput')
    updateTeacherProfileInput: UpdateTeacherProfileInput,
  ) {
    return await this.teachersService.updateProfile(
      context.req.user,
      updateTeacherProfileInput,
    );
  }

  /**
   * Get All List of teacher's Documents
   * @param context
   * @returns
   */
  @Query(() => ListUserOnboardingDocumentsObject)
  @UseGuards(JwtTeacherAuthGuard)
  async listTeacherOnboardingDocuments(@Context() context: any) {
    return await this.teachersService.listTeacherOnboardingDocuments(
      context.req.user,
    );
  }

  /**
   * Add Onboarding document
   * @param addOnboardingDocumentData
   * @param context
   * @returns
   */
  @Mutation(() => AddOnboardingDocumentObject)
  @UseGuards(JwtTeacherAuthGuard)
  async addOnboardingDocument(
    @Args('addOnboardingDocumentInput')
    addOnboardingDocumentData: AddOnboardingDocumentInput,
    @Context() context: any,
  ) {
    return await this.teachersService.addOnboardingDocument(
      addOnboardingDocumentData,
      context.req.user,
    );
  }

  /**
   * Delete Onboarding document
   * @param deleteOnboardingDocumentData
   * @param context
   * @returns
   */
  @Mutation(() => MessageObject)
  @UseGuards(JwtTeacherAuthGuard)
  async deleteOnboardingDocument(
    @Args('document_id', { type: () => ID! }) document_id: number,
    @Context() context: any,
  ) {
    return await this.teachersService.deleteOnboardingDocument(
      document_id,
      context.req.user,
    );
  }

  /**
   * Add log event for student by teacher
   * @param addLogEventData
   * @param context
   * @returns
   */
  @Mutation(() => AddLogEventObject)
  @UseGuards(JwtTeacherAuthGuard)
  async addLogEvent(
    @Args('addLogeventInput') addLogEventData: AddLogEventInput,
    @Args({ name: 'file', type: () => [GraphQLUpload!], nullable: true })
    files: Promise<FileUpload[]>[],
    @Context() context: any,
  ) {
    return await this.teachersService.addLogEvent(
      addLogEventData,
      context.req.user,
      files,
    );
  }

  /**
   * Update log event for student by teacher
   * @param updateLogEventData
   * @param id
   * @param context
   * @returns
   */
  @Mutation(() => AddLogEventObject)
  @UseGuards(JwtTeacherAuthGuard)
  async updateLogEvent(
    @Args('updateLogEventInput') updateLogEventData: UpdateLogEventInput,
    @Args('logeventId', { type: () => ID! }) id: number,
    @Args({ name: 'file', type: () => [GraphQLUpload!], nullable: true })
    video: FileUpload[],
    @Context() context: any,
  ) {
    const logEvent = await this.teachersService.updateLogEvent(
      updateLogEventData,
      id,
      context.req.user,
      video,
    );
    return logEvent;
  }

  /**
   * List All log events by teacher Id
   * @param listAllLogEventsData
   * @param context
   * @returns
   */
  @Query(() => ListLogEventObject)
  @UseGuards(JwtTeacherAuthGuard)
  async listAllLogEventsForTeacher(
    @Args('listAllLogEventsInput') listAllLogEventsData: ListLogEventsInput,
    @Context() context: any,
  ) {
    return await this.teachersService.listAllLogEventsForTeacher(
      listAllLogEventsData,
      context.req.user,
    );
  }

  /**
   * Get Log event by Id
   * @param id
   * @param context
   * @returns
   */
  @Query(() => LogEvents)
  @UseGuards(JwtTeacherAuthGuard)
  async getLogEventByIdForTeacher(
    @Args('logeventId', { type: () => ID! }) id: number,
    @Context() context: any,
  ) {
    return await this.teachersService.getLogEventByIdForTeacher(
      id,
      context.req.user,
    );
  }

  /**
   * Delete Log event by Id
   * @param id
   * @param context
   * @returns
   */
  @Mutation(() => MessageObject)
  @UseGuards(JwtTeacherAuthGuard)
  async deleteLogEvent(
    @Args('logeventId', { type: () => ID! }) id: number,
    @Context() context: any,
  ) {
    return await this.teachersService.deleteLogEvent(id, context.req.user);
  }

  /**
   * List All Log event type
   * @returns
   */
  @Query(() => [LogEventType])
  @UseGuards(JwtTeacherAuthGuard)
  async listAllLogEventTypeForTeacher() {
    return await this.teachersService.listAllLogEventType();
  }

  /**
   * Enable or disable MFA feature for teacher
   * @param isMFAStatus
   * @param context
   * @returns
   */
  @Mutation(() => EnableDisableObjectType)
  @UseGuards(JwtTeacherAuthGuard)
  async enableDisableMFAForTeacher(
    @Args('isMFAStatus', { type: () => Int!, nullable: false })
    isMFAStatus: number,
    @Context() context: any,
  ) {
    const userId = context.req.user.id;
    return await this.teachersService.enableOrDisableMFAForTeacher(
      userId,
      isMFAStatus,
    );
  }

  /**
   * Get subjects with pagination and sorting
   * @param listSubjectInput
   * @returns
   */
  @Query(() => ListSubjectObjectType)
  @UseGuards(JwtTeacherAuthGuard)
  async listSubjects(
    @Args('listSubjectInput') listSubjectInput: ListSubjectInputType,
    @Context() context: any,
  ) {
    const user_id = context.req.user.id;
    return await this.teachersService.getAllSubjects(listSubjectInput, user_id);
  }

  /**
   * Get Subject with lesson plan details
   * @param subject_id
   * @returns
   */
  @Query(() => Subjects)
  @UseGuards(JwtTeacherAuthGuard)
  async getSubjectWithLessonPlansBySubjectId(
    @Args('subject_id', { type: () => ID! }) subject_id: number,
  ) {
    return await this.teachersService.getSubjectWithLessonPlans(subject_id);
  }

  /**
   * Get Subject with lesson plan details
   * @param lesson_plan_id
   * @returns
   */
  @Query(() => LessonPlans)
  @UseGuards(JwtTeacherAuthGuard)
  async getLessonPlanById(
    @Args('lesson_plan_id', { type: () => ID! }) lesson_plan_id: number,
  ) {
    return await this.teachersService.getLessonPlanById(lesson_plan_id);
  }

  /**
   * upload lesson plan
   * @param lesson_plan_id
   * @param lesson_plan_data
   * @returns
   */
  @Mutation(() => UploadOrRemoveLessonPlanObject)
  @UseGuards(JwtTeacherAuthGuard)
  async uploadLessonPlanById(
    @Args('lesson_plan_id', { type: () => ID! }) lesson_plan_id: number,
    @Args('lesson_plan_data', { type: () => UploadLessonPlanInput! })
    lesson_plan_data: UploadLessonPlanInput,
    @Context() context: any,
  ) {
    const userId = context.req.user.id;
    return await this.teachersService.uploadLessonPlanById(
      lesson_plan_id,
      lesson_plan_data,
      userId,
    );
  }

  /**
   * Remove uploaded lesson plan
   * @param lesson_plan_attachment_id
   * @returns
   */
  @Mutation(() => MessageObject)
  @UseGuards(JwtTeacherAuthGuard)
  async removeLessonPlanAttachmentById(
    @Args('lesson_plan_attachment_id', { type: () => ID! })
    lesson_plan_attachment_id: number,
  ) {
    return await this.teachersService.deleteLessonPlanById(
      lesson_plan_attachment_id,
    );
  }

  /**
   * List All Recent Logs by teacher Id
   * @param listAllRecentLogsData
   * @param context
   * @returns
   */
  @Query(() => ListRecentLogsObject)
  @UseGuards(JwtTeacherAuthGuard)
  async listAllRecentLogsForTeacher(
    @Args('listAllRecentLogsInput') listAllRecentLogsData: ListRecentLogsInput,
    @Context() context: any,
  ) {
    return await this.teachersService.listAllRecentLogsForTeacher(
      listAllRecentLogsData,
      context.req.user,
    );
  }

  /**
   * Add newsletter for classes by teacher
   * @param addNewsletterData
   * @param context
   * @returns
   */
  @Mutation(() => AddNewsletterObject)
  @UseGuards(JwtTeacherAuthGuard)
  async addNewsletter(
    @Args('addNewsletterInput') addNewsletterData: AddNewsletterInput,
    @Context() context: any,
  ) {
    return await this.teachersService.addNewsletter(
      addNewsletterData,
      context.req.user,
    );
  }

  /**
   * Update newsletter for classes by teacher
   * @param newsletter_id
   * @param updateNewsletterData
   * @param context
   * @returns
   */
  @Mutation(() => AddNewsletterObject)
  @UseGuards(JwtTeacherAuthGuard)
  async updateNewsletter(
    @Args('newsletter_id', { type: () => ID! })
    newsletter_id: number,
    @Args('updateNewsletterInput') updateNewsletterData: AddNewsletterInput,
    @Context() context: any,
  ) {
    return await this.teachersService.updateNewsletter(
      newsletter_id,
      updateNewsletterData,
      context.req.user,
    );
  }

  /**
   * Delete newsletter for classes by teacher
   * @param newsletter_id
   * @param class_id
   * @param context
   * @returns
   */
  @Mutation(() => MessageObject)
  @UseGuards(JwtTeacherAuthGuard)
  async deleteNewsletter(
    @Args('newsletter_id', { type: () => ID! })
    newsletter_id: number,
    @Args('class_id', { type: () => ID! })
    class_id: number,
    @Context() context: any,
  ) {
    return await this.teachersService.deleteNewsletter(
      newsletter_id,
      class_id,
      context.req.user,
    );
  }

  /**
   * Get list newsletter for classes by teacher
   * @param listNewsletterData
   * @param class_id
   * @param context
   * @returns
   */
  @Query(() => ListNewsletterObject)
  @UseGuards(JwtTeacherAuthGuard)
  async listNewsletter(
    @Args('listNewsletterInput') listNewsletterData: CommonListingInputType,
    @Args('class_id', { type: () => ID!, nullable: true })
    class_id: number,
    @Context() context: any,
  ) {
    return await this.teachersService.listNewsletter(
      listNewsletterData,
      class_id,
      context.req.user,
    );
  }

  /**
   * Approve or reject zoom call meeting of teacher
   * @param chat_message_id
   * @param status
   * @returns
   */
  @Mutation(() => MessageObject)
  @UseGuards(JwtTeacherAuthGuard)
  async approveOrRejectZoomMeetingRequest(
    @Args('chat_message_id', { type: () => ID }) chat_message_id: number,
    @Args('status', { type: () => Int }) status: number,
    @Context() context: any,
  ) {
    const teacher = context.req.user;
    let message = 'Zoom meeting invitaion approved successfully!';
    await this.teachersService.acceptRejectMeetingInvitaionOfParent(
      chat_message_id,
      teacher,
      status,
    );
    if (status === 2) {
      message = 'Zoom meeting invitaion rejected successfully!';
    }
    return { message };
  }
}
