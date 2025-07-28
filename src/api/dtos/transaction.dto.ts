import { IsEthereumAddress, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class WalletAddressParamDto {
    @IsEthereumAddress()
    address: string;
}

export class EstimateGasDto {
  @IsString()
  from: string;

  @IsString()
  to: string;

  @IsString()
  @IsOptional()
  value?: string; // Wei dưới dạng hex hoặc decimal string
}

export class EstimateGasTokenDto {
  @IsString()
  from: string;

  @IsString()
  to: string;

  @IsString()
  @IsNotEmpty()
  amount: string; // Wei or ETH depending on type

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
    items : TransactionDto[]
}

export class EstimateResponseDto {
    gas : number
}
