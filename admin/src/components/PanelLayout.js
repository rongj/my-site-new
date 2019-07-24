import React from 'react';
import '@/styles/panel.scss';

export default ({ title, children }) => (
  <div className="main-panel">
    <div className="main-panel-header">{title}</div>
    <div className="main-panel-content">{children}</div>
  </div>
)