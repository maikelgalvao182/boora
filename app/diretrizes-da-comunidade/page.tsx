import { getLocale } from "next-intl/server";
import { redirect } from "next/navigation";

export default async function CommunityGuidelinesRedirectPage() {
  const locale = await getLocale();
  redirect(`/${locale}/diretrizes-da-comunidade`);
}
