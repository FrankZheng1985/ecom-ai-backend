# 部署指南

## 部署到Vercel

### 1. 准备代码仓库

1. 初始化Git仓库（如果还没有）：
```bash
git init
git add .
git commit -m "Initial commit: 智能体数据中台"
```

2. 推送到GitHub：
```bash
git remote add origin https://github.com/yourusername/ecom-ai-backend.git
git push -u origin main
```

### 2. 在Vercel中部署

1. 访问 [Vercel](https://vercel.com) 并登录
2. 点击 "New Project"
3. 选择你的GitHub仓库
4. 配置项目设置：
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (默认)
   - **Build Command**: `npm run build` (默认)
   - **Output Directory**: `.next` (默认)

### 3. 配置环境变量

在Vercel项目设置中添加以下环境变量：

#### 必需的环境变量
```
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@[YOUR-SUBABASE-HOST]:5432/postgres
```

#### 可选的环境变量
```
WC_CONSUMER_KEY=your_woocommerce_consumer_key
WC_CONSUMER_SECRET=your_woocommerce_consumer_secret
STRICKINGLY_WEBHOOK_SECRET=your_strikingly_webhook_secret
```

### 4. 部署

1. 点击 "Deploy" 按钮
2. 等待部署完成（通常需要2-3分钟）
3. 部署成功后，你会得到一个类似 `https://your-project.vercel.app` 的URL

## 配置Supabase数据库

### 1. 创建Supabase项目

1. 访问 [Supabase](https://supabase.com)
2. 创建新项目
3. 记录数据库连接信息

### 2. 同步数据库模式

部署完成后，需要同步数据库模式：

```bash
# 在本地运行（需要先设置DATABASE_URL）
npx prisma db push
```

或者，你可以使用Supabase的SQL编辑器直接运行生成的SQL。

## 配置Webhook

### 1. WordPress (WooCommerce)

1. 在WordPress后台进入 **WooCommerce > 设置 > 高级 > REST API**
2. 创建新的API密钥
3. 将密钥配置到Vercel环境变量中
4. 测试同步：访问 `https://your-domain.vercel.app/api/sync/wordpress`

### 2. Strikingly

1. 在Strikingly开发者设置中配置Webhook
2. 设置Webhook URL为：`https://your-domain.vercel.app/api/webhook/strikingly`
3. 配置签名验证密钥（可选但推荐）

## 测试部署

### 1. 健康检查

访问 `https://your-domain.vercel.app/api/health` 检查系统状态。

### 2. API文档

访问 `https://your-domain.vercel.app/api-docs` 查看完整的API文档。

### 3. 测试API端点

```bash
# 测试订单API
curl "https://your-domain.vercel.app/api/dify/orders?site=zenbreeze&limit=10"

# 测试客户API
curl "https://your-domain.vercel.app/api/dify/customers?site=sogoodtea&limit=10"

# 测试产品API
curl "https://your-domain.vercel.app/api/dify/products?in_stock=true&limit=10"
```

## 在Dify中配置

### 1. 创建HTTP请求节点

在Dify工作流中添加HTTP请求节点，配置以下信息：

- **URL**: `https://your-domain.vercel.app/api/dify/orders`
- **Method**: GET
- **Headers**: 根据需要添加认证头

### 2. 查询参数示例

```
# 获取特定站点的订单
?site=zenbreeze&start_date=2025-01-01&limit=20

# 获取高价值客户
?site=sogoodtea&min_lifetime_value=100

# 获取有库存的产品
?in_stock=true&category=tea
```

## 监控和维护

### 1. 日志监控

在Vercel仪表板中查看函数日志，监控API调用情况。

### 2. 数据库监控

在Supabase仪表板中监控数据库性能和存储使用情况。

### 3. 定期同步

建议设置定时任务定期同步数据：

```bash
# 使用cron job或类似服务
# 每小时同步一次WordPress数据
0 * * * * curl https://your-domain.vercel.app/api/sync/wordpress
```

## 故障排除

### 常见问题

1. **数据库连接失败**
   - 检查DATABASE_URL是否正确
   - 确认Supabase项目是否正常运行

2. **API返回500错误**
   - 检查Vercel函数日志
   - 确认环境变量是否正确配置

3. **数据同步失败**
   - 检查API密钥是否正确
   - 确认网络连接是否正常

### 联系支持

如果遇到问题，请检查：
1. Vercel函数日志
2. Supabase数据库日志
3. 网络连接状态
4. API密钥配置

## 安全建议

1. **使用HTTPS**: 所有API调用都应使用HTTPS
2. **API密钥保护**: 不要在客户端代码中暴露API密钥
3. **Webhook验证**: 启用Strikingly webhook签名验证
4. **访问控制**: 考虑添加API访问限制
5. **数据备份**: 定期备份Supabase数据库
