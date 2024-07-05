import {
  Args,
  Context,
  ID,
  Int,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { ClassService } from './class.service';
import { MessageObject } from 'src/commonGqlTypes/message.object';
import { AddClassInput } from './dto/addClass.input';
import { UseGuards } from '@nestjs/common';
import { JwtAdminAuthGuard } from 'src/guards/admin_guard/admin_jwt.guard';
import { UpdateClassInput } from './dto/updateClass.input';
import { ListAllClassesInput } from './dto/listAllClasses.input';
import { ListAllClassesObject } from './dto/listAllClasses.object';

@Resolver()
export class ClassResolver {
  constructor(private readonly classService: ClassService) {}

  /**
   * Add Class by Admin
   * @param addClassData
   * @param context
   * @returns
   */
  @Mutation(() => MessageObject)
  @UseGuards(JwtAdminAuthGuard)
  async adminAddClass(
    @Args('addClassInput') addClassData: AddClassInput,
    @Context() context: any,
  ) {
    return await this.classService.addClass(addClassData, context.req.user);
  }

  /**
   * Update Class by Admin
   * @param id
   * @param updateClassData
   * @returns
   */
  @Mutation(() => MessageObject)
  @UseGuards(JwtAdminAuthGuard)
  async adminUpdateClassById(
    @Args('classId', { type: () => ID! }) id: number,
    @Args('updateClassInput') updateClassData: UpdateClassInput,
  ) {
    return await this.classService.updateClassById(id, updateClassData);
  }

  /**
   * Get All Class list
   * @param listAllClassesData
   * @returns
   */
  @Query(() => ListAllClassesObject)
  @UseGuards(JwtAdminAuthGuard)
  async adminListAllClasses(
    @Args('listAllClassesInput') listAllClassesData: ListAllClassesInput,
  ) {
    return await this.classService.listAllClasses(listAllClassesData);
  }

  /**
   * Update Class status By Id
   * @param id
   * @param status
   * @returns
   */
  @Mutation(() => MessageObject)
  @UseGuards(JwtAdminAuthGuard)
  async adminUpdateClassStatusById(
    @Args('classId', { type: () => ID! }) id: number,
    @Args('status', { type: () => Int! }) status: number,
  ) {
    return await this.classService.updateClassStatusById(id, status);
  }

  /**
   * Delete Class By Id
   * @param id
   * @returns
   */
  @Mutation(() => MessageObject)
  @UseGuards(JwtAdminAuthGuard)
  async adminDeleteClassById(@Args('classId', { type: () => ID! }) id: number) {
    return await this.classService.deleteClassById(id);
  }
}
