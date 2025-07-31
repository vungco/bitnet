import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { WalletService } from 'src/modules/database/services/wallet.service';
import { CreateWalletDto, WalletDto } from '../dtos/wallet.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';

@ApiTags('auth')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiBody({ type: CreateWalletDto })
  async login(@Body() body: CreateWalletDto): Promise<{
    access_token: string;
    items: WalletDto;
  }> {
    const { access_token, items } = await this.authService.connect(body);
    return {
      access_token,
      items,
    };
  }
}
