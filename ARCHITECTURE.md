# 🏗️ 智能体数据中台 - 系统架构

## 📋 架构概述

智能体数据中台采用现代化的微服务架构，支持多平台数据集成和AI智能体交互。

## 🎯 核心组件

### 1. 前端层 (Frontend Layer)
```
Next.js 15 + TypeScript + Tailwind CSS
├── 主页 (/)
├── API文档页面 (/api-docs)
└── 响应式设计
```

### 2. API层 (API Layer)
```
Next.js API Routes
├── 健康检查 (/api/health)
├── 数据同步API
│   ├── WordPress同步 (/api/sync/wordpress)
│   └── Strikingly同步 (/api/sync/strikingly)
├── Webhook接收
│   └── Strikingly Webhook (/api/webhook/strikingly)
└── Dify集成API
    ├── 订单查询 (/api/dify/orders)
    ├── 客户查询 (/api/dify/customers)
    └── 产品查询 (/api/dify/products)
```

### 3. 数据层 (Data Layer)
```
Prisma ORM + 数据库
├── 开发环境: SQLite (dev.db)
├── 生产环境: PostgreSQL (Supabase)
└── 数据模型
    ├── Site (站点)
    ├── Order (订单)
    ├── Customer (客户)
    ├── Product (产品)
    └── AdInsight (广告数据)
```

### 4. 外部集成 (External Integrations)
```
数据源平台
├── WordPress WooCommerce
│   ├── REST API拉取
│   └── 订单/产品数据
└── Strikingly
    ├── 定期API同步
    └── 订单/客户数据
```

### 5. AI智能体层 (AI Agent Layer)
```
Dify平台集成
├── 智能体配置
├── API工具集成
└── 对话管理
```

## 🔄 数据流架构

### 数据同步流程
```
外部平台 → API同步 → 数据中台 → 统一存储 → AI智能体
    ↓           ↓         ↓         ↓         ↓
WordPress → 定期拉取 → 数据处理 → 数据库 → Dify查询
Strikingly → 定期同步 → 数据验证 → 统一格式 → 智能分析
```

### API调用流程
```
Dify智能体 → API请求 → 数据中台 → 数据库查询 → 结果返回
    ↓           ↓         ↓         ↓         ↓
用户问题 → 工具调用 → 参数验证 → 数据检索 → 智能回答
```

## 🛠️ 技术栈

### 后端技术
- **框架**: Next.js 15
- **语言**: TypeScript
- **ORM**: Prisma
- **数据库**: SQLite (开发) / PostgreSQL (生产)
- **部署**: Vercel

### 前端技术
- **框架**: Next.js 15
- **样式**: Tailwind CSS
- **类型**: TypeScript

### 外部服务
- **数据库**: Supabase (PostgreSQL)
- **部署**: Vercel
- **AI平台**: Dify
- **数据源**: WordPress WooCommerce, Strikingly

## 📊 数据模型关系

```
Site (站点)
├── 1:N Order (订单)
├── 1:N Customer (客户)
└── 1:N Product (产品)

Customer (客户)
└── 1:N Order (订单)

Order (订单)
├── N:1 Site (站点)
└── N:1 Customer (客户)

Product (产品)
└── N:1 Site (站点)
```

## 🔐 安全架构

### API安全
- **认证**: Webhook密钥验证
- **授权**: 基于角色的访问控制
- **验证**: 输入参数验证

### 数据安全
- **加密**: 敏感数据加密存储
- **备份**: 定期数据备份
- **隔离**: 环境隔离 (开发/生产)

## 🚀 部署架构

### 开发环境
```
本地开发
├── Next.js开发服务器 (localhost:3000)
├── SQLite数据库 (dev.db)
└── 环境变量 (.env)
```

### 生产环境
```
Vercel部署
├── 无服务器函数
├── Supabase数据库
├── 环境变量配置
└── 自动部署 (GitHub集成)
```

## 📈 扩展性设计

### 水平扩展
- **无服务器架构**: 自动扩缩容
- **数据库优化**: 索引和查询优化
- **缓存策略**: 数据缓存机制

### 功能扩展
- **新数据源**: 支持更多平台集成
- **新API端点**: 易于添加新的查询接口
- **新数据模型**: 灵活的数据结构设计

## 🔧 监控和运维

### 系统监控
- **健康检查**: `/api/health` 端点
- **日志记录**: 详细的错误和操作日志
- **性能监控**: API响应时间监控

### 数据监控
- **同步状态**: 数据同步成功/失败监控
- **数据质量**: 数据完整性检查
- **业务指标**: 订单、客户、产品统计

## 🎯 最佳实践

### 开发实践
- **代码规范**: TypeScript严格模式
- **错误处理**: 统一的错误处理机制
- **测试覆盖**: 完整的测试脚本

### 部署实践
- **环境隔离**: 开发/生产环境分离
- **配置管理**: 环境变量管理
- **版本控制**: Git版本控制

### 运维实践
- **监控告警**: 系统状态监控
- **日志管理**: 结构化日志记录
- **备份恢复**: 数据备份策略

---

**🏗️ 这是一个现代化、可扩展、高性能的智能体数据中台架构！**
