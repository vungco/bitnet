import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEthereumAddress, IsNotEmpty, IsString } from 'class-validator';

export class WalletAddressParamDto {
  @ApiPropertyOptional()
  @IsEthereumAddress()
  address: string;
}

export class EthBalanceResponseDto {
  balance: number;
}

export class Erc20TokenDto {
  tokenAddress: string;
  addressGetPrice: string;
  name: string;
  image: string;
  symbol: string;
  decimals: number;
  balance: number;
}

export class Erc20TokensResponseDto {
  items: Erc20TokenDto[];
}

export class CreateWalletDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  address: string;
}

export class UpdateWalletDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  address: string;
}

export class WalletDto {
  id: number;

  address: string;
}
