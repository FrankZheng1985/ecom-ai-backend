// src/app/api/health/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // 测试数据库连接 - 使用简单的查询
    await prisma.site.findFirst();
    
    // 获取基本统计信息
    const [siteCount, orderCount, customerCount, productCount] = await Promise.all([
      prisma.site.count(),
      prisma.order.count(),
      prisma.customer.count(),
      prisma.product.count(),
    ]);

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      stats: {
        sites: siteCount,
        orders: orderCount,
        customers: customerCount,
        products: productCount,
      },
      endpoints: {
        sync: {
          wordpress: '/api/sync/wordpress',
        },
        webhook: {
          strikingly: '/api/webhook/strikingly',
        },
        dify: {
          orders: '/api/dify/orders',
          customers: '/api/dify/customers',
          products: '/api/dify/products',
        },
      },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: errorMessage,
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
