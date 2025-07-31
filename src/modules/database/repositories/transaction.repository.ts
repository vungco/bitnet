import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionEntity } from '../entities/transaction.entity';
import { Repository } from 'typeorm';
import { TransactionCreateDto } from 'src/modules/api/dtos/transaction.dto';

@Injectable()
export class TransactionRepository {
  constructor(
    @InjectRepository(TransactionEntity)
    private transactionRepo: Repository<TransactionEntity>,
  ) {}

  async find(
    page: number,
    limit: number,
    order: 'DESC' | 'ASC',
    id?: number,
  ): Promise<{
    total: number;
    items: TransactionEntity[];
  }> {
    const [data, total] = await this.transactionRepo.findAndCount({
      where: id ? { id: id } : {},
      skip: (page - 1) * limit,
      take: limit,
      order: {
        id: order,
      },
    });
    return {
      total,
      items: data,
    };
  }

  async findById(_id: number): Promise<TransactionEntity> {
    return await this.transactionRepo.findOneBy({ id: _id });
  }

  async create(
    data: TransactionCreateDto,
    walletId: number,
  ): Promise<TransactionEntity> {
    const transaction = this.transactionRepo.create({ walletId, ...data });
    return await this.transactionRepo.save(transaction);
  }

  // async update(
  //   id: number,
  //   data: TransactionUpdateDto,
  // ): Promise<TransactionEntity> {
  //   const transaction: TransactionEntity = { id, ...data };
  //   return this.transactionRepo.save(transaction);
  // }

  async delete(id: number): Promise<void> {
    await this.transactionRepo.delete(id);
  }
}
