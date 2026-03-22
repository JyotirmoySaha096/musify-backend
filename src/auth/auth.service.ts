import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Op } from 'sequelize';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { DatabaseService } from '../database/database.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private db: DatabaseService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.db.models.User.findOne({
      where: {
        [Op.or]: [{ email: dto.email }, { username: dto.username }],
      },
    });

    if (existingUser) {
      throw new ConflictException('Email or username already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const savedUser = await this.db.models.User.create({
      id: uuidv4(),
      email: dto.email,
      username: dto.username,
      passwordHash,
      avatarUrl: null,
    });
    const token = this.generateToken(savedUser as any);

    return {
      user: {
        id: (savedUser as any).id,
        email: (savedUser as any).email,
        username: (savedUser as any).username,
      },
      accessToken: token,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.db.models.User.findOne({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, (user as any).passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken(user as any);

    return {
      user: {
        id: (user as any).id,
        email: (user as any).email,
        username: (user as any).username,
      },
      accessToken: token,
    };
  }

  async getProfile(userId: string) {
    const user = await this.db.models.User.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException();
    }

    return {
      id: (user as any).id,
      email: (user as any).email,
      username: (user as any).username,
      avatarUrl: (user as any).avatarUrl,
      createdAt: (user as any).createdAt,
    };
  }

  private generateToken(user: any): string {
    return this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });
  }
}
