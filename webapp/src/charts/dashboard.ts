import { BigDecimal } from "@/models/store/big.decimal";
import i18n from "@/plugins/i18n"
import { formatBigNumber, formatBigNumberLocalized } from "@/utils/locale-number-formatter";

const communityPoolColor = '#fff1a9';
const strategicReversePoolColor = '#72bf44';
const airdropPoolColor = '#26697f';

const bondedColor = '#26697f';
const unBoundedColor = '#fff1a9';
const unBoundingColor = '#72bf44';
const remainingTokensColor = '#E4E4E4';

export function createDashboardPoolsChartData(remainingTokens: number | BigDecimal, communityPool: number | BigDecimal, strategicReversePool: number | BigDecimal, airdropPool: number | BigDecimal, precision = 4) {
  const formatter = function (params: any) {
    return `
      <b>${params.data.name}</b></br>
      <b>${formatBigNumberLocalized(params.value)}</b>`
  };
  return createDashboardPoolsSingleChartData(
    formatter,
    [
      { value: communityPool, name: i18n.global.t('DASHBOARD_VIEW.COMMUNITY_POOL'), color: communityPoolColor },
      { value: remainingTokens, name: i18n.global.t('DASHBOARD_VIEW.REMAINING_TOKENS'), color: remainingTokensColor },
      { value: strategicReversePool, name: i18n.global.t('DASHBOARD_VIEW.STRATEGIC_REVERSE_POOL'), color: strategicReversePoolColor },
      { value: airdropPool, name: i18n.global.t('DASHBOARD_VIEW.AIRDROP'), color: airdropPoolColor }
    ], precision
  )
}

function createDashboardPoolsSingleChartData(formatter: any, data: { value: number | BigDecimal, name: string, color: string }[], precision: number) {
  return {
    tooltip: {
      trigger: 'item',
      formatter: formatter
    },

    series: [{
      width: '90%',
      height: '90%',
      center: ['55%', '55%'],
      name: 'Pools',
      type: 'pie',
      radius: ['50%', '100%'],

      // -------~~~~~~~~~~~~~~~~~~~~~~~~~~

      markPoint: {
        tooltip: { show: false },
        label: {
          show: true,
          formatter: '{b}',
          color: 'black',
          fontSize: 20,
        },
        data: [{
          name: 'Total 10%',
          value: '-',
          symbol: 'circle',
          itemStyle: { color: 'transparent' },
          x: '50%',
          y: '50%',
        }],
      },

      // -------~~~~~~~~~~~~~~~~~~~~~~~~~~

      avoidLabelOverlap: true,
      label: {
        show: false,
        color: '#000',
        fontSize: '80',
        position: 'center'
      },
      emphasis: {
        label: {
          show: false,
          fontSize: '30',
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: data.map(d => { return createDashboardPoolsChartSeriesData(d.value, d.name, d.color,precision) })
    }]
  };

}

function createDashboardPoolsChartSeriesData(value: number | BigDecimal, name: string, color: string, precision: number) {
  return {
    value: value.toFixed(precision),
    name: name,
    itemStyle: {
      label: {
        show: false
      },
      labelLine: {
        show: false
      },
      color: color

    }
  }
}








export function createTokenomicsChartData(bounded: number | BigDecimal, unBounded: number | BigDecimal, unBounding: number | BigDecimal, total: number | BigDecimal, precision = 4) {
  const formatter = function (params: any) {
    return `
      <b>${params.data.name}</b></br>
      <b>${formatBigNumberLocalized(params.value)}</b>`
  };

  return createTokenomicsSingleChartData(
    formatter,
    [
      { value: bounded, name: i18n.global.t('DASHBOARD_VIEW.BOUNDED'), color: bondedColor },
      { value: unBounded, name: i18n.global.t('DASHBOARD_VIEW.UNBOUNDED'), color: unBoundedColor },
      { value: unBounding, name: i18n.global.t('DASHBOARD_VIEW.UNBOUNDING'), color: unBoundingColor }
    ], total, precision
  )
}



function createTokenomicsSingleChartData(formatter: any, data: { value: number | BigDecimal, name: string, color: string }[], total: number | BigDecimal, precision: number) {
  const dataToset: any[] = data.map(d => { return createTokenomicsChartSeriesData(d.value, d.name, d.color, precision) });
  dataToset.push({
    value: total.toFixed(precision),
    name: null,

    itemStyle: { opacity: 0 },
    tooltip: { show: false },
  });
  const result = {
    media: [
      {
        query: {
          maxWidth: 1150
        },
        option: {
          series: [
            {
              width: '130%',
              height: '130%',
              startAngle: 180,
              endAngle: 360,
              type: 'pie',
              radius: ['50%', '85%'],
              center: ['50%', '55%'],
              right: 'center',
              avoidLabelOverlap: true,
              label: {
                show: false,
                color: '#000',
                fontSize: '80',
                position: 'center'
              },
              emphasis: {
                label: {
                  show: false,
                  fontSize: '30',
                  fontWeight: 'bold'
                }
              },
              labelLine: {
                show: false
              },
              data: dataToset
            }
          ]
        }
      }
    ],
    tooltip: {
      trigger: 'item',
      formatter: formatter
    },
    // legend: {
    //   orient: 'vertical',
    //   left: 10,
    // },
    series: [
      {
        width: '130%',
        height: '130%',
        startAngle: 180,
        endAngle: 360,
        type: 'pie',
        radius: ['50%', '85%'],
        center: ['40%', '55%'],
        avoidLabelOverlap: true,
        label: {
          show: false,
          color: '#000',
          fontSize: '80',
          position: 'center'
        },
        emphasis: {
          label: {
            show: false,
            fontSize: '30',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: dataToset
      }
    ],
  };
  return result;
}

function createTokenomicsChartSeriesData(value: number | BigDecimal, name: string, color: string, precision: number) {
  return {
    value: value.toFixed(precision),
    name: name,
    itemStyle: {
      label: {
        show: false
      },
      labelLine: {
        show: false
      },
      color: color

    }
  }
}
