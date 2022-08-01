import i18n from "@/plugins/i18n"

const communityPoolColor = '#fff1a9';
const strategicReversePoolColor = '#72bf44';
const airdropPoolColor = '#26697f';

const bondedColor = '#26697f';
const unBoundedColor = '#fff1a9';
const unBoundingColor = '#72bf44';

export function createDashboardPoolsChartData(communityPool: string, strategicReversePool: string, airdropPool: string) {
  return createDashboardPoolsSingleChartData(
    '{b} <br/>{c}',
    [
      { value: communityPool, name: i18n.global.t('DASHBOARD_VIEW.COMMUNITY_POOL'), color: communityPoolColor },
      { value: strategicReversePool, name: i18n.global.t('DASHBOARD_VIEW.STRATEGIC_REVERSE_POOL'), color: strategicReversePoolColor },
      { value: airdropPool, name: i18n.global.t('DASHBOARD_VIEW.AIRDROP'), color: airdropPoolColor }
    ]
  )
}

function createDashboardPoolsSingleChartData(formatter: any, data: { value: string, name: string, color: string }[]) {
  return {
    tooltip: {
      trigger: 'item',
      formatter: formatter
    },

    series: [{
      width: '90%',
      height: '90%',
      center: ['55%', '50%'],
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
      data: data.map(d => { return createDashboardPoolsChartSeriesData(d.value, d.name, d.color) })
    }]
  };

}

function createDashboardPoolsChartSeriesData(value: string, name: string, color: string) {
  return {
    value: value,
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








export function createTokenomicsChartData(bounded: string, unBounded: string, unBounding: string, total: string) {
  return createTokenomicsSingleChartData(
    '{b} <br/>{c}',
    [
      { value: bounded, color: bondedColor },
      { value: unBounded, color: unBoundedColor },
      { value: unBounding, color: unBoundingColor }
    ], total
  )
}



function createTokenomicsSingleChartData(formatter: any, data: { value: string, color: string }[], total: string) {
  const dataToset: any[] = data.map(d => { return createTokenomicsChartSeriesData(d.value, d.color) });
  dataToset.push({
    value: total,
    name: null,

    itemStyle: { opacity: 0 },
    tooltip: { show: false },
  });
  const result = {
    tooltip: {
      trigger: 'item',
      formatter: formatter
    },
    legend: {
      orient: 'vertical',
      left: 10,
    },
    series: [
      {
        width: '100%',
        height: '100%',
        startAngle: 180,
        endAngle: 360,
        type: 'pie',
        radius: ['50%', '90%'],
        center: ['50%', '43%'],
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

function createTokenomicsChartSeriesData(value: string, color: string) {
  return {
    value: value,
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
