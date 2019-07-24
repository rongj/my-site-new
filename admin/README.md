# 对外数据中心
> 基于[create-react-app](https://github.com/facebook/create-react-app)构建开发，使用[mobx](https://cn.mobx.js.org/)做数据流管理

[![react](https://img.shields.io/badge/react-^16.8.6-61dafb.svg?style=flat-square)](https://github.com/facebook/react)
[![antd](https://img.shields.io/badge/antd-^3.18.2-1890ff.svg?style=flat-square)](https://github.com/ant-design/ant-design)
[![mobx](https://img.shields.io/badge/mobx-^5.10.1-green.svg?style=flat-square)](https://github.com/mobxjs/mobx)

## 如何运行
```bash
# 安装依赖
npm install

# 开发
npm start
open http://localhost:8082

# 发布（上线）打包
npm run build
```


## 项目结构说明

```bash
┌── /build/               # 输出目录
├── /public/              # html文件、图标、文件模板
├── /config/              # create-react-app配置目录
├── /scripts/             # create-react-app解包目录
├─┬ /src/                 # 项目源码目录
│ ├── /assets/            # 静态资源图片
│ ├── /components/        # 组件目录
│ ├── /icons/             # 项目依赖图标
│ ├─┬ /services/          # 接口目录
│ │ ├── index.js          # 导出文件
│ │ └── auth.js           # 权限相关接口
│ ├─┬ /stores/            # 状态目录
│ │ ├── globalStore.js    # mobx全局状态
│ │ └── index.js          # mobx入口文件
│ ├── /styles/            # 样式目录
│ ├─┬ /utils/             # 工具方法目录
│ │ ├── tools.js          # 封装通用方法
│ │ ├── message.js        # 提示toast
│ │ └── request.js        # 请求通用配置
│ ├── /pages/             # 页面目录
│ │ └─┬ **                # 页面通用文件
│ │   ├── FormLayout.js   # 表单查询条件组件
│ │   ├── TablePanel.js   # 页面表格
│ │   ├── TableDetail.js  # 详细表格
│ │   ├── store.js        # 当前页面状态
│ │   ├── service.js      # 当前页面接口
│ │   └── Index.js        # 页面入口文件
│ ├── App.js              # 主视图和路由配置
│ └── index.js            # 启动挂载文件
└── package.json          # 项目依赖
```

## 页面相关文件说明
> 为方便开发复制降低开发维护，各文目录文件名保持一致, 组件、接口、状态监听名称保持一致

- `FormLayout.js` 页面通用表单组件,数据来源`store.js`的`formData`,与按月或详情公用方便维护
- `TablePanel.js` 页面主表格面板组件, 通常与按月查询(表格字段相同)公用
- `TableDetail.js` 主表格点击进去的详细表格数据，与主表格字段存在较大差异
- `store.js` 当前页面状态管理文件
- `service.js` 当前页面接口地址文件

## 项目维护

| 角色     | 人员    |
| ------- | --------|
| 前端开发 | 【荣杰】 |
| 后端开发 | 【张浩东】【詹学佳】【胡畔】 |

## 项目开发
- ##### 接口地址
[数据开发平台](http://dc.021.com/datadev/)提供

- ##### 开发阶段
开发测试使用本机ip, 方便测试调试
http://172.18.28.0/foreign-dc/build/index.html

- ##### 上线
打包build目录命名ROOT.zip 发给张浩东或者詹学佳上线
> 线上地址: http://dc.021.com/foreign-dc/
