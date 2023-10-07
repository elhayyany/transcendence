import {
  Body,
  Controller,
  Get,
  Post,
  Redirect,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
  UnauthorizedException,
  HttpCode,
} from '@nestjs/common';
import { JwtGard } from 'src/auth/guard';
import { AuthService } from './auth.service';
import { AuthDto } from 'src/dto';
import { AuthGuard } from '@nestjs/passport';
import { GoogleOAuthGuard } from './guard/google-oauth.guard';
import { SELF_DECLARED_DEPS_METADATA } from '@nestjs/common/constants';
import RequestWithUser from './interfaces/requestWithUser.interface';
import { TwoFactorAuthenticationCodeDto } from '../dto/all.dto';
import { Response, response } from 'express';
import { BadRequestException } from '@nestjs/common';
import { EventsGateway } from 'src/events/events.gateway';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Get('signin')
  @UseGuards(AuthGuard('42'))
  SignIn() { }

  @Get('callback')
  @UseGuards(AuthGuard('42'))
  async callback(@Req() req, @Res() res) {
    const r = await this.authService.SignIn(req);
    console.log("HIIII")
    console.log('heeererjekdjaskl;s');

    await res.cookie('jwt', r.token, {
        domain: 'localhost', // Set to your domain
        path: '/',
        httpOnly: true,
        secure: true, // Set to true for HTTPS
        //sameSite: 'Lax', // Adjust based on your requirements
    });
    res.redirect('http://localhost:8000/home');
  }
}

//! redirect to profile page
@Controller("/auth/google")
export class GoogleAuthController {
  constructor(private readonly authService: AuthService) { }

  @Get('signin')
  @UseGuards(GoogleOAuthGuard)
  SignIn() {
  }
  @Get('googleRedirect')
  @UseGuards(GoogleOAuthGuard)
  async Google_redirect(@Req() req, @Res() res) {
    const r = await this.authService.SignIn(req);
    await res.cookie("jwt", r.token , {
      httpOnly: true,
      secure: true,
    })
    res.redirect("http://clinet/");
    // console.log({redirected: r});
  }
}


@UseGuards(JwtGard)
@Controller("logout")
export class LogoutController {
  constructor(
    private readonly authService: AuthService,
    private readonly events: EventsGateway,
  ) {}
  @Get()
  async Logout(@Req() req, @Res() res) {

    // what if the user saved his token?
    await res.clearCookie("jwt");
    // set the user to offline
    //! close all sockets
    await this.events.handleDisconnect(req.user.id);

    res.redirect("http://localhost:8000/");
  }
}

@Controller('2fa')
// @UseInterceptors(ClassSerializerInterceptor)
export class TwoFactorAuthenticationController {
  constructor(private readonly authService: AuthService) {}
  //! this function is for debugging purposes but the whole controller is not working
  @Get()
  a(@Req() request: Request) {
    console.log({ request });
    console.log("helldo");
    return "hellodasf";
  }

  @Post('generate') //! generatin qr code and puthing teh secret key in db
  //! use jwt guard here
  async register(@Res() response: Response, @Req() request: RequestWithUser) {
    const { otpauthUrl } =
      await this.authService.generateTwoFactorAuthenticationSecret(
        request.user,
      );
    console.log({ otpauthUrl });
    console.log({ request });
    return this.authService.pipeQrCodeStream(response, otpauthUrl);
  }

  @Post('turn-on') //! hadi bayna kat turniha on
  @HttpCode(200)
  //! use jwt guard here
  async turnOnTwoFactorAuthentication(
    @Req() request: RequestWithUser,
    @Body() { twoFactorAuthenticationCode }: TwoFactorAuthenticationCodeDto,
  ) {
    const isCodeValid = this.authService.isTwoFactorAuthenticationCodeValid(
      twoFactorAuthenticationCode,
      request.user,
    );
    if (!isCodeValid) {
      throw new BadRequestException('Wrong authentication code');
    }
    await this.authService.turnOnTwoFactorAuthentication(request.user.userId);
  }

  @Post('turn-off') //! hadi bayna kat turniha on
  @HttpCode(200)
  //! use jwt guard here
  async turnOffTwoFactorAuthentication(@Req() request: RequestWithUser) {
    await this.authService.turnOffTwoFactorAuthentication(request.user.userId);
    response.setHeader('Set-Cookie', this.authService.getCookieForLogOut());
  }

  @Post('authenticate') //
  @HttpCode(200)
  //! use jwt guard here
  async authenticate(
    @Req() request: RequestWithUser,
    @Body() { twoFactorAuthenticationCode }: TwoFactorAuthenticationCodeDto,
    setCookies = true,
  ) {
    const isCodeValid = this.authService.isTwoFactorAuthenticationCodeValid(
      twoFactorAuthenticationCode,
      request.user,
    );
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }

    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
      request.user.userId,
      true,
    );
    if (setCookies) {
      request.res.setHeader('Set-Cookie', [accessTokenCookie]);
    }
    return request.user;
  }
}



//! leader board