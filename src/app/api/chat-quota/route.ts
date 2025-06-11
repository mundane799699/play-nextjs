import { NextRequest, NextResponse } from 'next/server';

interface DailyQuota {
  date: string;
  count: number;
  memberType: string;
}

// 模拟数据存储（实际项目中应该存储在数据库）
// 这里用Map来模拟，key是userId，value是每日使用记录
const userQuotaStorage = new Map<string, DailyQuota>();

// 获取今天的日期字符串 (YYYY-MM-DD)
function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

// 根据会员类型获取每日限制次数
function getDailyLimit(memberType: string): number {
  switch (memberType?.toUpperCase()) {
    case 'PRO':
      return -1; // -1 表示无限制
    case 'PLUS':
    case 'FREE':
    default:
      return 10; // 普通用户和Plus用户每天10次
  }
}

// GET: 获取用户当前的对话次数信息
export async function GET(req: NextRequest) {
  try {
    // 从cookie获取用户token，然后获取用户信息
    const token = req.cookies.get("Admin-Token")?.value;
    console.log('Chat-quota GET - Token:', token ? 'exists' : 'missing');
    
    if (!token) {
      // 未登录用户返回默认的免费用户配额
      return NextResponse.json({
        code: 200,
        data: {
          used: 0,
          limit: 10,
          remaining: 10,
          memberType: 'FREE',
          canUse: true,
          resetTime: new Date().getTime() + 24 * 60 * 60 * 1000
        }
      });
    }

    // 从查询参数获取用户信息，如果没有则使用默认值
    const userId = req.nextUrl.searchParams.get('userId') || 'default';
    const memberType = req.nextUrl.searchParams.get('memberType') || 'FREE';
    
    console.log('Chat-quota GET - Params:', { userId, memberType });
    
    const today = getTodayString();
    const userKey = `${userId}_${today}`;
    
    // 获取或初始化用户今日使用数据
    let userQuota = userQuotaStorage.get(userKey);
    if (!userQuota || userQuota.date !== today) {
      userQuota = {
        date: today,
        count: 0,
        memberType: memberType
      };
      userQuotaStorage.set(userKey, userQuota);
    }

    const dailyLimit = getDailyLimit(memberType);
    const remaining = dailyLimit === -1 ? -1 : Math.max(0, dailyLimit - userQuota.count);
    
    const result = {
      used: userQuota.count,
      limit: dailyLimit,
      remaining: remaining,
      memberType: memberType,
      canUse: dailyLimit === -1 || userQuota.count < dailyLimit,
      resetTime: new Date(today + 'T00:00:00').getTime() + 24 * 60 * 60 * 1000 // 明天0点的时间戳
    };
    
    console.log('Chat-quota GET - Result:', result);
    
    return NextResponse.json({
      code: 200,
      data: result
    });
  } catch (error) {
    console.error('获取对话次数失败:', error);
    return NextResponse.json({ 
      error: 'Internal Server Error',
      code: 500 
    }, { status: 500 });
  }
}

// POST: 使用一次对话次数
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("Admin-Token")?.value;
    if (!token) {
      return NextResponse.json({ 
        error: 'Unauthorized',
        code: 401 
      }, { status: 401 });
    }

    const body = await req.json();
    const { userId = 'default', memberType = 'FREE' } = body;
    
    const today = getTodayString();
    const userKey = `${userId}_${today}`;
    
    // 获取或初始化用户今日使用数据
    let userQuota = userQuotaStorage.get(userKey);
    if (!userQuota || userQuota.date !== today) {
      userQuota = {
        date: today,
        count: 0,
        memberType: memberType
      };
    }

    const dailyLimit = getDailyLimit(memberType);
    
    // 检查是否超过限制
    if (dailyLimit !== -1 && userQuota.count >= dailyLimit) {
      return NextResponse.json({
        code: 403,
        error: '今日对话次数已用完',
        data: {
          used: userQuota.count,
          limit: dailyLimit,
          remaining: 0,
          memberType: memberType,
          canUse: false
        }
      }, { status: 403 });
    }

    // 增加使用次数
    userQuota.count += 1;
    userQuotaStorage.set(userKey, userQuota);
    
    const remaining = dailyLimit === -1 ? -1 : Math.max(0, dailyLimit - userQuota.count);
    
    return NextResponse.json({
      code: 200,
      data: {
        used: userQuota.count,
        limit: dailyLimit,
        remaining: remaining,
        memberType: memberType,
        canUse: dailyLimit === -1 || userQuota.count < dailyLimit
      }
    });
  } catch (error) {
    console.error('使用对话次数失败:', error);
    return NextResponse.json({ 
      error: 'Internal Server Error',
      code: 500 
    }, { status: 500 });
  }
} 