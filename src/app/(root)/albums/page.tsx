import { Album } from "@/components/shared/Album";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";


export default function AlbumsPage() {
  return (
    <div>
      <div className="flex items-center justify-between px-8 py-2 bg-background border-b space-x-5 md:hidden">
        <div className="fixed top-3 inset-x-0 z-50 left-3 text-3xl text-bold"><Link href="/"><ChevronLeft /></Link></div>
        <h1 className="text-xl font-semibold mb-2">Albums</h1>
      </div>      
      <h1 className="text-xl font-semibold mb-4 hidden md:block">Albums</h1>
      <Album />
    </div>
  );
}