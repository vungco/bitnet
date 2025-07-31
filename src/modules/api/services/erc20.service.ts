import { BadRequestException, Injectable } from '@nestjs/common';
import { Contract, ethers } from 'ethers';
import { ERC20_ABI } from 'src/modules/blockchain/abis/erc20.abi';

Injectable();
export class Erc20Service {
  constructor(
    private provider = new ethers.InfuraProvider(
      'sepolia',
      process.env.RPC_URL,
    ),
  ) {}

  async getTokenBalance(
    address: string,
    tokenAddress: string,
  ): Promise<string> {
    try {
      const token = new Contract(tokenAddress, ERC20_ABI, this.provider);
      return await token.balanceOf(address);
    } catch (error) {
      throw new BadRequestException('lấy dữ liệu thất bại');
    }
  }

  async getTokensymbol(tokenAddress: string): Promise<string> {
    try {
      const token = new Contract(tokenAddress, ERC20_ABI, this.provider);
      return await token.symbol();
    } catch (error) {
      throw new BadRequestException('lấy dữ liệu thất bại');
    }
  }

  async getTokendecimals(tokenAddress: string): Promise<number> {
    try {
      const token = new Contract(tokenAddress, ERC20_ABI, this.provider);
      return await token.decimals();
    } catch (error) {
      throw new BadRequestException('lấy dữ liệu thất bại');
    }
  }

  async transferToken(
    tokenAddress: string,
    to: string,
    signer: any,
    amount: string,
  ): Promise<boolean> {
    try {
      const contract = new Contract(tokenAddress, ERC20_ABI, signer);
      const tx = await contract.transfer(to, ethers.parseEther(amount));
      await tx.wait();

      return true;
    } catch (error) {
      console.error('Transfer failed:', error);

      return false;
    }
  }
}
