import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { WalletEntity } from './wallet.entity';

@Entity('transactions')
export class TransactionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  walletId: number;

  @Column()
  blockNumber: string;

  @Column()
  timeStamp: string;

  @Column()
  hash: string;

  @Column()
  from: string;

  @Column()
  to: string;

  @Column()
  value: string;

  @Column()
  gasPrice: string;

  @Column()
  gasUsed: string;

  @Column()
  input: string;

  @Column()
  isError: string;

  @Column()
  txreceipt_status: string;

  @ManyToOne(() => WalletEntity, (wallet) => wallet.transactions)
  @JoinColumn({ name: 'walletId' })
  wallet: WalletEntity;
}
