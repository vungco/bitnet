import { BadRequestException, Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import {
  Erc20TokenDto,
  Erc20TokensResponseDto,
  EthBalanceResponseDto,
} from '../dtos/wallet.dto';
import { Erc20Service } from './erc20.service';

@Injectable()
export class WalletExternalService {
  private provider: ethers.JsonRpcProvider;

  constructor(private readonly web3Service: Erc20Service) {
    this.provider = new ethers.InfuraProvider(
      'sepolia',
      process.env.INFURA_API_KEY,
    ); // hoặc Alchemy
  }

  async getEthBalance(address: string): Promise<EthBalanceResponseDto> {
    try {
      const balanceInWei = await this.provider.getBalance(address);
      const balanceInEth = ethers.formatEther(balanceInWei);
      return {
        balance: Number(balanceInEth),
      };
    } catch (error) {
      throw new BadRequestException('có lỗi trong quá trình thực hiện');
    }
  }

  async getErc20Tokens(address: string): Promise<Erc20TokensResponseDto> {
    const result: Erc20TokenDto[] = [];

    for (const token of FIXED_TOKENS) {
      const tokenAddress = token.address;
      const name = token.name;
      const image = token.image;

      try {
        const [balanceOf, symbol, decimals] = await Promise.all([
          this.web3Service.getTokenBalance(address, tokenAddress),
          this.web3Service.getTokensymbol(tokenAddress),
          this.web3Service.getTokendecimals(tokenAddress),
        ]);

        result.push({
          tokenAddress,
          addressGetPrice: token.addressGetPrice,
          name,
          balance: Number(balanceOf),
          symbol,
          decimals: Number(decimals),
          image,
        });
      } catch (err) {
        console.warn(
          ` Không lấy được dữ liệu token: ${tokenAddress} - ${name}: ${err?.message || err}`,
        );
        continue;
      }
    }

    return { items: result };
  }
}

const FIXED_TOKENS = [
  {
    name: 'tDAI',
    address: '0x53844F9577C2334e541Aec7Df7174ECe5dF1fCf0',
    addressGetPrice: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCE8Lgbhy4J9u-j0UgoXNIF_wC9XM0QPVi2w&s',
  },
  {
    name: 'LINK',
    address: '0x779877A7B0D9E8603169DdbD7836e478b4624789',
    addressGetPrice: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
    image: 'https://s2.coinmarketcap.com/static/img/coins/200x200/1975.png',
  },
  {
    name: 'USDT',
    address: '0x523C8591Fbe215B5aF0bEad65e65dF783A37BCBC',
    addressGetPrice: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    image: 'https://s2.coinmarketcap.com/static/img/coins/200x200/825.png',
  },
];
