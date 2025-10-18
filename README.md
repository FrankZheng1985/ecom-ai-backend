# 🤖 智能体数据中台

> 为跨境独立站构建的AI智能体数据中台，支持WordPress和Strikingly平台数据统一管理

## ✨ 功能特性

- 🔄 **数据统一化**: 整合WordPress和Strikingly平台数据
- 🤖 **AI智能体支持**: 为Dify提供标准化API接口
- 📊 **实时数据同步**: WordPress API拉取 + Strikingly Webhook推送
- 🔍 **智能查询**: 支持多条件筛选和复杂查询
- 📈 **数据分析**: 订单、客户、产品数据统计分析
- 🚀 **生产就绪**: Vercel部署，支持高并发访问

## 🚀 快速开始

### 方法1: 使用启动脚本（推荐）
```bash
./start.sh
```

### 方法2: 手动启动
```bash
# 1. 安装依赖
npm install

# 2. 初始化数据库
npx prisma db push

# 3. 添加测试数据
node add-test-data.js

# 4. 启动开发服务器
npm run dev
```

## 📊 API端点

### 基础信息
- **本地地址**: http://localhost:3000
- **API文档**: http://localhost:3000/api-docs
- **健康检查**: http://localhost:3000/api/health

### 核心API
| 功能 | 端点 | 方法 | 描述 |
|------|------|------|------|
| 健康检查 | `/api/health` | GET | 系统状态和统计信息 |
| 订单查询 | `/api/dify/orders` | GET | 查询订单数据 |
| 客户查询 | `/api/dify/customers` | GET | 查询客户数据 |
| 产品查询 | `/api/dify/products` | GET | 查询产品数据 |

## 🧪 测试验证

### 运行API测试
```bash
node test-dify-apis.js
```

### 测试结果示例
```
🚀 开始测试Dify API端点...
==================================================

📊 1. 健康检查
✅ /api/health - 成功
   数据库状态: connected
   站点数量: 2
   订单数量: 3
   客户数量: 3
   产品数量: 3

📦 2. 订单查询测试
✅ /api/dify/orders - 成功
   总订单数: 3
✅ /api/dify/orders - 成功
   已完成订单: 2
✅ /api/dify/orders - 成功
   Zenbreeze订单: 2

👥 3. 客户查询测试
✅ /api/dify/customers - 成功
   总客户数: 3
✅ /api/dify/customers - 成功
   高价值客户: 1
✅ /api/dify/customers - 成功
   Sogoodtea客户: 1

🛍️ 4. 产品查询测试
✅ /api/dify/products - 成功
   总产品数: 3
✅ /api/dify/products - 成功
   茶具产品: 1
✅ /api/dify/products - 成功
   有库存产品: 3

🔍 5. 复杂查询测试
✅ /api/dify/orders - 成功
   复杂查询订单: 2
✅ /api/dify/products - 成功
   价格范围产品: 3

==================================================
🎉 API测试完成！
```

## 🤖 Dify集成

### 1. 创建智能体
1. 登录 [Dify平台](https://dify.ai)
2. 创建新的"智能体"应用
3. 命名为"电商数据助手"

### 2. 配置API工具
按照 `DIFY_INTEGRATION.md` 详细指南配置：
- 订单查询工具
- 客户查询工具
- 产品查询工具

### 3. 设置提示词
使用提供的智能体提示词模板，让AI助手能够：
- 理解电商业务场景
- 正确调用API工具
- 提供专业的数据分析

## 📁 项目结构

```
ecom-ai-backend/
├── src/app/api/              # API路由
│   ├── health/               # 健康检查
│   ├── dify/                 # Dify专用API
│   │   ├── orders/           # 订单查询
│   │   ├── customers/        # 客户查询
│   │   └── products/         # 产品查询
│   ├── sync/wordpress/       # WordPress同步
│   └── webhook/strikingly/   # Strikingly Webhook
├── prisma/                   # 数据库配置
│   └── schema.prisma         # 数据模型
├── docs/                     # 文档
│   ├── DIFY_INTEGRATION.md   # Dify集成指南
│   └── FINAL_SETUP.md        # 完整配置说明
├── scripts/                  # 脚本
│   ├── start.sh              # 快速启动脚本
│   ├── test-dify-apis.js     # API测试脚本
│   └── add-test-data.js      # 测试数据脚本
└── README.md                 # 项目说明
```

## 🗄️ 数据模型

### 核心实体
- **Site**: 站点信息 (zenbreeze, sogoodtea)
- **Order**: 订单数据 (状态、金额、客户等)
- **Customer**: 客户信息 (标签、生命周期价值等)
- **Product**: 产品信息 (分类、价格、库存等)
- **AdInsight**: 广告数据 (预留扩展)

### 数据关系
```
Site 1:N Order
Site 1:N Customer  
Site 1:N Product
Customer 1:N Order
```

## 🔧 开发命令

```bash
# 开发
npm run dev              # 启动开发服务器
npm run build            # 构建生产版本
npm run start            # 启动生产服务器

# 数据库
npx prisma db push       # 同步数据库模式
npx prisma studio        # 打开数据库管理界面

# 测试
npm run test:api         # 测试API功能
node test-dify-apis.js   # 运行Dify API测试
node add-test-data.js    # 添加测试数据
```

## 🌐 生产部署

### Vercel部署
- **生产URL**: https://ecom-ai-backend-mu.vercel.app
- **自动部署**: 推送到main分支自动触发
- **环境变量**: 需要在Vercel控制台配置

### 环境变量配置
```env
DATABASE_URL=postgresql://...
WC_CONSUMER_KEY=your_woocommerce_key
WC_CONSUMER_SECRET=your_woocommerce_secret
STRICKINGLY_WEBHOOK_SECRET=your_webhook_secret
```

## 📊 使用示例

### 查询订单
```bash
# 查询所有订单
curl "http://localhost:3000/api/dify/orders"

# 查询已完成的订单
curl "http://localhost:3000/api/dify/orders?status=completed"

# 查询特定站点的订单
curl "http://localhost:3000/api/dify/orders?site=zenbreeze"
```

### 查询客户
```bash
# 查询所有客户
curl "http://localhost:3000/api/dify/customers"

# 查询高价值客户
curl "http://localhost:3000/api/dify/customers?tags=high-value"

# 查询生命周期价值大于1000的客户
curl "http://localhost:3000/api/dify/customers?min_lifetime_value=1000"
```

### 查询产品
```bash
# 查询所有产品
curl "http://localhost:3000/api/dify/products"

# 查询茶具类产品
curl "http://localhost:3000/api/dify/products?category=tea-sets"

# 查询价格在20-100之间的产品
curl "http://localhost:3000/api/dify/products?min_price=20&max_price=100"
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

4. **依赖安装失败**
   ```bash
   # 清理缓存重新安装
   rm -rf node_modules package-lock.json
   npm install
   ```

## 📞 技术支持

### 文档资源
- [Dify集成指南](DIFY_INTEGRATION.md) - 详细的Dify配置说明
- [完整配置说明](FINAL_SETUP.md) - 项目配置总结
- [API测试脚本](test-dify-apis.js) - 自动化测试工具

### 调试方法
1. 查看服务器日志
2. 使用API测试脚本验证
3. 检查浏览器开发者工具
4. 查看数据库状态

## 🎯 下一步计划

- [ ] 配置真实数据源 (WordPress + Strikingly)
- [ ] 优化智能体提示词
- [ ] 添加更多数据分析功能
- [ ] 实现实时数据同步
- [ ] 添加数据可视化功能

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

**🎉 开始您的AI智能体之旅！**