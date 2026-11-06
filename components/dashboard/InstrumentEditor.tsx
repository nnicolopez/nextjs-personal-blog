"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import {
  ActionIcon,
  Box,
  Button,
  Divider,
  Group,
  Paper,
  Pill,
  PillsInput,
  SegmentedControl,
  Select,
  SimpleGrid,
  Stack,
  Switch,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { deleteInstrumentAction, saveInstrumentAction } from "@/app/practice-actions";
import InstrumentView from "@/components/public/practices/InstrumentView";
import type { PracticesLabels, PublicEntry, PublicInstrument } from "@/components/public/practices/types";
import SubmitButton from "@/components/ui/SubmitButton";
import type { DemoKind, InstrumentImage, InstrumentKind, InstrumentLink, InstrumentStatus, PracticeColor } from "@/db/schema";
import type { Dictionary } from "@/lib/i18n";
import { lines, PRACTICE_HEX, slugify } from "@/lib/practices";
import { SaveRow } from "./EditorForms";
import classes from "./InstrumentEditor.module.css";

export interface InstrumentDraft {
  id: string | null;
  name: string;
  slug: string;
  practiceId: string;
  kind: InstrumentKind;
  status: InstrumentStatus;
  summary: string;
  problem: string;
  byMe: string;
  byAi: string;
  materials: string[];
  demoKind: DemoKind;
  demoUrl: string;
  images: InstrumentImage[];
  links: InstrumentLink[];
  featured: boolean;
  isVisible: boolean;
}

interface Props {
  t: Dictionary;
  labels: PracticesLabels;
  initial: InstrumentDraft;
  practices: { id: string; name: string; color: PracticeColor }[];
  buildLog: PublicEntry[];
  fullName: string;
  basePath: string;
  host: string;
}

/**
 * Instrument form with a live preview of its public page. The fields are
 * controlled so the preview updates as you type; lists travel to the server
 * action as JSON in hidden inputs.
 */
const InstrumentEditor = ({ t, labels, initial, practices, buildLog, fullName, basePath, host }: Props) => {
  const [state, formAction] = useActionState(saveInstrumentAction, {});
  const [draft, setDraft] = useState(initial);
  // New instruments follow the name until the address is edited by hand
  const [slugTouched, setSlugTouched] = useState(Boolean(initial.id));
  const [material, setMaterial] = useState("");
  const [width, setWidth] = useState<"desktop" | "mobile">("desktop");
  const [confirmDelete, setConfirmDelete] = useState(false);

  // The preview renders the page at its real width and zooms it to fit the frame
  const viewportRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(0.5);
  const pageWidth = width === "desktop" ? 1200 : 390;
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const update = () => setZoom(Math.min(1, el.clientWidth / pageWidth));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [pageWidth]);

  const set = <K extends keyof InstrumentDraft>(key: K, value: InstrumentDraft[K]) => setDraft((d) => ({ ...d, [key]: value }));
  const setName = (name: string) => setDraft((d) => ({ ...d, name, slug: slugTouched ? d.slug : slugify(name) }));
  const err = state.errors ?? {};

  const addMaterial = () => {
    const value = material.trim();
    if (value && !draft.materials.includes(value)) set("materials", [...draft.materials, value]);
    setMaterial("");
  };

  const preview: PublicInstrument = useMemo(
    () => ({
      id: draft.id ?? "new",
      slug: draft.slug,
      practiceId: draft.practiceId,
      name: draft.name || t.newInstrument,
      kind: draft.kind,
      status: draft.status,
      summary: draft.summary,
      problem: draft.problem,
      byMe: lines(draft.byMe),
      byAi: lines(draft.byAi),
      materials: draft.materials,
      demo: draft.demoKind === "images" || !draft.demoUrl ? null : { kind: draft.demoKind, url: draft.demoUrl },
      images: draft.images.filter((i) => i.url),
      links: draft.links.filter((l) => l.label && l.url),
      featured: draft.featured,
    }),
    [draft, t.newInstrument],
  );
  const practice = practices.find((p) => p.id === draft.practiceId);

  return (
    <div className={classes.layout}>
      <Paper p={24} className={classes.form}>
        <form action={formAction}>
          <input type="hidden" name="id" value={draft.id ?? ""} />
          <input type="hidden" name="materials" value={JSON.stringify(draft.materials)} />
          <input type="hidden" name="images" value={JSON.stringify(draft.images)} />
          <input type="hidden" name="links" value={JSON.stringify(draft.links)} />
          <input type="hidden" name="kind" value={draft.kind} />
          <input type="hidden" name="demoKind" value={draft.demoKind} />

          <Stack gap="md">
            <Text fw={700}>{t.basics}</Text>
            <TextInput label={t.nameLabel} name="name" value={draft.name} onChange={(e) => setName(e.currentTarget.value)} required maxLength={80} error={err.name} />
            <TextInput
              label={t.slugLabel}
              name="slug"
              value={draft.slug}
              onChange={(e) => { setSlugTouched(true); set("slug", e.currentTarget.value.toLowerCase()); }}
              leftSection={<Text fz={13} c="dimmed" pl={10} style={{ whiteSpace: "nowrap" }}>{host}{basePath}/</Text>}
              leftSectionWidth={Math.min(220, (host.length + basePath.length + 1) * 7.4 + 14)}
              maxLength={60}
              error={err.slug}
            />
            <Textarea label={t.summaryLabel} description={t.summaryHint} name="summary" value={draft.summary} onChange={(e) => set("summary", e.currentTarget.value)} autosize minRows={2} maxLength={300} error={err.summary} />
            <SimpleGrid cols={2} spacing="sm">
              <Select
                label={t.practiceLabel}
                name="practiceId"
                data={practices.map((p) => ({ value: p.id, label: p.name }))}
                value={draft.practiceId}
                onChange={(v) => v && set("practiceId", v)}
                allowDeselect={false}
                error={err.practiceId}
              />
              <Select
                label={t.statusLabel}
                name="status"
                data={(Object.keys(labels.status) as InstrumentStatus[]).map((s) => ({ value: s, label: labels.status[s] }))}
                value={draft.status}
                onChange={(v) => v && set("status", v as InstrumentStatus)}
                allowDeselect={false}
              />
            </SimpleGrid>
            <div>
              <Text fz={13} fw={600} mb={7}>{t.kindLabel}</Text>
              <SegmentedControl
                fullWidth
                value={draft.kind}
                onChange={(v) => set("kind", v as InstrumentKind)}
                data={(Object.keys(labels.kind) as InstrumentKind[]).map((k) => ({ value: k, label: labels.kind[k] }))}
              />
            </div>
            <Textarea label={t.problemLabel} name="problem" value={draft.problem} onChange={(e) => set("problem", e.currentTarget.value)} autosize minRows={3} maxLength={3000} error={err.problem} />

            <Divider color="var(--pc-border)" />
            <Text fw={700}>{t.aiSection}</Text>
            <Textarea label={t.byMeLabel} name="byMe" value={draft.byMe} onChange={(e) => set("byMe", e.currentTarget.value)} autosize minRows={3} maxLength={2000} error={err.byMe} />
            <Textarea label={t.byAiLabel} description={t.linesHint} name="byAi" value={draft.byAi} onChange={(e) => set("byAi", e.currentTarget.value)} autosize minRows={3} maxLength={2000} error={err.byAi} />

            <Divider color="var(--pc-border)" />
            <PillsInput label={t.materialsLabel} description={t.materialsHint} error={err.materials}>
              <Pill.Group>
                {draft.materials.map((m) => (
                  <Pill key={m} withRemoveButton removeButtonProps={{ "aria-label": `${t.remove} ${m}` }} onRemove={() => set("materials", draft.materials.filter((x) => x !== m))}>{m}</Pill>
                ))}
                <PillsInput.Field
                  value={material}
                  onChange={(e) => setMaterial(e.currentTarget.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addMaterial(); }
                    if (e.key === "Backspace" && !material && draft.materials.length) set("materials", draft.materials.slice(0, -1));
                  }}
                  onBlur={addMaterial}
                  maxLength={40}
                  aria-label={t.materialsLabel}
                />
              </Pill.Group>
            </PillsInput>

            <Divider color="var(--pc-border)" />
            <Text fw={700}>{t.demoSection}</Text>
            <SegmentedControl
              fullWidth
              aria-label={t.demoKindLabel}
              value={draft.demoKind}
              onChange={(v) => set("demoKind", v as DemoKind)}
              data={(Object.keys(t.demoKinds) as DemoKind[]).map((k) => ({ value: k, label: t.demoKinds[k] }))}
            />
            {draft.demoKind !== "images" && (
              <TextInput label={t.demoUrlLabel} name="demoUrl" value={draft.demoUrl} onChange={(e) => set("demoUrl", e.currentTarget.value)} inputMode="url" maxLength={200} error={err.demoUrl} />
            )}
            <div>
              <Text fz={13} fw={600} mb={7}>{t.imagesLabel}</Text>
              <Stack gap={6}>
                {draft.images.map((image, k) => (
                  <Group key={k} gap={6} wrap="nowrap">
                    <TextInput flex={3} placeholder={t.imageUrl} aria-label={t.imageUrl} value={image.url} inputMode="url"
                      onChange={(e) => set("images", draft.images.map((x, j) => (j === k ? { ...x, url: e.currentTarget.value } : x)))} />
                    <TextInput flex={2} placeholder={t.imageCaption} aria-label={t.imageCaption} value={image.caption} maxLength={120}
                      onChange={(e) => set("images", draft.images.map((x, j) => (j === k ? { ...x, caption: e.currentTarget.value } : x)))} />
                    <ActionIcon size={36} aria-label={t.remove} onClick={() => set("images", draft.images.filter((_, j) => j !== k))}>✕</ActionIcon>
                  </Group>
                ))}
              </Stack>
              {err.images && <Text fz={13} c="red" mt={4}>{err.images}</Text>}
              {draft.images.length < 12 && (
                <Button variant="subtle" size="compact-sm" mt={6} onClick={() => set("images", [...draft.images, { url: "", caption: "" }])}>{t.addImage}</Button>
              )}
            </div>

            <Divider color="var(--pc-border)" />
            <div>
              <Text fw={700}>{t.linksSection}</Text>
              <Text fz={13} c="dimmed" mb={8}>{t.linksHint}</Text>
              <Stack gap={6}>
                {draft.links.map((link, k) => (
                  <Group key={k} gap={6} wrap="nowrap">
                    <TextInput flex={2} placeholder={t.linkLabel} aria-label={t.linkLabel} value={link.label} maxLength={40}
                      onChange={(e) => set("links", draft.links.map((x, j) => (j === k ? { ...x, label: e.currentTarget.value } : x)))} />
                    <TextInput flex={3} placeholder={t.linkUrl} aria-label={t.linkUrl} value={link.url} inputMode="url"
                      onChange={(e) => set("links", draft.links.map((x, j) => (j === k ? { ...x, url: e.currentTarget.value } : x)))} />
                    <ActionIcon size={36} aria-label={t.remove} onClick={() => set("links", draft.links.filter((_, j) => j !== k))}>✕</ActionIcon>
                  </Group>
                ))}
              </Stack>
              {err.links && <Text fz={13} c="red" mt={4}>{err.links}</Text>}
              {draft.links.length < 6 && (
                <Button variant="subtle" size="compact-sm" mt={6} onClick={() => set("links", [...draft.links, { label: "", url: "" }])}>{t.addLink}</Button>
              )}
            </div>

            <Divider color="var(--pc-border)" />
            <Text fw={700}>{t.publication}</Text>
            <Switch name="isVisible" label={t.visibleOnSite} checked={draft.isVisible} onChange={(e) => set("isVisible", e.currentTarget.checked)} />
            <Switch name="featured" label={t.featureOnHome} checked={draft.featured} onChange={(e) => set("featured", e.currentTarget.checked)} />

            {draft.id ? <SaveRow state={state} t={t} /> : <Group mt={6}><SubmitButton>{t.createInstrument}</SubmitButton></Group>}
          </Stack>
        </form>

        {draft.id && (
          <Group mt={18} gap={10}>
            {!confirmDelete ? (
              <Button variant="subtle" color="red" size="compact-sm" onClick={() => setConfirmDelete(true)}>{t.deleteInstrument}</Button>
            ) : (
              <form action={deleteInstrumentAction.bind(null, draft.id)}>
                <Group gap={10}>
                  <Text fz={13}>{t.confirmDeleteShort}</Text>
                  <SubmitButton color="red" size="compact-sm">{t.deleteInstrument}</SubmitButton>
                  <Button variant="default" size="compact-sm" onClick={() => setConfirmDelete(false)}>{t.cancel}</Button>
                </Group>
              </form>
            )}
          </Group>
        )}
      </Paper>

      <Box className={classes.preview}>
        <Group justify="space-between" mb={10}>
          <Text fz={14} fw={700}>{t.preview}</Text>
          <SegmentedControl
            size="xs"
            value={width}
            onChange={(v) => setWidth(v as "desktop" | "mobile")}
            data={[{ value: "desktop", label: t.previewDesktop }, { value: "mobile", label: t.previewMobile }]}
          />
        </Group>
        <div className={classes.frame} data-width={width}>
          <div className={classes.bar}><i /><i /><i /><span>{host}{basePath}/{draft.slug}</span></div>
          <div className={classes.viewport} ref={viewportRef}>
            <div className={classes.page} style={{ width: pageWidth, zoom }} inert>
              <InstrumentView
                fullName={fullName}
                basePath={basePath}
                instrument={preview}
                practice={practice && { id: practice.id, name: practice.name, color: PRACTICE_HEX[practice.color], description: "", showInSequencer: true }}
                buildLog={buildLog}
                labels={labels}
              />
            </div>
          </div>
        </div>
      </Box>
    </div>
  );
};

export default InstrumentEditor;
