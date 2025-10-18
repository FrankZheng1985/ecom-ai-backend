#!/usr/bin/env node

/**
 * 智能体数据中台演示脚本
 * 展示各种API查询功能
 */

const BASE_URL = 'http://localhost:3000';

// 颜色输出
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function fetchAPI(endpoint, params = {}) {
  try {
    const url = new URL(`${BASE_URL}${endpoint}`);
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        url.searchParams.append(key, params[key]);
      }
    });

    const response = await fetch(url);
    const data = await response.json();
    return { success: response.ok, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function demo() {
  log('🎭 智能体数据中台演示', 'bold');
  log('='.repeat(50), 'cyan');
  
  // 1. 系统状态
  log('\n📊 1. 系统状态检查', 'yellow');
  const health = await fetchAPI('/api/health');
  if (health.success) {
    log(`   状态: ${health.data.status}`, 'green');
    log(`   数据库: ${health.data.database}`, 'green');
    log(`   时间: ${health.data.timestamp}`, 'blue');
    log(`   数据统计:`, 'blue');
    log(`     - 站点: ${health.data.stats.sites}`, 'blue');
    log(`     - 订单: ${health.data.stats.orders}`, 'blue');
    log(`     - 客户: ${health.data.stats.customers}`, 'blue');
    log(`     - 产品: ${health.data.stats.products}`, 'blue');
  }

  // 2. 订单分析
  log('\n📦 2. 订单数据分析', 'yellow');
  
  // 2.1 所有订单
  const allOrders = await fetchAPI('/api/dify/orders');
  if (allOrders.success) {
    log(`   总订单数: ${allOrders.data.data?.length || 0}`, 'green');
    log(`   总销售额: $${allOrders.data.stats?.totalRevenue || 0}`, 'green');
  }

  // 2.2 按状态分析
  const completedOrders = await fetchAPI('/api/dify/orders', { status: 'completed' });
  const pendingOrders = await fetchAPI('/api/dify/orders', { status: 'pending' });
  
  if (completedOrders.success) {
    log(`   已完成订单: ${completedOrders.data.data?.length || 0}`, 'blue');
  }
  if (pendingOrders.success) {
    log(`   待处理订单: ${pendingOrders.data.data?.length || 0}`, 'blue');
  }

  // 2.3 按站点分析
  const zenbreezeOrders = await fetchAPI('/api/dify/orders', { site: 'zenbreeze' });
  const sogoodteaOrders = await fetchAPI('/api/dify/orders', { site: 'sogoodtea' });
  
  if (zenbreezeOrders.success) {
    log(`   Zenbreeze订单: ${zenbreezeOrders.data.data?.length || 0}`, 'blue');
  }
  if (sogoodteaOrders.success) {
    log(`   Sogoodtea订单: ${sogoodteaOrders.data.data?.length || 0}`, 'blue');
  }

  // 3. 客户分析
  log('\n👥 3. 客户数据分析', 'yellow');
  
  // 3.1 所有客户
  const allCustomers = await fetchAPI('/api/dify/customers');
  if (allCustomers.success) {
    log(`   总客户数: ${allCustomers.data.data?.length || 0}`, 'green');
  }

  // 3.2 高价值客户
  const highValueCustomers = await fetchAPI('/api/dify/customers', { tags: 'high-value' });
  if (highValueCustomers.success) {
    log(`   高价值客户: ${highValueCustomers.data.data?.length || 0}`, 'blue');
    if (highValueCustomers.data.data?.length > 0) {
      const customer = highValueCustomers.data.data[0];
      log(`     示例: ${customer.name} (${customer.email}) - $${customer.lifetimeValue}`, 'cyan');
    }
  }

  // 3.3 VIP客户
  const vipCustomers = await fetchAPI('/api/dify/customers', { tags: 'vip' });
  if (vipCustomers.success) {
    log(`   VIP客户: ${vipCustomers.data.data?.length || 0}`, 'blue');
  }

  // 4. 产品分析
  log('\n🛍️ 4. 产品数据分析', 'yellow');
  
  // 4.1 所有产品
  const allProducts = await fetchAPI('/api/dify/products');
  if (allProducts.success) {
    log(`   总产品数: ${allProducts.data.data?.length || 0}`, 'green');
  }

  // 4.2 按分类分析
  const teaSets = await fetchAPI('/api/dify/products', { category: 'tea-sets' });
  const greenTea = await fetchAPI('/api/dify/products', { category: 'green-tea' });
  const accessories = await fetchAPI('/api/dify/products', { category: 'accessories' });
  
  if (teaSets.success) {
    log(`   茶具类产品: ${teaSets.data.data?.length || 0}`, 'blue');
  }
  if (greenTea.success) {
    log(`   绿茶类产品: ${greenTea.data.data?.length || 0}`, 'blue');
  }
  if (accessories.success) {
    log(`   配件类产品: ${accessories.data.data?.length || 0}`, 'blue');
  }

  // 4.3 价格分析
  const expensiveProducts = await fetchAPI('/api/dify/products', { min_price: '50' });
  const affordableProducts = await fetchAPI('/api/dify/products', { max_price: '50' });
  
  if (expensiveProducts.success) {
    log(`   高价产品(>$50): ${expensiveProducts.data.data?.length || 0}`, 'blue');
  }
  if (affordableProducts.success) {
    log(`   平价产品(<$50): ${affordableProducts.data.data?.length || 0}`, 'blue');
  }

  // 5. 业务洞察
  log('\n💡 5. 业务洞察', 'yellow');
  
  // 计算平均订单价值
  if (allOrders.success && allOrders.data.data?.length > 0) {
    const totalRevenue = allOrders.data.stats?.totalRevenue || 0;
    const orderCount = allOrders.data.data.length;
    const avgOrderValue = totalRevenue / orderCount;
    log(`   平均订单价值: $${avgOrderValue.toFixed(2)}`, 'magenta');
  }

  // 计算客户平均生命周期价值
  if (allCustomers.success && allCustomers.data.data?.length > 0) {
    const totalLTV = allCustomers.data.data.reduce((sum, customer) => sum + (customer.lifetimeValue || 0), 0);
    const avgLTV = totalLTV / allCustomers.data.data.length;
    log(`   客户平均生命周期价值: $${avgLTV.toFixed(2)}`, 'magenta');
  }

  // 6. 智能体查询示例
  log('\n🤖 6. 智能体查询示例', 'yellow');
  log('   以下是一些智能体可以回答的问题示例:', 'blue');
  log('   • "查询所有已完成的订单"', 'cyan');
  log('   • "分析高价值客户的特征"', 'cyan');
  log('   • "哪些产品最受欢迎？"', 'cyan');
  log('   • "比较两个站点的销售表现"', 'cyan');
  log('   • "推荐给新客户的产品"', 'cyan');
  log('   • "预测下个月的销售趋势"', 'cyan');

  log('\n' + '='.repeat(50), 'cyan');
  log('🎉 演示完成！您的智能体数据中台已准备就绪！', 'bold');
  log('\n📋 下一步:', 'yellow');
  log('1. 在Dify中创建智能体', 'blue');
  log('2. 配置API工具', 'blue');
  log('3. 开始智能对话！', 'blue');
  log('\n💡 提示: 使用 ./start.sh 快速启动项目', 'yellow');
}

// 运行演示
demo().catch(console.error);
