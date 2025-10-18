#!/usr/bin/env node

/**
 * Strikingly数据同步脚本
 * 定期从Strikingly同步订单数据
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
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function syncStrikinglyData() {
  try {
    log('🔄 开始同步Strikingly数据...', 'bold');
    
    const response = await fetch(`${BASE_URL}/api/sync/strikingly`);
    const result = await response.json();
    
    if (response.ok) {
      log(`✅ 同步成功: ${result.message}`, 'green');
      log(`   同步订单数: ${result.count}`, 'blue');
    } else {
      log(`❌ 同步失败: ${result.error}`, 'red');
    }
  } catch (error) {
    log(`❌ 网络错误: ${error.message}`, 'red');
  }
}

// 运行同步
syncStrikinglyData().catch(console.error);
