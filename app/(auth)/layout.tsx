export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-80 flex items-center justify-center">
      <div className="w-full max-w-md rounded-2xl bg-red-50 p-6">
        {children}
      </div>
    </div>
  );
}
