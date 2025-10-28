import { getDictionary } from "@/get-dictionary";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { FaBuilding } from "react-icons/fa";
import { FaHouseChimney } from "react-icons/fa6";
import { Locale } from "@/i18n-config";

export default async function Page(props: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await props.params;
  const dict = await getDictionary(lang);
  const t = dict.home;

  return (
    <main className="flex items-center justify-center">
      <div className="flex w-50 flex-col sm:w-60 lg:w-66 xl:w-80 2xl:w-100">
        <div className="mb-5 flex flex-col items-center justify-center gap-1 2xl:mb-10">
          <Image
            src="/logo_big.webp"
            alt={t.alt.logo}
            width={346}
            height={404}
            className="h-auto w-full"
          />
          <p className="text-body 2xl:text-h5 text-brand-10 text-center">
            {t.subtitle}
          </p>
        </div>
        <div className="flex flex-col items-center justify-center gap-2.5 sm:flex-row sm:gap-6 md:gap-8 2xl:gap-10">
          <Link href={`/${lang}/search?property-type=apartment`}>
            <Button
              type="main"
              icon={
                <FaBuilding className="text-brand-6 sm:h-5 sm:w-5 2xl:h-7 2xl:w-7" />
              }
              icon_position="left"
            >
              {t.buttons.apartments}
            </Button>
          </Link>
          <Link href={`/${lang}/search?property-type=house`}>
            <Button
              type="main"
              icon={
                <FaHouseChimney className="text-brand-6 sm:h-5 sm:w-5 2xl:h-7 2xl:w-7" />
              }
              icon_position="left"
            >
              {t.buttons.houses}
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
