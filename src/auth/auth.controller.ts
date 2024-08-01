import {
  Body,
  Controller,
  Get,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  SetMetadata,
  UseGuards,
  Redirect,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthenticatedGuard } from './authenticated.guard';

import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/roles/entities/role.entity';
import { RolesGuard } from 'src/roles/role.guard';
import { PermissionsGuard } from './permissions.guard';
import { RolesService } from 'src/roles/roles.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // @Public() // In case some guards are turned on globally
  // @UseGuards(LocalAuthGuard)
  // @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  // @Redirect('/app/dashboard')
  login(@Request() req): any {
    // return { msg: 'Logged in!' };
    return this.authService.login(req.user);
  }

  @Post('register')
  register(@Request() req): any {
    return { msg: 'R in!' };
  }

  // @UseGuards(AuthenticatedGuard)
  // @UseGuards(AuthenticatedGuard, RolesGuard)
  // @Roles('Admin','User')
  // @SetMetadata('roles', ['Admin'])
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  // @SetMetadata('permissions', ['read:profile'])
  getProfile(@Request() req) {
    return req.user;
  }

  // @UseGuards(AuthenticatedGuard)
  @Get('logout')
  @Redirect('/app')
  async logout(@Request() req): Promise<any> {
    return new Promise((resolve, reject) => {
      req.logout(async (err) => {
        if (err) {
          console.error('Error logging out:', err);
          reject(new Error('Could not log out.'));
        } else {
          req.session.destroy((err) => {
            if (err) {
              console.error('Error destroying session:', err);
              reject(new Error('Could not log out.'));
            } else {
              resolve({ msg: 'Logged out successfully!' });
            }
          });
        }
      });
    });
  }
}
