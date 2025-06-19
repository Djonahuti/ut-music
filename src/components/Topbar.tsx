"use client";

import { ListOrdered, LogOutIcon, Search, UserCircle } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Input } from "./ui/input";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { User } from "@/types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { usePlayer } from "@/lib/playerContext";
import { TrackInfo } from "./TrackInfo";
import { PlayerControls } from "./Controls";
//import { Timeline } from "./Timeline";
import { Volume } from "./Volume";
import { Button } from "./ui/button";

export default function Topbar() {
  const [user, setUser] = useState<User | null>(null);
  const player = usePlayer();

useEffect(() => {
    // Fetch user data from Supabase
    const fetchUserData = async () => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', user.email)
          .single();

        if (error) {
          console.error('Error fetching user data:', error.message);
        } else {
          setUser(data);
        }
      } else if (userError) {
        console.error('Error getting user:', userError.message);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/sign-in';
  };


  return (
    <div className="w-full h-15 flex justify-between items-center p-2 border-b bg-background">
      <>
        {player && player.currentTrack && (
        <>
          <div className="flex items-center gap-2">
              <PlayerControls />
              <Volume />
          </div>
          <div className="flex items-center gap-2">
            <TrackInfo />
          </div>  
        </>        
        )}

      </>
      <div className="flex gap-2 items-center">
        <DropdownMenu>
          <DropdownMenuTrigger
           className="p-1 rounded hover:bg-muted transition ml-2"
          >
         <ListOrdered className="w-5 h-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Up Next</DropdownMenuLabel>
            <DropdownMenuSeparator />             
            <DropdownMenuItem>
                  Track 1
            </DropdownMenuItem>             
          </DropdownMenuContent>
        </DropdownMenu>       
        <div className="flex items-center border rounded-md px-2">
          <Search className="w-4 h-4 text-muted-foreground mr-1" />
          <Input
            type="text"
            placeholder="Search"
            className="border-none p-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-8"
          />
        </div>
        {user && user.id ? (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className="w-8 h-8 rounded-full">
                {user.avatar_url ? (
                  <AvatarImage
                   src={user.avatar_url} 
                   alt={user.fullName} 
                   className="w-10 h-10 rounded-full border-gray-300" 
                  />
                ) : (
                  <AvatarFallback className="rounded-full">{user.fullName?.charAt(0)}</AvatarFallback>
                )}
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-full">
                    {user.avatar_url ? (
                      <AvatarImage
                        src={user.avatar_url}
                        alt={user.fullName}
                        className="rounded-full"
                      />
                    ) : (
                      <AvatarFallback className="rounded-full">{user.fullName?.charAt(0)}</AvatarFallback>
                    )}
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user.fullName}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Link href="/profile" className="flex items-center gap-2">
                    <UserCircle className="w-4 h-4" />Profile
                  </Link>
                </DropdownMenuItem>                
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <button onClick={handleLogout} className="flex space-x-0 w-full text-left cursor-pointer">
                  <LogOutIcon />
                  Log out
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ):(
        <Link href="/sign-in" className="rounded-full">
          <Avatar className="h-10 w-10 rounded-full">
            <AvatarFallback className="rounded-full">US</AvatarFallback>
          </Avatar>        
        </Link>          
        )}
        <ThemeToggle />
      </div>
    </div>
  );
}