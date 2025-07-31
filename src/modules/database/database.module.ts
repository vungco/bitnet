import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfig } from './config';
import { TransactionEntity } from './entities/transaction.entity';
import { TransactionRepository } from './repositories/transaction.repository';
import { TransactionService } from './services/transaction.service';
import { WalletEntity } from './entities/wallet.entity';
import { WalletRepository } from './repositories/wallet.repository';
import { WalletService } from './services/wallet.service';

const entities = [TransactionEntity, WalletEntity];
const repositories = [TransactionRepository, WalletRepository];
const services = [TransactionService, WalletService];

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfig,
    }),
    TypeOrmModule.forFeature([TransactionEntity, WalletEntity]),
  ],
  controllers: [],
  providers: [...entities, ...repositories, ...services],
  exports: [...entities, ...repositories, ...services],
})
export class DatabaseModule {}
