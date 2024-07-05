import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../baseEntity';
import { STATUS } from 'src/constants';
import { Users } from './user.entity';
import { OnboardingDocumentsList } from './onboarding_documents_list.entity';

@ObjectType()
@Entity({ name: 'user_onboarding_documents' })
export class UserOnboardingDocuments extends BaseEntity {
  @Field(() => ID)
  @Column()
  user_id: number;

  @Field(() => ID)
  @Column()
  document_id: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  document_url: string;

  @Field(() => Int)
  @Column({
    type: 'tinyint',
    default: STATUS.ACTIVE,
    comment: '0: Inactive, 1: Active',
  }) // 0: Inactive, 1: Active
  status: number;

  @Field(() => Users)
  @ManyToOne(() => Users, (user) => user.user_onboarding_documents)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @Field(() => OnboardingDocumentsList)
  @ManyToOne(
    () => OnboardingDocumentsList,
    (onboardingDocumentsList) =>
      onboardingDocumentsList.user_onboarding_documents,
  )
  @JoinColumn({ name: 'document_id' })
  onboarding_documents_list: OnboardingDocumentsList;
}
