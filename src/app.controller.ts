import { Controller, Get, Render, Session } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  root(@Session() session: Record<string, any>) {
    return {
      title: 'Jongie Nara - Paper Art Museum & Culture',
      user: session.user || null,
    };
  }

  @Get('catalog')
  @Render('catalog')
  catalog(@Session() session: Record<string, any>) {
    return {
      title: '카다로그 - 종이나라',
      user: session.user || null,
    };
  }
}

