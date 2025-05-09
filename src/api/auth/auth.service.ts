import {
  Injectable,
  NotFoundException,
  HttpStatus,
  HttpCode,
  HttpException,
} from '@nestjs/common';
import { comparePassword, dataResponse, timeout } from 'src/utils';
import { UsersService } from '../users/users.service';
import { LoginUserDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { Users } from 'src/schemas';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async generateTokenJwt(user: Users): Promise<string> {
    const payload = {
      sub: user._id,
      name: user.name,
      roles: user.roles,
      iss: process.env.JWT_ISSUER,
    };

    return this.jwtService.sign(payload);
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      await timeout(75);
      return null;
    }

    const isPasswordValid = comparePassword(password, user.password);
    if (!isPasswordValid) return null;

    return { _id: user._id, name: user.name, roles: user.roles };
  }

  @HttpCode(HttpStatus.OK)
  async userLogin(user: LoginUserDto) {
    try {
      if (!user) {
        throw new NotFoundException('Usuário ou senha invalídos!');
      }

      const userValidate = await this.validateUser(user.login, user.password);

      if (!userValidate) {
        throw new NotFoundException('Usuário ou senha invalídos!');
      }

      return dataResponse(
        await this.generateTokenJwt(userValidate),
        1,
        'Login Ok!',
        HttpStatus.OK,
      );
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
