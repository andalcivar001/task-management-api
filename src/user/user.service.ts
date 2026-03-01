import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth-dto';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/user.entity';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(user: RegisterAuthDto) {
    if (user.usuario.length < 4) {
      throw new HttpException(
        'El usuario debe tener mas de 3 caracteres',
        HttpStatus.CONFLICT,
      );
    }

    const usuarioExists = await this.userRepository.findOneBy({
      usuario: user.usuario,
    });
    if (usuarioExists) {
      // El error 409 es un conflicto
      throw new HttpException('El usuario ya existe', HttpStatus.CONFLICT);
    }

    const newUser = this.userRepository.create(user);
    const userSaved = await this.userRepository.save(newUser);
    const payload = {
      id: userSaved.id,
      name: userSaved.nombre,
    };
    const token = this.jwtService.sign(payload);
    const { password, ...userWithoutPassword } = userSaved;

    const data = {
      user: userWithoutPassword,
      token: token,
    };
    return data;
  }

  async login(loginData: LoginAuthDto) {
    const usuario = loginData.usuario;
    const pwd = loginData.password;
    const userFound = await this.userRepository.findOne({
      where: {
        usuario: usuario,
      },
    });

    if (!userFound) {
      throw new HttpException(
        'El usuario no esta registrado',
        HttpStatus.NOT_FOUND,
      );
    }

    const isPwdValid = await compare(pwd, userFound.password);
    if (!isPwdValid) {
      throw new HttpException(
        'La contraseña es incorrecta',
        HttpStatus.FORBIDDEN,
      );
    }

    const payload = { id: userFound.id, name: userFound.nombre };
    const token = this.jwtService.sign(payload);
    const { password, ...userWithoutPassword } = userFound;
    const data = {
      user: userWithoutPassword,
      token: token,
    };
    return data;
  }
}
