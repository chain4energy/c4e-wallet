<template>
  <div class="pools-tile">
    <div class="legend">
    <h5 style="font-weight: bold;">{{ $t("DASHBOARD_VIEW.POOLS") }}</h5>
    <div class="items">
        <div class="legend-item">
          <div class="dot" style="background: #87CEEB"> </div>
          <div> {{ $t("DASHBOARD_VIEW.GENERIC_COMMUNITY_POOL") }}</div>
          <Icon name="ArrowRight" />
          <CoinAmount v-if="!loading" :amount="genericCommunityPoolForDisplay" :show-denom="true" style="font-weight: bold"/>
          <span v-else style="font-weight: bold">Loading...</span>
        </div>
        <div class="legend-item">
          <div class="dot" style="background: #72BF44"> </div>
          <div> {{ $t("DASHBOARD_VIEW.GREENTREASURY_POOL") }}</div>
          <Icon name="ArrowRight" />
          <CoinAmount v-if="!loading" :amount="greenTreasuryForDisplay" :show-denom="true" style="font-weight: bold"/>
          <span v-else style="font-weight: bold">Loading...</span>
        </div>
        <div class="legend-item">
          <div class="dot" style="background: #E4E4E4"> </div>
          <div> {{ $t("DASHBOARD_VIEW.REMAINING_TOKENS") }}</div>
          <Icon name="ArrowRight" />
          <CoinAmount :amount="tokensStore.getRemainingTokens" :show-denom="true" style="font-weight: bold"/>
        </div>
        <div class="legend-item">
          <div class="dot" style="background: #27697F"></div>
          <div> {{ $t("DASHBOARD_VIEW.STRATEGIC_REVERSE_POOL") }}</div>
          <Icon name="ArrowRight" />
          <CoinAmount :amount="tokensStore.getStrategicReversePool" :show-denom="true" style="font-weight: bold"/>
        </div>
        <div class="legend-item">
          <div class="dot" style="background: #FFF1A9"></div>
          <div> {{ $t("DASHBOARD_VIEW.AIRDROP") }}</div>
          <Icon name="ArrowRight" />
          <CoinAmount :amount="tokensStore.getAirdropPool" :show-denom="true" style="font-weight: bold"/>
        </div>
    </div>
    </div>
    <div style=" height: 100%; width:100% ;max-width:350px;margin-left: auto;
    margin-right: auto " ref="poolsRef">
      <ShadowedSvgChart id="poolschartdiv" >
        <v-chart :option="option" autoresize />
        <C4EIcon icon="c4e-circle" class="inside" :size="poolsRef?.clientWidth ? poolsRef.clientWidth/3 : 100"/>
      </ShadowedSvgChart>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PieChart } from "echarts/charts";
import VChart from "vue-echarts";
import { use } from "echarts/core";
import { SVGRenderer } from "echarts/renderers";
import {computed, ref, onMounted, watch} from "vue";
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import Icon from "../features/IconComponent.vue";
import {useTokensStore} from "@/store/tokens.store";
import { createDashboardPoolsChartData, createDashboardPoolsChartDataWithSeparation } from "@/charts/dashboard";
import ShadowedSvgChart from "../commons/ShadowedSvgChart.vue";
import C4EIcon from "../commons/C4EIcon.vue";
import CoinAmount from "../commons/CoinAmount.vue";
import { useConfigurationStore } from "@/store/configuration.store";
import { getCommunityPoolFundData, type FundData } from '@/services/communityPool.service';
import { calculateChartData, type CommunityPoolChartData } from '@/services/communityPoolChart.service';
import { BigDecimal } from '@/models/store/big.decimal';
import { DecCoin } from '@/models/store/common';
use([
  SVGRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent
]);

const tokensStore = useTokensStore();
const poolsRef = ref<HTMLElement>();

// reactive state for green treasury data
const loading = ref(false);
const error = ref<string | null>(null);
const fundData = ref<FundData[]>([]);
const chartData = ref<CommunityPoolChartData | null>(null);
const greenTreasuryAmount = ref(0);

const communityPool = computed(() => {
  const totalCommunityPool = tokensStore.getCommunityPool.amount;
  const greenTreasuryInMicrounits = new BigDecimal(greenTreasuryAmount.value * 1000000);
  
  // subtract green treasury amount from community pool
  const genericCommunityPoolAmount = totalCommunityPool.subtract(greenTreasuryInMicrounits);
  
  return useConfigurationStore().config.getConvertedAmount(genericCommunityPoolAmount);
});

const greenTreasuryForDisplay = computed(() => {
  const configStore = useConfigurationStore();
  const denom = configStore.config.stakingDenom;
  // convert to uc4e
  const amountInMicrounits = greenTreasuryAmount.value * 1000000;
  return new DecCoin(new BigDecimal(amountInMicrounits), denom);
});

const genericCommunityPoolForDisplay = computed(() => {
  const configStore = useConfigurationStore();
  const denom = configStore.config.stakingDenom;
  const totalCommunityPool = tokensStore.getCommunityPool.amount;
  const greenTreasuryInMicrounits = new BigDecimal(greenTreasuryAmount.value * 1000000);
  
  const genericAmount = totalCommunityPool.subtract(greenTreasuryInMicrounits);
  
  return new DecCoin(genericAmount, denom);
});

const strategicReversePool = computed(() => {
  return useConfigurationStore().config.getConvertedAmount(tokensStore.getStrategicReversePool.amount);
});


const airdropPool = computed(() => {
  return useConfigurationStore().config.getConvertedAmount(tokensStore.getAirdropPool.amount);
});

const totalSupply = computed(() => {
  return useConfigurationStore().config.getConvertedAmount(tokensStore.getTotalSupply.amount);
});

const remainingTokens = computed(() => {
  return useConfigurationStore().config.getConvertedAmount(tokensStore.getRemainingTokens.amount);
});

// load green treasury data
const loadGreenTreasuryData = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    console.log('Loading Energy Treasury fund data...');
    fundData.value = await getCommunityPoolFundData();
    console.log('Fund data loaded:', fundData.value.length, 'items');

    // calculate chart data
    chartData.value = await calculateChartData(fundData.value);
    console.log('Chart data calculated:', chartData.value);

    // set the amount
    greenTreasuryAmount.value = chartData.value.fundedAmount;

  } catch (err) {
    console.error('Error loading Energy Treasury data:', err);
    error.value = 'Failed to load Energy Treasury data';
    // fallback
    greenTreasuryAmount.value = 0;
  } finally {
    loading.value = false;
  }
};

const option = computed(() => {
  if (!loading.value && chartData.value) {
    // separate charts for green treausy and community pool
    return createDashboardPoolsChartDataWithSeparation(
      remainingTokens.value,
      communityPool.value, // generic community pool (-green treasury)
      greenTreasuryAmount.value,
      strategicReversePool.value,
      airdropPool.value,
      totalSupply.value
    );
  } else {
    // while loading fallback to original chart
    return createDashboardPoolsChartData(
      remainingTokens.value,
      useConfigurationStore().config.getConvertedAmount(tokensStore.getCommunityPool.amount),
      strategicReversePool.value,
      airdropPool.value,
      totalSupply.value
    );
  }
});

// load data on mount
onMounted(async () => {
  await loadGreenTreasuryData();
});

// check for network changes
watch(
  () => useConfigurationStore().config?.hasuraURL,
  (newUrl, oldUrl) => {
    if (newUrl && oldUrl && newUrl !== oldUrl) {
      console.log('Network configuration changed, reloading Energy Treasury data...');
      loadGreenTreasuryData();
    }
  }
);

watch(
  () => useConfigurationStore().config?.bcApiURL,
  (newUrl, oldUrl) => {
    if (newUrl && oldUrl && newUrl !== oldUrl) {
      console.log('Blockchain API configuration changed, reloading Energy Treasury data...');
      loadGreenTreasuryData();
    }
  }
);


</script>

<style scoped lang="scss">
#poolschartdiv {
  width: 100%;
  height: 100%;
  // margin-bottom: -30px;
  // margin-left: -10px;
  // background: transparent url("@/assets/logo.png") no-repeat center ;
  // background-size: 50px;
position: relative;
  .inside{
    width: 40%;
      position: absolute;
      top: 50%;
      -ms-transform: translateY(-50%);
      transform: translateY(-50%);
      margin:auto;
      text-align: center;
      vertical-align: middle;
      left: 0;
      right: 0;

    }

}

@media screen and (max-width: 1150px) {
  #poolschartdiv {
    height: 350px;
    width: 100%;
    align-self: center;

    .inside{
      width: 40%;
      position: absolute;
      top: 50%;
      -ms-transform: translateY(-50%);
      transform: translateY(-50%);
      margin:auto;
      text-align: center;
      vertical-align: middle;
      left: 0;
      right: 0;

    }
  }
}

.c4e-icon {
  color: #27697F;
}

</style>
