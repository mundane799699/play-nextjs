export interface ChatQuotaInfo {
  used: number;
  limit: number; // -1 表示无限制
  remaining: number; // -1 表示无限制
  memberType: string;
  canUse: boolean;
  resetTime?: number;
}

// 获取用户当前的对话次数信息
export async function getChatQuota(userId?: string, memberType?: string): Promise<ChatQuotaInfo> {
  try {
    const params = new URLSearchParams();
    if (userId) params.append('userId', userId);
    if (memberType) params.append('memberType', memberType);
    
    const response = await fetch(`/api/chat-quota?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const result = await response.json();
    
    if (result.code === 200) {
      return result.data;
    }
    throw new Error(result.error || '获取对话次数失败');
  } catch (error) {
    console.error('获取对话次数失败:', error);
    throw error;
  }
}

// 使用一次对话次数
export async function useChatQuota(userId?: string, memberType?: string): Promise<ChatQuotaInfo> {
  try {
    const response = await fetch('/api/chat-quota', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        memberType
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const result = await response.json();
    
    if (result.code === 200) {
      return result.data;
    }
    
    if (result.code === 403) {
      // 次数用完的特殊处理
      throw new Error(result.error || '今日对话次数已用完');
    }
    
    throw new Error(result.error || '使用对话次数失败');
  } catch (error) {
    console.error('使用对话次数失败:', error);
    throw error;
  }
}

// 检查是否可以继续对话
export async function canUseChat(userId?: string, memberType?: string): Promise<boolean> {
  try {
    const quotaInfo = await getChatQuota(userId, memberType);
    return quotaInfo.canUse;
  } catch (error) {
    console.error('检查对话权限失败:', error);
    return false; // 出错时保守处理，不允许使用
  }
} 