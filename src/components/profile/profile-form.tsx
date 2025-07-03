
'use client';

import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useRouter } from "next/navigation";

export function ProfileForm() {
  const { user, updateUser, logout } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setAvatar(user.avatar);
    }
  }, [user]);

  if (!user) {
    // This case should ideally be handled by the page component redirecting.
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ name, email, avatar });
    toast({
      title: "Profile Updated",
      description: "Your changes have been saved successfully.",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-6">
        <Avatar className="h-20 w-20">
          <AvatarImage src={avatar} data-ai-hint="person portrait" />
          <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-grow space-y-2">
            <Label htmlFor="avatar">Avatar URL</Label>
            <Input id="avatar" value={avatar} onChange={(e) => setAvatar(e.target.value)} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="flex justify-end gap-2">
         <Button type="button" variant="outline" onClick={handleLogout}>Log Out</Button>
         <Button type="submit">Save Changes</Button>
      </div>
    </form>
  );
}
