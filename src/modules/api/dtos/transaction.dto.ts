import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEthereumAddress,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class WalletAddressParamDto {
  @IsEthereumAddress()
  address: string;
}

export class EstimateGasDto {
  @ApiProperty({ example: '0x821647428812222' })
  @IsString()
  from: string;

  @ApiProperty({ example: '0x821647428812222' })
  @IsString()
  to: string;

  @ApiProperty({ example: '0.01' })
  @IsString()
  @IsOptional()
  value?: string; // Wei dưới dạng hex hoặc decimal string
}

export class EstimateGasTokenDto {
  @ApiProperty({ example: '0x821647428812222' })
  @IsString()
  from: string;

  @ApiProperty({ example: '0x821647428812222' })
  @IsString()
  to: string;

  @ApiProperty({ example: '0.001' })
  @IsString()
  @IsNotEmpty()
  amount: string; // Wei or ETH depending on type

  @ApiProperty({ example: '0x821647428812222' })
  @IsOptional()
  @IsString()
  recipient?: string; // only for ERC20
}

export class TransactionDto {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  from: string;
  to: string;
  value: string;
  gasPrice: string;
  gasUsed: string;
  input: string;
  isError: string;
  txreceipt_status: string;
}

export class TransactionResponseDto {
  items: TransactionDto[];
}

export class EstimateResponseDto {
  gas: number;
}

export class TransactionCreateDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  blockNumber: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  timeStamp: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  hash: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  from: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  to: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  value: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  gasPrice: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  gasUsed: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  input: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  isError: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  txreceipt_status: string;
}

// export class TransactionUpdateDto extends TransactionCreateDto {}
export class PaginationQueryDto {
  @ApiPropertyOptional()
  order?: 'DESC' | 'ASC';

  @ApiPropertyOptional()
  page?: number;

  @ApiPropertyOptional()
  limit?: number;
}
