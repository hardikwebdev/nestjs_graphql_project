import { Args, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TeachersService } from './teachers.service';
import { MessageObject } from 'src/commonGqlTypes/message.object';
import { CreateTeacherInput } from './dto/createTeacher.input';
import { UpdateTeacherInput } from './dto/updateTeacher.input';
import {
  ListUserObjectType,
  UserObject,
} from 'src/commonGqlTypes/listUser.object';
import { ListTeacherInput } from './dto/listTeachers.input';
import { ListTeachersPaperworkObject } from './dto/listTeachersPaperwork.object';
import { ListTeachersPaperworkInput } from './dto/listTeachersPaperwork.input';
import { UseGuards } from '@nestjs/common';
import { JwtAdminAuthGuard } from 'src/guards/admin_guard/admin_jwt.guard';
import { ListClassesByTeacherSchools } from './dto/listClassesByTeacherSchools.object';
import { AssignClassesToTeacherInput } from './dto/assignClassesToTeacher.input';
import { ListAssignClassesByTeacherObject } from './dto/listAssignClassesByTeacherId.object';
import { CreateZoomCallTimingInput } from './dto/createZoomCallTiming.input';
import { ListTeachersSickRequestInput } from './dto/listTeachersSickRequest.input';
import { ListTeachersSickRequestObject } from './dto/listTeachersSickRequest.object';
import { ListTeachersReimbursementRequestInput } from './dto/listTeachersReimbursementRequest.input';
import { ListTeachersReimbursementRequestObject } from './dto/listTeachersReimbursementRequest.object';
import { ListZoomCallTimingObject } from './dto/listZoomCallTiming.object';
import { ListZoomCallTimingInput } from './dto/listZoomCallTiming.input';
import { ListClockInOutObject } from 'src/frontend/clock-in-out/dto/listClockInOut.object';
import { ListClockInOutInput } from 'src/frontend/clock-in-out/dto/listClockInOut.input';
import { UpdateTimeOffRequestInput } from './dto/updateTimeOffStatus.input';

@Resolver()
export class TeachersResolver {
  constructor(private readonly teacherService: TeachersService) {}

  /**
   * Create Teacher by Admin
   * @param addTeacherInput
   * @returns
   */
  @Mutation(() => MessageObject)
  @UseGuards(JwtAdminAuthGuard)
  async adminAddTeacher(
    @Args('addTeacherInput') addTeacherInput: CreateTeacherInput,
  ) {
    return await this.teacherService.addTeacher(addTeacherInput);
  }

  /**
   * Update Teacher by id
   * @param updateTeacherInput
   * @param id
   * @returns
   */
  @Mutation(() => MessageObject)
  @UseGuards(JwtAdminAuthGuard)
  async adminUpdateTeacher(
    @Args('updateTeacherInput') updateTeacherInput: UpdateTeacherInput,
    @Args('id', { type: () => ID! }) id: number,
  ) {
    return await this.teacherService.updateTeacher(updateTeacherInput, id);
  }

  /**
   * Get All Teachers with Search, Filter and Pagination
   * @param listTeacherInput
   * @returns
   */
  @Query(() => ListUserObjectType)
  @UseGuards(JwtAdminAuthGuard)
  async adminGetAllTeachers(
    @Args('listTeacherInput') listTeacherInput: ListTeacherInput,
  ) {
    return await this.teacherService.getAllTeachers(listTeacherInput);
  }

  /**
   * Delete Teacher by id
   * @param id
   * @returns
   */
  @Mutation(() => MessageObject)
  @UseGuards(JwtAdminAuthGuard)
  async adminDeleteTeacherbyId(@Args('id', { type: () => ID! }) id: number) {
    return await this.teacherService.deleteTeacherById(id);
  }

  /**
   * Get Teacher by id
   * @param id
   * @returns
   */
  @Query(() => UserObject)
  @UseGuards(JwtAdminAuthGuard)
  async adminGetTeacherById(@Args('id', { type: () => ID! }) id: number) {
    return await this.teacherService.getTeacherByID(id);
  }

  /**
   * Update Teacher Status by id
   * @param id
   * @param status
   * @returns
   */
  @Mutation(() => MessageObject)
  @UseGuards(JwtAdminAuthGuard)
  async adminUpdateTeacherStatus(
    @Args('id', { type: () => ID! }) id: number,
    @Args('status', { type: () => Int! }) status: number,
  ) {
    return await this.teacherService.updateTeacherStatus(id, status);
  }

  /**
   * Get All Paperworks created by Teachers with pagination
   * @param listTeachersPaperworkInput
   * @returns
   */
  @Query(() => ListTeachersPaperworkObject)
  @UseGuards(JwtAdminAuthGuard)
  async adminGetAllTeachersPaperwork(
    @Args('listTeachersPaperworkInput')
    listTeachersPaperworkInput: ListTeachersPaperworkInput,
  ) {
    return await this.teacherService.getAllTeachersPaperwork(
      listTeachersPaperworkInput,
    );
  }

  /**
   * Get All classes list by teacher schools
   * @param id
   * @returns
   */
  @Query(() => ListClassesByTeacherSchools)
  @UseGuards(JwtAdminAuthGuard)
  async adminGetClassListByTeacherSchools(
    @Args('id', { type: () => ID! }) id: number,
  ) {
    return await this.teacherService.getClassListByTeacherSchools(id);
  }

  /**
   * Assign Classes to Teacher
   * @param id
   * @param assignClassesData
   * @returns
   */
  @Mutation(() => MessageObject)
  @UseGuards(JwtAdminAuthGuard)
  async adminAssignClassesToTeacher(
    @Args('id', { type: () => ID! }) id: number,
    @Args('assignClassesToTeacherInput')
    assignClassesData: AssignClassesToTeacherInput,
  ) {
    return await this.teacherService.assignClassesToTeacher(
      id,
      assignClassesData,
    );
  }

  /**
   * UnAssign All Classes for particular Teacher
   * @param id
   * @returns
   */
  @Mutation(() => MessageObject)
  @UseGuards(JwtAdminAuthGuard)
  async adminUnassignAllClassToTeacher(
    @Args('id', { type: () => ID! }) id: number,
  ) {
    return await this.teacherService.removeAllClassMappingbyTeacherId(id);
  }

  /**
   * Get All Assign Classes by TeacherID
   * @param id
   * @returns
   */
  @Query(() => ListAssignClassesByTeacherObject)
  @UseGuards(JwtAdminAuthGuard)
  async adminGetAssignClassesbyTeacherId(
    @Args('id', { type: () => ID! }) id: number,
  ) {
    return await this.teacherService.getAssignClassesbyTeacherId(id);
  }

  /**
   * Restrict Class Access for particular Teacher
   * @param teacherId
   * @param classId
   * @param status
   * @returns
   */
  @Mutation(() => MessageObject)
  @UseGuards(JwtAdminAuthGuard)
  async adminRestrictClassAccessbyTeacherId(
    @Args('teacherId', { type: () => ID! }) teacherId: number,
    @Args('classId', { type: () => ID! }) classId: number,
    @Args('status', { type: () => Int! }) status: number,
  ) {
    return await this.teacherService.restrictClassAccessbyTeacherId(
      teacherId,
      classId,
      status,
    );
  }

  /**
   * Disable Chat Feature for particular Teacher
   * @param id
   * @param status
   * @returns
   */
  @Mutation(() => MessageObject)
  @UseGuards(JwtAdminAuthGuard)
  async adminDisableChatFeaturebyTeacherId(
    @Args('id', { type: () => ID! }) id: number,
    @Args('status', { type: () => Int! }) status: number,
  ) {
    return await this.teacherService.disableChatFeaturebyTeacherId(id, status);
  }

  /**
   * Create Zoom Call Timing for particular Teacher
   * @param id
   * @param createZoomCallTimingData
   * @returns
   */
  @Mutation(() => MessageObject)
  @UseGuards(JwtAdminAuthGuard)
  async adminCreateZoomCallTimingbyTeacherId(
    @Args('teacherId', { type: () => ID! }) id: number,
    @Args('createZoomCallTimingInput')
    createZoomCallTimingData: CreateZoomCallTimingInput,
  ) {
    return await this.teacherService.createZoomCallTimingbyTeacherId(
      id,
      createZoomCallTimingData,
    );
  }

  /**
   * Get All Sick Requests submitted by Teachers with pagination
   * @param listTeachersSickRequest
   * @returns
   */
  @Query(() => ListTeachersSickRequestObject)
  @UseGuards(JwtAdminAuthGuard)
  async adminGetAllSickRequests(
    @Args('listTeachersSickRequest')
    listTeachersSickRequest: ListTeachersSickRequestInput,
  ) {
    return await this.teacherService.getAllSickRequests(
      listTeachersSickRequest,
    );
  }

  /**
   * Get All Reimbursement Requests submitted by Teachers with pagination
   * @param listTeachersReimbursementRequest
   * @returns
   */
  @Query(() => ListTeachersReimbursementRequestObject)
  @UseGuards(JwtAdminAuthGuard)
  async adminGetAllReimbursementRequests(
    @Args('listTeachersReimbursementRequest')
    listTeachersReimbursementRequest: ListTeachersReimbursementRequestInput,
  ) {
    return await this.teacherService.getAllReimbursementRequests(
      listTeachersReimbursementRequest,
    );
  }

  /**
   * Get All Zoom Call Timings List by Teacher with Pagination
   * @param zoomCallTimingData
   * @param id
   * @returns
   */
  @Query(() => ListZoomCallTimingObject)
  @UseGuards(JwtAdminAuthGuard)
  async adminGetZoomCallTimingListbyTeacher(
    @Args('listZoomCallTimingInput')
    zoomCallTimingData: ListZoomCallTimingInput,
  ) {
    return await this.teacherService.getAllZoomCallTimingsList(
      zoomCallTimingData,
    );
  }

  /**
   * Update Zoom Call Timing Slots
   * @param id
   * @param updateZoomCallTimingData
   * @returns
   */
  @Mutation(() => MessageObject)
  @UseGuards(JwtAdminAuthGuard)
  async adminUpdateZoomCallTimingSlots(
    @Args('zoomCallTimingID', { type: () => ID! }) id: number,
    @Args('updateZoomCallTimingSlotsInput')
    updateZoomCallTimingData: CreateZoomCallTimingInput,
  ) {
    return await this.teacherService.updateZoomCallTimingSlots(
      id,
      updateZoomCallTimingData,
    );
  }

  /**
   * Delete Zoom Call Timing
   * @param id
   * @returns
   */
  @Mutation(() => MessageObject)
  @UseGuards(JwtAdminAuthGuard)
  async adminDeleteZoomCallTiming(
    @Args('zoomCallTimingID', { type: () => ID! }) id: number,
  ) {
    return await this.teacherService.deleteZoomCallTiming(id);
  }

  /**
   * Get All Clock In Out Logs History by TeacherID with Pagination
   * @param listClockInOutData
   * @param id
   * @returns
   */
  @Query(() => ListClockInOutObject)
  @UseGuards(JwtAdminAuthGuard)
  async adminListClockInOutByTeacherID(
    @Args('listClockInOutInput') listClockInOutData: ListClockInOutInput,
    @Args('teacherID', { type: () => ID! }) id: number,
  ) {
    return await this.teacherService.listClockInOutByTeacherID(
      listClockInOutData,
      id,
    );
  }

  /**
   * Approve or reject time-off request
   * @param timeOffId
   * @param updateSickRequestStatusInput
   * @returns
   */
  @UseGuards(JwtAdminAuthGuard)
  @Mutation(() => MessageObject)
  async adminUpdateSickRequestStatus(
    @Args('timeOffId', { type: () => ID! }) id: number,
    @Args('updateSickRequestStatusInput')
    updateSickRequestStatusInput: UpdateTimeOffRequestInput,
  ) {
    return await this.teacherService.approveOrRejectSickRequest(
      id,
      updateSickRequestStatusInput,
    );
  }

  /**
   * Update Reimbursement Request Status (1: approve OR 2: reject)
   * @param reimbursementId
   * @param status
   * @returns
   */
  @Mutation(() => MessageObject)
  @UseGuards(JwtAdminAuthGuard)
  async adminUpdateReimbursementRequestStatus(
    @Args('reimbursementId', { type: () => ID! }) reimbursementId: number,
    @Args('status', { type: () => Int! }) status: number,
  ) {
    return await this.teacherService.updateReimbursementRequestStatus(
      reimbursementId,
      status,
    );
  }
}
