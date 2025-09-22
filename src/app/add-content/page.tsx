/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import Header from "../_components/Header";
import Button from "../_components/ui/Button";

const categories = [
  { id: "novel", name: "웹소설", icon: "📚" },
  //   { id: "drama", name: "드라마", icon: "📺" },
  { id: "webtoon", name: "웹툰", icon: "🎨" },
  { id: "comic", name: "만화", icon: "💥" },
  //   { id: "movie", name: "영화", icon: "🎬" },
  //   { id: "music", name: "음반", icon: "🎵" },
  //   { id: "book", name: "도서", icon: "📖" },
  { id: "game", name: "게임", icon: "🎮" },
  //   { id: "other", name: "기타", icon: "📁" },
];

// 컨텐츠 유형별 필드 정의
const categoryFields = {
  novel: {
    creatorLabel: "작가",
  },
  drama: {
    creatorLabel: "감독/출연진",
  },
  movie: {
    creatorLabel: "감독/출연진",
  },
  comic: {
    creatorLabel: "작가",
  },
  webtoon: {
    creatorLabel: "작가",
  },
  music: {
    creatorLabel: "아티스트/참여자",
  },
  book: {
    creatorLabel: "작가/참여자",
  },
  game: {
    creatorLabel: "개발사/참여자",
  },
  other: {
    creatorLabel: "제작자/참여자",
  },
};

export default function AddContentPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("novel");
  const [tags, setTags] = useState<string[]>([]);
  const [aliases, setAliases] = useState<string[]>([]);
  const [artists, setArtists] = useState<string[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    year: "",
    platform: "",
    description: "",
  });

  // tRPC 뮤테이션 훅
  const createContent = api.content.create.useMutation({
    onSuccess: () => {
      alert("컨텐츠가 성공적으로 등록되었습니다! 🎉");
      router.push("/contents");
    },
    onError: () => {
      alert(`등록 실패`);
    },
  });

  const currentFields =
    categoryFields[selectedCategory as keyof typeof categoryFields];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTag = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      // 한글 입력 조합 중인지 체크
      if (event.nativeEvent.isComposing) {
        return;
      }

      event.preventDefault();
      const tagValue = (event.target as HTMLInputElement).value.trim();

      if (tagValue && !tags.includes(tagValue)) {
        setTags([...tags, tagValue]);
        (event.target as HTMLInputElement).value = "";
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 카테고리 매핑 (소문자 → 대문자)
    const categoryMap: Record<string, "NOVEL" | "WEBTOON" | "GAME"> = {
      novel: "NOVEL",
      webtoon: "WEBTOON",
      game: "GAME",
    };

    // 제출할 데이터 구성
    const submitData = {
      title: formData.title,
      category: categoryMap[selectedCategory] ?? "NOVEL",
      year: formData.year || undefined,
      platform: formData.platform || undefined,
      description: formData.description,
      artists: artists.filter((artist) => artist.trim() !== ""),
      aliases: aliases.filter((alias) => alias.trim() !== ""),
      tags: tags,
      image: imagePreview ?? undefined,
    };

    console.log("제출 데이터:", submitData);

    // tRPC 뮤테이션 호출
    createContent.mutate(submitData);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="rounded-xl bg-white p-8 shadow-lg">
            <h1 className="border-primary mb-8 inline-block border-b-4 pb-3 text-2xl font-bold text-gray-800">
              ✨ 새 컨텐츠 추가
            </h1>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* 카테고리 선택 */}
              <div>
                <label className="mb-3 block text-sm font-semibold text-gray-700">
                  컨텐츠 유형 *
                </label>
                <div className="grid grid-cols-4 gap-4 md:grid-cols-7">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => handleCategoryChange(category.id)}
                      className={`rounded-xl border-2 p-4 text-center transition-all duration-300 ${
                        selectedCategory === category.id
                          ? "border-primary bg-primary text-white"
                          : "hover:border-primary border-gray-200 bg-white text-gray-700"
                      }`}
                    >
                      <span className="mb-2 block text-2xl">
                        {category.icon}
                      </span>
                      <span className="text-sm font-medium">
                        {category.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 이미지 업로드 */}
              <div>
                <label className="mb-3 block text-sm font-semibold text-gray-700">
                  표지/포스터 이미지
                </label>
                <div
                  className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                    imagePreview
                      ? "border-primary bg-gray-50"
                      : "hover:border-primary border-gray-300"
                  }`}
                  onClick={() => document.getElementById("imageInput")?.click()}
                >
                  {imagePreview ? (
                    <div>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="mx-auto mb-3 max-h-48 max-w-48 rounded-lg"
                      />
                      <div className="text-sm text-gray-600">
                        클릭하여 이미지 변경
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="mb-3 text-4xl text-gray-400">📷</div>
                      <div className="text-gray-600">
                        클릭하여 이미지 업로드
                        <br />
                        <small>JPG, PNG 파일 (최대 5MB)</small>
                      </div>
                    </>
                  )}
                  <input
                    type="file"
                    id="imageInput"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>
              </div>

              {/* 기본 정보 */}
              <div>
                <label
                  htmlFor="title"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  제목 *
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="focus:border-primary w-full rounded-lg border-2 border-gray-200 px-4 py-3 transition-colors focus:outline-none"
                  placeholder="컨텐츠 제목을 입력하세요"
                  required
                />
              </div>

              {/* 아티스트/참여자 시스템 */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <label className="block text-sm font-semibold text-gray-700">
                    {currentFields.creatorLabel}
                  </label>
                  <Button
                    type="button"
                    onClick={() => setArtists([...artists, ""])}
                    variant="secondary"
                    size="sm"
                  >
                    + 추가
                  </Button>
                </div>

                <div className="space-y-3">
                  {artists.map((artist, index) => (
                    <div key={index} className="flex gap-3">
                      <input
                        type="text"
                        value={artist}
                        onChange={(e) => {
                          const updatedArtists = [...artists];
                          updatedArtists[index] = e.target.value;
                          setArtists(updatedArtists);
                        }}
                        className="focus:border-primary flex-1 rounded-lg border-2 border-gray-200 px-4 py-3 transition-colors focus:outline-none"
                        placeholder={`${currentFields.creatorLabel} 이름을 입력하세요`}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setArtists(artists.filter((_, i) => i !== index))
                        }
                        className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-red-200 text-red-500 transition-colors hover:border-red-300 hover:bg-red-50"
                      >
                        ×
                      </button>
                    </div>
                  ))}

                  {artists.length === 0 && (
                    <div className="rounded-lg border-2 border-dashed border-gray-200 p-6 text-center text-gray-500">
                      + 추가 버튼을 눌러서 {currentFields.creatorLabel}를
                      추가하세요
                    </div>
                  )}
                </div>
              </div>

              {/* 별칭 시스템 */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <label className="block text-sm font-semibold text-gray-700">
                    별칭/다른 이름
                    <span className="ml-2 text-xs text-gray-500">(검색용)</span>
                  </label>
                  <Button
                    type="button"
                    onClick={() => setAliases([...aliases, ""])}
                    variant="secondary"
                    size="sm"
                  >
                    + 추가
                  </Button>
                </div>

                <div className="space-y-3">
                  {aliases.map((alias, index) => (
                    <div key={index} className="flex gap-3">
                      <input
                        type="text"
                        value={alias}
                        onChange={(e) => {
                          const updatedAliases = [...aliases];
                          updatedAliases[index] = e.target.value;
                          setAliases(updatedAliases);
                        }}
                        className="focus:border-primary flex-1 rounded-lg border-2 border-gray-200 px-4 py-3 transition-colors focus:outline-none"
                        placeholder="별칭을 입력하세요 (예: 전독시, Omniscient Reader)"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setAliases(aliases.filter((_, i) => i !== index))
                        }
                        className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-red-200 text-red-500 transition-colors hover:border-red-300 hover:bg-red-50"
                      >
                        ×
                      </button>
                    </div>
                  ))}

                  {aliases.length === 0 && (
                    <div className="rounded-lg border-2 border-dashed border-gray-200 p-6 text-center text-gray-500">
                      + 추가 버튼을 눌러서 별칭을 추가하세요
                    </div>
                  )}
                </div>
              </div>

              {/* 컨텐츠 유형별 동적 필드 */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="year"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    출시년도
                  </label>
                  <input
                    type="number"
                    id="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    className="focus:border-primary w-full rounded-lg border-2 border-gray-200 px-4 py-3 transition-colors focus:outline-none"
                    placeholder="2025"
                    min="1900"
                    max="2030"
                  />
                </div>
              </div>

              {/* 플랫폼/출판사 (동적 라벨) */}
              <div>
                <label
                  htmlFor="platform"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  {selectedCategory === "book"
                    ? "출판사"
                    : selectedCategory === "music"
                      ? "음반사"
                      : selectedCategory === "movie"
                        ? "배급사"
                        : "플랫폼"}
                </label>
                <input
                  type="text"
                  id="platform"
                  value={formData.platform}
                  onChange={handleInputChange}
                  className="focus:border-primary w-full rounded-lg border-2 border-gray-200 px-4 py-3 transition-colors focus:outline-none"
                  placeholder={
                    selectedCategory === "book"
                      ? "예: 민음사, 문학동네"
                      : selectedCategory === "music"
                        ? "예: SM Entertainment, YG"
                        : selectedCategory === "movie"
                          ? "예: 롯데엔터테인먼트"
                          : "예: 카카오페이지, 넷플릭스"
                  }
                />
              </div>

              {/* 장르/태그 */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  장르/키워드
                </label>
                <input
                  type="text"
                  className="focus:border-primary w-full rounded-lg border-2 border-gray-200 px-4 py-3 transition-colors focus:outline-none"
                  placeholder="태그를 입력하고 Enter를 누르세요"
                  onKeyDown={handleAddTag}
                />
                <div className="mt-3 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-primary flex items-center gap-2 rounded-full px-3 py-1 text-sm text-white"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="cursor-pointer font-bold hover:text-gray-200"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* 설명 */}
              <div>
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  {selectedCategory === "novel" ||
                  selectedCategory === "webtoon"
                    ? "줄거리"
                    : selectedCategory === "movie" ||
                        selectedCategory === "drama"
                      ? "시놉시스"
                      : selectedCategory === "music"
                        ? "앨범 소개"
                        : "설명"}{" "}
                  *
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="resize-vertical focus:border-primary min-h-32 w-full rounded-lg border-2 border-gray-200 px-4 py-3 transition-colors focus:outline-none"
                  placeholder="컨텐츠에 대한 간단한 설명을 작성해주세요"
                  required
                />
              </div>

              {/* 버튼 */}
              <div className="flex justify-center gap-4 border-t border-gray-200 pt-6">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => router.back()}
                  disabled={createContent.isPending}
                >
                  취소
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={createContent.isPending}
                >
                  {createContent.isPending ? "등록 중..." : "컨텐츠 등록"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
