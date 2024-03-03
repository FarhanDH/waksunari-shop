import { Injectable, UnauthorizedException } from "@nestjs/common";
import { LoginDto } from "./dto/login.dto";
import { JwtService } from "@nestjs/jwt";
import { compare } from "bcrypt";
import { UsersService } from "../users/users.service";
import { config } from "~/lib/config";

const EXPIRE_TIME = 1000 * 60 * 60 * 5;

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async loginUser(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto);
    const payload = {
      id: user._id,
      username: user.username,
      sub: {
        name: user.fullName,
      },
    };

    return {
      user,
      jwtTokens: {
        accessToken: await this.jwtService.signAsync(payload, {
          expiresIn: "5h",
          secret: config().secrets.jwt,
        }),
        expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
      },
    };
  }

  async validateUser(loginDto: LoginDto) {
    const user = (
      await this.usersService.findByEmail(loginDto.email)
    ).toObject();
    if (user && (await compare(loginDto.password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...result } = user;
      return result;
    }
    throw new UnauthorizedException("Invalid credentials");
  }
}
