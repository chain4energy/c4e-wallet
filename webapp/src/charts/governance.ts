import { BigDecimal } from "@/models/store/big.decimal";
import { toPercentage } from "@/models/store/common";
import i18n from "@/plugins/i18n";
import { formatBigNumberLocalized } from "@/utils/locale-number-formatter";


const yesColor = '#72bf44';
const abstainColor = '#27697f';
const noColor = '#e02626';
const noWithVetoColor = '#FDDB2A';
const noVotesColor = '#797777';

export function createProposalDetailsChartData(yes: number | BigDecimal, abstain: number | BigDecimal, no: number | BigDecimal, noWithVeto: number | BigDecimal, notVoted: number | BigDecimal, sum: bigint, precision = 4) {
  if (sum > 0) {
    const formatter = function (params: any) {
      return `
        <b>${params.data.name}</b></br>
        <b>${formatBigNumberLocalized(params.value)}</b>
        <b>(${formatBigNumberLocalized(String(params.percent))}%)</b>`;
    };
    return createProposalDetailsSingleChartData(
      formatter,
      [
        {value: yes, name: i18n.global.t('GOVERNANCE_VIEW.VOTING_OPTIONS.YES'), color: yesColor},
        {value: abstain, name: i18n.global.t('GOVERNANCE_VIEW.VOTING_OPTIONS.ABSTAIN'), color: abstainColor},
        {value: no, name: i18n.global.t('GOVERNANCE_VIEW.VOTING_OPTIONS.NO'), color: '#e02626'},
        {value: noWithVeto, name: i18n.global.t('GOVERNANCE_VIEW.VOTING_OPTIONS.NO_WITH_VETO'), color: '#FDDB2A'},
        {value: notVoted, name: i18n.global.t('GOVERNANCE_VIEW.VOTING_OPTIONS.NOT_VOTED'), color: '#8d8d8d'}
      ], precision
    );
  } else {
    return createProposalDetailsSingleChartData(
      'No votes <br/>0 (0%)',
      [
        {value: 1, name: '', color: noVotesColor}
      ], precision
    );
  }
}

export function createProposalListChartData(
  yes: {
    amount: number | BigDecimal
    percentage: BigDecimal
  },
  abstain: {
    amount: number | BigDecimal
    percentage: BigDecimal
  },
  no: {
    amount: number | BigDecimal
    percentage: BigDecimal
  },
  noWithVeto: {
    amount: number | BigDecimal
    percentage: BigDecimal
  },
  sum: bigint,
  precision = 4,
  percentagePrecision = 2) {

    if (sum > 0) {
      const formatter = function (params: any) {
        return `
          <b>${params.seriesName}</b></br>
          <b>${formatBigNumberLocalized(params.value)} (${formatBigNumberLocalized(String(params.data.name))}%)</b>`;
      };

      return createProposalListSingleChartData(
        formatter,
        [
          {amount: yes.amount, percentage: yes.percentage ,name: i18n.global.t('GOVERNANCE_VIEW.VOTING_OPTIONS.YES'), color: yesColor},
          {amount: abstain.amount, percentage: abstain.percentage ,name: i18n.global.t('GOVERNANCE_VIEW.VOTING_OPTIONS.ABSTAIN'), color: abstainColor},
          {amount: no.amount, percentage: no.percentage ,name: i18n.global.t('GOVERNANCE_VIEW.VOTING_OPTIONS.NO'), color: noColor},
          {amount: noWithVeto.amount, percentage: noWithVeto.percentage ,name: i18n.global.t('GOVERNANCE_VIEW.VOTING_OPTIONS.NO_WITH_VETO'), color: noWithVetoColor},
        ],
        precision,
        percentagePrecision
      );
    } else {
      return createProposalListSingleChartData(
        'No votes <br/>0 (0%)',
        [
          {amount: 1, percentage: new BigDecimal(0) ,name: '', color: noVotesColor}
        ],
        precision,
        percentagePrecision
      );
    }

}

function createProposalDetailsSingleChartData(formatter: any, data: {value: number | BigDecimal, name: string, color: string}[], precision: number) {
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

        data: data.map(d => {return createProposalDetailsChartSeriesData(d.value, d.name, d.color, precision);}),
      }],

    };

}


function createProposalDetailsChartSeriesData(value: number | BigDecimal, name: string, color: string, precision: number) {
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
      color: color,
    }
  };
}

function createProposalListSingleChartData(formatter: any, data: {amount: number | BigDecimal, percentage: BigDecimal, name: string, color: string}[], precision: number, percentagePrecision: number) {
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
    series: data.map(d => {return createProposalListChartSeriesData(d.amount, d.percentage, d.name, d.color, precision, percentagePrecision);}),

  } ;

}

function createProposalListChartSeriesData(amount: number | BigDecimal, percentage: BigDecimal, name: string, color: string, precision: number, percentagePrecision: number) {
  return {
    name: name,
    type: 'bar',
    color:color,
    stack: 'total',
    emphasis: {
      focus: 'series'
    },
    data: [{name: toPercentage(percentage, percentagePrecision), value: amount.toFixed(precision)}]
  };
}
