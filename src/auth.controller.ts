import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Res,
  Render,
  Session,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ─── 로그인 페이지 ───
  @Get('login')
  @Render('login')
  loginPage(@Session() session: Record<string, any>) {
    return {
      title: '로그인 - 종이나라',
      error: null,
      user: session.user || null,
    };
  }

  // ─── 로그인 처리 ───
  @Post('login')
  async loginSubmit(
    @Body() body: { email: string; password: string },
    @Session() session: Record<string, any>,
    @Res() res: Response,
  ) {
    try {
      const user = await this.authService.login(body.email, body.password);
      // 세션에 유저 정보 저장 (비밀번호 제외)
      session.user = {
        id: user.id,
        email: user.email,
        name: user.name,
      };
      return res.redirect('/');
    } catch (err) {
      return res.render('login', {
        title: '로그인 - 종이나라',
        error: err.message || '로그인에 실패했습니다.',
        user: null,
      });
    }
  }

  // ─── 회원가입 페이지 ───
  @Get('register')
  @Render('register')
  registerPage(@Session() session: Record<string, any>) {
    return {
      title: '회원가입 - 종이나라',
      error: null,
      success: null,
      user: session.user || null,
    };
  }

  // ─── 회원가입 처리 ───
  @Post('register')
  async registerSubmit(
    @Body()
    body: {
      name: string;
      email: string;
      password: string;
      'password-confirm': string;
      phone: string;
    },
    @Session() session: Record<string, any>,
    @Res() res: Response,
  ) {
    try {
      // 비밀번호 확인
      if (body.password !== body['password-confirm']) {
        return res.render('register', {
          title: '회원가입 - 종이나라',
          error: '비밀번호가 일치하지 않습니다.',
          success: null,
          user: null,
        });
      }

      if (body.password.length < 8) {
        return res.render('register', {
          title: '회원가입 - 종이나라',
          error: '비밀번호는 8자 이상이어야 합니다.',
          success: null,
          user: null,
        });
      }

      await this.authService.register({
        email: body.email,
        name: body.name,
        password: body.password,
        phone: body.phone,
      });

      return res.render('register', {
        title: '회원가입 - 종이나라',
        error: null,
        success: '회원가입이 완료되었습니다! 로그인 해주세요.',
        user: null,
      });
    } catch (err) {
      return res.render('register', {
        title: '회원가입 - 종이나라',
        error: err.message || '회원가입에 실패했습니다.',
        success: null,
        user: null,
      });
    }
  }

  // ─── 로그아웃 ───
  @Get('logout')
  logout(@Session() session: Record<string, any>, @Res() res: Response) {
    session.user = null;
    return res.redirect('/');
  }
}
