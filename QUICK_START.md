# 🚀 智能体数据中台 - 快速开始指南

## ⚡ 一键启动

```bash
# 克隆项目（如果还没有）
git clone https://github.com/FrankZheng1985/ecom-ai-backend.git
cd ecom-ai-backend

# 一键启动
./start.sh
```

## 🔧 手动启动

```bash
# 1. 安装依赖
npm install

# 2. 初始化数据库
npx prisma db push

# 3. 添加测试数据
node add-test-data.js

# 4. 启动服务器
npm run dev
```

## 🧪 测试功能

```bash
# 测试所有API
node test-dify-apis.js

# 测试WordPress连接
node test-wordpress-api.js

# 运行完整演示
node demo.js
```

## 🌐 访问地址

- **主页**: http://localhost:3000
- **API文档**: http://localhost:3000/api-docs
- **健康检查**: http://localhost:3000/api/health

## 🤖 Dify集成

### 1. 创建智能体
1. 登录 [Dify平台](https://dify.ai)
2. 创建新的"智能体"应用
3. 命名为"电商数据助手"

### 2. 配置API工具
使用以下端点配置工具：

| 功能 | 端点 | 方法 | 描述 |
|------|------|------|------|
| 健康检查 | `http://localhost:3000/api/health` | GET | 系统状态 |
| 订单查询 | `http://localhost:3000/api/dify/orders` | GET | 查询订单 |
| 客户查询 | `http://localhost:3000/api/dify/customers` | GET | 查询客户 |
| 产品查询 | `http://localhost:3000/api/dify/products` | GET | 查询产品 |

### 3. 设置提示词
```
你是一个专业的电商数据分析助手，可以帮助用户查询和分析电商数据。

## 你的能力
- 查询订单信息（按站点、客户、日期、状态等条件）
- 查询客户信息（按站点、标签、生命周期价值等条件）
- 查询产品信息（按站点、分类、价格、库存等条件）
- 提供数据分析和洞察

## 可用站点
- zenbreeze: WordPress站点
- sogoodtea: Strikingly站点

## 订单状态
- completed: 已完成
- pending: 待处理
- processing: 处理中

## 客户标签
- high-value: 高价值客户
- loyal: 忠诚客户
- vip: VIP客户
- new-customer: 新客户
- repeat-buyer: 重复购买者

请用友好、专业的语气回答用户的问题。
```

## 📊 查询示例

### 订单查询
```bash
# 查询所有订单
curl "http://localhost:3000/api/dify/orders"

# 查询已完成的订单
curl "http://localhost:3000/api/dify/orders?status=completed"

# 查询特定站点的订单
curl "http://localhost:3000/api/dify/orders?site=zenbreeze"

# 查询特定客户的订单
curl "http://localhost:3000/api/dify/orders?customer_email=john@example.com"
```

### 客户查询
```bash
# 查询所有客户
curl "http://localhost:3000/api/dify/customers"

# 查询高价值客户
curl "http://localhost:3000/api/dify/customers?tags=high-value"

# 查询生命周期价值大于1000的客户
curl "http://localhost:3000/api/dify/customers?min_lifetime_value=1000"
```

### 产品查询
```bash
# 查询所有产品
curl "http://localhost:3000/api/dify/products"

# 查询茶具类产品
curl "http://localhost:3000/api/dify/products?category=tea-sets"

# 查询价格在20-100之间的产品
curl "http://localhost:3000/api/dify/products?min_price=20&max_price=100"
```

## 🔑 配置真实数据源

### WordPress配置
1. 登录WordPress后台
2. 进入 WooCommerce > 设置 > 高级 > REST API
3. 创建新的API密钥
4. 复制Consumer Key和Consumer Secret
5. 更新 `.env` 文件：
```env
WC_CONSUMER_KEY="ck_your_actual_key_here"
WC_CONSUMER_SECRET="cs_your_actual_secret_here"
```

### Strikingly配置
1. 登录Strikingly后台
2. 进入设置 > 集成 > Webhooks
3. 创建新的Webhook
4. 设置URL: `http://localhost:3000/api/webhook/strikingly`
5. 更新 `.env` 文件：
```env
STRICKINGLY_WEBHOOK_SECRET="your_webhook_secret_here"
```

## 🛠️ 故障排除

### 常见问题

1. **端口被占用**
   ```bash
   # 查找占用3000端口的进程
   lsof -ti:3000
   # 杀死进程
   kill -9 $(lsof -ti:3000)
   ```

2. **数据库连接失败**
   ```bash
   # 重新初始化数据库
   npx prisma db push
   ```

3. **API测试失败**
   ```bash
   # 确保服务器运行
   curl http://localhost:3000/api/health
   ```

4. **WordPress API连接失败**
   ```bash
   # 测试WordPress连接
   node test-wordpress-api.js
   ```

## 📁 项目结构

```
ecom-ai-backend/
├── src/app/api/              # API路由
│   ├── health/               # 健康检查
│   ├── dify/                 # Dify专用API
│   ├── sync/wordpress/       # WordPress同步
│   └── webhook/strikingly/   # Strikingly Webhook
├── prisma/                   # 数据库配置
├── docs/                     # 文档
├── scripts/                  # 脚本
│   ├── start.sh              # 快速启动
│   ├── demo.js               # 演示脚本
│   ├── test-dify-apis.js     # API测试
│   └── test-wordpress-api.js # WordPress测试
└── README.md                 # 项目说明
```

## 🎯 下一步

1. **配置Dify智能体** - 按照上述指南配置
2. **测试智能体功能** - 尝试各种查询
3. **配置真实数据源** - 连接您的网站
4. **扩展功能** - 根据需求添加新功能

## 🎉 开始使用！

您的智能体数据中台已经完全准备就绪！现在可以：

- ✅ 查询和分析电商数据
- ✅ 创建智能对话助手
- ✅ 自动化业务分析
- ✅ 优化运营决策

**开始您的AI智能体之旅吧！** 🚀✨
