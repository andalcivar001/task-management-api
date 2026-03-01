import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth-dto';

@Controller('auth')
export class UserController {
  constructor(private authService: UserService) {}

  @Post('register')
  async register(@Body() user: RegisterAuthDto) {
    return await this.authService.register(user);
  }

  @Post('login')
  async login(@Body() loginData: LoginAuthDto) {
    return await this.authService.login(loginData);
  }
}
