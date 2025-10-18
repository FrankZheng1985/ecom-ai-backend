#!/usr/bin/env node

/**
 * Dify集成测试脚本
 * 用于验证所有API端点是否正常工作
 */

const BASE_URL = 'https://unexcised-brycen-weaponless.ngrok-free.dev';

// 颜色输出
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testDifyIntegration() {
  log('\n' + colors.yellow + '🤖 Dify集成测试' + colors.reset);
  log(colors.cyan + '==================================================' + colors.reset);

  // 1. 健康检查
  log('\n' + colors.yellow + '📊 1. 系统健康检查' + colors.reset);
  try {
    const healthResponse = await fetch(`${BASE_URL}/api/health`);
    const healthData = await healthResponse.json();
    if (healthResponse.ok && healthData.status === 'healthy') {
      log('✅ 系统状态正常', 'green');
      log(`   数据库: ${healthData.database}`, 'blue');
      log(`   站点数: ${healthData.stats.sites}`, 'blue');
      log(`   订单数: ${healthData.stats.orders}`, 'blue');
      log(`   客户数: ${healthData.stats.customers}`, 'blue');
      log(`   产品数: ${healthData.stats.products}`, 'blue');
    } else {
      log(`❌ 系统状态异常: ${healthData.status}`, 'red');
    }
  } catch (error) {
    log(`❌ 健康检查失败: ${error.message}`, 'red');
  }

  // 2. 订单API测试
  log('\n' + colors.yellow + '📦 2. 订单API测试' + colors.reset);
  const orderTests = [
    { name: '查询所有订单', url: '/api/dify/orders' },
    { name: '查询已完成订单', url: '/api/dify/orders?status=completed' },
    { name: '查询zenbreeze站点订单', url: '/api/dify/orders?site=zenbreeze' },
    { name: '查询sogoodtea站点订单', url: '/api/dify/orders?site=sogoodtea' },
    { name: '限制返回数量', url: '/api/dify/orders?limit=2' }
  ];

  for (const test of orderTests) {
    try {
      const response = await fetch(`${BASE_URL}${test.url}`);
      const data = await response.json();
      if (response.ok && data.success) {
        log(`   ✅ ${test.name}: 成功 (${data.count || data.data?.length || 0}条记录)`, 'green');
      } else {
        log(`   ❌ ${test.name}: 失败 - ${data.error || '未知错误'}`, 'red');
      }
    } catch (error) {
      log(`   ❌ ${test.name}: 请求失败 - ${error.message}`, 'red');
    }
  }

  // 3. 客户API测试
  log('\n' + colors.yellow + '👥 3. 客户API测试' + colors.reset);
  const customerTests = [
    { name: '查询所有客户', url: '/api/dify/customers' },
    { name: '查询高价值客户', url: '/api/dify/customers?tags=high-value' },
    { name: '查询VIP客户', url: '/api/dify/customers?tags=vip' },
    { name: '查询生命周期价值>1000的客户', url: '/api/dify/customers?min_lifetime_value=1000' },
    { name: '限制返回数量', url: '/api/dify/customers?limit=2' }
  ];

  for (const test of customerTests) {
    try {
      const response = await fetch(`${BASE_URL}${test.url}`);
      const data = await response.json();
      if (response.ok && data.success) {
        log(`   ✅ ${test.name}: 成功 (${data.count || data.data?.length || 0}条记录)`, 'green');
      } else {
        log(`   ❌ ${test.name}: 失败 - ${data.error || '未知错误'}`, 'red');
      }
    } catch (error) {
      log(`   ❌ ${test.name}: 请求失败 - ${error.message}`, 'red');
    }
  }

  // 4. 产品API测试
  log('\n' + colors.yellow + '🛍️ 4. 产品API测试' + colors.reset);
  const productTests = [
    { name: '查询所有产品', url: '/api/dify/products' },
    { name: '查询茶具类产品', url: '/api/dify/products?category=tea-sets' },
    { name: '查询绿茶类产品', url: '/api/dify/products?category=green-tea' },
    { name: '查询配件类产品', url: '/api/dify/products?category=accessories' },
    { name: '查询价格>50的产品', url: '/api/dify/products?min_price=50' },
    { name: '限制返回数量', url: '/api/dify/products?limit=2' }
  ];

  for (const test of productTests) {
    try {
      const response = await fetch(`${BASE_URL}${test.url}`);
      const data = await response.json();
      if (response.ok && data.success) {
        log(`   ✅ ${test.name}: 成功 (${data.count || data.data?.length || 0}条记录)`, 'green');
      } else {
        log(`   ❌ ${test.name}: 失败 - ${data.error || '未知错误'}`, 'red');
      }
    } catch (error) {
      log(`   ❌ ${test.name}: 请求失败 - ${error.message}`, 'red');
    }
  }

  // 5. 业务数据分析
  log('\n' + colors.yellow + '📈 5. 业务数据分析' + colors.reset);
  try {
    const ordersResponse = await fetch(`${BASE_URL}/api/dify/orders`);
    const ordersData = await ordersResponse.json();
    if (ordersData.success) {
      log(`   总销售额: $${ordersData.stats?.totalRevenue?.toFixed(2) || '0.00'}`, 'magenta');
      log(`   总订单数: ${ordersData.stats?.totalOrders || 0}`, 'magenta');
      log(`   平均订单价值: $${((ordersData.stats?.totalRevenue || 0) / (ordersData.stats?.totalOrders || 1)).toFixed(2)}`, 'magenta');
      
      // 订单状态分布
      const statusCounts = ordersData.data?.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {}) || {};
      
      log('   订单状态分布:', 'blue');
      for (const status in statusCounts) {
        log(`     ${status}: ${statusCounts[status]}`, 'cyan');
      }
    }
  } catch (error) {
    log(`❌ 业务数据分析失败: ${error.message}`, 'red');
  }

  log(colors.cyan + '\n==================================================' + colors.reset);
  log(colors.yellow + '🎉 Dify集成测试完成！' + colors.reset);
  log(colors.yellow + '\n📋 下一步操作:' + colors.reset);
  log('1. 在Dify中更新所有工具的URL', 'blue');
  log('2. 测试智能体对话功能', 'blue');
  log('3. 根据需要调整工作流', 'blue');
  log(colors.yellow + '\n🔗 Dify配置URL:' + colors.reset);
  log('订单查询: https://unexcised-brycen-weaponless.ngrok-free.dev/api/dify/orders', 'cyan');
  log('客户查询: https://unexcised-brycen-weaponless.ngrok-free.dev/api/dify/customers', 'cyan');
  log('产品查询: https://unexcised-brycen-weaponless.ngrok-free.dev/api/dify/products', 'cyan');
}

testDifyIntegration();
