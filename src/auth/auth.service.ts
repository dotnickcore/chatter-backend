import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/users/entities/user.entity';
import { TokenPayload } from './token-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async login(user: User, response: Response) {
    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configService.getOrThrow('JWT_EXPIRATION'),
    );

    const tokenPayload: TokenPayload = {
      _id: user._id.toHexString(),
      email: user.email,
    };

    const token = this.jwtService.sign(tokenPayload);

    // Set the token in a cookie
    response.cookie('Authentication', token, {
      httpOnly: true,
      expires,
    });

    // Return the token in the response body as well (for the frontend to access)
    return { token };
  }

  logout(response: Response) {
    response.cookie('Authentication', '', {
      httpOnly: true,
      expires: new Date(0),  // Expire in the past
      maxAge: 0,             // Ensures instant removal
      path: '/',             // Matches original path
      secure: process.env.NODE_ENV === 'production', // Secure in production
      sameSite: 'lax',       // Ensure consistency
    });

    response.status(200).json({ message: "Logged out successfully" });
}
}