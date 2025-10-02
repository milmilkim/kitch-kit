/* eslint-disable @next/next/no-img-element */
"use client";

import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import type { ContentCategory } from "@prisma/client";
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

export default function ContentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const contentId = params.id as string;

  const { data: content, isLoading, error } = api.content.getById.useQuery({
    id: contentId,
  });

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-xl text-gray-500">로딩 중...</div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !content) {
    return (
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="flex min-h-[400px] flex-col items-center justify-center">
            <div className="mb-4 text-6xl">❌</div>
            <div className="mb-4 text-xl text-gray-500">
              {error?.message ?? "컨텐츠를 찾을 수 없습니다."}
            </div>
            <Link href="/contents">
              <Button variant="secondary">목록으로 돌아가기</Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const categoryInfo = categories.find((c) => c.id === content.category);
  const artistsData = content.artists as unknown;
  const aliasesData = content.aliases as unknown;
  const tagsData = content.tags as unknown;

  const artists = Array.isArray(artistsData) && artistsData.length > 0
    ? artistsData.map((a: { value: string }) => a.value)
    : [];

  const aliases = Array.isArray(aliasesData) && aliasesData.length > 0
    ? aliasesData.map((a: { value: string }) => a.value)
    : [];

  const tags = Array.isArray(tagsData)
    ? tagsData.map((t: { value: string }) => t.value)
    : [];

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-4xl px-4">
        {/* 뒤로가기 버튼 */}
        <div className="mb-6">
          <Button
            variant="secondary"
            onClick={() => router.back()}
            className="mb-4"
          >
            ← 뒤로가기
          </Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* 이미지 영역 */}
          <div className="space-y-4">
            <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 shadow-lg">
              {content.image ? (
                <img
                  src={`${process.env.NEXT_PUBLIC_R2_PUBLIC_URL ?? ""}/${content.image}`}
                  alt={content.title}
                  width={600}
                  height={800}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-8xl">
                  {categoryInfo?.icon ?? "📁"}
                </div>
              )}
            </div>

            {/* 카테고리 배지 */}
            <div className="flex items-center justify-center">
              <span className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white">
                <span className="mr-2">{categoryInfo?.icon}</span>
                {categoryInfo?.name}
              </span>
            </div>
          </div>

          {/* 컨텐츠 정보 */}
          <div className="space-y-6">
            {/* 제목 */}
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {content.title}
              </h1>
              {content.year && (
                <p className="text-lg text-gray-600">{content.year}년</p>
              )}
            </div>

            {/* 아티스트 */}
            {artists.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  아티스트
                </h3>
                <div className="flex flex-wrap gap-2">
                  {artists.map((artist, idx) => (
                    <span
                      key={idx}
                      className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800"
                    >
                      {artist}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 별명 */}
            {aliases.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  별명
                </h3>
                <div className="flex flex-wrap gap-2">
                  {aliases.map((alias, idx) => (
                    <span
                      key={idx}
                      className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600"
                    >
                      {alias}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 플랫폼 */}
            {content.platform && (
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  플랫폼
                </h3>
                <p className="text-gray-600">{content.platform}</p>
              </div>
            )}

            {/* 설명 */}
            {content.description && (
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  설명
                </h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {content.description}
                </p>
              </div>
            )}

            {/* 태그 */}
            {tags.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  태그
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="rounded-full bg-purple-100 px-3 py-1 text-sm text-purple-800"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 메타 정보 */}
            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                <div>
                  <span className="font-medium">생성자:</span>
                  <p>{content.createdBy.name}</p>
                </div>
                <div>
                  <span className="font-medium">생성일:</span>
                  <p>{new Date(content.createdAt).toLocaleDateString('ko-KR')}</p>
                </div>
                {content.lastEditedBy && (
                  <div>
                    <span className="font-medium">최종 수정자:</span>
                    <p>{content.lastEditedBy.name}</p>
                  </div>
                )}
                <div>
                  <span className="font-medium">최종 수정일:</span>
                  <p>{new Date(content.updatedAt).toLocaleDateString('ko-KR')}</p>
                </div>
              </div>
            </div>

            {/* 액션 버튼 */}
            <div className="flex gap-3 pt-4">
              <Link href="/contents">
                <Button variant="secondary" className="flex-1">
                  목록으로
                </Button>
              </Link>
              {session && (
                <Link href={`/contents/${content.id}/edit`}>
                  <Button className="flex-1">
                    수정하기
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
