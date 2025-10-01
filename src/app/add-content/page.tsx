"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import Header from "../../components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type z } from "zod";
import { CreateContentSchema } from "@/lib/validators/content";
import type { ContentCategory } from "@prisma/client";
import { cn } from "@/lib/utils";

const categories: { id: ContentCategory; name: string; icon: string }[] = [
  { id: "NOVEL", name: "웹소설", icon: "📚" },
  //   { id: "drama", name: "드라마", icon: "📺" },
  { id: "WEBTOON", name: "웹툰", icon: "🎨" },
  // { id: "comic", name: "만화", icon: "💥" },
  //   { id: "movie", name: "영화", icon: "🎬" },
  //   { id: "music", name: "음반", icon: "🎵" },
  //   { id: "book", name: "도서", icon: "📖" },
  // { id: "game", name: "게임", icon: "🎮" },
  //   { id: "other", name: "기타", icon: "📁" },
];

// 컨텐츠 유형별 필드 정의
const categoryFields: Partial<
  Record<ContentCategory, { creatorLabel: string }>
> = {
  NOVEL: {
    creatorLabel: "작가",
  },
  DRAMA: {
    creatorLabel: "감독/출연진",
  },
  MOVIE: {
    creatorLabel: "감독/출연진",
  },
  COMIC: {
    creatorLabel: "작가",
  },
  WEBTOON: {
    creatorLabel: "작가",
  },
  MUSIC: {
    creatorLabel: "아티스트/참여자",
  },
  BOOK: {
    creatorLabel: "작가/참여자",
  },
  GAME: {
    creatorLabel: "개발사/참여자",
  },
  OTHER: {
    creatorLabel: "제작자/참여자",
  },
};

export default function AddContentPage() {
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const formSchema = CreateContentSchema;

  const form = useForm<z.infer<typeof CreateContentSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      category: "NOVEL",
      year: "",
      platform: "",
      description: "",
      artists: [],
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log("onSubmit");
    console.log(data);
    // createContent.mutate(submitData);
  };

  const selectedCategory = form.watch("category") ?? "NOVEL";

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

  const { fields: artistsFields, append: appendArtists, remove: removeArtists } = useFieldArray({
    name: "artists",
    control: form.control,
  });

  const { fields: aliasesFields, append: appendAliases, remove: removeAliases } = useFieldArray({
    name: "aliases",
    control: form.control,
  });

  const { fields: tagsFields, append: appendTags, remove: removeTags } = useFieldArray({
    name: "tags",
    control: form.control,
  });

  const handleAddTag = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      // 한글 입력 조합 중인지 체크
      if (event.nativeEvent.isComposing) {
        return;
      }

      event.preventDefault();
      const tagValue = (event.target as HTMLInputElement).value.trim();

      if (tagValue && !tagsFields.some((f) => f.value === tagValue)) {
        appendTags({ value: tagValue });
        (event.target as HTMLInputElement).value = "";
      }
    }
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

            <FormProvider {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit, (err) => {
                  console.log("onSubmit error");
                  console.log(err);
                })}
                className="space-y-8"
              >
                {/* 카테고리 선택 */}
                <div>
                  <label className="mb-3 block text-sm font-semibold text-gray-700">
                    컨텐츠 유형 *
                  </label>
                  <div className="grid grid-cols-4 gap-4 md:grid-cols-7">
                    {categories.map((category) => (
                      <button
                        onClick={() => form.setValue("category", category.id)}
                        key={category.id}
                        type="button"
                        className={cn(
                          `rounded-xl border-2 p-4 text-center transition-all duration-300`,
                          selectedCategory === category.id
                            ? "border-primary bg-primary text-white"
                            : "hover:border-primary border-gray-200 bg-white text-gray-700",
                        )}
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
                {/* <div>
                  <label className="mb-3 block text-sm font-semibold text-gray-700">
                    표지/포스터 이미지
                  </label>
                  <div
                    className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                      imagePreview
                        ? "border-primary bg-gray-50"
                        : "hover:border-primary border-gray-300"
                    }`}
                    onClick={() =>
                      document.getElementById("imageInput")?.click()
                    }
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
                </div> */}

                {/* 기본 정보 */}
                <div>
                  <label
                    htmlFor="title"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    제목 *
                  </label>
                  <Input
                    type="text"
                    id="title"
                    placeholder="컨텐츠 제목을 입력하세요"
                    {...form.register("title")}
                  />
                </div>

                {/* 아티스트/참여자 시스템 */}
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <label className="block text-sm font-semibold text-gray-700">
                      {currentFields!.creatorLabel}
                    </label>
                    <Button
                      type="button"
                      onClick={() => {
                        appendArtists({ value: "" });
                      }}
                      variant="secondary"
                    >
                      + 추가
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {artistsFields.map((artist, index) => (
                      <div key={index} className="flex gap-3">
                        <Input
                          id="artist"
                          type="text"
                          placeholder={`${currentFields!.creatorLabel} 이름을 입력하세요`}
                          {...form.register(`artists.${index}`)}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            removeArtists(index);
                            
                          }}
                          className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-red-200 text-red-500 transition-colors hover:border-red-300 hover:bg-red-50"
                        >
                          ×
                        </button>
                      </div>
                    ))}

                    {artistsFields.length === 0 && (
                      <div className="rounded-lg border-2 border-dashed border-gray-200 p-6 text-center text-gray-500">
                        + 추가 버튼을 눌러서 {currentFields!.creatorLabel}를
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
                      <span className="ml-2 text-xs text-gray-500">
                        (검색용)
                      </span>
                    </label>
                    <Button
                      type="button"
                      onClick={() => appendAliases({ value: "" })}
                      variant="secondary"
                      size="sm"
                    >
                      + 추가
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {aliasesFields.map((alias, index) => (
                      <div key={index} className="flex gap-3">
                        <Input
                          id="alias"
                          type="text"
                          {...form.register(`aliases.${index}`)}
                          placeholder="별칭을 입력하세요 (예: 전독시, Omniscient Reader)"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            removeAliases(index)
                          }
                          className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-red-200 text-red-500 transition-colors hover:border-red-300 hover:bg-red-50"
                        >
                          ×
                        </button>
                      </div>
                    ))}

                    {aliasesFields.length === 0 && (
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
                    <Input
                      type="number"
                      id="year"
                      placeholder="2025"
                      min="1900"
                      {...form.register("year")}
                    />
                  </div>
                </div>

                {/* 플랫폼/출판사 (동적 라벨) */}
                <div>
                  <label
                    htmlFor="platform"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    {selectedCategory === "BOOK"
                      ? "출판사"
                      : selectedCategory === "MUSIC"
                        ? "음반사"
                        : selectedCategory === "MOVIE"
                          ? "배급사"
                          : "플랫폼"}
                  </label>
                  <Input
                    type="text"
                    id="platform"
                    placeholder={
                      selectedCategory === "BOOK"
                        ? "예: 민음사, 문학동네"
                        : selectedCategory === "MUSIC"
                          ? "예: SM Entertainment, YG"
                          : selectedCategory === "MOVIE"
                            ? "예: 롯데엔터테인먼트"
                            : "예: 카카오페이지, 넷플릭스"
                    }
                    {...form.register("platform")}
                  />
                </div>

                {/* 장르/태그 */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    장르/키워드
                  </label>
                  <Input
                    type="text"
                    name="tags"
                    id="tags"
                    placeholder="태그를 입력하고 Enter를 누르세요"
                    onKeyDown={handleAddTag}
                  />
                  <div className="flex flex-wrap gap-1">
                    {tagsFields.map((tag, index) => (
                      <span
                        key={tag.value}
                        className="bg-primary inline-flex items-center rounded-full px-3 py-1 text-sm text-white"
                      >
                        {tag.value}
                        <button
                          type="button"
                          onClick={() => removeTags(index)}
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
                    {selectedCategory === "NOVEL" ||
                    selectedCategory === "WEBTOON"
                      ? "줄거리"
                      : selectedCategory === "MOVIE" ||
                          selectedCategory === "DRAMA"
                        ? "시놉시스"
                        : selectedCategory === "MUSIC"
                          ? "앨범 소개"
                          : "설명"}{" "}
                    *
                  </label>
                  <textarea
                    id="description"
                    className="resize-vertical focus:border-primary min-h-32 w-full rounded-lg border-2 border-gray-200 px-4 py-3 transition-colors focus:outline-none"
                    placeholder="컨텐츠에 대한 간단한 설명을 작성해주세요"
                    {...form.register("description")}
                  />
                </div>

                {/* 버튼 */}
                <div className="flex justify-center gap-4 border-t border-gray-200 pt-6">
                  <Button
                    type="button"
                    variant="secondary"
                    disabled={createContent.isPending}
                  >
                    취소
                  </Button>
                  <Button type="submit" disabled={createContent.isPending}>
                    {createContent.isPending ? "등록 중..." : "컨텐츠 등록"}
                  </Button>
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      </main>
    </>
  );
}
