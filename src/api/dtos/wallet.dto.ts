import { IsEthereumAddress } from 'class-validator';

export class WalletAddressParamDto {
  @IsEthereumAddress()
  address: string;
}

export class EthBalanceResponseDto {
  balance: number;
}

export class Erc20TokenDto {
  tokenAddress: string;
  name : string;
  image : string
  symbol: string;
  decimals: number;
  balance: number;
}

export class Erc20TokensResponseDto {
  items: Erc20TokenDto[];
}
