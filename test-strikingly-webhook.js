#!/usr/bin/env node

/**
 * Strikingly Webhook测试脚本
 * 用于测试Webhook接收功能
 */

// 加载环境变量
require('dotenv').config();

const BASE_URL = 'http://localhost:3000';
const WEBHOOK_SECRET = process.env.STRICKINGLY_WEBHOOK_SECRET;

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

// 模拟Strikingly Webhook数据
const mockStrikinglyOrder = {
  id: 'strikingly_order_001',
  status: 'completed',
  total: '89.99',
  currency: 'USD',
  customer: {
    email: 'strikingly_customer@example.com',
    name: 'Strikingly Customer',
    phone: '+1234567890'
  },
  items: [
    {
      product: 'Premium Tea Set',
      quantity: 1,
      price: 89.99
    }
  ],
  created_at: new Date().toISOString(),
  site: 'sogoodtea'
};

async function testWebhook() {
  log('🔗 Strikingly Webhook 测试', 'bold');
  log('='.repeat(50), 'cyan');

  // 检查环境变量
  log('\n📋 1. 检查环境变量', 'yellow');
  if (!WEBHOOK_SECRET || WEBHOOK_SECRET === 'your_strikingly_webhook_secret' || WEBHOOK_SECRET === 'sk_your_actual_webhook_secret_here') {
    log('❌ STRICKINGLY_WEBHOOK_SECRET 未正确配置', 'red');
    log('   请在 .env 文件中设置正确的 Webhook 密钥', 'blue');
    log('   建议格式: sk_strikingly_webhook_2024', 'blue');
    return;
  }

  log('✅ 环境变量已配置', 'green');
  log(`   Webhook Secret: ${WEBHOOK_SECRET.substring(0, 10)}...`, 'blue');

  // 测试Webhook端点
  log('\n🌐 2. 测试Webhook端点', 'yellow');
  
  try {
    const response = await fetch(`${BASE_URL}/api/webhook/strikingly`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-strikingly-signature': WEBHOOK_SECRET
      },
      body: JSON.stringify(mockStrikinglyOrder)
    });

    if (response.ok) {
      const result = await response.json();
      log('✅ Webhook接收成功！', 'green');
      log(`   响应: ${JSON.stringify(result, null, 2)}`, 'blue');
    } else {
      const error = await response.text();
      log(`❌ Webhook接收失败: ${response.status} ${response.statusText}`, 'red');
      log(`   错误详情: ${error}`, 'blue');
    }
  } catch (error) {
    log(`❌ 网络错误: ${error.message}`, 'red');
  }

  // 测试数据是否已保存
  log('\n📊 3. 检查数据是否已保存', 'yellow');
  
  try {
    const ordersResponse = await fetch(`${BASE_URL}/api/dify/orders?site=sogoodtea`);
    if (ordersResponse.ok) {
      const ordersData = await ordersResponse.json();
      log(`✅ 查询成功，找到 ${ordersData.data?.length || 0} 个订单`, 'green');
      
      if (ordersData.data?.length > 0) {
        const latestOrder = ordersData.data[0];
        log('   最新订单信息:', 'blue');
        log(`     - 订单ID: ${latestOrder.originalId}`, 'cyan');
        log(`     - 状态: ${latestOrder.status}`, 'cyan');
        log(`     - 总金额: $${latestOrder.totalAmount}`, 'cyan');
        log(`     - 客户: ${latestOrder.customerEmail}`, 'cyan');
      }
    }
  } catch (error) {
    log(`❌ 查询失败: ${error.message}`, 'red');
  }

  // 配置指南
  log('\n' + '='.repeat(50), 'cyan');
  log('📋 Strikingly Webhook 配置指南:', 'yellow');
  log('1. 登录Strikingly后台', 'blue');
  log('2. 进入 设置 > 集成 > Webhook', 'blue');
  log('3. 创建新的Webhook', 'blue');
  log('4. 设置URL: http://localhost:3000/api/webhook/strikingly', 'blue');
  log('5. 生成Webhook密钥', 'blue');
  log('6. 更新 .env 文件中的 STRICKINGLY_WEBHOOK_SECRET', 'blue');
  log('7. 重新运行此测试脚本', 'blue');
  
  log('\n💡 注意: 本地测试需要使用ngrok等工具暴露本地端口', 'yellow');
  log('   生产环境请使用: https://your-domain.com/api/webhook/strikingly', 'yellow');
}

// 运行测试
testWebhook().catch(console.error);
