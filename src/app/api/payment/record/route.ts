import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { planType, wechatId, timestamp } = await req.json();

    // Record the payment information
    const paymentRecord = await prisma.paymentRecord.create({
      data: {
        userId: session.user.id,
        planType,
        wechatId,
        timestamp: new Date(timestamp),
      },
    });

    return NextResponse.json({ success: true, data: paymentRecord });
  } catch (error) {
    console.error('Payment record error:', error);
    return NextResponse.json(
      { error: 'Failed to record payment' },
      { status: 500 }
    );
  }
}
