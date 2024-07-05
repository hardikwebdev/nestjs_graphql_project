import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class updateBlogAndNewsInput {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  pdf_url?: string;
}
