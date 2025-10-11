import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { User } from '../entities/user.entity';
import { RefreshToken } from '../entities/refresh-token.entity';

interface Tokens {
    accessToken: string;
    refreshToken: string;
}

@Injectable()
export class AuthService {
    constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(RefreshToken)
    private readonly refreshRepo: Repository<RefreshToken>,

    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    ) {}

    async register(email: string, username: string, password: string): Promise<Tokens> {
    const existing = await this.userRepo.findOne({ where: [{ email }, { username }] });
    if (existing) throw new BadRequestException('User already exists');

    const hashed = await bcrypt.hash(password, 10);
    const user = this.userRepo.create({ email, username, password: hashed });
    await this.userRepo.save(user);

    return this.generateTokens(user);
    }

    async login(email: string, password: string): Promise<Tokens> {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokens(user);
    }

    private async generateTokens(user: User): Promise<Tokens> {
    const payload = { sub: user.id, username: user.username };

    const accessToken = this.jwtService.sign(payload);

    const refreshToken = await this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRES_IN'),
    });

    const refreshEntity = this.refreshRepo.create({
        token: refreshToken,
        user,
    });

    await this.refreshRepo.save(refreshEntity);

    return { accessToken, refreshToken };
    }

    async refresh(refreshToken: string): Promise<Tokens> {
    const stored = await this.refreshRepo.findOne({
        where: { token: refreshToken },
        relations: ['user'],
    });

    if (!stored) throw new UnauthorizedException('Token invalid');

    try {
        const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_SECRET'),
        });

        return this.generateTokens(stored.user);
    } catch {
        throw new UnauthorizedException('Token expired');
    }
    }
}
