import { BadRequestException, Injectable } from "@nestjs/common";
import { Contract, ethers, EtherscanProvider } from "ethers";
import { ERC20_ABI } from "src/blockchain/abis/erc20.abi";

Injectable()
export class Web3Service {
    constructor(private provider = new ethers.InfuraProvider("sepolia",process.env.RPC_URL)) {}

    async getTokenBalance (address: string, tokenAddress : string) : Promise<string> {
        try {
            const token = new Contract(tokenAddress,ERC20_ABI,this.provider);            
            return token.balanceOf(address);
        } catch (error) {
            throw new BadRequestException("lấy dữ liệu thất bại")
        }
    }

    async getTokensymbol ( tokenAddress : string) : Promise<string> {
        try {
            const token = new Contract(tokenAddress,ERC20_ABI,this.provider);
            return token.symbol();
        } catch (error) {
            throw new BadRequestException("lấy dữ liệu thất bại")
        }
    }

    async getTokendecimals (tokenAddress : string) : Promise<number> {
        try {
            const token = new Contract(tokenAddress,ERC20_ABI,this.provider);
            return token.decimals();

        } catch (error) {
            throw new BadRequestException("lấy dữ liệu thất bại")
        }
    }
}