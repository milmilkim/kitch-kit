"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

export default function Header() {
  const { data: session } = useSession();

  const navItems: { name: string; href: string }[] = [
    { name: "홈", href: "/" },
    { name: "컨텐츠 추가", href: "/add-content" },
  ];

  return (
    <header className="header-gradient w-full shadow-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* 로고 */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="text-2xl font-bold text-white transition-colors duration-200 hover:text-purple-100"
            >
              K
            </Link>
          </div>

          {/* 네비게이션 메뉴 */}
          <nav className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="header-button header-hover py-2 font-medium"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>

          {/* 프로필/로그인 */}
          <div className="flex items-center space-x-4">
            {session ? (
              <div className="flex items-center space-x-3">
                {/* 프로필 이미지 */}
                {session.user?.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={session.user.image}
                    alt="프로필"
                    className="h-8 w-8 rounded-full border-2 border-white/30"
                  />
                )}

                {/* 사용자 이름 */}
                <span className="text-sm font-medium text-white">
                  {session.user?.name}
                </span>

                {/* 로그아웃 버튼 */}
                <button
                  onClick={() => signOut()}
                  className="header-button header-hover"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn()}
                className="header-button bg-white/20 px-4 py-2 font-medium backdrop-blur-sm hover:bg-white/30"
              >
                로그인
              </button>
            )}
          </div>

          {/* 모바일 메뉴 버튼 */}
          <div className="md:hidden">
            <button className="header-hover p-2 text-white">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
