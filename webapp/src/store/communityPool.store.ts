import { defineStore } from "pinia";
import apiFactory from "@/api/factory.api";
import { StoreLogger } from "@/services/logged.service";
import { ServiceTypeEnum } from "@/services/logger/service-type.enum";
import { LogLevel } from "@/services/logger/log-level";
import { ToastsService } from "@/services/toasts/toasts.service";
import { ToastsTypeEnum } from "@/services/toasts/toasts-type.enum";
import { CommunityPoolMessage } from "@/api/communityPool.api";

const logger = new StoreLogger(ServiceTypeEnum.COMMUNITY_POOL_STORE);

export interface FundData {
  amount: string;
  depositor: string;
  timestamp: string;
  transaction_hash: string;
}

interface AmountInfo {
  denom: string;
  amount: string;
}

interface ValueObject {
  amount: AmountInfo[];
  depositor: string;
}

interface CommunityPoolState {
  messages: CommunityPoolMessage[];
  fundData: FundData[];
  lastUpdated: number;
}

const extractAmount = (value: ValueObject): string => {
  try {
    if (value?.amount && Array.isArray(value.amount) && value.amount.length > 0) {
      const firstAmount = value.amount[0];
      if (firstAmount?.amount) {
        // convert from uc4e to C4E
        const amountInUc4e = Number.parseFloat(firstAmount.amount);
        if (!Number.isNaN(amountInUc4e)) {
          const amountInC4e = amountInUc4e / 1000000;
          return amountInC4e.toString();
        }
        return firstAmount.amount; // return original value on fail
      }
    }
    return 'N/A';
  } catch (error) {
    console.error('Error extracting amount:', error);
    return 'N/A';
  }
};

const mapMessageToFundData = (message: CommunityPoolMessage): FundData => {
  if (!message?.value || typeof message.value !== 'object') {
    logger.logToConsole(LogLevel.WARNING, 'Invalid message structure:', JSON.stringify(message));
    return { amount: 'N/A', depositor: 'N/A', timestamp: 'N/A', transaction_hash: 'N/A' };
  }

  const amountValue = extractAmount(message.value);
  const amount = amountValue === 'N/A' ? 'N/A' : `${amountValue} C4E`;
  const depositor = message.value.depositor || 'N/A';
  const transaction_hash = message.transaction_hash || 'N/A';

  // extract timestamp from transaction block
  let timestamp = 'N/A';
  if (message.transaction?.block?.timestamp) {
    timestamp = message.transaction.block.timestamp;
  }

  return { amount, depositor, timestamp, transaction_hash };
};

export const useCommunityPoolStore = defineStore('communityPool', {
  state: (): CommunityPoolState => {
    return {
      messages: [],
      fundData: [],
      lastUpdated: 0,
    };
  },
  actions: {
    async fetchCommunityPoolData(lockscreen = true) {
      await apiFactory.communityPoolApi().fetchCommunityPoolData(lockscreen).then(response => {
        if (response.isSuccess() && response.data !== undefined) {
          this.messages = response.data.message;
          this.fundData = this.messages.map(mapMessageToFundData);
          this.lastUpdated = Date.now();
          logger.logToConsole(LogLevel.DEBUG, `Fetched ${this.messages.length} community pool messages`);
        } else {
          const message = 'Error fetching community pool data';
          logger.logToConsole(LogLevel.ERROR, message);
          ToastsService.getInstance().errorToast(ToastsTypeEnum.COMMUNITY_POOL, message);
        }
      });
    },
    clear() {
      this.messages = [];
      this.fundData = [];
      this.lastUpdated = 0;
    }
  },
  getters: {
    getCommunityPoolMessages(): CommunityPoolMessage[] {
      return this.messages;
    },
    getFundData(): FundData[] {
      return this.fundData;
    },
    getAmounts(): string[] {
      return this.messages.map(message => {
        if (!message?.value || typeof message.value !== 'object') {
          return 'N/A';
        }
        return extractAmount(message.value);
      });
    },
    getLastUpdated(): number {
      return this.lastUpdated;
    }
  },
});
