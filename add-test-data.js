// 添加测试数据的脚本
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addTestData() {
  console.log('🚀 开始添加测试数据...\n');

  try {
    // 1. 创建测试站点
    console.log('1. 创建测试站点...');
    const zenbreezeSite = await prisma.site.upsert({
      where: { name: 'zenbreeze' },
      update: {},
      create: {
        name: 'zenbreeze',
        platform: 'wordpress',
        url: 'https://zenbreeze.net',
        apiKey: 'test_key',
        apiSecret: 'test_secret'
      }
    });

    const sogoodteaSite = await prisma.site.upsert({
      where: { name: 'sogoodtea' },
      update: {},
      create: {
        name: 'sogoodtea',
        platform: 'strikingly',
        url: 'https://sogoodtea.com'
      }
    });

    console.log('✅ 站点创建完成');

    // 2. 创建测试客户
    console.log('2. 创建测试客户...');
    const customers = [
      {
        email: 'john@example.com',
        name: 'John Smith',
        phone: '+1234567890',
        siteId: zenbreezeSite.id,
        tags: '["high-value", "loyal"]',
        lifetimeValue: 1250.50
      },
      {
        email: 'mary@example.com',
        name: 'Mary Johnson',
        phone: '+1234567891',
        siteId: sogoodteaSite.id,
        tags: '["new-customer"]',
        lifetimeValue: 89.99
      },
      {
        email: 'david@example.com',
        name: 'David Brown',
        phone: '+1234567892',
        siteId: zenbreezeSite.id,
        tags: '["vip", "repeat-buyer"]',
        lifetimeValue: 2100.75
      }
    ];

    for (const customerData of customers) {
      await prisma.customer.upsert({
        where: { email: customerData.email },
        update: customerData,
        create: customerData
      });
    }

    console.log('✅ 客户创建完成');

    // 3. 创建测试产品
    console.log('3. 创建测试产品...');
    const products = [
      {
        originalId: 'prod_001',
        siteId: zenbreezeSite.id,
        name: 'Premium Tea Set',
        description: 'High-quality tea set with 6 different tea varieties',
        price: 89.99,
        stock: 50,
        category: 'tea-sets',
        images: '["https://example.com/tea-set-1.jpg", "https://example.com/tea-set-2.jpg"]'
      },
      {
        originalId: 'prod_002',
        siteId: sogoodteaSite.id,
        name: 'Organic Green Tea',
        description: 'Premium organic green tea from Japan',
        price: 24.99,
        stock: 100,
        category: 'green-tea',
        images: '["https://example.com/green-tea.jpg"]'
      },
      {
        originalId: 'prod_003',
        siteId: zenbreezeSite.id,
        name: 'Tea Accessories Kit',
        description: 'Complete tea brewing accessories',
        price: 45.50,
        stock: 25,
        category: 'accessories',
        images: '["https://example.com/accessories.jpg"]'
      }
    ];

    for (const productData of products) {
      await prisma.product.upsert({
        where: { 
          originalId_siteId: {
            originalId: productData.originalId,
            siteId: productData.siteId
          }
        },
        update: productData,
        create: productData
      });
    }

    console.log('✅ 产品创建完成');

    // 4. 创建测试订单
    console.log('4. 创建测试订单...');
    const orders = [
      {
        originalId: 'order_001',
        siteId: zenbreezeSite.id,
        customerEmail: 'john@example.com',
        totalAmount: 89.99,
        status: 'completed',
        items: JSON.stringify([
          { product: 'Premium Tea Set', quantity: 1, price: 89.99 }
        ]),
        createdAt: new Date('2025-10-15')
      },
      {
        originalId: 'order_002',
        siteId: sogoodteaSite.id,
        customerEmail: 'mary@example.com',
        totalAmount: 24.99,
        status: 'processing',
        items: JSON.stringify([
          { product: 'Organic Green Tea', quantity: 1, price: 24.99 }
        ]),
        createdAt: new Date('2025-10-16')
      },
      {
        originalId: 'order_003',
        siteId: zenbreezeSite.id,
        customerEmail: 'david@example.com',
        totalAmount: 135.49,
        status: 'completed',
        items: JSON.stringify([
          { product: 'Premium Tea Set', quantity: 1, price: 89.99 },
          { product: 'Tea Accessories Kit', quantity: 1, price: 45.50 }
        ]),
        createdAt: new Date('2025-10-17')
      }
    ];

    for (const orderData of orders) {
      await prisma.order.upsert({
        where: {
          originalId_siteId: {
            originalId: orderData.originalId,
            siteId: orderData.siteId
          }
        },
        update: orderData,
        create: orderData
      });
    }

    console.log('✅ 订单创建完成');

    // 5. 显示统计信息
    console.log('\n📊 数据统计:');
    const stats = await prisma.$transaction([
      prisma.site.count(),
      prisma.customer.count(),
      prisma.product.count(),
      prisma.order.count()
    ]);

    console.log(`   - 站点: ${stats[0]}`);
    console.log(`   - 客户: ${stats[1]}`);
    console.log(`   - 产品: ${stats[2]}`);
    console.log(`   - 订单: ${stats[3]}`);

    console.log('\n🎉 测试数据添加完成！');
    console.log('\n🌐 现在您可以访问以下地址查看数据：');
    console.log('   - 主页: http://localhost:3000');
    console.log('   - API文档: http://localhost:3000/api-docs');
    console.log('   - 健康检查: http://localhost:3000/api/health');

  } catch (error) {
    console.error('❌ 添加测试数据失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addTestData();
