import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User, UserDocument } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async loginUser(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email }).select('+password');
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(
      password || '',
      user.password || '',
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const jwtPayload = {
      email: user.email,
      role: user.role,
    };

    const secret =
      this.configService.get<string>('JWT_SECRET') || 'real_estate';
    const expiresIn =
      this.configService.get<string>('EXPIRES_IN') || '30d';

    const token = this.jwtService.sign(jwtPayload, {
      secret,
      expiresIn: expiresIn as any,
    });

    return {
      success: true,
      message: 'Login successful',
      token,
    };
  }

  async registerUser(createUserDto: CreateUserDto) {
    await this.usersService.createUserIntoDB(createUserDto);
    return {
      success: true,
      message: 'User registered successfully',
    };
  }
}
