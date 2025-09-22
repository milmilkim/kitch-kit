"use client";

import { signIn, getProviders } from "next-auth/react";
import { useEffect, useState } from "react";

interface Provider {
  id: string;
  name: string;
}

export default function SignIn() {
  const [providers, setProviders] = useState<Record<string, Provider> | null>(
    null,
  );

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders();
      setProviders(res as Record<string, Provider>);
    };
    void fetchProviders();
  }, []);

  if (!providers) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md ">
        {/* 로고/제목 */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">로그인</h1>
        </div>

        {/* 로그인 버튼들 */}
        <div className="space-y-4">
          {Object.values(providers).map((provider: Provider) => {
            // 구글 공식 로고 SVG
            const GoogleIcon = () => (
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            );

            // 각 프로바이더별 스타일 설정
            if (provider.id === "google") {
              return (
                <button
                  key={provider.name}
                  onClick={() => signIn(provider.id, { callbackUrl: "/" })}
                  className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-50 hover:shadow-md focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                >
                  <GoogleIcon />
                  Sign in with Google
                </button>
              );
            }

            // 기타 프로바이더
            const getProviderStyle = (providerId: string) => {
              switch (providerId) {
                case "discord":
                  return {
                    bg: "bg-indigo-600 hover:bg-indigo-700",
                    text: "text-white",
                    icon: "🎮",
                  };
                default:
                  return {
                    bg: "bg-gray-600 hover:bg-gray-700",
                    text: "text-white",
                    icon: "🔐",
                  };
              }
            };

            const style = getProviderStyle(provider.id);

            return (
              <button
                key={provider.name}
                onClick={() => signIn(provider.id, { callbackUrl: "/" })}
                className={`flex w-full items-center justify-center gap-3 rounded-xl px-6 py-4 ${style.bg} ${style.text} transform text-lg font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg focus:ring-4 focus:ring-blue-200 focus:outline-none`}
              >
                <span className="text-2xl">{style.icon}</span>
                {provider.name}으로 로그인
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
