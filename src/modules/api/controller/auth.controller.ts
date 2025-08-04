import { Body, Controller, Post } from '@nestjs/common';
import { CreateWalletDto, WalletDto } from '../dtos/wallet.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';

@ApiTags('auth')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiBody({ type: CreateWalletDto })
  @ApiOperation({ summary: 'login application' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 404, description: 'Login fail' })
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
