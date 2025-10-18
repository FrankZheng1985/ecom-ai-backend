// src/app/api/sync/wordpress/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const WC_URL = 'https://zenbreeze.net/wp-json/wc/v3';
const WC_KEY = process.env.WC_CONSUMER_KEY;
const WC_SECRET = process.env.WC_CONSUMER_SECRET;

export async function GET() {
  try {
    if (!WC_KEY || !WC_SECRET) {
      return NextResponse.json({ error: 'WooCommerce API credentials not configured' }, { status: 500 });
    }

    const response = await fetch(`${WC_URL}/orders`, {
      headers: {
        'Authorization': `Basic ${btoa(`${WC_KEY}:${WC_SECRET}`)}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch orders: ${response.statusText}`);
    }

    const orders: unknown[] = await response.json();
    
    // 确保站点存在
    let site = await prisma.site.findUnique({ where: { name: 'zenbreeze' } });
    if (!site) {
      site = await prisma.site.create({
        data: {
          name: 'zenbreeze',
          platform: 'wordpress',
          url: 'https://zenbreeze.net',
          apiKey: WC_KEY,
          apiSecret: WC_SECRET
        }
      });
    }

    let syncedCount = 0;
    for (const order of orders) {
      try {
        // 类型断言，假设order是WooCommerce订单格式
        const woocommerceOrder = order as {
          id: number;
          status: string;
          total: string;
          billing: {
            email: string;
            first_name: string;
            last_name: string;
            phone: string;
          };
          line_items: Record<string, unknown>[];
          date_created: string;
        };

        // 确保客户存在
        await prisma.customer.upsert({
          where: { email: woocommerceOrder.billing.email },
          update: {
            name: woocommerceOrder.billing.first_name + ' ' + woocommerceOrder.billing.last_name,
            phone: woocommerceOrder.billing.phone,
          },
          create: {
            email: woocommerceOrder.billing.email,
            name: woocommerceOrder.billing.first_name + ' ' + woocommerceOrder.billing.last_name,
            phone: woocommerceOrder.billing.phone,
            siteId: site.id,
          }
        });

        // 使用upsert避免重复创建订单
        await prisma.order.upsert({
          where: { 
            originalId_siteId: {
              originalId: woocommerceOrder.id.toString(),
              siteId: site.id
            }
          },
          update: {
            status: woocommerceOrder.status,
            totalAmount: parseFloat(woocommerceOrder.total),
            items: JSON.parse(JSON.stringify(woocommerceOrder.line_items)),
            updatedAt: new Date(),
          },
          create: {
            originalId: woocommerceOrder.id.toString(),
            siteId: site.id,
            customerEmail: woocommerceOrder.billing.email,
            totalAmount: parseFloat(woocommerceOrder.total),
            status: woocommerceOrder.status,
            items: JSON.parse(JSON.stringify(woocommerceOrder.line_items)),
            createdAt: new Date(woocommerceOrder.date_created),
          }
        });
        
        syncedCount++;
      } catch (orderError) {
        console.error(`Error syncing order:`, orderError);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Successfully synced ${syncedCount} orders from WordPress`,
      count: syncedCount 
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('WordPress sync error:', error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
