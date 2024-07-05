import {
  Args,
  Context,
  ID,
  Int,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { SchoolsService } from './schools.service';
import { MessageObject } from 'src/commonGqlTypes/message.object';
import { CreateSchoolInput } from './dto/createSchool.input';
import { ListSchoolsObjectType } from './dto/listSchool.object';
import { ListSchoolInput } from './dto/listSchool.input';
import { UseGuards } from '@nestjs/common';
import { JwtAdminAuthGuard } from 'src/guards/admin_guard/admin_jwt.guard';
import { Schools } from 'src/database/entities/schools.entity';
import { QrCodeObject } from './dto/qrCode.object';
import { GenerateQRCodeInput } from './dto/qrCode.input';

@Resolver()
export class SchoolsResolver {
  constructor(private readonly schoolService: SchoolsService) {}

  /**
   * Add School by Admin
   * @param addSchool
   * @returns
   */
  @Mutation(() => MessageObject)
  @UseGuards(JwtAdminAuthGuard)
  async adminAddSchool(
    @Args('addSchoolInput') addSchoolInput: CreateSchoolInput,
    @Context() context: any,
  ) {
    const user = context?.req?.user;
    return await this.schoolService.addSchool(addSchoolInput, user);
  }

  /**
   * Update School by Id
   * @param updateSchool
   * @param id
   * @returns
   */
  @Mutation(() => MessageObject)
  @UseGuards(JwtAdminAuthGuard)
  async adminUpdateSchool(
    @Args('updateSchoolInput') updateSchoolInput: CreateSchoolInput,
    @Args('id', { type: () => ID! }) id: number,
  ) {
    return await this.schoolService.updateSchoolById(id, updateSchoolInput);
  }

  /**
   * Delete School by Id
   * @param id
   * @returns
   */
  @Mutation(() => MessageObject)
  @UseGuards(JwtAdminAuthGuard)
  async adminDeleteSchool(@Args('id', { type: () => ID! }) id: number) {
    return await this.schoolService.deleteSchoolById(id);
  }

  /**
   * Get School by Id
   * @param id
   * @returns
   */
  @Query(() => Schools)
  @UseGuards(JwtAdminAuthGuard)
  async adminGetSchoolById(@Args('id', { type: () => ID! }) id: number) {
    return await this.schoolService.getSchoolById(id);
  }

  /**
   * Get Schools list with Search, Sort and Pagination
   * @param listSchoolInput
   * @returns
   */
  @Query(() => ListSchoolsObjectType)
  @UseGuards(JwtAdminAuthGuard)
  async adminListSchools(
    @Args('listSchoolInput') listSchoolInput: ListSchoolInput,
  ) {
    return await this.schoolService.getSchools(listSchoolInput);
  }

  /**
   * Generate All Schools QR Code
   * @returns
   */
  @Mutation(() => QrCodeObject)
  async adminGenerateQrCode(
    @Args('qrCodeInput') qrCodeData: GenerateQRCodeInput,
  ) {
    return await this.schoolService.generateQrCode(qrCodeData);
  }

  /**
   * Update School Status
   * @param id
   * @param status
   * @returns
   */
  @Mutation(() => MessageObject)
  @UseGuards(JwtAdminAuthGuard)
  async adminUpdateSchoolStatus(
    @Args('id', { type: () => ID! }) id: number,
    @Args('status', { type: () => Int! }) status: number,
  ) {
    return await this.schoolService.updateSchoolStatus(id, status);
  }
}
