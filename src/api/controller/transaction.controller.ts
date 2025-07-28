import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { TransactionService } from "../services/transaction.service";
import { EstimateGasDto, EstimateGasTokenDto, EstimateResponseDto, TransactionResponseDto, WalletAddressParamDto } from "../dtos/transaction.dto";

@Controller("api/transactions")
export class TransactionController {
    constructor(private readonly transactionService : TransactionService) {}

    @Get(":address")
    async getTransaction(@Param() param : WalletAddressParamDto) : Promise<TransactionResponseDto> {
        return this.transactionService.getTransactions(param.address)
    }

    @Post("estimate")
    async getEstimateGas(@Body() body : EstimateGasDto) : Promise<EstimateResponseDto>{
        return this.transactionService.getEstimateGas(body);
    }

    @Post("estimate/token")
    async getEstimateTokenGas(@Body() body : EstimateGasTokenDto) : Promise<EstimateResponseDto>{
        return this.transactionService.estimateTokenTransfer(body);
    }
}