import { UseGuards } from '@nestjs/common';
import { Args, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MessageObject } from 'src/commonGqlTypes/message.object';
import { JwtAdminAuthGuard } from 'src/guards/admin_guard/admin_jwt.guard';
import { CreateSubjectInput } from './dto/createSubject.input';
import { SubjectService } from './subject.service';
import { ListSubjectObjectType } from './dto/listSubject.object';
import { ListSubjectInput } from './dto/listSubject.input';
import { UpdateSubjectInput } from './dto/updateSubject.input';

@Resolver()
export class SubjectResolver {
  constructor(private readonly subjectService: SubjectService) {}
  /**
   * Create subject by admin
   * @param createSubjectInput
   * @returns
   */
  @Mutation(() => MessageObject)
  @UseGuards(JwtAdminAuthGuard)
  async adminCreateSubject(
    @Args('createSubjectInput') createSubjectInput: CreateSubjectInput,
  ) {
    return await this.subjectService.createSubject(createSubjectInput);
  }

  /**
   * Get subjects with pagination and sorting
   * @param listSubjectInput
   * @returns
   */
  @Query(() => ListSubjectObjectType)
  @UseGuards(JwtAdminAuthGuard)
  async adminListSubjects(
    @Args('listSubjectInput') listSubjectInput: ListSubjectInput,
  ) {
    return await this.subjectService.getAllSubjects(listSubjectInput);
  }

  /**
   * Update subject by subject id
   * @param updateSubjectInput
   * @param subject_id
   * @returns
   */
  @Mutation(() => MessageObject)
  @UseGuards(JwtAdminAuthGuard)
  async adminUpdateSubjectById(
    @Args('updateSubjectInput') updateSubjectInput: UpdateSubjectInput,
    @Args('subject_id', { type: () => ID! }) subject_id: number,
  ) {
    return await this.subjectService.updateSubjectById(
      subject_id,
      updateSubjectInput,
    );
  }

  /**
   * Update subject status
   * @param status
   * @param subject_id
   * @returns
   */
  @Mutation(() => MessageObject)
  @UseGuards(JwtAdminAuthGuard)
  async adminUpdateSubjectStatusById(
    @Args('status', { type: () => Int! }) status: number,
    @Args('subject_id', { type: () => ID! }) subject_id: number,
  ) {
    await this.subjectService.findSubject({ id: subject_id });
    await this.subjectService.updateSubject({ id: subject_id }, { status });
    return { message: 'Subject status updated successfully!' };
  }

  /**
   * Delete subject by subject id
   * @param subject_id
   * @returns
   */
  @Mutation(() => MessageObject)
  @UseGuards(JwtAdminAuthGuard)
  async adminDeleteSubjectById(
    @Args('subject_id', { type: () => ID! }) subject_id: number,
  ) {
    return await this.subjectService.deleteSubjectById(subject_id);
  }
}
