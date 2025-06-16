import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  Mic,
  Folder,
  Music,
  Guitar,
  MoreHorizontal,
} from "lucide-react";

export default function MobileNav() {
  return (
    <nav className="w-full max-w-md mx-auto bg-white rounded-xl shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Library</h2>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            className="p-2 rounded-full hover:bg-gray-100 focus:outline-none"
          >
            <MoreHorizontal className="w-6 h-6 text-gray-500" />
          </button>
          <Avatar>
            <AvatarImage
              src="https://ui-avatars.com/api/?name=User"
              alt="@user"
            />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>
      </div>
      <ul className="divide-y divide-gray-200">
        <NavItem icon={<Calendar className="text-pink-500" />} label="Recently Added" />
        <NavItem icon={<Mic className="text-pink-500" />} label="Artists" />
        <NavItem icon={<Folder className="text-pink-500" />} label="Albums" />
        <NavItem icon={<Music className="text-pink-500" />} label="Songs" />
        <NavItem icon={<Guitar className="text-pink-500" />} label="Genre" />
      </ul>
    </nav>
  );
}

type NavItemProps = {
  icon: React.ReactNode;
  label: string;
};

function NavItem({ icon, label }: NavItemProps) {
  return (
    <li>
      <button
        className="flex items-center w-full py-4 px-2 text-left hover:bg-gray-50 focus:outline-none transition"
      >
        <span className="mr-4">{icon}</span>
        <span className="flex-1 font-medium text-gray-900">{label}</span>
        <span className="ml-auto text-gray-400">&gt;</span>
      </button>
    </li>
  );
}
