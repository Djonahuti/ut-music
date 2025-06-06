"use client";

import { LogOutIcon, UserCircle } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Input } from "./ui/input";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { User } from "@/types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function Topbar() {
  const [user, setUser] = useState<User | null>(null);

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
    <header className="w-full flex justify-between items-center px-4 py-2 border-b bg-background">
      <div className="flex gap-4 items-center">
        <Input placeholder="Search" className="w-72" />
      </div>
      <div className="flex gap-2 items-center">
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
    </header>
  );
}