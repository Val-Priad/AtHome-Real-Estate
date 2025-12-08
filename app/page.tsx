import Image from "next/image";
import Link from "next/link";
import { FaBuilding } from "react-icons/fa";
import { FaHouseChimney } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import styles from "@/styles/page.module.css";
import { getOffersCount } from "@/lib/actions/estate/getOffersCount";

export default async function Page() {
  const offers = await getOffersCount();
  return (
    <main className={`${styles["bg-home"]} flex items-center justify-center`}>
      <div className="flex w-50 flex-col sm:w-60 lg:w-66 xl:w-80 2xl:w-100">
        <div className="mb-5 flex flex-col items-center justify-center gap-1 2xl:mb-10">
          <Image
            src="/logo_big.webp"
            alt="Company logo"
            width={346}
            height={404}
            className="h-auto w-full"
          />
          {!!offers && (
            <p className="text-body 2xl:text-h5 text-brand-10 text-center">
              Choose from {offers} real estate offers
            </p>
          )}
        </div>
        <div className="flex flex-col items-center justify-center gap-2.5 sm:flex-row sm:gap-6 md:gap-8 2xl:gap-10">
          <Link href={`/search?estateType=apartment`}>
            <Button size="lg" className="cursor-pointer">
              <FaBuilding />
              Apartments
            </Button>
          </Link>
          <Link href={`/search?estateType=house`}>
            <Button size="lg" className="cursor-pointer">
              <FaHouseChimney />
              Houses
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
