import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

export interface JwtPayload {
    sub: string;
    email: string;
    username: string;
    iat: number;
    exp: number;
}

export interface AuthenticatedUser {
    id: string;
    email: string;
    username: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly configService: ConfigService) {
    super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        secretOrKey: configService.get<string>('JWT_SECRET') || 'default_secret',
    });
    }

    async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    if (!payload.sub || !payload.email || !payload.username) {
        throw new UnauthorizedException('Invalid token');
    }

    return {
        id: payload.sub,
        email: payload.email,
        username: payload.username,
    };
    }
}
