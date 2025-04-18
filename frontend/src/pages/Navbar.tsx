import React from "react";
import { Button } from "@/components/ui/button";
import { Bell, CalendarDays, MessageCircle, User } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="w-full flex items-center justify-between p-4 shadow-md bg-white">
      <div className="text-2xl font-bold text-blue-600">NoTiCall</div>
      <div className="flex items-center gap-4">
        <Button variant="outline">Create Meeting</Button>
        <Button variant="outline">Join Meeting</Button>
        <CalendarDays className="w-6 h-6 text-gray-600 hover:text-blue-600 cursor-pointer" />
        <Bell className="w-6 h-6 text-gray-600 hover:text-blue-600 cursor-pointer" />
        <MessageCircle className="w-6 h-6 text-gray-600 hover:text-blue-600 cursor-pointer" />
        <User className="w-6 h-6 text-gray-600 hover:text-blue-600 cursor-pointer" />
      </div>
    </nav>
  );
};

export default Navbar;