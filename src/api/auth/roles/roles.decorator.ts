import { SetMetadata } from '@nestjs/common';
import { ERole } from 'src/models/roles';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: ERole[]) => SetMetadata(ROLES_KEY, roles);