import React, { Component } from 'react';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';

const colors = [
  '#1890FF',
  '#13C2C2',
  '#2FC25B',
  '#FACC14',
  '#F04864',
  '#8543E0',
  '#3436C7',
  '#223273'
];

export default class extends Component {

  getOptions = () => {
    
    let {
      dataSource = [],
      xAxisKey,
      yAxisKey,
      seriesName,
    } = this.props;
    
    // 图例
    let legendLabels = dataSource.map(l => l[xAxisKey]);

    let seriesData = [];
    seriesData = dataSource.map(l => ({
      name: l[xAxisKey],
      value: l[yAxisKey]
    }));

    return {
      color: colors,
      tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: legendLabels
      },
      series: [
        {
          name: seriesName,
          type: 'pie',
          radius : '55%',
          center: ['50%', '50%'],
          data: seriesData,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          normal: {
            label: {
              formatter: '{b} : {c} ({d}%)'
            },
            labelLine: {
              length: 1
            }
          }
        }
      ]   
    }
  }
  
  render() {
    return (
      <div className="chart chart-pie">
        <ReactEchartsCore
          echarts={echarts}
          option={this.getOptions()}
          notMerge={true}
          lazyUpdate={true} />
      </div>
    )
  }
}