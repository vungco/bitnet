import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { privateDecrypt } from 'crypto';
import { Observable } from 'rxjs';
import { WalletRepository } from 'src/modules/database/repositories/wallet.repository';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private walletRepository: WalletRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('No authorization header found');
    }
    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer') {
      throw new UnauthorizedException('Invalid authorization type');
    }

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    try {
      const payload = await this.jwtService.verifyAsync(token);

      const wallet = await this.walletRepository.findOne({
        where: { id: payload.sub, address: payload.address },
      });

      if (!wallet) {
        throw new UnauthorizedException('User not found');
      }

      request.wallet = wallet;

      return true;
    } catch (error) {}
  }
}
