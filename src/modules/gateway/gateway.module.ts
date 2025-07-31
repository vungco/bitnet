import { Module } from '@nestjs/common';
import { TransactionGateWay } from './transaction.gateway';

@Module({
  providers: [TransactionGateWay],
  exports: [TransactionGateWay],
})
export class GateWayModule {}
