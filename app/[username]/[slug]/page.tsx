import type { Metadata } from "next";
import { notFound } from "next/navigation";
import OwnerBar from "@/components/public/OwnerBar";
import InstrumentView from "@/components/public/practices/InstrumentView";
import { getSiteHost } from "@/lib/data";
import { getDictionary } from "@/lib/i18n";
import { toPracticesData, toPublicInstrument } from "@/lib/page-data";
import { loadPublicAccount } from "@/lib/public-page";

interface Props {
  params: Promise<{ username: string; slug: string }>;
}

/** The instrument at /username/slug. Hidden ones are only shown to the owner. */
async function loadInstrument(params: Props["params"]) {
  const { username, slug } = await params;
  const result = await loadPublicAccount(username);
  if (!result) return null;
  const instrument = result.account.instruments.find((i) => i.slug === decodeURIComponent(slug));
  if (!instrument || (!instrument.isVisible && !result.isOwner)) return null;
  return { ...result, instrument };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const result = await loadInstrument(params);
  if (!result) return { title: "PersonalCMS" };
  return { title: `${result.instrument.name} · ${result.account.page.fullName}`, description: result.instrument.summary };
}

const InstrumentPage = async ({ params }: Props) => {
  const result = await loadInstrument(params);
  if (!result) notFound();

  const { account, isOwner, instrument } = result;
  const { lang, t } = await getDictionary();
  const host = await getSiteHost();
  const data = toPracticesData(account, t, lang);

  // Previous / next among the instruments the public can see
  const list = data.instruments;
  const index = list.findIndex((i) => i.id === instrument.id);
  const neighbor = (k: number) => (index >= 0 && list[k] ? { slug: list[k].slug, name: list[k].name } : undefined);

  return (
    <>
      {isOwner && <OwnerBar address={`${host}/${account.user.username}/${instrument.slug}`} isPublished={account.page.isPublished} t={t} />}
      <InstrumentView
        fullName={account.page.fullName}
        basePath={data.basePath}
        instrument={toPublicInstrument(instrument)}
        practice={data.practices.find((p) => p.id === instrument.practiceId)}
        buildLog={data.entries.filter((e) => e.instrumentId === instrument.id)}
        prev={neighbor(index - 1)}
        next={neighbor(index + 1)}
        labels={data.labels}
      />
    </>
  );
};

export default InstrumentPage;
