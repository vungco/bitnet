import { Controller, Get, Param, UsePipes, ValidationPipe } from '@nestjs/common';
import { WalletService } from '../services/wallet.service';
import { Erc20TokensResponseDto, EthBalanceResponseDto, WalletAddressParamDto } from '../dtos/wallet.dto';

@Controller('api/wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get(':address/balance')
  async getEthBalance(
    @Param() params: WalletAddressParamDto,
  ): Promise<EthBalanceResponseDto> {
    return this.walletService.getEthBalance(params.address);
  }

  @Get(':address/tokens')
  async getErc20Tokens(
    @Param() params: WalletAddressParamDto,
  ): Promise<Erc20TokensResponseDto> {
    return this.walletService.getErc20Tokens(params.address);
  }
}
