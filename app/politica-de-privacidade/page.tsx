import { getLocale } from "next-intl/server";
import { redirect } from "next/navigation";

export default async function PrivacyPolicyRedirectPage() {
  const locale = await getLocale();
  redirect(`/${locale}/politica-de-privacidade`);
}
