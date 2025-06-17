"use client";

import { useEffect, useState } from "react";
import { fetchUserPlaylists } from "@/lib/actions";
import { useAuth } from "@/lib/AuthContext";

export default function ViewPlaylists() {
  const user = useAuth();
  const [playlists, setPlaylists] = useState<any[]>([]);

  useEffect(() => {
    if (user && user.user && user.user.id) {
      fetchUserPlaylists(user.user.id).then(setPlaylists).catch(console.error);
    }
  }, [user]);

  return (
    <div className="p-4 space-y-4">
      {playlists.length === 0 ? (
        <p>No playlists yet</p>
      ) : (
        <ul className="space-y-2">
          {playlists.map((playlist) => (
            <li key={playlist.id} className="border p-3 rounded shadow">
              <h2 className="font-semibold">{playlist.title}</h2>
              <p className="text-sm text-muted-foreground">{playlist.description || "No description"}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
