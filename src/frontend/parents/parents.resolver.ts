import { Args, Context, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ParentsService } from './parents.service';
import { StudentInput } from './dto/student.input';
import { StudentObjectType } from './dto/student.object';
import { UseGuards } from '@nestjs/common';
import { JwtParentAuthGuard } from 'src/guards/parent_guard/parent_jwt.guard';
import { MessageObject } from 'src/commonGqlTypes/message.object';
import { UpdateStudentInput } from './dto/updateStudentProfile.input';
import { GetTeacherOfSchoolInput } from './dto/getTeacherOfStudent.input';
import { TeacherListingObject } from './dto/teacherListing.object';
import { UserProfileType } from './dto/userProfile.object';
import { ListLogEventObject } from '../teachers/dto/listLogEvent.object';
import { ListAllLogEventsForParentInput } from './dto/listAllLogEventForParent.input';
import { UpdateEmergencyContactInput } from './dto/updateEmergencyContact.input';
import { ZoomCallTiming } from 'src/database/entities/zoom_call_timing.entity';
import { CreateZoomCallMeetingInput } from './dto/createZoomCallMeeting.input';
import { ListClassesOfStudentInput } from './dto/listClassOfStudent.input';
import { ListStudentOfClassInput } from './dto/listStudentOfClass.input';
import { ListTeacherByClassObject } from './dto/listTeacherOfClass.object';
import { ListTeacherOfClassInput } from './dto/listTeacherOfClass.input';
import { ListClassOfStudentObjectType } from './dto/listClassOfStudent.object';
import { ListStudentsOfClassObjectType } from './dto/listStudentOfClass.object';
import { CreateExchangeReturnRequestInput } from './dto/createExchangeReturnRequest.input';

@Resolver()
export class ParentsResolver {
  constructor(private readonly parentsService: ParentsService) {}
  /**
   * Add child
   * @param ChildInput
   * @returns
   */
  @Mutation(() => StudentObjectType)
  @UseGuards(JwtParentAuthGuard)
  async addStudent(
    @Args('input') input: StudentInput,
    @Context() context,
  ): Promise<StudentObjectType> {
    const parent_id = context.req.user.id;
    return await this.parentsService.addStudent(input, parent_id);
  }

  /**
   * Get User Profile
   * @param context
   * @returns
   */
  @Query(() => UserProfileType)
  @UseGuards(JwtParentAuthGuard)
  async getUserProfile(@Context() context) {
    return await this.parentsService.UserProfile(context);
  }

  /**
   * Update Student Details
   * @param updateStudentDetails
   * @param id
   * @returns
   */
  @Mutation(() => MessageObject)
  @UseGuards(JwtParentAuthGuard)
  async updateStudentProfile(
    @Context() context,
    @Args('updateStudentInput') updateStudentDetails: UpdateStudentInput,
    @Args('id', { type: () => ID! }) id: number,
  ): Promise<MessageObject> {
    return await this.parentsService.updateStudentProfile(
      context,
      updateStudentDetails,
      id,
    );
  }

  /**
   * Delete Student
   * @param id
   * @returns
   */
  @Mutation(() => MessageObject)
  @UseGuards(JwtParentAuthGuard)
  async deleteStudent(
    @Context() context,
    @Args('id', { type: () => ID! }) id: number,
  ): Promise<MessageObject> {
    return await this.parentsService.deleteStudent(context, id);
  }

  /**
   * List teacher data with search and pagination as per user's school
   * @param context
   * @param getTeachersOfSchoolInput
   * @returns
   */
  @Mutation(() => TeacherListingObject)
  @UseGuards(JwtParentAuthGuard)
  async getTeachersOfSchool(
    @Context() context,
    @Args('getTeachersOfSchoolInput')
    getTeachersOfSchoolInput: GetTeacherOfSchoolInput,
  ): Promise<TeacherListingObject> {
    const userId = context.req.user.id;
    return await this.parentsService.getTeacherBySchoolId(
      getTeachersOfSchoolInput,
      userId,
    );
  }

  /**
   * List All Log event for parent by student Id
   * @param id
   * @param context
   * @returns
   */
  @Query(() => ListLogEventObject)
  @UseGuards(JwtParentAuthGuard)
  async listLogEventForParent(
    @Args('listAllLogEventsInput')
    listAllLogEventData: ListAllLogEventsForParentInput,
    @Args('studentId', { type: () => ID! }) id: number,
  ) {
    return await this.parentsService.listLogEventForParent(
      listAllLogEventData,
      id,
    );
  }

  /**
   * Update Emergency COntact of student
   * @param id
   * @param updateEmergencyContactInput
   * @returns
   */
  @Mutation(() => MessageObject)
  @UseGuards(JwtParentAuthGuard)
  async updateEmergencyContact(
    @Context() context,
    @Args('studentId', { type: () => ID! }) id: number,
    @Args('updateEmergencyContactInput')
    updateEmergencyContactInput: UpdateEmergencyContactInput,
  ) {
    return await this.parentsService.updateEmergencyContact(
      context,
      id,
      updateEmergencyContactInput,
    );
  }

  /**
   * Get zoom call meeting slots of teacher
   * @param teacherId
   * @returns
   */
  @Query(() => [ZoomCallTiming])
  @UseGuards(JwtParentAuthGuard)
  async getZoomCallSlotsOfTeacherForParent(
    @Args('teacherId', { type: () => ID! }) teacherId: number,
  ) {
    return await this.parentsService.getSlotsOfZoomCallTimingsOfTeacher(
      teacherId,
    );
  }

  /**
   * Create zoom call meeting with teacher
   * @param teacherId
   * @returns
   */
  @Mutation(() => MessageObject)
  @UseGuards(JwtParentAuthGuard)
  async createZoomCallMeetingWithAdminOrTeacher(
    @Args('createZoomCallMeetingInput')
    createZoomCallMeetingInput: CreateZoomCallMeetingInput,
    @Context() context: any,
  ) {
    const parent = context.req.user;
    return await this.parentsService.createZoomCallMeetingWithAdminOrTeacher(
      parent,
      createZoomCallMeetingInput,
    );
  }

  /**
   * get class list by student ID
   * @param studentId
   * @param context
   * @param listClassesOfStudentInput
   * @returns
   */
  @Query(() => ListClassOfStudentObjectType)
  @UseGuards(JwtParentAuthGuard)
  async listClassesByStudentId(
    @Args('studentId', { type: () => ID! }) studentId: number,
    @Context() context: any,
    @Args('listClassesOfStudentInput')
    listClassesOfStudentInput: ListClassesOfStudentInput,
  ) {
    const parent = context.req.user;
    return await this.parentsService.getStudentWiseClassList(
      studentId,
      parent,
      listClassesOfStudentInput,
    );
  }

  /**
   * get students list by class ID
   * @param classId
   * @param context
   * @param listStudentsOfClassInput
   * @returns
   */
  @Query(() => ListStudentsOfClassObjectType)
  @UseGuards(JwtParentAuthGuard)
  async listStudentsByClassId(
    @Args('classId', { type: () => ID! }) classId: number,
    @Context() context: any,
    @Args('listStudentsOfClassInput')
    listStudentsOfClassInput: ListStudentOfClassInput,
  ) {
    const parent = context.req.user;
    return await this.parentsService.getStudentsListClassWise(
      classId,
      parent,
      listStudentsOfClassInput,
    );
  }

  /**
   * get teachers list by class ID
   * @param classId
   * @param context
   * @param listTeachersOfClassInput
   * @returns
   */
  @Query(() => ListTeacherByClassObject)
  @UseGuards(JwtParentAuthGuard)
  async listTeachersByClassId(
    @Args('classId', { type: () => ID! }) classId: number,
    @Context() context: any,
    @Args('listTeachersOfClassInput')
    listTeachersOfClassInput: ListTeacherOfClassInput,
  ) {
    const parent = context.req.user;
    return await this.parentsService.getTeacherListClassWise(
      classId,
      parent,
      listTeachersOfClassInput,
    );
  }

  @Mutation(() => MessageObject)
  @UseGuards(JwtParentAuthGuard)
  async createExchangeReturnRequest(
    @Args('createExchangeReturnRequestInput')
    createExchangeReturnRequestInput: CreateExchangeReturnRequestInput,
    @Context() context: any,
  ) {
    const parent = context.req.user;
    return await this.parentsService.createExchangeReturnRequest(
      createExchangeReturnRequestInput,
      parent,
    );
  }
}
