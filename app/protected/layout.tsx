import { AuthButton } from "@/components/auth-button";
import { Suspense } from "react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="border-b h-14 flex items-center px-6 justify-between">
        <span className="font-semibold text-sm">Cals Counter</span>
        <Suspense>
          <AuthButton />
        </Suspense>
      </nav>
      <main className="flex-1 max-w-3xl w-full mx-auto p-6">{children}</main>
    </div>
  );
}
