# 📖 智能体数据中台 - 用户手册

## 🎯 项目概述

智能体数据中台是一个专为跨境独立站设计的AI智能体数据管理平台，支持WordPress和Strikingly平台的数据统一管理和智能分析。

## 🚀 快速开始

### 1. 启动项目
```bash
# 方法1：一键启动
./start.sh

# 方法2：手动启动
npm run dev
```

### 2. 访问地址
- **主页**: http://localhost:3000
- **API文档**: http://localhost:3000/api-docs
- **健康检查**: http://localhost:3000/api/health

## 📊 数据管理

### 数据同步

#### WordPress数据同步
```bash
# 手动同步WordPress数据
curl "http://localhost:3000/api/sync/wordpress"

# 测试WordPress连接
node test-wordpress-api.js
```

#### Strikingly数据同步
```bash
# 手动同步Strikingly数据
node sync-strikingly.js

# 或直接调用API
curl "http://localhost:3000/api/sync/strikingly"
```

#### 定时同步设置
```bash
# 每5分钟同步Strikingly数据
*/5 * * * * cd /path/to/ecom-ai-backend && node sync-strikingly.js

# 每小时同步一次
0 * * * * cd /path/to/ecom-ai-backend && node sync-strikingly.js
```

### 数据查询

#### 订单查询
```bash
# 查询所有订单
curl "http://localhost:3000/api/dify/orders"

# 查询已完成的订单
curl "http://localhost:3000/api/dify/orders?status=completed"

# 查询特定站点的订单
curl "http://localhost:3000/api/dify/orders?site=zenbreeze"

# 查询特定客户的订单
curl "http://localhost:3000/api/dify/orders?customer_email=john@example.com"

# 查询日期范围内的订单
curl "http://localhost:3000/api/dify/orders?start_date=2024-01-01&end_date=2024-12-31"
```

#### 客户查询
```bash
# 查询所有客户
curl "http://localhost:3000/api/dify/customers"

# 查询高价值客户
curl "http://localhost:3000/api/dify/customers?tags=high-value"

# 查询VIP客户
curl "http://localhost:3000/api/dify/customers?tags=vip"

# 查询生命周期价值大于1000的客户
curl "http://localhost:3000/api/dify/customers?min_lifetime_value=1000"

# 查询特定站点的客户
curl "http://localhost:3000/api/dify/customers?site=sogoodtea"
```

#### 产品查询
```bash
# 查询所有产品
curl "http://localhost:3000/api/dify/products"

# 查询茶具类产品
curl "http://localhost:3000/api/dify/products?category=tea-sets"

# 查询价格在20-100之间的产品
curl "http://localhost:3000/api/dify/products?min_price=20&max_price=100"

# 查询有库存的产品
curl "http://localhost:3000/api/dify/products?in_stock=true"

# 查询特定站点的产品
curl "http://localhost:3000/api/dify/products?site=zenbreeze"
```

## 🤖 Dify智能体集成

### 1. 创建智能体

1. 登录 [Dify平台](https://dify.ai)
2. 点击"创建应用"
3. 选择"智能体"类型
4. 输入应用名称: "电商数据助手"

### 2. 配置API工具

#### 订单查询工具
```
工具名称: 订单查询
工具描述: 查询订单信息，支持按站点、客户、日期等条件筛选
请求方法: GET
请求URL: http://localhost:3000/api/dify/orders
参数配置:
  - site: 站点名称 (可选)
  - customer_email: 客户邮箱 (可选)
  - start_date: 开始日期 (可选)
  - end_date: 结束日期 (可选)
  - status: 订单状态 (可选)
  - limit: 返回数量 (可选)
```

#### 客户查询工具
```
工具名称: 客户查询
工具描述: 查询客户信息，支持按站点、标签、生命周期价值等条件筛选
请求方法: GET
请求URL: http://localhost:3000/api/dify/customers
参数配置:
  - site: 站点名称 (可选)
  - email: 邮箱搜索 (可选)
  - tags: 客户标签 (可选)
  - min_lifetime_value: 最小生命周期价值 (可选)
  - limit: 返回数量 (可选)
```

#### 产品查询工具
```
工具名称: 产品查询
工具描述: 查询产品信息，支持按站点、分类、价格等条件筛选
请求方法: GET
请求URL: http://localhost:3000/api/dify/products
参数配置:
  - site: 站点名称 (可选)
  - name: 产品名称 (可选)
  - category: 产品分类 (可选)
  - min_price: 最低价格 (可选)
  - max_price: 最高价格 (可选)
  - in_stock: 是否有库存 (可选)
  - limit: 返回数量 (可选)
```

### 3. 设置智能体提示词

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

## 使用指南
1. 当用户询问订单时，使用订单查询工具
2. 当用户询问客户时，使用客户查询工具
3. 当用户询问产品时，使用产品查询工具
4. 提供清晰、准确的数据分析结果
5. 如果数据为空，说明没有符合条件的数据

请用友好、专业的语气回答用户的问题。
```

## 🧪 测试和验证

### 运行测试脚本

```bash
# 测试所有API功能
node test-dify-apis.js

# 测试WordPress连接
node test-wordpress-api.js

# 测试Strikingly Webhook
node test-strikingly-webhook.js

# 运行完整数据同步测试
node test-all-sync.js

# 查看项目演示
node demo.js
```

### 验证数据同步

```bash
# 检查系统状态
curl "http://localhost:3000/api/health"

# 检查订单数据
curl "http://localhost:3000/api/dify/orders" | jq '.data | length'

# 检查客户数据
curl "http://localhost:3000/api/dify/customers" | jq '.data | length'

# 检查产品数据
curl "http://localhost:3000/api/dify/products" | jq '.data | length'
```

## 🔧 配置管理

### 环境变量配置

编辑 `.env` 文件：

```env
# 数据库连接配置
DATABASE_URL="file:./dev.db"

# WooCommerce API配置
WC_CONSUMER_KEY="ck_your_actual_key_here"
WC_CONSUMER_SECRET="cs_your_actual_secret_here"

# Strikingly Webhook配置
STRICKINGLY_WEBHOOK_SECRET="sk_strikingly_webhook_2024_test"
```

### 数据库管理

```bash
# 重新初始化数据库
npx prisma db push

# 添加测试数据
node add-test-data.js

# 打开数据库管理界面
npx prisma studio
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

5. **Strikingly同步失败**
   ```bash
   # 手动同步Strikingly数据
   node sync-strikingly.js
   ```

### 调试方法

1. **查看服务器日志**
   - 检查终端输出的错误信息
   - 查看API响应状态码

2. **使用测试脚本**
   - 运行相应的测试脚本
   - 检查测试结果和错误信息

3. **检查环境变量**
   ```bash
   # 检查环境变量是否正确加载
   node -e "require('dotenv').config(); console.log(process.env.WC_CONSUMER_KEY);"
   ```

4. **验证API端点**
   ```bash
   # 测试各个API端点
   curl -I http://localhost:3000/api/health
   curl -I http://localhost:3000/api/dify/orders
   ```

## 📈 性能优化

### 数据库优化

1. **索引优化**
   - 为常用查询字段添加索引
   - 定期清理无用数据

2. **查询优化**
   - 使用适当的查询条件
   - 限制返回数据量

### API优化

1. **缓存策略**
   - 对频繁查询的数据进行缓存
   - 设置合理的缓存过期时间

2. **分页查询**
   - 使用limit参数限制返回数据量
   - 实现分页查询功能

## 🔒 安全考虑

### API安全

1. **认证验证**
   - 使用Webhook密钥验证请求来源
   - 实现API访问控制

2. **数据验证**
   - 验证输入参数
   - 防止SQL注入攻击

### 数据安全

1. **敏感信息保护**
   - 不要在代码中硬编码敏感信息
   - 使用环境变量存储密钥

2. **数据备份**
   - 定期备份数据库
   - 实现数据恢复机制

## 📞 技术支持

### 文档资源

- [README.md](README.md) - 项目总览
- [QUICK_START.md](QUICK_START.md) - 快速开始指南
- [DIFY_INTEGRATION.md](DIFY_INTEGRATION.md) - Dify集成指南
- [FINAL_SETUP.md](FINAL_SETUP.md) - 完整配置说明

### 获取帮助

1. 查看项目文档
2. 运行测试脚本诊断问题
3. 检查服务器日志
4. 验证环境变量配置

## 🎯 最佳实践

### 数据同步

1. **定期同步**
   - 设置合理的同步频率
   - 监控同步状态

2. **错误处理**
   - 实现重试机制
   - 记录错误日志

### 智能体配置

1. **提示词优化**
   - 根据业务需求调整提示词
   - 定期更新和优化

2. **工具配置**
   - 合理配置API工具参数
   - 测试工具功能

### 监控和维护

1. **系统监控**
   - 监控API响应时间
   - 检查数据同步状态

2. **定期维护**
   - 更新依赖包
   - 清理无用数据

---

**🎉 开始使用您的智能体数据中台吧！**
