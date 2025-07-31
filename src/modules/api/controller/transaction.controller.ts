import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  EstimateGasDto,
  EstimateGasTokenDto,
  EstimateResponseDto,
  PaginationQueryDto,
  TransactionCreateDto,
  TransactionDto,
} from '../dtos/transaction.dto';
import { TransactionService } from 'src/modules/database/services/transaction.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';

@ApiTags('transaction')
@UseGuards(AuthGuard)
@ApiBearerAuth('access-token')
@Controller('api/transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @ApiParam({ name: 'address', type: String })
  @Get('address/:address')
  async getTransaction(
    @Param('address') address: string,
    @Query() query: PaginationQueryDto,
  ): Promise<{
    total: number;
    items: TransactionDto[];
    lastPage: number;
  }> {
    const { total, items, lastPage } =
      await this.transactionService.getTransactions(address, query);
    return {
      total,
      items,
      lastPage,
    };
  }

  @ApiBody({ type: EstimateGasDto })
  @Post('estimate')
  async getEstimateGas(
    @Body() body: EstimateGasDto,
  ): Promise<EstimateResponseDto> {
    return await this.transactionService.getEstimateGas(body);
  }

  @ApiBody({ type: EstimateGasTokenDto })
  @Post('estimate/token')
  async getEstimateTokenGas(
    @Body() body: EstimateGasTokenDto,
  ): Promise<EstimateResponseDto> {
    return await this.transactionService.estimateTokenTransfer(body);
  }

  @ApiQuery({ type: PaginationQueryDto })
  @Get()
  async getTransactionsLocal(@Query() query: PaginationQueryDto): Promise<{
    total: number;
    items: TransactionDto[];
    lastPage: number;
  }> {
    return await this.transactionService.find(query);
  }

  @ApiParam({ name: 'id', type: Number })
  @Get(':id')
  async getTransactionById(@Param('id') id: number): Promise<{
    items: TransactionDto;
  }> {
    const tx = await this.transactionService.findById(id);
    return {
      items: tx,
    };
  }

  @ApiBody({ type: TransactionCreateDto })
  @Post()
  async create(
    @Body() data: TransactionCreateDto,
    @Request() req: any,
  ): Promise<{
    items: TransactionDto;
  }> {
    const tx = await this.transactionService.create(data, req.wallet.id);
    return {
      items: tx,
    };
  }

  @ApiParam({ name: 'id', type: Number })
  @Delete(':id')
  async delete(@Param('id') id: number) {
    await this.transactionService.delete(id);
  }
}
