// src/app/api/webhook/strikingly/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const order = await request.json();

    // 验证webhook来源（可选但推荐）
    const webhookSecret = process.env.STRICKINGLY_WEBHOOK_SECRET;
    if (webhookSecret) {
      const signature = request.headers.get('x-strikingly-signature');
      if (!signature || signature !== webhookSecret) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    // 确保站点存在
    let site = await prisma.site.findUnique({ where: { name: 'sogoodtea' } });
    if (!site) {
      site = await prisma.site.create({
        data: {
          name: 'sogoodtea',
          platform: 'strikingly',
          url: 'https://sogoodtea.com',
        }
      });
    }

    // 确保客户存在
    await prisma.customer.upsert({
      where: { email: order.customer.email },
      update: {
        name: order.customer.name,
        phone: order.customer.phone,
      },
      create: {
        email: order.customer.email,
        name: order.customer.name,
        phone: order.customer.phone,
        siteId: site.id,
      }
    });

    // 创建订单
    await prisma.order.create({
      data: {
        originalId: order.id,
        siteId: site.id,
        customerEmail: order.customer.email,
        totalAmount: parseFloat(order.total),
        status: order.status,
        items: order.items,
        createdAt: new Date(order.created_at),
      }
    });

    return NextResponse.json({ success: true, message: 'Order synced successfully' });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Strikingly webhook error:', error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
