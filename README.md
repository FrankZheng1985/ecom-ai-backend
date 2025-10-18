# 智能体数据中台

为跨境独立站智能体提供统一的数据服务，连接WordPress和Strikingly平台。

## 功能特性

- 🔄 **数据同步**: 自动同步来自WordPress和Strikingly的订单、客户和产品数据
- 🤖 **智能体支持**: 为Dify智能体提供统一的API接口
- 📊 **实时监控**: 实时监控系统状态，提供健康检查和统计信息
- 🔒 **安全可靠**: 支持API密钥验证和Webhook签名验证

## 技术栈

- **Next.js 15**: React框架，提供API路由
- **Prisma**: 现代化ORM，数据库操作
- **Supabase**: PostgreSQL数据库服务
- **TypeScript**: 类型安全的JavaScript
- **Tailwind CSS**: 现代化UI样式

## 快速开始

### 1. 环境配置

1. 复制环境变量文件：
```bash
cp .env.example .env
```

2. 配置数据库连接：
```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@[YOUR-SUBABASE-HOST]:5432/postgres"
```

3. 配置WooCommerce API（可选）：
```env
WC_CONSUMER_KEY="your_woocommerce_consumer_key"
WC_CONSUMER_SECRET="your_woocommerce_consumer_secret"
```

4. 配置Strikingly Webhook（可选）：
```env
STRICKINGLY_WEBHOOK_SECRET="your_strikingly_webhook_secret"
```

### 2. 数据库设置

1. 推送数据库模式：
```bash
npx prisma db push
```

2. 生成Prisma客户端：
```bash
npx prisma generate
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000 查看应用。

## API 接口

### 健康检查
- `GET /api/health` - 系统状态和统计信息

### 数据同步
- `GET /api/sync/wordpress` - 从WordPress同步订单数据

### Webhook
- `POST /api/webhook/strikingly` - 接收Strikingly订单数据

### Dify智能体接口
- `GET /api/dify/orders` - 订单查询接口
- `GET /api/dify/customers` - 客户查询接口
- `GET /api/dify/products` - 产品查询接口

## 部署

### Vercel部署

1. 将代码推送到GitHub仓库
2. 在Vercel中导入项目
3. 配置环境变量
4. 部署

### 环境变量配置

在Vercel项目设置中添加以下环境变量：
- `DATABASE_URL`
- `WC_CONSUMER_KEY`（可选）
- `WC_CONSUMER_SECRET`（可选）
- `STRICKINGLY_WEBHOOK_SECRET`（可选）

## 使用指南

### 1. 配置WordPress同步

1. 在WordPress后台创建WooCommerce REST API密钥
2. 将密钥配置到环境变量中
3. 访问 `/api/sync/wordpress` 同步数据

### 2. 配置Strikingly Webhook

1. 在Strikingly开发者设置中配置Webhook URL
2. 设置Webhook URL为：`https://your-domain.com/api/webhook/strikingly`
3. 配置签名验证密钥

### 3. 在Dify中使用

在Dify的HTTP请求节点中调用API：

```javascript
// 获取订单数据
GET https://your-domain.com/api/dify/orders?site=zenbreeze&start_date=2025-01-01

// 获取客户数据
GET https://your-domain.com/api/dify/customers?site=sogoodtea&min_lifetime_value=100

// 获取产品数据
GET https://your-domain.com/api/dify/products?category=tea&in_stock=true
```

## 数据模型

### 站点 (Site)
- 记录不同平台的基本信息
- 支持WordPress和Strikingly

### 订单 (Order)
- 统一的订单数据结构
- 包含客户信息和商品详情

### 客户 (Customer)
- 客户基本信息
- 生命周期价值计算
- 标签系统

### 产品 (Product)
- 产品基本信息
- 库存管理
- 分类系统

### 广告洞察 (AdInsight)
- 广告活动数据
- ROI计算
- 多平台支持

## 开发

### 项目结构

```
src/
├── app/
│   ├── api/
│   │   ├── dify/          # Dify智能体接口
│   │   ├── sync/          # 数据同步接口
│   │   ├── webhook/       # Webhook接收
│   │   └── health/        # 健康检查
│   ├── api-docs/          # API文档页面
│   └── page.tsx           # 主页
├── prisma/
│   └── schema.prisma      # 数据库模式
└── ...
```

### 添加新的数据源

1. 在Prisma schema中定义新的站点类型
2. 创建对应的同步API
3. 更新Dify接口以支持新数据源

## 许可证

MIT License