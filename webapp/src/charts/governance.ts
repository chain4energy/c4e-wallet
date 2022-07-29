export function createProposalDetailsChartData(yes: string, abstain: string, no: string, noWithVeto: string, sum: bigint) {
  if (sum > 0) {
    return createProposalDetailsSingleChartData(
      '{b} <br/>{c} ({d}%)',
      [
        {value: yes, name: 'Yes', color: '#72bf44'},
        {value: abstain, name: 'Abstain', color: '#27697f'},
        {value: no, name: 'No', color: '#e02626'},
        {value: noWithVeto, name: 'No with veto', color: '#fff1a9'}
      ]
    )
  } else {
    return createProposalDetailsSingleChartData(
      'No votes <br/>0 (0%)',
      [
        {value: '1', name: '', color: '#797777'}
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