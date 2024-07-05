import { Args, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RolesPermissionsService } from './roles_permissions.service';
import { MessageObject } from 'src/commonGqlTypes/message.object';
import { UpdateRolePermissionInput } from './dto/updateRolePermission.input';
import { ListRolePermissionsObject } from './dto/listRolePermissions.object';
import { UseGuards } from '@nestjs/common';
import { JwtAdminAuthGuard } from 'src/guards/admin_guard/admin_jwt.guard';

@Resolver()
export class RolesPermissionsResolver {
  constructor(
    private readonly rolesPermissionService: RolesPermissionsService,
  ) {}

  /**
   * Update Role permission
   * @param id
   * @param updatePermissionData
   * @returns
   */
  @Mutation(() => MessageObject)
  @UseGuards(JwtAdminAuthGuard)
  async adminUpdateRolePermission(
    @Args('permissionId', { type: () => ID! }) id: number,
    @Args('updateRolePermissionInput')
    updatePermissionData: UpdateRolePermissionInput,
  ) {
    return await this.rolesPermissionService.updateRolePermission(
      id,
      updatePermissionData,
    );
  }

  /**
   * Update Role permission status
   * @param id
   * @param status
   * @returns
   */
  @Mutation(() => MessageObject)
  @UseGuards(JwtAdminAuthGuard)
  async adminUpdateRolePermissionStatus(
    @Args('permissionId', { type: () => ID! }) id: number,
    @Args('status', { type: () => Int! }) status: number,
  ) {
    return await this.rolesPermissionService.updateRolePermissionStatus(
      id,
      status,
    );
  }

  /**
   * Get List of Permissions by Role Id
   * @param id
   * @returns
   */
  @Query(() => ListRolePermissionsObject)
  @UseGuards(JwtAdminAuthGuard)
  async adminGetListPermissionByRoleId(
    @Args('roleId', { type: () => ID! }) id: number,
  ) {
    return await this.rolesPermissionService.getListPermissionByRoleId(id);
  }
}
