import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h1 className="text-brand-10 mb-4 text-4xl font-bold">404</h1>
      <p className="mb-6 text-xl text-gray-600">Page not found</p>

      <Link
        href="/"
        className="bg-brand-6 hover:bg-brand-7 rounded-md px-5 py-2 text-white transition"
      >
        Go back home
      </Link>
    </div>
  );
}
