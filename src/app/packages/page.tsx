
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ShieldAlert, Users } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const PRICE_PER_USER = 25; // Example price per user

export default function PackagesPage() {
  const { user, company, updateCompany } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [userCount, setUserCount] = useState(company?.userCount || 1);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);
  
  useEffect(() => {
    if (company) {
      setUserCount(company.userCount);
    }
  }, [company]);


  if (!user || user.role !== 'admin') {
    return (
        <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
            <ShieldAlert className="w-16 h-16 text-destructive" />
            <h1 className="text-2xl font-bold">Access Denied</h1>
            <p className="text-muted-foreground">You do not have permission to view this page.</p>
        </div>
    );
  }

  if (!company) {
    return (
       <div className="flex items-center justify-center h-full">
         <Loader2 className="w-8 h-8 animate-spin" />
       </div>
    );
  }

  const handleSaveChanges = () => {
    setIsSaving(true);
    setTimeout(() => {
        updateCompany({ userCount });
        setIsSaving(false);
        toast({
            title: "Package Updated",
            description: `Your plan has been updated to ${userCount} users.`,
        });
    }, 1000);
  };

  const monthlyCost = userCount * PRICE_PER_USER;

  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Manage Your Subscription</h1>
        <p className="text-muted-foreground mt-2">Adjust your plan to fit your team's needs.</p>
      </div>
      
      <div className="max-w-2xl mx-auto w-full">
        <Card>
            <CardHeader>
                <CardTitle>Current Plan</CardTitle>
                <CardDescription>
                    Your subscription is based on the number of users in your organization.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-6 border rounded-lg bg-accent/20">
                    <div className="flex items-center gap-4">
                        <Users className="h-8 w-8 text-primary"/>
                        <div>
                            <p className="font-semibold text-lg">{company.userCount} Users</p>
                            <p className="text-muted-foreground">Current plan size</p>
                        </div>
                    </div>
                     <div className="text-right">
                        <p className="text-2xl font-bold">${company.userCount * PRICE_PER_USER}/mo</p>
                        <p className="text-muted-foreground">Next bill</p>
                    </div>
                </div>

                <div className="space-y-4 pt-4">
                    <Label htmlFor="user-count-slider" className="text-base font-medium">
                        Adjust Number of Users ({userCount})
                    </Label>
                    <Slider
                        id="user-count-slider"
                        min={1}
                        max={100}
                        step={1}
                        value={[userCount]}
                        onValueChange={(value) => setUserCount(value[0])}
                    />
                    <div className="text-center bg-background rounded-lg p-4">
                        <p className="text-muted-foreground">New Monthly Cost</p>
                        <p className="text-3xl font-bold text-primary">${monthlyCost.toFixed(2)}</p>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button 
                    className="w-full" 
                    onClick={handleSaveChanges} 
                    disabled={userCount === company.userCount || isSaving}
                >
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                </Button>
            </CardFooter>
        </Card>
      </div>
    </div>
  );
}
