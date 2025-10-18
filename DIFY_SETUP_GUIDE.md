# 🤖 Dify智能体配置指南

## 🎯 当前ngrok URL
```
https://unexcised-brycen-weaponless.ngrok-free.dev
```

⚠️ **注意**：这是免费版URL，每次重启ngrok都会变化。已升级付费版，等待配置固定域名。

## 🔧 在Dify中配置工具

### 1. 订单查询工具
- **工具名称**：订单查询
- **URL**：`https://unexcised-brycen-weaponless.ngrok-free.dev/api/dify/orders`
- **方法**：GET
- **参数**：
  - `site` (可选): 站点名称 (zenbreeze 或 sogoodtea)
  - `customer_email` (可选): 客户邮箱
  - `start_date` (可选): 开始日期 (YYYY-MM-DD)
  - `end_date` (可选): 结束日期 (YYYY-MM-DD)
  - `status` (可选): 订单状态 (completed, pending, processing)
  - `limit` (可选): 返回数量限制 (默认50)

### 2. 客户查询工具
- **工具名称**：客户查询
- **URL**：`https://unexcised-brycen-weaponless.ngrok-free.dev/api/dify/customers`
- **方法**：GET
- **参数**：
  - `site` (可选): 站点名称 (zenbreeze 或 sogoodtea)
  - `email` (可选): 客户邮箱
  - `tags` (可选): 客户标签 (high-value, loyal, vip, new-customer, repeat-buyer)
  - `min_lifetime_value` (可选): 最小生命周期价值
  - `limit` (可选): 返回数量限制 (默认50)

### 3. 产品查询工具
- **工具名称**：产品查询
- **URL**：`https://unexcised-brycen-weaponless.ngrok-free.dev/api/dify/products`
- **方法**：GET
- **参数**：
  - `site` (可选): 站点名称 (zenbreeze 或 sogoodtea)
  - `name` (可选): 产品名称
  - `category` (可选): 产品分类 (tea-sets, green-tea, accessories)
  - `min_price` (可选): 最低价格
  - `max_price` (可选): 最高价格
  - `in_stock` (可选): 是否有库存 (true 或 false)
  - `limit` (可选): 返回数量限制 (默认50)

## 🧪 测试问题

在Dify中测试以下问题：

1. **"查询所有订单"**
2. **"显示高价值客户"**
3. **"查看茶具类产品"**
4. **"统计今天的销售额"**
5. **"显示zenbreeze站点的订单"**
6. **"查找VIP客户"**

## ⚠️ 重要提醒

### ngrok URL是临时的
- 每次重启ngrok都会生成新的URL
- 需要重新在Dify中更新URL

### 获取稳定URL的方法
1. **升级ngrok付费版**：获得固定域名
2. **部署到Vercel**：获得永久URL
3. **使用其他内网穿透服务**

## 🚀 下一步操作

1. **在Dify中更新所有工具的URL**
2. **测试智能体功能**
3. **根据需要调整工作流**
4. **考虑部署到生产环境**

## 📊 当前数据状态

- **订单数**：6个
- **客户数**：多个
- **产品数**：多个
- **总销售额**：$476.44

## 🔗 相关链接

- **API文档**：https://unexcised-brycen-weaponless.ngrok-free.dev/api-docs
- **健康检查**：https://unexcised-brycen-weaponless.ngrok-free.dev/api/health
- **OpenAPI规范**：https://unexcised-brycen-weaponless.ngrok-free.dev/api/openapi
