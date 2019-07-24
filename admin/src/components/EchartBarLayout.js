import React, { Component } from 'react';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';
import { Button, Dropdown, Icon, Menu } from 'antd';

const ButtonGroup = Button.Group;

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
  constructor(props) {
    super(props);
    let yAxisLabels = props.yAxisLabels || [];
    this.state = {
      yAxisLabelSelected: yAxisLabels[0] || null
    }
  }
  
  render() {
    const { yAxisLabelSelected } = this.state;
    let {
      dataSource = [],
      xAxisKey,
      yAxisKey,
      yAxisLabels,
      legendLabels,
      seriesName
    } = this.props;

    let xdata = [...new Set(dataSource.map(l => l[xAxisKey]))];
    let seriesData = [];

    // 是否显示自定义的按钮图标
    let showLabelButtons =  Array.isArray(yAxisLabels) && yAxisLabels.length > 1;
    const MAX_LABEL_LENGTH = 4;
    if(showLabelButtons) {
      // 当前选中的yAxisKey
      let currentIndex = yAxisLabels.indexOf(yAxisLabelSelected);
      let currentKey = yAxisKey[currentIndex === -1 ? 0 : currentIndex];
      seriesData = [{
        name: yAxisLabelSelected,
        type: 'bar',
        barWidth: '50%',
        data: dataSource.map(l => l[currentKey])
      }]
    }
    // 显示多图例
    else if(!showLabelButtons && Array.isArray(yAxisKey)) {
      seriesData = yAxisKey.map((item, i) => ({
        name: Array.isArray(legendLabels) ? legendLabels[i] : item,
        type: 'bar',
        barWidth: '50%',
        data: dataSource.map(l => l[item])
      }))
    }
    // 只有一条线
    else if(typeof(yAxisKey) === 'string') {
      seriesData = [{
        name: seriesName || yAxisKey,
        type: 'bar',
        barWidth: '50%',
        data: dataSource.map(l => l[yAxisKey])
      }]
    }

    const getOptions = () => {
      return {
        grid: {
          left: 10,
          right: 30,
          bottom: 20,
          top: Array.isArray(legendLabels) ? 40 : 20,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data: legendLabels,
          right: 30,
          show: Array.isArray(legendLabels)
        },
        color: colors,        
        xAxis: {
          type: 'category',
          boundaryGap: true,
          // inverse: reverse,
          data: xdata,
          axisTick: {
            alignWithLabel: true
          },
          axisLine: {
            lineStyle: {
              color: '#ccc',
            }
          },
          axisLabel: {
            textStyle: {
              color: '#666',
              fontSize: 12
            }
          }
        },
        yAxis: {
          type: 'value',
          scale: true,
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed',
              color: ['#e8e8e8']
            }
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: '#666',
              fontSize: 12
            },
            formatter: function (value) {
              return (value >= 10000) ? value / 10000 + 'w' : value;
            }
          }
        },
        series: seriesData
      }
    }
    
    return (
      <div className="chart chart-bar">
        {
          showLabelButtons ? 
          <div style={{ margin: '10px 0' }}>
            <ButtonGroup>
              {
                yAxisLabels.slice(0, MAX_LABEL_LENGTH).map((item, i) => 
                <Button
                  size="small"
                  type={yAxisLabelSelected === item ? 'primary' : ''}
                  key={item}
                  onClick={() => this.setState({ yAxisLabelSelected: item })}>{item}</Button>
                )
              }
              {
                yAxisLabels.length > MAX_LABEL_LENGTH ?
                <Dropdown
                  overlay={
                    <Menu onClick={e => this.setState({ yAxisLabelSelected: e.key })}>
                      {       
                        yAxisLabels.slice(MAX_LABEL_LENGTH).map(item => 
                          <Menu.Item 
                            className={yAxisLabelSelected === item ? 'menu-item-selected' : ''} 
                            key={item}>
                            {item}
                          </Menu.Item>
                        )
                      }
                    </Menu>
                  }>
                  {
                    yAxisLabels.indexOf(yAxisLabelSelected) >= MAX_LABEL_LENGTH ?
                    <Button size="small" type="primary">
                      { yAxisLabelSelected } <Icon type="down" />
                    </Button>:
                    <Button size="small">
                      更多 <Icon type="down" />
                    </Button>
                  } 
                </Dropdown> : null
              }
            </ButtonGroup>
          </div> : null
        }
        <ReactEchartsCore
          echarts={echarts}
          option={getOptions()}
          notMerge={true}
          lazyUpdate={true} />
      </div>
    )
  }
}