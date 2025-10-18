#!/usr/bin/env node

/**
 * Dify API测试脚本
 * 用于验证所有API端点的功能
 */

const BASE_URL = 'http://localhost:3000';

// 颜色输出
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testAPI(endpoint, params = {}) {
  try {
    const url = new URL(`${BASE_URL}${endpoint}`);
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        url.searchParams.append(key, params[key]);
      }
    });

    const response = await fetch(url);
    const data = await response.json();

    if (response.ok && data.success !== false) {
      log(`✅ ${endpoint} - 成功`, 'green');
      return { success: true, data };
    } else {
      log(`❌ ${endpoint} - 失败: ${data.error || '未知错误'}`, 'red');
      return { success: false, error: data.error };
    }
  } catch (error) {
    log(`❌ ${endpoint} - 网络错误: ${error.message}`, 'red');
    return { success: false, error: error.message };
  }
}

async function runTests() {
  log('🚀 开始测试Dify API端点...', 'bold');
  log('='.repeat(50), 'blue');

  // 1. 健康检查
  log('\n📊 1. 健康检查', 'yellow');
  const health = await testAPI('/api/health');
  if (health.success) {
    log(`   数据库状态: ${health.data.database}`, 'blue');
    log(`   站点数量: ${health.data.stats.sites}`, 'blue');
    log(`   订单数量: ${health.data.stats.orders}`, 'blue');
    log(`   客户数量: ${health.data.stats.customers}`, 'blue');
    log(`   产品数量: ${health.data.stats.products}`, 'blue');
  }

  // 2. 订单查询测试
  log('\n📦 2. 订单查询测试', 'yellow');
  
  // 2.1 查询所有订单
  const allOrders = await testAPI('/api/dify/orders');
  if (allOrders.success) {
    log(`   总订单数: ${allOrders.data.data?.length || 0}`, 'blue');
  }

  // 2.2 查询已完成的订单
  const completedOrders = await testAPI('/api/dify/orders', { status: 'completed' });
  if (completedOrders.success) {
    log(`   已完成订单: ${completedOrders.data.data?.length || 0}`, 'blue');
  }

  // 2.3 查询特定站点的订单
  const zenbreezeOrders = await testAPI('/api/dify/orders', { site: 'zenbreeze' });
  if (zenbreezeOrders.success) {
    log(`   Zenbreeze订单: ${zenbreezeOrders.data.data?.length || 0}`, 'blue');
  }

  // 3. 客户查询测试
  log('\n👥 3. 客户查询测试', 'yellow');
  
  // 3.1 查询所有客户
  const allCustomers = await testAPI('/api/dify/customers');
  if (allCustomers.success) {
    log(`   总客户数: ${allCustomers.data.data?.length || 0}`, 'blue');
  }

  // 3.2 查询高价值客户
  const highValueCustomers = await testAPI('/api/dify/customers', { tags: 'high-value' });
  if (highValueCustomers.success) {
    log(`   高价值客户: ${highValueCustomers.data.data?.length || 0}`, 'blue');
  }

  // 3.3 查询特定站点的客户
  const sogoodteaCustomers = await testAPI('/api/dify/customers', { site: 'sogoodtea' });
  if (sogoodteaCustomers.success) {
    log(`   Sogoodtea客户: ${sogoodteaCustomers.data.data?.length || 0}`, 'blue');
  }

  // 4. 产品查询测试
  log('\n🛍️ 4. 产品查询测试', 'yellow');
  
  // 4.1 查询所有产品
  const allProducts = await testAPI('/api/dify/products');
  if (allProducts.success) {
    log(`   总产品数: ${allProducts.data.data?.length || 0}`, 'blue');
  }

  // 4.2 查询茶具类产品
  const teaSets = await testAPI('/api/dify/products', { category: 'tea-sets' });
  if (teaSets.success) {
    log(`   茶具产品: ${teaSets.data.data?.length || 0}`, 'blue');
  }

  // 4.3 查询有库存的产品
  const inStockProducts = await testAPI('/api/dify/products', { in_stock: 'true' });
  if (inStockProducts.success) {
    log(`   有库存产品: ${inStockProducts.data.data?.length || 0}`, 'blue');
  }

  // 5. 复杂查询测试
  log('\n🔍 5. 复杂查询测试', 'yellow');
  
  // 5.1 多条件订单查询
  const complexOrders = await testAPI('/api/dify/orders', {
    site: 'zenbreeze',
    status: 'completed',
    limit: '5'
  });
  if (complexOrders.success) {
    log(`   复杂查询订单: ${complexOrders.data.data?.length || 0}`, 'blue');
  }

  // 5.2 价格范围产品查询
  const priceRangeProducts = await testAPI('/api/dify/products', {
    min_price: '20',
    max_price: '100'
  });
  if (priceRangeProducts.success) {
    log(`   价格范围产品: ${priceRangeProducts.data.data?.length || 0}`, 'blue');
  }

  log('\n' + '='.repeat(50), 'blue');
  log('🎉 API测试完成！', 'bold');
  log('\n📋 下一步操作:', 'yellow');
  log('1. 确保所有测试都显示 ✅ 成功', 'blue');
  log('2. 在Dify中配置这些API端点', 'blue');
  log('3. 开始使用智能体进行数据查询', 'blue');
  log('\n💡 提示: 如果看到 ❌ 错误，请检查本地服务器是否运行', 'yellow');
}

// 运行测试
runTests().catch(console.error);
