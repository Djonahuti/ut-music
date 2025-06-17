
import { supabase } from "@/lib/supabase";

export const addSongToPlaylist = async (playlistId: string, songId: string) => {
  const { error } = await supabase.from("playlist_songs").insert([{ playlist_id: playlistId, song_id: songId }]);
  if (error) throw new Error(error.message);
};

export const fetchUserPlaylists = async (userId: string) => {
  const { data, error } = await supabase
    .from("playlists")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
};

export const createPlaylist = async (userId: string, title: string) => {
  const { data, error } = await supabase
    .from("playlists")
    .insert([{ title, user_id: userId }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};
