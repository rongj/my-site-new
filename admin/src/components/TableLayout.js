import React from 'react';
import { Table } from 'antd';

export default ({
  loading = false,
  dataSource,
  columns,
  rowKey = (record, i) => i,
  scroll = { x: '100%' },
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
    {...props} />
)