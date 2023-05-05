# 财务后台管理系统

系统框架是[ant design pro](https://pro.ant.design)，基础 UI 框架是[ant design](https://3x.ant.design/docs/react/introduce-cn)

## 环境准备

安装 `node_modules`:

```bash
npm install
```

or

```bash
yarn
```

## 提供脚本

脚本配置在 `package.json`.

### 启动项目

```bash
npm start
```

### 打包测试项目

```bash
npm run build:test
```

### 打包线上项目

```bash
npm run build:prod
```

### 检测代码

```bash
npm run lint
```

自动修复某些 lint 错误的脚本:

```bash
npm run lint:fix
```

## 版本更新信息

### 更新日志

#### [1.0.0] - 2021-12-02

##### 新增

- 预付款订单-预付订单，新增 `退款金额` 的列表项，`退款时间` 的搜索项
- 销售订单同步-需同步订单列表，同步门诊、同步代理商、同步医生、同步业务员、同步订单、批量同步功能
- 订单详情，增加 同步信息（操作人、 同步方式 、同步患者编号、同步订单号、同步批次号、 同步订单类型）

##### 删除

- 预付款订单-预付订单、预付账单，`退款` 功能页面去掉 `退款时间` 表单项
