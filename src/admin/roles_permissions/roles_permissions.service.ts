import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { UpdateRolePermissionInput } from './dto/updateRolePermission.input';
import { Repository } from 'typeorm';
import { RolesPermissions } from 'src/database/entities/roles_permissions.entity';
import { GraphQLError } from 'graphql';
import { UserRoles } from 'src/database/entities/user_roles.entity';

@Injectable()
export class RolesPermissionsService {
  constructor(
    @Inject('ROLES_PERMISSIONS_REPOSITORY')
    private readonly rolePermissionRepository: Repository<RolesPermissions>,
    @Inject('USER_ROLES_REPOSITORY')
    private readonly userRoleRepository: Repository<UserRoles>,
  ) { }

  /**
   * Update Role permission
   * @param permissionId
   * @param updatePermissionData
   * @returns
   */
  async updateRolePermission(
    permissionId: number,
    updatePermissionData: UpdateRolePermissionInput,
  ) {
    const isPermissionExist = await this.getPermissionById(permissionId);

    if (!isPermissionExist) {
      throw new GraphQLError('No permission found!', {
        extensions: {
          statusCode: HttpStatus.NOT_FOUND,
        },
      });
    }

    isPermissionExist.can_add = updatePermissionData.can_add;
    isPermissionExist.can_update = updatePermissionData.can_update;
    isPermissionExist.can_delete = updatePermissionData.can_delete;
    isPermissionExist.can_view = updatePermissionData.can_view;

    await this.rolePermissionRepository.save(isPermissionExist);

    return { message: 'Permission updated successfully!' };
  }

  /**
   * Update Role permission status
   * @param permissionId
   * @param status
   * @returns
   */
  async updateRolePermissionStatus(permissionId: number, status: number) {
    const isPermissionExist = await this.getPermissionById(permissionId);

    if (!isPermissionExist) {
      throw new GraphQLError('No permission found!', {
        extensions: {
          statusCode: HttpStatus.NOT_FOUND,
        },
      });
    }

    isPermissionExist.status = status;

    await this.rolePermissionRepository.save(isPermissionExist);

    return { message: 'Permission updated successfully!' };
  }

  /**
   * Get List of Permissions by Role Id
   * @param roleId
   * @returns
   */
  async getListPermissionByRoleId(roleId: number) {
    const isRoleExist = await this.userRoleRepository.findOneBy({
      role_id: roleId,
    });

    if (!isRoleExist) {
      throw new GraphQLError('No Role found!', {
        extensions: {
          statusCode: HttpStatus.NOT_FOUND,
        },
      });
    }

    const permissions = await this.rolePermissionRepository.find({
      where: { role_id: isRoleExist.id },
    });

    return { permissions };
  }

  /**
   * Commen Get Permission By Id Function
   * @param id
   * @returns
   */
  async getPermissionById(id: number) {
    return await this.rolePermissionRepository.findOneBy({ id });
  }
}
