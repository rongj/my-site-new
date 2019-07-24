import React, { Component } from 'react';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
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

    // 显示自定义的按钮图标
    let showLabelButtons =  Array.isArray(yAxisLabels) && yAxisLabels.length;
		let currentIndex = null;
		let currentKey = null;
		if(showLabelButtons) {
			currentIndex = yAxisLabels.indexOf(yAxisLabelSelected);
			currentKey = yAxisKey[currentIndex === -1 ? 0 : currentIndex];
		}
		const MAX_LABEL_LENGTH = 4;
		// 显示图例
		let showLabelLegends =  Array.isArray(legendLabels) && legendLabels.length;
    if(showLabelButtons && !showLabelLegends) {
      // 当前选中的yAxisKey
      seriesData = [{
        name: yAxisLabelSelected,
        type: 'line',
        showSymbol: false,
        data: dataSource.map(l => l[currentKey])
      }]
    }
    // 显示多图例
    else if(!showLabelButtons && showLabelLegends) {
      seriesData = yAxisKey.map((item, i) => ({
        name: Array.isArray(legendLabels) ? legendLabels[i] : item,
        type: 'line',
        showSymbol: false,
        zlevel: yAxisKey.length - i,
        data: dataSource.map(l => l[item])
      }))
		}
		// 显示自定义按钮和图例
    else if(showLabelButtons && Array.isArray(yAxisKey) && Array.isArray(yAxisKey[0])) {
			// 当前选中的yAxisKey
      seriesData = currentKey.map((item, i) => ({
        name: Array.isArray(legendLabels) && Array.isArray(yAxisKey[0]) ? legendLabels[currentIndex][i] : item,
        type: 'line',
        showSymbol: false,
        zlevel: currentKey.length - i,
        data: dataSource.map(l => l[item])
      }))
    }
    // 只有一条线
    else if(typeof(yAxisKey) === 'string') {
      seriesData = [{
        name: seriesName || yAxisKey,
        type: 'line',
        showSymbol: false,
        data: dataSource.map(l => l[yAxisKey])
      }]
    }

    const getOptions = () => {
      return {
        grid: {
          left: 10,
          right: 30,
          bottom: 20,
          top: showLabelLegends ? 40 : 20,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data: showLabelLegends && Array.isArray(legendLabels[0]) ? legendLabels[currentIndex] : legendLabels,
          right: 30,
          show: showLabelLegends
        },
        color: colors,
        xAxis: {
          type: 'category',
          boundaryGap: false,
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
      <div className="chart chart-line">
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