import { Module } from '@nestjs/common';
import { WalletController } from './controller/wallet.controller';
import { TransactionController } from './controller/transaction.controller';
import { WalletService } from './services/wallet.service';
import { Web3Service } from './services/web3.service';
import { HttpModule } from '@nestjs/axios';
import { TransactionService } from './services/transaction.service';


@Module({
  imports: [HttpModule],
  controllers: [WalletController,TransactionController],
  providers: [WalletService,Web3Service,TransactionService],
})
export class ApiModule {}
