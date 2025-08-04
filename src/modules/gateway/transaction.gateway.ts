import {
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ethers } from 'ethers';
import pLimit = require('p-limit');
import { Server, Socket } from 'socket.io';

export enum WsEvent {
  TransactionChanged = 'transaction:changed',
}

interface Transaction {
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

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class TransactionGateWay implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  private provider: ethers.WebSocketProvider;
  private clientAddressMap: Map<string, string> = new Map();

  handleConnection(client: Socket) {
    console.log(`🔌 Client connected: ${client.id}`);
  }

  //client gửi address lên khi kết nối
  @SubscribeMessage('register_wallet')
  handleRegisterAddress(
    @MessageBody() address: any,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('connect ......');

    if (ethers.isAddress(address)) {
      this.clientAddressMap.set(client.id, address.toLocaleLowerCase());
      console.log(`Client ${client.id} theo dõi ví ${address}`);
    } else {
      client.emit('error', { message: 'Invalid Ethereum address' });
    }
  }

  handleDisconnect(client: Socket) {
    this.clientAddressMap.delete(client.id);
    console.log('Client Disconnected ', client.id);
  }

  afterInit(server: any) {
    // this.initBlockchainListener();
  }

  private initBlockchainListener(retry = 0) {
    try {
      this.provider = new ethers.WebSocketProvider(
        process.env.RPC_URLWebSocket!,
      );

      this.provider.on('block', async (blockNumber) => {
        console.log(`📦 New block: ${blockNumber}`);

        let block;
        try {
          block = await this.provider.getBlock(blockNumber);
        } catch (error) {
          console.error('❌ Failed to fetch block:', error);
          return;
        }

        if (!block?.transactions || block.transactions.length === 0) return;

        const limit = pLimit(5);

        await Promise.allSettled(
          block.transactions.map((txhash) =>
            limit(() => this.handleTransaction(txhash, block.timestamp)),
          ),
        );
      });

      this.provider.on('error', (error) => {
        console.error('💥 WebSocket provider error:', error);
        this.reconnectListener(retry);
      });
    } catch (error) {
      console.error(`❌ Blockchain listener error (retry ${retry}):`, error);
      setTimeout(() => this.initBlockchainListener(retry + 1), 3000);
    }
  }

  private async handleTransaction(txhash: string, timestamp: number) {
    try {
      const receipt = await this.waitForReceiptWithRetry(txhash, 5, 1000);
      if (!receipt || receipt.status !== 1) return;

      const tx = await this.provider.getTransaction(txhash);
      if (!tx) return;

      const from = tx.from?.toLowerCase();
      const to = tx.to?.toLowerCase();

      const txEvent = {
        hash: tx.hash,
        from,
        to,
        value: ethers.formatEther(tx.value),
        blockNumber: receipt.blockNumber,
        timestamp,
        status: 'confirmed',
      };

      for (const [clientId, address] of this.clientAddressMap.entries()) {
        if (from === address || to === address) {
          this.server.to(clientId).emit(WsEvent.TransactionChanged, txEvent);
          console.log('📤 Sent txEvent to client:', clientId);
        }
      }
    } catch (error) {
      console.warn(`⚠️ Error handling tx ${txhash}:`, error.message);
    }
  }

  // ⚙️ Helper function: retry wrapper
  private async waitForReceiptWithRetry(
    txHash: string,
    retries = 5,
    delay = 1000,
  ): Promise<ethers.TransactionReceipt | null> {
    for (let i = 0; i < retries; i++) {
      try {
        const receipt = await this.provider.getTransactionReceipt(txHash);
        if (receipt) return receipt;
      } catch (err) {
        // thường gặp: internal error
        console.warn(`🔁 Retry ${i + 1} for receipt ${txHash}: ${err.message}`);
      }
      await new Promise((res) => setTimeout(res, delay));
    }
    return null;
  }

  private reconnectListener(retry = 0) {
    console.log(`♻️ Reconnecting blockchain listener... (retry ${retry})`);
    setTimeout(() => this.initBlockchainListener(retry + 1), 3000);
  }
}
