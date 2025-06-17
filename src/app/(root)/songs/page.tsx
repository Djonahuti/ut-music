import { Song } from "@/components/shared/Song";
import { AuthProvider } from "@/lib/AuthContext";


export default function SongsPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold mb-4 hidden md:block">Songs</h1>
      <AuthProvider>
        <Song />
      </AuthProvider>
    </div>
  );
}