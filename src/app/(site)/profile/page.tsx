"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { fetchMemberInfo } from "@/services/user";
const memberTypeMap: Record<string, string> = {
  FREE: "免费用户",
  MONTHLY: "月度会员",
  YEARLY: "年度会员",
};

const ProfilePage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [memberInfo, setMemberInfo] = useState<any>({
    memberType: "",
    memberExpireTime: "",
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/signin");
    }
  }, [user, router, loading]);

  useEffect(() => {
    fetchMemberInfo().then((res: any) => {
      const { code, data, msg } = res;
      if (code === 200) {
        setMemberInfo(data);
      }
    });
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#faf6f2]">
      <Breadcrumb pageName="个人资料" />

      <div className="container mx-auto  px-4 py-8">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-lg bg-white p-6 shadow-md dark:bg-dark-2">
            <div className="space-y-4">
              <div className="pb-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      昵称
                    </span>
                    <span className="text-dark dark:text-white">
                      {user.nickName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      邮箱
                    </span>
                    <span className="text-dark dark:text-white">
                      {user.email}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      会员等级
                    </span>
                    <span className="text-dark dark:text-white">
                      {memberTypeMap[memberInfo.memberType]}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      会员到期时间
                    </span>
                    <span className="text-dark dark:text-white">
                      {memberInfo.memberExpireTime}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
