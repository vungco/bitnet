import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TransactionEntity } from './transaction.entity';

@Entity('wallets')
export class WalletEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  address: string;

  // @OneToMany(() => User_tokenEntity,(ut) => ut.user)
  // user_tokens : User_tokenEntity[];

  @OneToMany(() => TransactionEntity, (tx) => tx.wallet)
  transactions: TransactionEntity[];
}
