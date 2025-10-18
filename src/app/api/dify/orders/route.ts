// src/app/api/dify/orders/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const siteName = searchParams.get('site'); // 'zenbreeze' or 'sogoodtea'
    const customerEmail = searchParams.get('email');
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');

    // 构建查询条件
    const where: {
      site?: { name: string };
      customerEmail?: string;
      status?: string;
      createdAt?: {
        gte?: Date;
        lte?: Date;
      };
    } = {};
    
    if (siteName) {
      where.site = { name: siteName };
    }
    
    if (customerEmail) {
      where.customerEmail = customerEmail;
    }
    
    if (status) {
      where.status = status;
    }
    
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate);
      }
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        customer: true, // 包含关联的客户信息
        site: true,     // 包含站点信息
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: Math.min(limit, 100), // 限制最大返回数量
    });

    // 计算统计信息
    const stats = await prisma.order.aggregate({
      where,
      _sum: {
        totalAmount: true,
      },
      _count: {
        id: true,
      },
    });

    return NextResponse.json({ 
      success: true, 
      data: orders,
      stats: {
        totalOrders: stats._count.id,
        totalRevenue: stats._sum.totalAmount || 0,
      },
      filters: {
        site: siteName,
        customerEmail,
        startDate,
        endDate,
        status,
        limit,
      }
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Dify API error:', error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
