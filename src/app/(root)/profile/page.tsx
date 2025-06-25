import ProfilePage from "@/components/shared/ViewProfile";
import { AuthProvider } from "@/lib/AuthContext";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function Profile() {
  return (
    <div>
      <div className="flex items-center justify-between px-8 py-2 bg-background border-b space-x-5 md:hidden">
        <div className="fixed top-3 inset-x-0 z-50 left-3 text-3xl text-bold"><Link href="/"><ChevronLeft /></Link></div>
        <h1 className="text-xl font-semibold mb-2">Profile</h1>
      </div>
      <AuthProvider>
        <ProfilePage />
      </AuthProvider>      
    </div>
  );
}