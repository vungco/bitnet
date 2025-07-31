import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { WalletExternalService } from '../services/walletExternal.service';
import {
  CreateWalletDto,
  Erc20TokensResponseDto,
  EthBalanceResponseDto,
  WalletAddressParamDto,
  WalletDto,
} from '../dtos/wallet.dto';
import { RedisService } from 'src/redis/redis.service';
import { PaginationQueryDto, TransactionDto } from '../dtos/transaction.dto';
import { TransactionService } from 'src/modules/database/services/transaction.service';
import { WalletService } from 'src/modules/database/services/wallet.service';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';

@UseGuards(AuthGuard)
@ApiTags('wallet')
@ApiBearerAuth('access-token')
@Controller('api/wallet')
export class WalletController {
  private cacheKeyToken: string;
  constructor(
    private readonly walletExternalService: WalletExternalService,
    private readonly walletService: WalletService,
    private readonly redisService: RedisService,
    private readonly transactionService: TransactionService,
  ) {
    this.cacheKeyToken = 'token:all';
  }

  @ApiParam({ name: 'address', type: String })
  @Get(':address/balance')
  async getEthBalance(
    @Param() params: WalletAddressParamDto,
  ): Promise<EthBalanceResponseDto> {
    return this.walletExternalService.getEthBalance(params.address);
  }

  @ApiParam({ name: 'address', type: String })
  @Get(':address/tokens')
  async getErc20Tokens(
    @Param() params: WalletAddressParamDto,
  ): Promise<Erc20TokensResponseDto> {
    const redistoken = await this.redisService.get(this.cacheKeyToken);
    if (redistoken) {
      const parse: Erc20TokensResponseDto = JSON.parse(redistoken);
      return parse;
    }

    const tokenRp = await this.walletExternalService.getErc20Tokens(
      params.address,
    );

    await this.redisService.set(this.cacheKeyToken, tokenRp, 60);

    return tokenRp;
  }

  @ApiQuery({ type: PaginationQueryDto })
  @Get('transactions')
  async getTransactionByWallet(
    @Request() req: any,
    @Query() query: PaginationQueryDto,
  ): Promise<{
    total: number;
    items: TransactionDto[];
    lastPage: number;
  }> {
    return await this.transactionService.find(query, req.walletId);
  }
}
