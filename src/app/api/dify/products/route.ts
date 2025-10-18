// src/app/api/dify/products/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const siteName = searchParams.get('site');
    const category = searchParams.get('category');
    const name = searchParams.get('name');
    const minPrice = searchParams.get('min_price');
    const maxPrice = searchParams.get('max_price');
    const inStock = searchParams.get('in_stock');
    const limit = parseInt(searchParams.get('limit') || '50');

    // 构建查询条件
    const where: {
      site?: { name: string };
      category?: string;
      name?: { contains: string; mode: 'insensitive' };
      price?: {
        gte?: number;
        lte?: number;
      };
      stock?: { gt: number };
    } = {};
    
    if (siteName) {
      where.site = { name: siteName };
    }
    
    if (category) {
      where.category = category;
    }
    
    if (name) {
      where.name = { contains: name, mode: 'insensitive' };
    }
    
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) {
        where.price.gte = parseFloat(minPrice);
      }
      if (maxPrice) {
        where.price.lte = parseFloat(maxPrice);
      }
    }
    
    if (inStock === 'true') {
      where.stock = { gt: 0 };
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        site: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: Math.min(limit, 100),
    });

    return NextResponse.json({ 
      success: true, 
      data: products,
      count: products.length,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Products API error:', error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
