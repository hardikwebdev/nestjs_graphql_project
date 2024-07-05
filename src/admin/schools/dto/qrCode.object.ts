import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class QrCodeObject {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;

  @Field()
  qr_code: string;
}
