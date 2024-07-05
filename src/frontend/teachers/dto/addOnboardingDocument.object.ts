import { Field, ObjectType } from '@nestjs/graphql';
import { MessageObject } from 'src/commonGqlTypes/message.object';
import { UserOnboardingDocuments } from 'src/database/entities/user_onboarding_documents.entity';

@ObjectType()
export class AddOnboardingDocumentObject extends MessageObject {
  @Field(() => UserOnboardingDocuments)
  userOnboardingDocument: UserOnboardingDocuments;
}
