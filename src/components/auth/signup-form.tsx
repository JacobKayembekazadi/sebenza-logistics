
'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export function SignUpForm() {
  const [companyName, setCompanyName] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userCount, setUserCount] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  
  const { signup } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      signup(
        { name: companyName, userCount },
        { name, email }
      );
      toast({
        title: 'Account Created!',
        description: 'Welcome to Sebenza. Redirecting you to the dashboard.',
      });
      router.push('/dashboard');
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="company-name">Company Name</Label>
        <Input id="company-name" required value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="name">Your Name</Label>
        <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div className="space-y-4">
        <Label htmlFor="users">Number of Users ({userCount})</Label>
        <p className="text-sm text-muted-foreground">Select how many employees will need access.</p>
        <Slider
          id="users"
          min={1}
          max={100}
          step={1}
          value={[userCount]}
          onValueChange={(value) => setUserCount(value[0])}
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Create Account
      </Button>
    </form>
  );
}
