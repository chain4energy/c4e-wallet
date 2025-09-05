import { useConfigurationStore } from '@/store/configuration.store';

interface Transaction {
  messages: unknown;
  success: boolean;
  block?: {
    timestamp: string;
    height: string;
  };
}

interface AmountInfo {
  denom: string;
  amount: string;
}

interface ValueObject {
  amount: AmountInfo[];
  depositor: string;
}

interface CommunityPoolMessage {
  transaction_hash: string;
  value: ValueObject;
  transaction: Transaction;
}

interface CommunityPoolData {
  message: CommunityPoolMessage[];
}

interface FundData {
  amount: string;
  depositor: string;
  timestamp: string;
}

interface GraphQLError {
  message: string;
}

interface GraphQLResponse {
  data?: {
    message: CommunityPoolMessage[];
  };
  errors?: GraphQLError[];
}

/*
{"query":"queryFundCommunityPool { message(where: {type: {_eq: \"cosmos.distribution.v1beta1.MsgFundCommunityPool\"}, transaction: {success: {_eq: true}}}){transaction_hash value transaction {messages success block {timestamp height} } }}"}
*/
// query looks for successful MsgFundCommunityPool messages only
const graphqlQuery = {
  query: `
    query queryFundCommunityPool {
      message(where: {
        type: {_eq: "cosmos.distribution.v1beta1.MsgFundCommunityPool"},
        transaction: {success: {_eq: true}}
      }) {
        transaction_hash
        value
        transaction {
          messages
          success
          block {
            timestamp
            height
          }
        }
      }
    }
  `
};

const extractAmount = (value: ValueObject): string => {
  try {
    if (value && value.amount && Array.isArray(value.amount) && value.amount.length > 0) {
      const firstAmount = value.amount[0];
      if (firstAmount && firstAmount.amount) {
        // convert from uc4e to C4E
        const amountInUc4e = parseFloat(firstAmount.amount);
        if (!isNaN(amountInUc4e)) {
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

export const fetchCommunityPoolData = async (): Promise<CommunityPoolData> => {
  const configStore = useConfigurationStore();
  const hasuraURL = configStore.config?.hasuraURL;

  if (!hasuraURL) {
    throw new Error('hasuraURL not configured');
  }

  const response = await fetch(`${hasuraURL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(graphqlQuery)
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: GraphQLResponse = await response.json();
  console.log('Raw GraphQL Response:', data);

  if (data.errors) {
    throw new Error(data.errors.map((err: GraphQLError) => err.message).join(', '));
  }

  if (!data.data) {
    throw new Error('No data received from GraphQL endpoint');
  }

  if (!data.data.message) {
    throw new Error('message array is undefined in response');
  }

  if (!Array.isArray(data.data.message)) {
    throw new Error('message is not an array in response');
  }

  return { message: data.data.message };
};

export const getCommunityPoolAmounts = async (): Promise<string[]> => {
  try {
    const data = await fetchCommunityPoolData();

    if (!data || !data.message || !Array.isArray(data.message)) {
      console.warn('Invalid data structure received:', data);
      return [];
    }

    return data.message.map(message => {
      if (!message || !message.value || typeof message.value !== 'object') {
        console.warn('Invalid message structure:', message);
        return 'N/A';
      }
      return extractAmount(message.value);
    });
  } catch (error) {
    console.error('Error in getCommunityPoolAmounts:', error);
    throw error;
  }
};

export const getCommunityPoolFundData = async (): Promise<FundData[]> => {
  try {
    const data = await fetchCommunityPoolData();

    if (!data || !data.message || !Array.isArray(data.message)) {
      console.warn('Invalid data structure received:', data);
      return [];
    }

    return data.message.map(message => {
      if (!message || !message.value || typeof message.value !== 'object') {
        console.warn('Invalid message structure:', message);
        return { amount: 'N/A', depositor: 'N/A', timestamp: 'N/A' };
      }

      const amountValue = extractAmount(message.value);
      const amount = amountValue !== 'N/A' ? `${amountValue} C4E` : 'N/A';
      const depositor = message.value.depositor || 'N/A';

      // extract timestamp from transaction block
      let timestamp = 'N/A';
      if (message.transaction && message.transaction.block && message.transaction.block.timestamp) {
        timestamp = message.transaction.block.timestamp;
      }

      return { amount, depositor, timestamp };
    });
  } catch (error) {
    console.error('Error in getCommunityPoolFundData:', error);
    throw error;
  }
};

export type { CommunityPoolData, CommunityPoolMessage, FundData };
