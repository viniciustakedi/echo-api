import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { ERole } from 'src/models/roles';
import { parseJwt } from 'src/utils/functions';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<ERole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // Se nenhuma role é necessária, permitir o acesso.
    }

    const { headers } = context.switchToHttp().getRequest();
    const { authorization: token } = headers;

    if (token) {
      const jwtDecoded = parseJwt(token);

      // Verificar se o token possui pelo menos uma das roles necessárias
      const hasRequiredRole = requiredRoles.some((role) =>
        jwtDecoded.roles.includes(role),
      );

      return hasRequiredRole;
    } else {
      return false; // Se não houver token, negar o acesso.
    }
  }
}
