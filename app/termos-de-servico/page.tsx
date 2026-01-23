import { getLocale } from "next-intl/server";
import { redirect } from "next/navigation";

export default async function TermsOfServiceRedirectPage() {
  const locale = await getLocale();
  redirect(`/${locale}/termos-de-servico`);
}
