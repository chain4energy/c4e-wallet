import i18n from "@/plugins/i18n"


const yesColor = '#72bf44';
const abstainColor = '#27697f';
const noColor = '#e02626';
const noWithVetoColor = '#fff1a9';
const noVotesColor = '#797777';

export function createProposalDetailsChartData(yes: string, abstain: string, no: string, noWithVeto: string, sum: bigint) {
  if (sum > 0) {
    return createProposalDetailsSingleChartData(
      '{b} <br/>{c} ({d}%)',
      [
        {value: yes, name: i18n.global.t('GOVERNANCE_VIEW.VOTING_OPTIONS.YES'), color: yesColor},
        {value: abstain, name: i18n.global.t('GOVERNANCE_VIEW.VOTING_OPTIONS.ABSTAIN'), color: abstainColor},
        {value: no, name: i18n.global.t('GOVERNANCE_VIEW.VOTING_OPTIONS.NO'), color: '#e02626'},
        {value: noWithVeto, name: i18n.global.t('GOVERNANCE_VIEW.VOTING_OPTIONS.NO_WITH_VETO'), color: '#fff1a9'}
      ]
    )
  } else {
    return createProposalDetailsSingleChartData(
      'No votes <br/>0 (0%)',
      [
        {value: '1', name: '', color: noVotesColor}
      ]
    )
  }
}

export function createProposalListChartData(
  yes: {
    amount: string
    percentage: string
  }, 
  abstain: {
    amount: string
    percentage: string
  },
  no: {
    amount: string
    percentage: string
  },
  noWithVeto: {
    amount: string
    percentage: string
  },
  sum: bigint) {

    if (sum > 0) {
      const formatter = function (params: any) {
        return `
          <b>${params.seriesName}</b></br>
          <b>${params.value} (${params.data.name}%)</b>`
      };

      return createProposalListSingleChartData(
        formatter,
        [
          {amount: yes.amount, percentage: yes.percentage ,name: i18n.global.t('GOVERNANCE_VIEW.VOTING_OPTIONS.YES'), color: yesColor},
          {amount: abstain.amount, percentage: abstain.percentage ,name: i18n.global.t('GOVERNANCE_VIEW.VOTING_OPTIONS.ABSTAIN'), color: abstainColor},
          {amount: no.amount, percentage: no.percentage ,name: i18n.global.t('GOVERNANCE_VIEW.VOTING_OPTIONS.NO'), color: noColor},
          {amount: noWithVeto.amount, percentage: noWithVeto.percentage ,name: i18n.global.t('GOVERNANCE_VIEW.VOTING_OPTIONS.NO_WITH_VETO'), color: noWithVetoColor},
        ]
      )
    } else {
      return createProposalListSingleChartData(
        'No votes <br/>0 (0%)',
        [
          {amount: '1', percentage: '0' ,name: '', color: noVotesColor}
        ]
      )
    }

}

function createProposalDetailsSingleChartData(formatter: any, data: {value: string, name: string, color: string}[]) {
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
        radius: ['100%', '78%'],

        avoidLabelOverlap: true,
        label: {
          show: false,
          color: '#000',
          fontSize: '80',
          position: 'center'
        },

        data: data.map(d => {return createProposalDetailsChartSeriesData(d.value, d.name, d.color)}),
      }],

    };
  
}


function createProposalDetailsChartSeriesData(value: string, name: string, color: string) {
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
      color: color,
    }
  }
}

function createProposalListSingleChartData(formatter: any, data: {amount: string, percentage: string, name: string, color: string}[]) {
  return {
    tooltip: {
      trigger: 'item',
      formatter: formatter
    },
    xAxis: {
      type: 'value',
      show:false
    },
    yAxis: {
      type: 'category',
      show:false,
      data: ['']
    },
    itemStyle: {
      barBorderRadius: [50,50,50,50]
    },
    series: data.map(d => {return createProposalListChartSeriesData(d.amount, d.percentage, d.name, d.color)}),
  
  } ;

}

function createProposalListChartSeriesData(amount: string, percentage: string, name: string, color: string) {
  return {
    name: name,
    type: 'bar',

    color:color,
    stack: 'total',
    emphasis: {
      focus: 'series'
    },
    data: [{name: percentage, value: amount}]
  }
}
