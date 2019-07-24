import React from 'react';
import { Table } from 'antd';
// import { isWeekend } from '@/utils/tools';

// const renderWeekend = (showWeekend, record) => {
//   let weekKey = typeof(showWeekend) === 'string' ? showWeekend : 'dt';
//   return isWeekend(record[weekKey]) ? 'tr-weekend' : '';
// }

export default ({
  loading = false,
  dataSource,
  columns,
  rowKey = (record, i) => i,
  scroll = { x: '100%' },
  // showWeekend = false,
  ...props
}) => (
  <Table
    size="small"
    bordered={false}
    loading={loading}
    dataSource={dataSource}
    columns={columns}
    rowKey={rowKey}
    scroll={scroll}
    pagination={false}
    // pagination={dataSource.length > 100 ? {
    //   size: 'default',
    //   pageSize: 15
    // } : false}
    // rowClassName={showWeekend ? renderWeekend.bind(null, showWeekend) : '' }
    {...props} />
)