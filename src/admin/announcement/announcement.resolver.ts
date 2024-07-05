import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AnnouncementService } from './announcement.service';
import { UseGuards } from '@nestjs/common';
import { JwtAdminAuthGuard } from 'src/guards/admin_guard/admin_jwt.guard';
import { MessageObject } from 'src/commonGqlTypes/message.object';
import { CreateAnnouncementInput } from './dto/createAnnouncement.input';
import { ListAnnouncementObject } from './dto/listAnnouncement.object';
import { ListAnnouncementInput } from './dto/listAnnouncement.input';
import { ListAllUsersObject } from './dto/listAllUsers.object';

@Resolver()
export class AnnouncementResolver {
  constructor(private readonly announcementService: AnnouncementService) {}

  /**
   * Create announcement
   * @param createAnnouncementInput
   * @returns
   */
  @Mutation(() => MessageObject)
  @UseGuards(JwtAdminAuthGuard)
  async adminCreateAnnouncement(
    @Args('createAnnouncementInput')
    createAnnouncementData: CreateAnnouncementInput,
  ) {
    return await this.announcementService.createAnnouncement(
      createAnnouncementData,
    );
  }

  /**
   * Delete announcement
   * @param id
   * @returns
   */
  @Mutation(() => MessageObject)
  @UseGuards(JwtAdminAuthGuard)
  async adminDeleteAnnouncement(
    @Args('announcementId', { type: () => ID! }) id: number,
  ) {
    return await this.announcementService.deleteAnnounceMent(id);
  }

  /**
   * Update announcement
   * @param id
   * @param updateAnnouncementInput
   * @returns
   */
  @Mutation(() => MessageObject)
  @UseGuards(JwtAdminAuthGuard)
  async adminUpdateAnnouncement(
    @Args('announcementId', { type: () => ID! }) id: number,
    @Args('updateAnnouncementInput')
    updateAnnouncementData: CreateAnnouncementInput,
  ) {
    return await this.announcementService.updateAnnouncement(
      id,
      updateAnnouncementData,
    );
  }

  /**
   * List all announcement
   * @param listAnnouncementData
   * @returns
   */
  @Query(() => ListAnnouncementObject)
  @UseGuards(JwtAdminAuthGuard)
  async adminListAnnouncement(
    @Args('listAnnouncementInput')
    listAnnouncementData: ListAnnouncementInput,
  ) {
    return await this.announcementService.listAnnouncement(
      listAnnouncementData,
    );
  }

  /**
   * List All Users without pagination for announcement specific user selection (parents, teachers)
   * @returns
   */
  @Query(() => ListAllUsersObject)
  @UseGuards(JwtAdminAuthGuard)
  async adminListAllUsers() {
    return await this.announcementService.listAllUsers();
  }
}
