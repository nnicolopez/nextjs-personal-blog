import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { requireAccount } from "@/lib/data";
import { UPLOAD_LIMITS, UPLOAD_TYPES } from "@/lib/uploads";

/**
 * Issues short-lived tokens so the browser uploads straight to Vercel Blob
 * (no 4.5 MB function body limit). Only a signed-in account gets a token, and
 * only for its own folder, the allowed media types and size.
 */
export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const account = await requireAccount();
        const kind = clientPayload === "audio" ? "audio" : "image";
        if (!pathname.startsWith(`${account.user.username}/`)) throw new Error("Wrong folder");
        return {
          allowedContentTypes: [...UPLOAD_TYPES[kind]],
          maximumSizeInBytes: UPLOAD_LIMITS[kind],
          addRandomSuffix: true,
        };
      },
    });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
