import { getLocale } from "next-intl/server";
import { redirect } from "next/navigation";

export default async function SafetyEtiquetteRedirectPage() {
  const locale = await getLocale();
  redirect(`/${locale}/seguranca-etiqueta`);
}
