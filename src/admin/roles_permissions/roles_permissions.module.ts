import { Module } from '@nestjs/common';
import { RolesPermissionsResolver } from './roles_permissions.resolver';
import { RolesPermissionsService } from './roles_permissions.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [RolesPermissionsResolver, RolesPermissionsService],
})
export class RolesPermissionsModule {}
