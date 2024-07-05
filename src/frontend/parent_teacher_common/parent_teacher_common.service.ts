import { Inject, Injectable } from '@nestjs/common';
import { AwsService } from 'src/aws/aws.service';
import { Users } from 'src/database/entities/user.entity';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { UpdateParentTeacherProfileInput } from './dto/updateProfileParentTeacher.input';
import { HelperService } from 'src/helper.service';
import { UpdateParentTeacherProfileObject } from './dto/updateParetTeacherProfile.object';
import { Newsletter } from 'src/database/entities/newsletter.entity';
import { CommonListingInputType } from 'src/commonGqlTypes/commonListing.object';
import { SORT_ORDER, STATUS } from 'src/constants';
import { NewsletterClassMappings } from 'src/database/entities/newsletter_class_mappings.entity';

@Injectable()
export class FrontendParentTeacherCommonService {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userRespository: Repository<Users>,
    @Inject('NEWSLETTER_REPOSITORY')
    private readonly newsletterRepository: Repository<Newsletter>,
    @Inject('NEWSLETTER_CLASS_MAPPINGS_REPOSITORY')
    private readonly newsletterClassMappingsRepository: Repository<NewsletterClassMappings>,
    private readonly awsService: AwsService,
    private readonly helperService: HelperService,
  ) {}

  /**
   * Enable or disable MFA feature for parent teacher
   * @param userId
   * @param mfa
   * @returns
   */
  async enableOrDisableMFAForParentTeacher(userId: number, mfa: number) {
    let message = 'enabled';
    if (mfa === 0) {
      message = 'disabled';
    }
    await this.userRespository.update({ id: userId }, { is_mfa: mfa });
    return {
      message: `Multifactor authentication has been ${message} successfully!`,
      is_mfa: mfa,
    };
  }

  /**
   * Update profile for parent and teacher
   * @param user
   * @param updateProfileInput
   * @returns
   */
  async updateProfile(
    user: Users,
    updateProfileInput: UpdateParentTeacherProfileInput,
  ): Promise<UpdateParentTeacherProfileObject> {
    const userData = await this.userRespository.findOne({
      where: { id: user.id },
    });
    Object.assign(userData, updateProfileInput);
    let uploadedPdfUrl = userData.profile_img;
    if (
      updateProfileInput.profile_image &&
      this.helperService.isBase64(updateProfileInput.profile_image)
    ) {
      let pdfName: string;
      if (updateProfileInput.firstname) {
        pdfName = updateProfileInput.firstname;
      }
      pdfName = userData.firstname;
      const uploadedPdf = await this.awsService.uploadToAWS(
        'parent_teacher_profile',
        updateProfileInput.profile_image,
        pdfName,
      );
      if (userData?.profile_img) {
        await this.awsService.removeFromBucket(userData.profile_img);
      }
      uploadedPdfUrl = uploadedPdf.Location;
    }
    userData.profile_img = uploadedPdfUrl;
    const updatedUser = await this.userRespository.save(userData);
    return {
      message: 'Your profile has been updated successfully!',
      firstname: updatedUser.firstname,
      lastname: updatedUser.lastname,
      phone_number: updatedUser.phone_number,
      position: updatedUser.position,
      profile_image: updatedUser.profile_img,
    };
  }

  /**
   * Get list newsletter for classes by teacher
   * @param listNewsletterData
   * @param class_id
   * @param user
   * @returns
   */
  async listNewsletter(
    listNewsletterData: CommonListingInputType,
    class_id: number,
    user: Users,
  ) {
    const { page, pageSize, sortBy } = listNewsletterData;
    const sortOrder: any = listNewsletterData.sortOrder;
    const skip = (page - 1) * pageSize;

    const queryBuilder: SelectQueryBuilder<Newsletter> =
      this.newsletterRepository
        .createQueryBuilder('newsletter')
        .leftJoinAndSelect(
          'newsletter.newsletter_class_mappings',
          'newsletter_class_mappings',
        )
        .leftJoinAndSelect('newsletter_class_mappings.class', 'class')
        .where('newsletter.status = :status', {
          status: STATUS.ACTIVE,
        })
        .andWhere(
          new Brackets((qb) => {
            if (class_id) {
              qb.where('newsletter_class_mappings.class_id = :class_id', {
                class_id,
              });
            } else {
              qb.where('newsletter.user_id = :userId', { userId: user.id });
            }
          }),
        )
        .skip(skip)
        .take(pageSize)
        .orderBy(
          `newsletter.${sortBy}`,
          SORT_ORDER.includes(sortOrder) ? sortOrder.toUpperCase() : 'DESC',
        );

    const [newsletter, total] = await queryBuilder.getManyAndCount();

    return { newsletter, total };
  }
}
