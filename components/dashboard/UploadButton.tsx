"use client";

import { useState } from "react";
import { Button, FileButton, Group, Progress, Text } from "@mantine/core";
import { upload } from "@vercel/blob/client";
import { slugify } from "@/lib/practices";
import { UPLOAD_LIMITS, UPLOAD_TYPES, type UploadKind } from "@/lib/uploads";

interface Props {
  /** Files go to "<username>/<folder>/..." in the Blob store */
  username: string;
  folder: string;
  kind?: UploadKind;
  multiple?: boolean;
  label: string;
  labels: { uploading: string; tooBig: string; failed: string };
  onUploaded: (url: string, fileName: string) => void;
}

/** Picks files and uploads them straight from the browser to Vercel Blob. */
const UploadButton = ({ username, folder, kind = "image", multiple = false, label, labels, onUploaded }: Props) => {
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const send = async (files: File[]) => {
    setError(null);
    for (const file of files) {
      if (file.size > UPLOAD_LIMITS[kind]) {
        setError(`${file.name}: ${labels.tooBig} (${Math.round(UPLOAD_LIMITS[kind] / 1024 / 1024)} MB)`);
        continue;
      }
      const dot = file.name.lastIndexOf(".");
      const base = slugify(dot > 0 ? file.name.slice(0, dot) : file.name) || "archivo";
      const ext = dot > 0 ? file.name.slice(dot).toLowerCase() : "";
      try {
        setProgress(0);
        const blob = await upload(`${username}/${folder}/${base}${ext}`, file, {
          access: "public",
          handleUploadUrl: "/api/upload",
          clientPayload: kind,
          contentType: file.type,
          onUploadProgress: ({ percentage }) => setProgress(percentage),
        });
        onUploaded(blob.url, dot > 0 ? file.name.slice(0, dot) : file.name);
      } catch {
        setError(`${file.name}: ${labels.failed}`);
      } finally {
        setProgress(null);
      }
    }
  };

  return (
    <div>
      <Group gap={10}>
        <FileButton
          accept={UPLOAD_TYPES[kind].join(",")}
          multiple={multiple}
          onChange={(value) => {
            const files = value ? (Array.isArray(value) ? value : [value]) : [];
            if (files.length) void send(files);
          }}
        >
          {(props) => (
            <Button {...props} variant="default" size="compact-sm" loading={progress !== null}>
              {label}
            </Button>
          )}
        </FileButton>
        {progress !== null && <Text fz={12} c="dimmed">{labels.uploading} {Math.round(progress)}%</Text>}
      </Group>
      {progress !== null && <Progress value={progress} size="xs" mt={6} />}
      {error && <Text fz={13} c="red" mt={6} role="alert">{error}</Text>}
    </div>
  );
};

export default UploadButton;
