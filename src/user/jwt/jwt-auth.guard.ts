import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

//habilitado para jwt
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
