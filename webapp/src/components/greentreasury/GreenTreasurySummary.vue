<template>
  <div class="green-treasury-container">
    <div class="community-pool-chart-section">
      <div v-if="chartLoading" class="loading">
        {{$t("GREENTREASURYVIEW.LOADING_CHART")}}
      </div>

      <div v-else-if="chartError" class="error">
        {{ $t("GREENTREASURYVIEW.CHART_ERROR") }}: {{ chartError }}
      </div>

      <div v-else-if="chartData" class="chart-container">
        <div class="horizontal-chart-container">
          <div class="chart-title">{{$t("GREENTREASURYVIEW.COMMUNITY_POOL_DISTRIBUTION") }}</div>

          <div class="progress-bar-container">
            <div class="progress-bar">
              <div
                class="progress-segment funded"
                :style="{ width: fundedPercentage + '%' }"
                :title="`Funded: ${formatAmount(chartData.fundedAmount)} C4E (${fundedPercentage.toFixed(1)}%)`"
              ></div>
            </div>
          </div>

          <div class="chart-legend">
            <div class="legend-item">
              <div class="legend-info">
                <div class="legend-color funded"></div>
                <span class="legend-label">{{$t("SECTION_TITLES.GREENTREASURY")}}</span>
              </div>
              <div class="legend-values">
                <div class="legend-percentage">{{ fundedPercentage.toFixed(1) }}%</div>
                <div class="legend-amount">{{ formatAmount(chartData.fundedAmount) }} C4E</div>
              </div>
            </div>
            <div class="legend-item">
              <div class="legend-info">
                <div class="legend-color remaining"></div>
                <span class="legend-label">{{ $t("GREENTREASURYVIEW.GENERIC_COMMUNITY_POOL") }}</span>
              </div>
              <div class="legend-values">
                <div class="legend-percentage">{{ remainingPercentage.toFixed(1) }}%</div>
                <div class="legend-amount">{{ formatAmount(chartData.remainingPool) }} C4E</div>
              </div>
            </div>
          </div>

          <div class="total-info">
            <strong>{{$t("GREENTREASURYVIEW.TOTAL_COMMUNITY_POOL")}}: {{ formatAmount(chartData.totalPool) }} C4E</strong>
          </div>
        </div>
      </div>
    </div>

    <div class="community-pool-section">
      <h2>{{ $t("GREENTREASURYVIEW.GREENTREASURY_FUNDING") }}</h2>

      <div v-if="loading" class="loading">
        {{$t("GREENTREASURYVIEW.LOADING_GREEN_TREASURY")}}
      </div>

      <div v-else-if="error" class="error">
        {{$t("GREENTREASURYVIEW.ERROR")}}: {{ error }}
      </div>

      <div v-else-if="fundData.length > 0" class="community-pool-data">
        <div class="data-summary">
          <p><strong>{{$t("GREENTREASURYVIEW.TOTAL_DEPOSITS")}}:</strong> {{ fundData.length }}</p>
        </div>

        <div class="amounts-list">
          <h3></h3>
          <div class="amounts-grid" :style="gridStyle">
            <div
              v-for="(fund, index) in paginatedFundData"
              :key="index"
              class="amount-item"
            >
              <div class="amount-value">{{ formatFundAmount(fund.amount) }}</div>
              <div class="timestamp" :title="`${splitTimestamp(fund.timestamp).date} ${splitTimestamp(fund.timestamp).time}`">{{ splitTimestamp(fund.timestamp).date }}</div>
              <div
                class="transaction-hash"
                @click="openExplorer(fund.transaction_hash)"
                :title="fund.transaction_hash"
              >
                {{ shortenAddress(fund.transaction_hash) }}
              </div>
            </div>
          </div>

          <div class="pagination-controls">
            <button
              @click="goToPage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="pagination-btn"
            >
              ← {{$t("GREENTREASURYVIEW.PREVIOUS")}}
            </button>

            <div class="page-info">
              <span>{{$t("GREENTREASURYVIEW.PAGE")}} {{ currentPage }} {{$t("GREENTREASURYVIEW.OF")}} {{ totalPages }}</span>
            </div>

            <button
              @click="goToPage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="pagination-btn"
            >
              {{$t("GREENTREASURYVIEW.NEXT")}} →
            </button>
          </div>
        </div>
      </div>

      <div v-else class="no-data">
        {{$t("GREENTREASURYVIEW.NO_DATA")}}
      </div>
    </div>

    <div class="info-boxes-section">
      <div class="info-boxes-grid">
        <div class="info-box">
          <h3 class="info-box-header">{{$t("GREENTREASURYVIEW.FAQ.TITLE.TREASURY")}}</h3>
          <div class="info-box-content">
            <p v-html="$t('GREENTREASURYVIEW.FAQ.CONTENT.TREASURY1', { proposal12link: $t('GREENTREASURYVIEW.FAQ.LINKS.proposal12link') })" @click="handleContentClick"></p>
            <p>{{$t("GREENTREASURYVIEW.FAQ.CONTENT.TREASURY2")}}</p>
          </div>
        </div>

        <div class="info-box">
          <h3 class="info-box-header">{{$t("GREENTREASURYVIEW.FAQ.TITLE.COMMUNITY_POOL")}}</h3>
          <div class="info-box-content">
            <p>{{$t("GREENTREASURYVIEW.FAQ.CONTENT.COMMUNITY_POOL1")}}</p>
            <p>{{$t("GREENTREASURYVIEW.FAQ.CONTENT.COMMUNITY_POOL2")}}</p>
          </div>
        </div>

        <div class="info-box">
          <h3 class="info-box-header">{{$t("GREENTREASURYVIEW.FAQ.TITLE.FUNDING")}}</h3>
          <div class="info-box-content">
            <p>{{$t("GREENTREASURYVIEW.FAQ.CONTENT.FUNDING1")}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template><script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { calculateChartData, type CommunityPoolChartData } from '@/services/communityPoolChart.service';
import { useConfigurationStore } from '@/store/configuration.store';
import { useCommunityPoolStore } from '@/store/communityPool.store';
import { useToast } from "vue-toastification";
import i18n from "@/plugins/i18n";
import { useRouter } from 'vue-router';

const isCalculating = ref(false);
const error = ref<string | null>(null);

const configStore = useConfigurationStore();
const communityPoolStore = useCommunityPoolStore();
const explorerUrl = computed(() => configStore.config?.explorerUrl);
const router = useRouter();

// computed property that gets fund data from store
const fundData = computed(() => communityPoolStore.getFundData);
const loading = computed(() => fundData.value.length === 0);

// pagination variables
const currentPage = ref(1);
const windowWidth = ref(window.innerWidth);

// dynamic items per page based on screen width
const itemsPerPage = computed(() => {
  const width = windowWidth.value;

  // calculate based on breakpoints and available space
  if (width >= 1400) return 7;      // large screens: 7 items
  else if (width >= 1200) return 6; // desktop: 6 items
  else if (width >= 1000) return 5; // medium desktop: 5 items
  else if (width >= 800) return 4;  // tablet landscape: 4 items
  else if (width >= 600) return 3;  // tablet portrait: 3 items
  else if (width >= 400) return 2;  // mobile landscape: 2 items
  else return 1;                    // small mobile: 1 item
});

const chartLoading = ref(false);
const chartError = ref<string | null>(null);
const chartData = ref<CommunityPoolChartData | null>(null);

const fundedPercentage = computed(() => {
  if (!chartData.value) return 0;
  return (chartData.value.fundedAmount / chartData.value.totalPool) * 100;
});

const remainingPercentage = computed(() => {
  if (!chartData.value) return 100;
  return (chartData.value.remainingPool / chartData.value.totalPool) * 100;
});

// pagination computed properties
const totalPages = computed(() => {
  return Math.ceil(fundData.value.length / itemsPerPage.value);
});

const paginatedFundData = computed(() => {
  // sort by timestamp
  const sortedData = [...fundData.value].sort((a, b) => {
    if (a.timestamp === 'N/A' || b.timestamp === 'N/A') return 0;
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });
  
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return sortedData.slice(start, end);
});

// dynamic grid style based on items per page
const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${itemsPerPage.value}, 1fr)`
}));

// pagination functions
const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

// window resize handler
const handleResize = () => {
  windowWidth.value = window.innerWidth;

  // adjust current page if it becomes invalid due to items per page change
  if (currentPage.value > totalPages.value && totalPages.value > 0) {
    currentPage.value = totalPages.value;
  }
};

// keyboard navigation
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'ArrowLeft' && currentPage.value > 1) {
    goToPage(currentPage.value - 1);
  } else if (event.key === 'ArrowRight' && currentPage.value < totalPages.value) {
    goToPage(currentPage.value + 1);
  }
};

const formatAmount = (amount: number): string => {
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
};

const formatFundAmount = (amount: string): string => {
  if (amount === 'N/A') return amount;

  // Extract the number from the string (e.g., "1000.50 C4E" -> "1000.50")
  const match = amount.match(/^([0-9.]+)\s*C4E$/);
  if (match) {
    const numericValue = parseFloat(match[1]);
    if (!isNaN(numericValue)) {
      return `${numericValue.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      })} C4E`;
    }
  }

  return amount; // fallback to original if parsing fails
};

const openProposalLink = async () => {
  // check if user is not on mainnet, redirect to mainnet first
  const currentNetwork = configStore.configName;
  
  if (!currentNetwork?.startsWith('Mainnet')) {
    console.log('Switching to Mainnet to view Proposal #12');
    configStore.setNetwork('Mainnet');
    // wait a moment for network switch
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // navigate to proposal page
  await router.push('/governance/12');
};

const handleContentClick = (event: Event) => {
  const target = event.target as HTMLElement;
  if (target && target.classList.contains('proposal-link')) {
    openProposalLink();
  }
};

const shortenAddress = (address: string): string => {
  if (!address || address === 'N/A') return address;
  if (address.length <= 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-3)}`;
};

const openExplorer = async (address: string) => {
  if (!address || address === 'N/A') return;

  try {
    const explorerLink = `${explorerUrl.value}/transactions/${address}`;
    console.log('Opening explorer link:', explorerLink);
    window.open(explorerLink, '_blank');

    useToast().info(i18n.global.t('GREENTREASURYVIEW.EXPLORER_OPEN'), {
      timeout: 5000
    });
  } catch (err){
    console.error('Failed to open explorer:', err);
  }
};

const splitTimestamp = (timestamp: string): { date: string; time: string } => {
  if (timestamp === 'N/A') return { date: 'N/A', time: 'N/A' };

  const dateObj = new Date(timestamp);
  if (isNaN(dateObj.getTime())) return {date: 'Invalid Date', time: 'Invalid Time'};
  return { date: dateObj.toLocaleDateString(), time: dateObj.toLocaleTimeString() };
};

const updateChartData = async () => {
  if (fundData.value.length === 0 || isCalculating.value) {
    return;
  }
  try {
    isCalculating.value = true;
    chartLoading.value = true;
    chartError.value = null;

    console.log('Calculating chart data...');
    chartData.value = await calculateChartData(fundData.value);
    console.log('Chart data calculated:', chartData.value);

  } catch (err) {
    console.error('Error calculating chart data:', err);
    chartError.value = 'Failed to calculate chart data';
    const toast = useToast();
    toast.error(i18n.global.t('greenTreasury.errors.chartFailed'));
  } finally {
    isCalculating.value = false;
    chartLoading.value = false;
  }
};

// calculate chart data when store data becomes available or changes
watch(
  () => fundData.value.length,
  (newLength) => {
    if (newLength > 0) {
      // reset to first page when new data is available
      currentPage.value = 1;
      updateChartData();
    }
  },
  { immediate: true }
);

onMounted(() => {
  // add event listeners
  window.addEventListener('keydown', handleKeydown);
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  // clean up event listeners
  window.removeEventListener('keydown', handleKeydown);
  window.removeEventListener('resize', handleResize);
});

// watch for network configuration changes and reload data
watch(
  () => useConfigurationStore().config?.hasuraURL,
  (newUrl, oldUrl) => {
    if (newUrl && oldUrl && newUrl !== oldUrl) {
      console.log('Network configuration changed, recalculating Energy Treasury data...');
      if (fundData.value.length > 0) {
        updateChartData();
      }
    }
  }
);

watch(
  () => useConfigurationStore().config?.bcApiURL,
  (newUrl, oldUrl) => {
    if (newUrl && oldUrl && newUrl !== oldUrl) {
      console.log('Blockchain API configuration changed, checking Energy Treasury availability...');

      // check if green treasury is available on the network
      const configStore = useConfigurationStore();
      if (!configStore.config?.greenTreasuryVisible) {
        console.log('Energy Treasury not available on this network, redirecting to dashboard...');
        router.push('/dashboard');
        return;
      }

      console.log('Recalculating Energy Treasury data...');
      if (fundData.value.length > 0) {
        updateChartData();
      }
    }
  }
);
</script>

<style scoped lang="scss">

.green-treasury-container {
  margin: 0;
  padding: 0;
}

.horizontal-chart-container {
  margin: 0 auto 30px auto;
  padding: 20px 33px;
  background: #0F3153;
  box-shadow: 0 0 4px 4px rgb(0 0 0 / 10%);
  border-radius: 5px;
  font-family: 'Inter', sans-serif;
  color: white;

  .chart-title {
    color: white;
    font-size: 1.6rem;
    font-weight: 600;
    margin-bottom: 25px;
    text-align: center;
    border-bottom: 1px solid #2AFD88;
    padding: 20px;
  }

  .progress-bar-container {
    position: relative;
    width: 100%;
    height: 50px;
    background: linear-gradient(90deg, #396dce 0%, #5bc0de 100%) !important;
    border-radius: 25px;
    overflow: hidden;
    box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.1);
    margin: 25px 0;
    border: 2px solid #dee2e6;

    .progress-bar {
      height: 100%;
      border-radius: 25px;
      overflow: hidden;
      background: transparent !important;

      .progress-segment {
        height: 100%;
        transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;

        &.funded {
          background: linear-gradient(90deg, #28a745 0%, #34ce57 100%) !important;
          box-shadow: inset 0 2px 4px rgba(40, 167, 69, 0.3);
          border-radius: 25px 0 0 25px;
        }

        &::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.2) 50%, transparent 100%);
          animation: shimmer 3s infinite;
        }
      }
    }
  }

  .chart-legend {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin: 25px 0;

    .legend-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 15px 20px;
      background: #02447A;
      border-radius: 4px;
      box-shadow: 0 0 2px 2px #02447A;
      border: 1px solid #02447A;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      color: white;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 2px 6px rgba(42, 253, 136, 0.3);
      }

      .legend-info {
        display: flex;
        align-items: center;
        gap: 12px;

        .legend-color {
          width: 18px;
          height: 18px;
          border-radius: 4px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);

          &.funded {
            background: linear-gradient(135deg, #28a745 0%, #34ce57 100%);
          }

          &.remaining {
            background: linear-gradient(135deg, #17a2b8 0%, #5bc0de 100%);
          }
        }

        .legend-label {
          font-weight: 600;
          color: white;
          font-size: 0.95rem;
        }
      }

      .legend-values {
        text-align: right;

        .legend-percentage {
          font-size: 1.1rem;
          font-weight: 700;
          color: white;
          margin-bottom: 2px;
        }

        .legend-amount {
          font-size: 0.85rem;
          color: #ccc;
          font-family: 'Courier New', monospace;
        }
      }
    }
  }

  .total-info {
    text-align: center;
    padding: 15px;
    background: #02447A;
    border-radius: 4px;
    box-shadow: 0 0 2px 2px #02447A;
    border: 1px solid #2AFD88;
    color: white;
    font-size: 1.1rem;
    margin-top: 20px;
  }

  // mobile users should be important too :)
  @media (max-width: 768px) {
    .chart-legend {
      grid-template-columns: 1fr;
      gap: 12px;
    }

    .progress-bar-container {
      height: 40px;
      margin: 20px 0;
    }

    .chart-title {
      font-size: 1.4rem;
    }
  }

  // mobile responsiveness for pagination controls only
  @media (max-width: 768px) {
    .pagination-controls {
      flex-direction: column;
      gap: 15px;

      .pagination-btn {
        padding: 12px 24px;
        font-size: 1rem;
      }

      .page-info {
        order: -1;
        padding: 10px 20px;
        font-size: 1.1rem;
      }
    }
  }
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.community-pool-section {
  margin-top: 30px;
  padding: 20px 33px;
  background: #0F3153;
  box-shadow: 0 0 4px 4px rgb(0 0 0 / 10%);
  border-radius: 5px;
  font-family: 'Inter', sans-serif;
  color: white;

  h2 {
    color: white;
    margin-bottom: 20px;
    font-size: 1.5rem;
    border-bottom: 1px solid #2AFD88;
    padding: 20px;
    font-weight: 600;
    margin-bottom: 15px;
  }

  h3 {
    color: white;
    margin-bottom: 15px;
    font-size: 1.2rem;
  }

  .loading {
    text-align: center;
    padding: 20px;
    color: #ccc;
    font-style: italic;
  }

  .error {
    background: #f8d7da;
    color: #721c24;
    padding: 15px;
    border-radius: 4px;
    border: 1px solid #f5c6cb;
  }

  .data-summary {
    background: #02447A;
    color: white;
    padding: 15px;
    border-radius: 4px;
    box-shadow: 0 0 2px 2px #02447A;
    margin-bottom: 20px;

    p {
      margin: 0 0 8px 0;
      font-size: 1.1rem;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  .messages-list {
    max-height: 600px;
    overflow-y: auto;
  }

  .amounts-list {
    max-height: 600px;
    overflow-y: auto;
  }

  .pagination-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    padding: 15px 0;
    border-top: 1px solid #2AFD88;

    .pagination-btn {
      background: #2AFD88;
      color: #0F3153;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
      font-size: 0.9rem;
      transition: all 0.2s ease-in-out;

      &:hover:not(:disabled) {
        background: #22e077;
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(34, 224, 119, 0.3);
      }

      &:disabled {
        background: #666;
        color: #ccc;
        cursor: not-allowed;
        opacity: 0.5;
      }

      &:active:not(:disabled) {
        transform: translateY(0);
        box-shadow: 0 1px 4px rgba(34, 224, 119, 0.3);
      }
    }

    .page-info {
      color: white;
      font-weight: 600;
      font-size: 1rem;
      background: #02447A;
      padding: 8px 16px;
      border-radius: 4px;
      border: 1px solid #2AFD88;
    }
  }

  .amounts-grid {
    display: grid;
    gap: 15px;
    margin-top: 15px;
    transition: all 0.3s ease;
    // grid columns are set dynamically via :style binding
  }

  .amount-item {
    background: #02447A;
    border: 1px solid #02447A;
    border-radius: 4px;
    padding: 15px;
    text-align: center;
    color: white;
    box-shadow: 0 0 2px 2px #02447A;
    transition: transform 0.2s ease-in-out;
    display: flex;
    flex-direction: column;
    gap: 8px;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 2px 6px rgba(42, 253, 136, 0.3);
    }

    .amount-value {
      font-family: 'Courier New', monospace;
      font-size: 1.1rem;
      font-weight: bold;
      color: white;
    }

    .timestamp {
      font-family: 'Courier New', monospace;
      font-size: 0.95rem;
      color: white;
    }

    .transaction-hash {
      font-family: 'Courier New', monospace;
      font-size: 0.85rem;
      color: #ccc;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 4px;
      background: rgba(42, 253, 136, 0.1);
      border: 1px solid #2AFD88;
      transition: all 0.2s ease-in-out;

      &:hover {
        background: rgba(42, 253, 136, 0.2);
        border-color: #2AFD88;
        color: white;
      }

      &:active {
        background: rgba(42, 253, 136, 0.3);
        transform: scale(0.98);
      }
    }
  }

  .message-item {
    background: #02447A;
    border: 1px solid #02447A;
    border-radius: 4px;
    padding: 15px;
    margin-bottom: 10px;
    box-shadow: 0 0 2px 2px #02447A;
    color: white;

    .message-hash {
      font-family: 'Courier New', monospace;
      font-size: 0.9rem;
      margin-bottom: 8px;
      word-break: break-all;
    }

    .message-value {
      margin-bottom: 8px;
      color: #ccc;
    }

    .message-success {
      .success {
        color: #2AFD88;
        font-weight: bold;
      }

      .failed {
        color: #dc3545;
        font-weight: bold;
      }
    }
  }

  .no-data {
    text-align: center;
    padding: 40px;
    color: #ccc;
    font-style: italic;
    background: #02447A;
    border-radius: 4px;
    border: 2px dashed #2AFD88;
  }
}

.info-boxes-section {
  margin-top: 30px;
  
  .info-boxes-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    
    @media (max-width: 1024px) {
      grid-template-columns: 1fr;
      gap: 20px;
    }
    
    @media (max-width: 768px) {
      gap: 15px;
    }
  }
  
  .info-box {
    background: #0F3153;
    box-shadow: 0 0 4px 4px rgb(0 0 0 / 10%);
    border-radius: 5px;
    padding: 20px 25px;
    font-family: 'Inter', sans-serif;
    color: white;
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 4px 12px rgba(42, 253, 136, 0.2);
    }
    
    .info-box-header {
      color: white;
      font-size: 1.3rem;
      font-weight: 600;
      margin-bottom: 15px;
      border-bottom: 1px solid #2AFD88;
      padding-bottom: 10px;
      text-align: center;
    }
    
    .info-box-content {
      line-height: 1.6;
      
      p {
        margin: 0 0 15px 0;
        font-size: 0.95rem;
        color: #e8e9ea;
        text-align: justify;
        
        &:last-child {
          margin-bottom: 0;
        }
      }
      
      .proposal-link {
        color: #2AFD88 !important;
        text-decoration: none;
        font-weight: 700 !important;
        cursor: pointer;
        transition: all 0.2s ease-in-out;
        
        &:hover {
          color: #22e077 !important;
          text-shadow: 0 0 8px rgba(34, 224, 119, 0.4);
        }
        
        &:active {
          transform: scale(0.98);
        }
      }

      :deep(.proposal-link) {
        color: #2AFD88 !important;
        font-weight: 700 !important;
        text-decoration: none;
        cursor: pointer;
        transition: all 0.2s ease-in-out;
        
        &:hover {
          color: #22e077 !important;
          text-shadow: 0 0 8px rgba(34, 224, 119, 0.4);
        }
      }
    }
  }
}


</style>
