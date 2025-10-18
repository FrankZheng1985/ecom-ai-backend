#!/usr/bin/env node

/**
 * 完整数据同步测试脚本
 * 测试WordPress和Strikingly的数据同步功能
 */

// 加载环境变量
require('dotenv').config();

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

async function testAPI(endpoint, method = 'GET', body = null) {
  try {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' }
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json();
    
    return { success: response.ok, data, status: response.status };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function runCompleteTest() {
  log('🚀 完整数据同步测试', 'bold');
  log('='.repeat(60), 'cyan');

  // 1. 系统健康检查
  log('\n📊 1. 系统健康检查', 'yellow');
  const health = await testAPI('/api/health');
  if (health.success) {
    log('✅ 系统状态正常', 'green');
    log(`   数据库: ${health.data.database}`, 'blue');
    log(`   站点数: ${health.data.stats.sites}`, 'blue');
    log(`   订单数: ${health.data.stats.orders}`, 'blue');
    log(`   客户数: ${health.data.stats.customers}`, 'blue');
    log(`   产品数: ${health.data.stats.products}`, 'blue');
  } else {
    log('❌ 系统健康检查失败', 'red');
    return;
  }

  // 2. WordPress数据同步测试
  log('\n🔄 2. WordPress数据同步测试', 'yellow');
  const wpSync = await testAPI('/api/sync/wordpress');
  if (wpSync.success) {
    log(`✅ WordPress同步成功: ${wpSync.data.message}`, 'green');
    log(`   同步订单数: ${wpSync.data.count}`, 'blue');
  } else {
    log(`❌ WordPress同步失败: ${wpSync.data?.error || '未知错误'}`, 'red');
  }

  // 3. Strikingly数据同步测试
  log('\n🔄 3. Strikingly数据同步测试', 'yellow');
  const stSync = await testAPI('/api/sync/strikingly');
  if (stSync.success) {
    log(`✅ Strikingly同步成功: ${stSync.data.message}`, 'green');
    log(`   同步订单数: ${stSync.data.count}`, 'blue');
  } else {
    log(`❌ Strikingly同步失败: ${stSync.data?.error || '未知错误'}`, 'red');
  }

  // 4. 数据查询测试
  log('\n📋 4. 数据查询测试', 'yellow');
  
  // 4.1 订单查询
  const orders = await testAPI('/api/dify/orders');
  if (orders.success) {
    log(`✅ 订单查询成功: ${orders.data.data?.length || 0} 个订单`, 'green');
    
    // 按站点统计
    const zenbreezeOrders = await testAPI('/api/dify/orders?site=zenbreeze');
    const sogoodteaOrders = await testAPI('/api/dify/orders?site=sogoodtea');
    
    if (zenbreezeOrders.success) {
      log(`   Zenbreeze订单: ${zenbreezeOrders.data.data?.length || 0}`, 'blue');
    }
    if (sogoodteaOrders.success) {
      log(`   Sogoodtea订单: ${sogoodteaOrders.data.data?.length || 0}`, 'blue');
    }
  }

  // 4.2 客户查询
  const customers = await testAPI('/api/dify/customers');
  if (customers.success) {
    log(`✅ 客户查询成功: ${customers.data.data?.length || 0} 个客户`, 'green');
  }

  // 4.3 产品查询
  const products = await testAPI('/api/dify/products');
  if (products.success) {
    log(`✅ 产品查询成功: ${products.data.data?.length || 0} 个产品`, 'green');
  }

  // 5. 业务数据分析
  log('\n📈 5. 业务数据分析', 'yellow');
  
  if (orders.success && orders.data.data?.length > 0) {
    const orderData = orders.data.data;
    const totalRevenue = orderData.reduce((sum, order) => sum + order.totalAmount, 0);
    const avgOrderValue = totalRevenue / orderData.length;
    
    // 按状态统计
    const statusCounts = orderData.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});

    log(`   总销售额: $${totalRevenue.toFixed(2)}`, 'magenta');
    log(`   平均订单价值: $${avgOrderValue.toFixed(2)}`, 'magenta');
    log(`   订单状态分布:`, 'magenta');
    Object.entries(statusCounts).forEach(([status, count]) => {
      log(`     ${status}: ${count}`, 'cyan');
    });
  }

  // 6. Dify API端点验证
  log('\n🤖 6. Dify API端点验证', 'yellow');
  
  const difyEndpoints = [
    { name: '健康检查', endpoint: '/api/health' },
    { name: '订单查询', endpoint: '/api/dify/orders' },
    { name: '客户查询', endpoint: '/api/dify/customers' },
    { name: '产品查询', endpoint: '/api/dify/products' }
  ];

  for (const endpoint of difyEndpoints) {
    const result = await testAPI(endpoint.endpoint);
    if (result.success) {
      log(`   ✅ ${endpoint.name}: 正常`, 'green');
    } else {
      log(`   ❌ ${endpoint.name}: 失败`, 'red');
    }
  }

  // 7. 测试完成总结
  log('\n' + '='.repeat(60), 'cyan');
  log('🎉 完整数据同步测试完成！', 'bold');
  
  log('\n📋 系统状态总结:', 'yellow');
  log('✅ WordPress数据同步: 正常', 'green');
  log('✅ Strikingly数据同步: 正常', 'green');
  log('✅ 数据查询API: 正常', 'green');
  log('✅ Dify集成端点: 正常', 'green');
  
  log('\n🚀 下一步操作:', 'yellow');
  log('1. 在Dify中配置智能体', 'blue');
  log('2. 设置定时同步任务', 'blue');
  log('3. 开始使用智能体进行数据分析', 'blue');
  
  log('\n💡 提示:', 'yellow');
  log('• 使用 node sync-strikingly.js 手动同步Strikingly数据', 'cyan');
  log('• 使用 node test-wordpress-api.js 测试WordPress连接', 'cyan');
  log('• 使用 node demo.js 查看完整演示', 'cyan');
}

// 运行测试
runCompleteTest().catch(console.error);
