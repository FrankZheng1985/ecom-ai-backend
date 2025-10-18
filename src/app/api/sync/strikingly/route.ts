// src/app/api/sync/strikingly/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    console.log('🔄 开始同步Strikingly数据...');

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

    // 模拟从Strikingly获取订单数据
    // 注意：这里需要根据Strikingly的实际API进行调整
    const mockStrikinglyOrders = [
      {
        id: 'strikingly_sync_001',
        status: 'completed',
        total: '45.99',
        customer: {
          email: 'sync_customer@example.com',
          name: 'Sync Customer',
          phone: '+1234567890'
        },
        items: [
          {
            product: 'Organic Green Tea',
            quantity: 2,
            price: 22.99
          }
        ],
        created_at: new Date().toISOString(),
      },
      {
        id: 'strikingly_sync_002',
        status: 'processing',
        total: '89.99',
        customer: {
          email: 'another_customer@example.com',
          name: 'Another Customer',
          phone: '+1234567891'
        },
        items: [
          {
            product: 'Premium Tea Set',
            quantity: 1,
            price: 89.99
          }
        ],
        created_at: new Date(Date.now() - 86400000).toISOString(), // 1天前
      }
    ];

    let syncedCount = 0;

    for (const order of mockStrikinglyOrders) {
      try {
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
            tags: '["strikingly-sync"]',
            lifetimeValue: parseFloat(order.total),
          }
        });

        // 创建订单
        await prisma.order.upsert({
          where: { 
            originalId_siteId: {
              originalId: order.id,
              siteId: site.id
            }
          },
          update: {
            status: order.status,
            totalAmount: parseFloat(order.total),
            items: order.items,
            updatedAt: new Date(),
          },
          create: {
            originalId: order.id,
            siteId: site.id,
            customerEmail: order.customer.email,
            totalAmount: parseFloat(order.total),
            status: order.status,
            items: order.items,
            createdAt: new Date(order.created_at),
          }
        });
        
        syncedCount++;
      } catch (orderError) {
        console.error(`Error syncing order ${order.id}:`, orderError);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Successfully synced ${syncedCount} orders from Strikingly`,
      count: syncedCount 
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Strikingly sync error:', error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
