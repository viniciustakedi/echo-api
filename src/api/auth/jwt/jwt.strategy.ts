import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { authEnv } from 'src/infra/env';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: authEnv.jwt.secretPublic,
      algorithms: ['RS256'],
    });
  }

  async validate(payload: any): Promise<any> {
    return { id: payload.sub, issue: payload.issue };
  }
}
