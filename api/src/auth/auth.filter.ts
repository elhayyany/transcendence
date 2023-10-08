import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { UnauthorizedException } from '@nestjs/common';

@Catch(UnauthorizedException)
export class ViewAuthFilter implements ExceptionFilter {
  async catch(exception: HttpException, host: ArgumentsHost) {
    console.log('ViewAuthFilter');
    const ctx = host.switchToHttp();
    const response = await ctx.getResponse<Response>();
    const status = exception.getStatus();
    await response.status(status).redirect('/');
    console.log(status);
    
  }
}
