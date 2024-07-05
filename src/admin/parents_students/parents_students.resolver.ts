import { UseGuards } from '@nestjs/common';
import { Args, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MessageObject } from 'src/commonGqlTypes/message.object';
import { JwtAdminAuthGuard } from 'src/guards/admin_guard/admin_jwt.guard';
import { ParentsStudentsService } from './parents_students.service';
import { CreateParentInput } from './dto/createParent.input';
import { AddStudentsInput } from './dto/addStudents.input';
import { UpdateParentWithStudentsInput } from './dto/updateParent.input';
import { ListClassesbyMapping } from './dto/listClasses.object';
import { ListParentsInput } from './dto/listParents.input';
import { ListUserObjectType } from 'src/commonGqlTypes/listUser.object';
import { ListTeachersPaperworkObject } from '../teachers/dto/listTeachersPaperwork.object';
import { ListParentsPaperworkInput } from './dto/listPaperworks.input';
import { Students } from 'src/database/entities/student.entity';
import { UpdateStudentsInput } from './dto/updateStudents.input';
import { SubscribedUser } from 'src/database/entities/subscribed_users.entity';
import { AssignClassesToTeacherInput } from '../teachers/dto/assignClassesToTeacher.input';
import { AssignSchoolToParentInput } from './dto/assignSchoolToParent.input';

@Resolver()
export class ParentsStudentsResolver {
  constructor(private readonly parentStudentService: ParentsStudentsService) {}

  /**
   * Add Parent with child by Admin
   * @param addParentWithStudentsData
   * @returns
   */
  @Mutation(() => MessageObject)
  @UseGuards(JwtAdminAuthGuard)
  async adminAddParentWithStudents(
    @Args('addParentWithStudentsInput')
    addParentWithStudentsData: CreateParentInput,
  ) {
    return await this.parentStudentService.addParentWithStudents(
      addParentWithStudentsData,
    );
  }

  /**
   * Add Students with Parent ID
   * @param addStudentsData
   * @param id
   * @returns
   */
  @Mutation(() => MessageObject)
  @UseGuards(JwtAdminAuthGuard)
  async adminAddStudents(
    @Args('addStudentsInput') addStudentsData: AddStudentsInput,
    @Args('ParentId', { type: () => ID! }) id: number,
  ) {
    return await this.parentStudentService.addStudents(addStudentsData, id);
  }

  /**
   * Update Parent by id
   * @param updateParentData
   * @param id
   * @returns
   */
  @Mutation(() => MessageObject)
  @UseGuards(JwtAdminAuthGuard)
  async adminUpdateParentWithStudentsById(
    @Args('updateParentInput') updateParentData: UpdateParentWithStudentsInput,
    @Args('ParentId', { type: () => ID! }) id: number,
  ) {
    return await this.parentStudentService.updateParentWithStudentsById(
      updateParentData,
      id,
    );
  }

  /**
   * Delete Parent with Students
   * @param id
   * @returns
   */
  @Mutation(() => MessageObject)
  @UseGuards(JwtAdminAuthGuard)
  async adminDeleteParentWithStudents(
    @Args('ParentId', { type: () => ID! }) id: number,
  ) {
    return await this.parentStudentService.deleteParentWithStudents(id);
  }

  /**
   * Delete Student by Id
   * @param id
   * @returns
   */
  @Mutation(() => MessageObject)
  @UseGuards(JwtAdminAuthGuard)
  async adminDeleteStudent(@Args('StudentId', { type: () => ID! }) id: number) {
    return await this.parentStudentService.deleteStudent(id);
  }

  /**
   * Get All Class List by student school
   * @param schoolId
   * @param studentId
   * @returns
   */
  @Query(() => ListClassesbyMapping)
  @UseGuards(JwtAdminAuthGuard)
  async adminGetClassListByStudentSchool(
    @Args('studentId', { type: () => ID! }) student_id: number,
  ) {
    return await this.parentStudentService.getClassList(student_id);
  }

  /**
   * Get All Parent List with Student Count with Pagination & Parent details with Students details by parent ID
   * @param listParentsData
   * @returns
   */
  @Query(() => ListUserObjectType)
  @UseGuards(JwtAdminAuthGuard)
  async adminGetParentsList(
    @Args('listParentsInput') listParentsData: ListParentsInput,
  ) {
    return await this.parentStudentService.getParentsList(listParentsData);
  }

  /**
   * Get All Paperworks created by Parents with pagination
   * @param listParentPaperworkData
   * @returns
   */
  @Query(() => ListTeachersPaperworkObject)
  @UseGuards(JwtAdminAuthGuard)
  async adminGetAllParentsPaperwork(
    @Args('listParentsPaperworkInput')
    listParentPaperworkData: ListParentsPaperworkInput,
  ) {
    return await this.parentStudentService.getAllParentsPaperwork(
      listParentPaperworkData,
    );
  }

  /**
   * Get Student by ID
   * @param id
   * @returns
   */
  @Query(() => Students)
  @UseGuards(JwtAdminAuthGuard)
  async adminGetStudentById(
    @Args('StudentId', { type: () => ID! }) id: number,
  ) {
    return await this.parentStudentService.getStudentById(id);
  }

  /**
   * Update Students
   * @param updateStudentsData
   * @returns
   */
  @Mutation(() => MessageObject)
  @UseGuards(JwtAdminAuthGuard)
  async adminUpdateStudents(
    @Args('updateStudentsInput') updateStudentsData: UpdateStudentsInput,
    @Args('parentId', { type: () => ID! }) parentId: number,
  ) {
    return await this.parentStudentService.updateStudents(
      updateStudentsData,
      parentId,
    );
  }

  /**
   * Get Subscription Plan Detail by Parent ID
   * @param id
   * @returns
   */
  @Query(() => SubscribedUser)
  @UseGuards(JwtAdminAuthGuard)
  async adminGetSubscribedPlanDetail(
    @Args('parentId', { type: () => ID! }) id: number,
  ) {
    return await this.parentStudentService.getSubscribedPlanDetail(id);
  }

  /**
   * Assign Classes to Student
   * @param assignClassesData
   * @param id
   * @returns
   */
  @Mutation(() => MessageObject)
  @UseGuards(JwtAdminAuthGuard)
  async adminAssignClassesToStudent(
    @Args('assignClassesToStudentInput')
    assignClassesData: AssignClassesToTeacherInput,
    @Args('studentId', { type: () => ID! }) id: number,
  ) {
    return await this.parentStudentService.assignClassesToStudent(
      id,
      assignClassesData,
    );
  }

  /**
   * unAssign All Classes to Student
   * @param id
   * @returns
   */
  @Mutation(() => MessageObject)
  @UseGuards(JwtAdminAuthGuard)
  async adminUnAssignAllClassestoStudent(
    @Args('studentId', { type: () => ID! }) id: number,
  ) {
    return await this.parentStudentService.unAssignAllClassesToStudent(id);
  }

  /**
   * Assign School to Parent & Students
   * @param id
   * @param assignSchoolData
   * @returns
   */
  @Mutation(() => MessageObject)
  @UseGuards(JwtAdminAuthGuard)
  async adminAssignSchoolToParent(
    @Args('parentId', { type: () => ID! }) id: number,
    @Args('assignSchoolToParentInput')
    assignSchoolData: AssignSchoolToParentInput,
  ) {
    return await this.parentStudentService.assignSchoolToParent(
      id,
      assignSchoolData,
    );
  }

  /**
   * Update Parent with students status by Parent ID
   * @param id
   * @param status
   * @returns
   */
  @Mutation(() => MessageObject)
  @UseGuards(JwtAdminAuthGuard)
  async adminUpdateParentWithStudentsStatus(
    @Args('ParentId', { type: () => ID! }) id: number,
    @Args('status', { type: () => Int! }) status: number,
  ) {
    return await this.parentStudentService.updateParentWithStudentsStatus(
      id,
      status,
    );
  }

  /**
   * Update Student Status by Student Id
   * @param id
   * @param status
   * @returns
   */
  @Mutation(() => MessageObject)
  @UseGuards(JwtAdminAuthGuard)
  async adminUpdateStudentStatus(
    @Args('StudentId', { type: () => ID! }) id: number,
    @Args('status', { type: () => Int! }) status: number,
  ) {
    return await this.parentStudentService.updateStudentStatus(id, status);
  }
}
