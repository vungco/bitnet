import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { TransactionRepository } from '../repositories/transaction.repository';
import { TransactionEntity } from '../entities/transaction.entity';
import {
  EstimateGasDto,
  EstimateGasTokenDto,
  EstimateResponseDto,
  PaginationQueryDto,
  TransactionCreateDto,
  TransactionDto,
} from 'src/modules/api/dtos/transaction.dto';
import { ethers } from 'ethers';
import { ERC20_ABI } from 'src/modules/blockchain/abis/erc20.abi';
import axios from 'axios';

@Injectable()
export class TransactionService {
  private ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
  private ETHERSCAN_BASE_URL = process.env.ETHERSCAN_BASE_URL;
  private provider = new ethers.InfuraProvider(
    'sepolia',
    process.env.INFURA_API_KEY,
  ); // hoặc Alchemy

  constructor(private transactionRepo: TransactionRepository) {}

  async find(
    query: PaginationQueryDto,
    id?: number,
  ): Promise<{
    total: number;
    items: TransactionEntity[];
    lastPage: number;
  }> {
    const order = query?.order ? query.order : 'DESC';
    const page = query?.page ? query.page : 1;
    const limit = query?.limit ? query.limit : 10;
    const { total, items } = await this.transactionRepo.find(
      page,
      limit,
      order,
      id,
    );
    return {
      total,
      items,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findById(id: number): Promise<TransactionEntity> {
    const transaction = this.transactionRepo.findById(id);
    if (!transaction) {
      throw new NotFoundException(`transaction with ${id} notfound`);
    }
    return transaction;
  }

  async create(
    data: TransactionCreateDto,
    walletId: number,
  ): Promise<TransactionEntity> {
    const tx = await this.transactionRepo.create(data, walletId);
    if (!tx) {
      throw new InternalServerErrorException('Failed to create transaction');
    }
    return tx;
  }

  // async update(id:number , data): Promise<TransactionEntity> {
  //   return;
  // }

  async delete(id: number): Promise<void> {
    await this.transactionRepo.delete(id);
  }

  async getTransactions(
    address: string,
    query: PaginationQueryDto,
  ): Promise<{
    total: number;
    items: TransactionDto[];
    lastPage: number;
  }> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    try {
      const txs = await axios.get(this.ETHERSCAN_BASE_URL, {
        params: {
          module: 'account',
          action: 'txlist',
          address,
          startblock: 0,
          endblock: 99999999,
          sort: 'desc',
          apikey: this.ETHERSCAN_API_KEY,
          page: page,
          offset: limit,
        },
      });
      const total = txs.data.result.length;

      return {
        total,
        items: txs.data.result,
        lastPage: Math.ceil(total / limit),
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to fetch transaction history',
      );
    }
  }

  async getEstimateGas(body: EstimateGasDto): Promise<EstimateResponseDto> {
    try {
      const tx: EstimateGasDto = {
        from: body.from,
        to: body.to,
      };
      if (body.value) {
        tx.value = ethers.parseEther(body.value).toString();
      }

      const gasFee = await this.provider.estimateGas(tx);
      return {
        gas: Number(gasFee),
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch estimataGasFee');
    }
  }

  async estimateTokenTransfer(body: EstimateGasTokenDto) {
    const contract = new ethers.Contract(body.to, ERC20_ABI, this.provider);

    const data = contract.interface.encodeFunctionData('transfer', [
      body.recipient,
      ethers.parseEther(body.amount.toString()),
    ]);

    const tx = {
      from: body.from,
      to: body.to,
      data,
    };

    const gas = await this.provider.estimateGas(tx);
    return { gas: Number(gas) };
  }
}
