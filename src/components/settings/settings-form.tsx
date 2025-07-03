
'use client';

import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "../ui/separator";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Textarea } from "../ui/textarea";

export function SettingsForm() {
  const { toast } = useToast();
  const { company, updateCompany } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [logo, setLogo] = useState('');
  
  useEffect(() => {
    if (company) {
      setName(company.name || '');
      setEmail(company.email || '');
      setPhone(company.phone || '');
      setAddress(company.address || '');
      setLogo(company.logo || '');
    }
  }, [company]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(company) {
        updateCompany({ ...company, name, email, phone, address, logo });
    }
    toast({
      title: "Settings Saved",
      description: "Your new settings have been applied.",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Company Profile</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20 rounded-md">
              <AvatarImage src={logo} data-ai-hint="logo company" />
              <AvatarFallback>
                {name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-grow space-y-2">
                <Label htmlFor="logo">Logo URL</Label>
                <Input id="logo" value={logo} onChange={(e) => setLogo(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input id="companyName" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
              <Label htmlFor="companyEmail">Contact Email</Label>
              <Input id="companyEmail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
              <Label htmlFor="companyPhone">Phone Number</Label>
              <Input id="companyPhone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="space-y-2">
              <Label htmlFor="companyAddress">Address</Label>
              <Textarea id="companyAddress" value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>
        </div>
      </div>
      
      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-medium">General</h3>
        <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select defaultValue="en">
                <SelectTrigger id="language" className="w-[280px]">
                    <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
                Choose your preferred language for the interface.
            </p>
        </div>
      </div>
      
      <Separator />

       <div className="space-y-4">
        <h3 className="text-lg font-medium">Appearance</h3>
        <div className="space-y-2">
            <Label htmlFor="theme">Theme</Label>
            <Select defaultValue="system">
                <SelectTrigger id="theme" className="w-[280px]">
                    <SelectValue placeholder="Select a theme" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
                Select the color scheme for the application.
            </p>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Notifications</h3>
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive updates about your account and projects.</p>
                </div>
                <Switch id="email-notifications" defaultChecked />
            </div>
             <div className="flex items-center justify-between">
                <div>
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Get real-time alerts on your devices.</p>
                </div>
                <Switch id="push-notifications" />
            </div>
             <div className="flex items-center justify-between">
                <div>
                    <Label htmlFor="marketing-emails">Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">Receive news, offers, and updates from Sebenza.</p>
                </div>
                <Switch id="marketing-emails" defaultChecked />
            </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button type="submit">Save Changes</Button>
      </div>
    </form>
  );
}
