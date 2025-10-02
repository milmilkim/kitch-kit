import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2Client, R2_BUCKET_NAME } from "@/lib/r2";

export const uploadRouter = createTRPCRouter({
  // 파일 업로드를 위한 presigned URL 생성
  getPresignedUrl: protectedProcedure
    .input(
      z.object({
        fileName: z.string(),
        fileType: z.string(),
        fileSize: z.number().max(10 * 1024 * 1024), // 10MB 제한
      })
    )
    .mutation(async ({ input }) => {
      const { fileName, fileType, fileSize } = input;
      
      // 파일명에 타임스탬프 추가하여 중복 방지
      const timestamp = Date.now();
      const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
      const key = `uploads/${timestamp}-${sanitizedFileName}`;

      const command = new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
        ContentType: fileType,
        ContentLength: fileSize,
      });

      try {
        const presignedUrl = await getSignedUrl(r2Client, command, {
          expiresIn: 300, // 5분 후 만료
        });

        return {
          presignedUrl,
          key,
        };
      } catch {
        throw new Error("파일 업로드 URL 생성에 실패했습니다.");
      }
    }),

  // 파일 삭제
  deleteFile: protectedProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ input }) => {
      const { key } = input;
      
      try {
        const command = new DeleteObjectCommand({
          Bucket: R2_BUCKET_NAME,
          Key: key,
        });
        
        await r2Client.send(command);
        return { success: true };
      } catch {
        throw new Error("파일 삭제에 실패했습니다.");
      }
    }),
});
