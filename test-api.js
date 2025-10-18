// 测试API功能的简单脚本
// 使用方法: node test-api.js [base-url]

const baseUrl = process.argv[2] || 'http://localhost:3000';

async function testAPI() {
  console.log('🚀 开始测试智能体数据中台API...\n');

  try {
    // 测试健康检查
    console.log('1. 测试健康检查API...');
    const healthResponse = await fetch(`${baseUrl}/api/health`);
    const healthData = await healthResponse.json();
    console.log('✅ 健康检查:', healthData.status);
    console.log('📊 统计信息:', healthData.stats);
    console.log('');

    // 测试订单API
    console.log('2. 测试订单API...');
    const ordersResponse = await fetch(`${baseUrl}/api/dify/orders?limit=5`);
    const ordersData = await ordersResponse.json();
    console.log('✅ 订单API:', ordersData.success ? '成功' : '失败');
    console.log('📦 订单数量:', ordersData.data?.length || 0);
    console.log('');

    // 测试客户API
    console.log('3. 测试客户API...');
    const customersResponse = await fetch(`${baseUrl}/api/dify/customers?limit=5`);
    const customersData = await customersResponse.json();
    console.log('✅ 客户API:', customersData.success ? '成功' : '失败');
    console.log('👥 客户数量:', customersData.data?.length || 0);
    console.log('');

    // 测试产品API
    console.log('4. 测试产品API...');
    const productsResponse = await fetch(`${baseUrl}/api/dify/products?limit=5`);
    const productsData = await productsResponse.json();
    console.log('✅ 产品API:', productsData.success ? '成功' : '失败');
    console.log('🛍️ 产品数量:', productsData.data?.length || 0);
    console.log('');

    // 测试WordPress同步API（如果有配置）
    console.log('5. 测试WordPress同步API...');
    try {
      const syncResponse = await fetch(`${baseUrl}/api/sync/wordpress`);
      const syncData = await syncResponse.json();
      console.log('✅ WordPress同步:', syncData.success ? '成功' : '失败');
      if (syncData.message) {
        console.log('📝 消息:', syncData.message);
      }
    } catch (error) {
      console.log('⚠️ WordPress同步:', '需要配置API密钥');
    }
    console.log('');

    console.log('🎉 API测试完成！');
    console.log('\n📋 可用的API端点:');
    console.log(`   - 健康检查: ${baseUrl}/api/health`);
    console.log(`   - 订单查询: ${baseUrl}/api/dify/orders`);
    console.log(`   - 客户查询: ${baseUrl}/api/dify/customers`);
    console.log(`   - 产品查询: ${baseUrl}/api/dify/products`);
    console.log(`   - WordPress同步: ${baseUrl}/api/sync/wordpress`);
    console.log(`   - Strikingly Webhook: ${baseUrl}/api/webhook/strikingly`);
    console.log(`   - API文档: ${baseUrl}/api-docs`);

  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    console.log('\n💡 请确保:');
    console.log('   1. 开发服务器正在运行 (npm run dev)');
    console.log('   2. 数据库连接正常');
    console.log('   3. 环境变量已正确配置');
  }
}

testAPI();
