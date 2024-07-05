import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const graphql = ctx.getContext().req;

    const { loginAdmin, loginTeacherParent } = ctx.getArgs();
    let email = loginAdmin?.email;
    let password = loginAdmin?.password;
    if (!loginAdmin) {
      email = loginTeacherParent.email;
      password = loginTeacherParent.password;
    }
    graphql.body.email = email;
    graphql.body.password = password;

    return graphql;
  }
}
