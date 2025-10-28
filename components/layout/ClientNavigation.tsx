import Image from "next/image";
import Link from "next/link";
import { CgMenu } from "react-icons/cg";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";

export default async function ClientNavigation({ lang }: { lang: Locale }) {
  const dict = await getDictionary(lang);
  const t = dict.nav;

  return (
    <header className="flex items-center justify-between px-10 py-4 2xl:px-20 2xl:py-5">
      <Link href={`/${lang}`}>
        <Image
          src="/logo_small.webp"
          alt={t.alt.logo}
          width={138}
          height={123}
          className="h-auto w-full"
        />
      </Link>

      <CgMenu className="text-brand-10 h-8 w-8 md:hidden" />

      <ul className="text-body xl:text-h5 hidden list-none gap-7 font-bold md:flex 2xl:flex 2xl:gap-20">
        <li className="duration-300 hover:-translate-y-1">
          <Link href={`/${lang}/admin`}>{t.links.admin}</Link>
        </li>
        <li className="duration-300 hover:-translate-y-1">
          <Link href={`/${lang}/profile/favorites`}>{t.links.saved}</Link>
        </li>
        <li className="duration-300 hover:-translate-y-1">
          <Link href={`/${lang}/sell-with-us`}>{t.links.sell}</Link>
        </li>
        <li className="duration-300 hover:-translate-y-1">
          <Link
            href={`/${lang}/log-in`}
            className="text-brand-1 bg-brand-6 hover:bg-brand-5 rounded-lg px-4 py-2 duration-300 hover:text-white"
          >
            {t.links.login}
          </Link>
        </li>
      </ul>
    </header>
  );
}
