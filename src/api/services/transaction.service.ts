import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { EstimateGasDto, EstimateGasTokenDto, EstimateResponseDto, TransactionResponseDto } from "../dtos/transaction.dto";
import axios from "axios";
import { ethers } from "ethers";
import { ERC20_ABI } from "src/blockchain/abis/erc20.abi";

@Injectable()
export class TransactionService {
    private ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;    
    private ETHERSCAN_BASE_URL = process.env.ETHERSCAN_BASE_URL;
    private provider = new ethers.InfuraProvider('sepolia', process.env.INFURA_API_KEY); // hoặc Alchemy

    async getTransactions(address : string) : Promise<TransactionResponseDto>{
        try {
            const txs = await axios.get(this.ETHERSCAN_BASE_URL,{
                params: {
                module: 'account',
                action: 'txlist',
                address,
                startblock: 0,
                endblock: 99999999,
                sort: 'desc',
                apikey: this.ETHERSCAN_API_KEY,
                },
            })

            return txs.data.result;
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch transaction history');
        }
    }

    async getEstimateGas(body : EstimateGasDto) : Promise<EstimateResponseDto> {
        try {
            const tx : EstimateGasDto = {
                from : body.from,
                to : body.to,
            }
            if (body.value) {
                tx.value = ethers.parseEther(body.value).toString();
            }

            const gasFee = await this.provider.estimateGas(tx);
            return {
                gas : Number(gasFee)
            }
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch estimataGasFee');
        }
    }

    async estimateTokenTransfer(body : EstimateGasTokenDto) {
        const contract = new ethers.Contract(body.to, ERC20_ABI, this.provider);

        const data = contract.interface.encodeFunctionData('transfer', [body.recipient, ethers.parseEther(body.amount.toString())]);

        const tx = {
        from : body.from,
        to: body.to,
        data,
        };

        const gas = await this.provider.estimateGas(tx);
        return { gas: Number(gas) };
    }
}