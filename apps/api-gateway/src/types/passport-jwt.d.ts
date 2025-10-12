declare module 'passport-jwt' {
    import { Strategy as PassportStrategy } from 'passport-strategy';
    import { Request } from 'express';

    export type JwtFromRequestFunction = (req: Request) => string | null;

    export interface StrategyOptions {
    jwtFromRequest: JwtFromRequestFunction;
    secretOrKey: string;
    algorithms?: string[];
    issuer?: string;
    audience?: string;
    passReqToCallback?: boolean;
    }

    export class Strategy extends PassportStrategy {
    constructor(options: StrategyOptions, verify?: (payload: any, done: Function) => void);
    }

    export const ExtractJwt: {
    fromAuthHeaderAsBearerToken(): JwtFromRequestFunction;
    };
}
