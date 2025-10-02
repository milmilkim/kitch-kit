/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import type { ContentCategory } from "@prisma/client";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

const categories: {
  id: ContentCategory | "ALL";
  name: string;
  icon: string;
}[] = [
  { id: "ALL", name: "전체", icon: "📱" },
  { id: "NOVEL", name: "웹소설", icon: "📚" },
  { id: "WEBTOON", name: "웹툰", icon: "🎨" },
  { id: "COMIC", name: "만화", icon: "💥" },
  { id: "DRAMA", name: "드라마", icon: "📺" },
  { id: "MOVIE", name: "영화", icon: "🎬" },
  { id: "MUSIC", name: "음반", icon: "🎵" },
  { id: "BOOK", name: "도서", icon: "📖" },
  { id: "GAME", name: "게임", icon: "🎮" },
  { id: "OTHER", name: "기타", icon: "📁" },
];

export default function ContentsListPage() {
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<
    ContentCategory | "ALL"
  >("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const { data: session } = useSession();

  const { data, isLoading } = api.content.getList.useQuery({
    page,
    limit: 12,
    category: selectedCategory === "ALL" ? undefined : selectedCategory,
    search: searchTerm || undefined,
  });

  const handleSearch = () => {
    setSearchTerm(searchInput);
    setPage(1);
  };

  const handleCategoryChange = (category: ContentCategory | "ALL") => {
    setSelectedCategory(category);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">📚 컨텐츠 목록</h1>
          {session && (
            <Link href="/contents/create">
              <Button>+ 새 컨텐츠 추가</Button>
            </Link>
          )}
        </div>

        {/* 카테고리 필터 */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={cn(
                  "rounded-lg border-2 px-4 py-2 text-sm font-medium transition-all",
                  selectedCategory === category.id
                    ? "border-primary bg-primary text-white"
                    : "hover:border-primary border-gray-200 bg-white text-gray-700",
                )}
              >
                <span className="mr-1">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* 검색 */}
        <div className="mb-8">
          <div className="flex gap-3">
            <Input
              type="text"
              placeholder="제목, 설명, 플랫폼으로 검색..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                  handleSearch();
                }
              }}
              className="flex-1"
            />
            <Button onClick={handleSearch}>🔍 검색</Button>
          </div>
        </div>

        {/* 컨텐츠 리스트 */}
        {isLoading ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-xl text-gray-500">로딩 중...</div>
          </div>
        ) : data?.contents && data.contents.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {data.contents.map((content) => {
                const artistsData = content.artists as unknown;
                const tagsData = content.tags as unknown;

                const artists =
                  Array.isArray(artistsData) && artistsData.length > 0
                    ? artistsData
                        .map((a: { value: string }) => a.value)
                        .join(", ")
                    : "";

                const tags = Array.isArray(tagsData)
                  ? tagsData.slice(0, 3).map((t: { value: string }) => t.value)
                  : [];

                return (
                  <Link
                    key={content.id}
                    href={`/contents/${content.id}`}
                    className="group cursor-pointer overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-xl"
                  >
                    {/* 이미지 영역 */}
                    <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100">
                      {content.image ? (
                        <img
                          src={`${process.env.NEXT_PUBLIC_R2_PUBLIC_URL ?? ""}/${content.image}`}
                          alt={content.title}
                          width={400}
                          height={533}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-6xl">
                          {categories.find((c) => c.id === content.category)
                            ?.icon ?? "📁"}
                        </div>
                      )}
                    </div>

                    {/* 컨텐츠 정보 */}
                    <div className="p-4">
                      <div className="mb-2 flex items-start justify-between">
                        <h3 className="line-clamp-2 flex-1 text-lg font-bold text-gray-800">
                          {content.title}
                        </h3>
                        <span className="ml-2 text-2xl">
                          {
                            categories.find((c) => c.id === content.category)
                              ?.icon
                          }
                        </span>
                      </div>

                      {artists && (
                        <p className="mb-2 line-clamp-1 text-sm text-gray-600">
                          {artists}
                        </p>
                      )}

                      <p className="mb-3 line-clamp-2 text-sm text-gray-500">
                        {content.description
                          ? content.description
                          : "설명이 없습니다."}
                      </p>

                      {/* 태그 */}
                      {tags.length > 0 && (
                        <div className="mb-3 flex flex-wrap gap-1">
                          {tags.map((tag: string, idx: number) => (
                            <span
                              key={idx}
                              className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* 메타 정보 */}
                      <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-500">
                        <span>{content.year}</span>
                        <span>{content.platform}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* 페이지네이션 */}
            {data.pagination.totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                <Button
                  variant="secondary"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                >
                  이전
                </Button>

                <div className="flex gap-2">
                  {Array.from(
                    { length: data.pagination.totalPages },
                    (_, i) => i + 1,
                  )
                    .filter((p) => {
                      const totalPages = data.pagination.totalPages;
                      // 현재 페이지 근처만 표시
                      return (
                        p === 1 ||
                        p === totalPages ||
                        (p >= page - 2 && p <= page + 2)
                      );
                    })
                    .map((p, idx, arr) => {
                      // ... 표시
                      const prevPage = arr[idx - 1];
                      const showEllipsis =
                        idx > 0 && prevPage !== undefined && p - prevPage > 1;
                      return (
                        <div key={p} className="flex items-center gap-2">
                          {showEllipsis && (
                            <span className="px-2 text-gray-500">...</span>
                          )}
                          <Button
                            variant={page === p ? "default" : "secondary"}
                            onClick={() => handlePageChange(p)}
                            className="min-w-[40px]"
                          >
                            {p}
                          </Button>
                        </div>
                      );
                    })}
                </div>

                <Button
                  variant="secondary"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === data.pagination.totalPages}
                >
                  다음
                </Button>
              </div>
            )}

            {/* 페이지 정보 */}
            <div className="mt-4 text-center text-sm text-gray-500">
              전체 {data.pagination.total}개 중 {(page - 1) * 12 + 1}-
              {Math.min(page * 12, data.pagination.total)}개 표시
            </div>
          </>
        ) : (
          <div className="flex min-h-[400px] flex-col items-center justify-center">
            <div className="mb-4 text-6xl">📭</div>
            <div className="text-xl text-gray-500">
              {searchTerm || selectedCategory !== "ALL"
                ? "검색 결과가 없습니다."
                : "등록된 컨텐츠가 없습니다."}
            </div>
            {(searchTerm || selectedCategory !== "ALL") && (
              <Button
                variant="secondary"
                onClick={() => {
                  setSearchTerm("");
                  setSearchInput("");
                  setSelectedCategory("ALL");
                  setPage(1);
                }}
                className="mt-4"
              >
                필터 초기화
              </Button>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
