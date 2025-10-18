// src/app/api/dify/customers/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const siteName = searchParams.get('site');
    const email = searchParams.get('email');
    const tags = searchParams.get('tags');
    const minLifetimeValue = searchParams.get('min_lifetime_value');
    const limit = parseInt(searchParams.get('limit') || '50');

    // 构建查询条件
    const where: {
      site?: { name: string };
      email?: { contains: string };
      tags?: { has: string };
      lifetimeValue?: { gte: number };
    } = {};
    
    if (siteName) {
      where.site = { name: siteName };
    }
    
    if (email) {
      where.email = { contains: email };
    }
    
    if (tags) {
      where.tags = { has: tags };
    }
    
    if (minLifetimeValue) {
      where.lifetimeValue = { gte: parseFloat(minLifetimeValue) };
    }

    const customers = await prisma.customer.findMany({
      where,
      include: {
        site: true,
        orders: {
          select: {
            id: true,
            totalAmount: true,
            status: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 5, // 只返回最近5个订单
        },
        _count: {
          select: {
            orders: true,
          },
        },
      },
      orderBy: {
        lifetimeValue: 'desc',
      },
      take: Math.min(limit, 100),
    });

    return NextResponse.json({ 
      success: true, 
      data: customers,
      count: customers.length,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Customers API error:', error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
