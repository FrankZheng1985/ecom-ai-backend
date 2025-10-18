#!/usr/bin/env node

/**
 * WordPress WooCommerce API测试脚本
 * 用于验证API密钥是否正确配置
 */

// 加载环境变量
require('dotenv').config();

const WC_URL = 'https://zenbreeze.net/wp-json/wc/v3';
const WC_KEY = process.env.WC_CONSUMER_KEY;
const WC_SECRET = process.env.WC_CONSUMER_SECRET;

// 颜色输出
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testWordPressAPI() {
  log('🔑 WordPress WooCommerce API 测试', 'bold');
  log('='.repeat(50), 'cyan');

  // 检查环境变量
  log('\n📋 1. 检查环境变量', 'yellow');
  if (!WC_KEY || WC_KEY === 'your_woocommerce_consumer_key' || WC_KEY === 'ck_your_actual_consumer_key_here') {
    log('❌ WC_CONSUMER_KEY 未正确配置', 'red');
    log('   请在 .env 文件中设置正确的 WooCommerce Consumer Key', 'blue');
    return;
  }
  
  if (!WC_SECRET || WC_SECRET === 'your_woocommerce_consumer_secret' || WC_SECRET === 'cs_your_actual_consumer_secret_here') {
    log('❌ WC_CONSUMER_SECRET 未正确配置', 'red');
    log('   请在 .env 文件中设置正确的 WooCommerce Consumer Secret', 'blue');
    return;
  }

  log('✅ 环境变量已配置', 'green');
  log(`   Consumer Key: ${WC_KEY.substring(0, 10)}...`, 'blue');
  log(`   Consumer Secret: ${WC_SECRET.substring(0, 10)}...`, 'blue');

  // 测试API连接
  log('\n🌐 2. 测试API连接', 'yellow');
  
  try {
    const response = await fetch(`${WC_URL}/orders`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64')}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const orders = await response.json();
      log('✅ API连接成功！', 'green');
      log(`   获取到 ${orders.length} 个订单`, 'blue');
      
      if (orders.length > 0) {
        const order = orders[0];
        log('   最新订单信息:', 'blue');
        log(`     - 订单ID: ${order.id}`, 'cyan');
        log(`     - 状态: ${order.status}`, 'cyan');
        log(`     - 总金额: $${order.total}`, 'cyan');
        log(`     - 客户: ${order.billing?.first_name} ${order.billing?.last_name}`, 'cyan');
        log(`     - 邮箱: ${order.billing?.email}`, 'cyan');
      }
    } else {
      log(`❌ API连接失败: ${response.status} ${response.statusText}`, 'red');
      
      if (response.status === 401) {
        log('   可能的原因:', 'yellow');
        log('   - API密钥错误', 'blue');
        log('   - 权限不足', 'blue');
        log('   - 密钥已过期', 'blue');
      } else if (response.status === 404) {
        log('   可能的原因:', 'yellow');
        log('   - WooCommerce插件未安装', 'blue');
        log('   - REST API未启用', 'blue');
        log('   - URL路径错误', 'blue');
      }
    }
  } catch (error) {
    log(`❌ 网络错误: ${error.message}`, 'red');
    log('   可能的原因:', 'yellow');
    log('   - 网络连接问题', 'blue');
    log('   - 网站无法访问', 'blue');
    log('   - SSL证书问题', 'blue');
  }

  // 测试其他端点
  log('\n🔍 3. 测试其他端点', 'yellow');
  
  const endpoints = [
    { name: '产品', url: '/products' },
    { name: '客户', url: '/customers' },
    { name: '系统状态', url: '/system_status' }
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${WC_URL}${endpoint.url}`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        log(`   ✅ ${endpoint.name}: 可访问 (${Array.isArray(data) ? data.length : 'OK'})`, 'green');
      } else {
        log(`   ❌ ${endpoint.name}: ${response.status}`, 'red');
      }
    } catch (error) {
      log(`   ❌ ${endpoint.name}: 网络错误`, 'red');
    }
  }

  log('\n' + '='.repeat(50), 'cyan');
  log('📋 配置指南:', 'yellow');
  log('1. 登录WordPress后台', 'blue');
  log('2. 进入 WooCommerce > 设置 > 高级 > REST API', 'blue');
  log('3. 创建新的API密钥', 'blue');
  log('4. 复制 Consumer Key 和 Consumer Secret', 'blue');
  log('5. 更新 .env 文件中的配置', 'blue');
  log('6. 重新运行此测试脚本', 'blue');
}

// 运行测试
testWordPressAPI().catch(console.error);
