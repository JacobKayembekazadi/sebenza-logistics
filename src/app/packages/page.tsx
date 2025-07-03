
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ShieldAlert } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

const plans = [
  {
    name: "Starter",
    price: "$49",
    features: ["1 Warehouse", "10 Employees", "Basic Reporting", "Email Support"],
    current: false,
  },
  {
    name: "Professional",
    price: "$99",
    features: ["5 Warehouses", "50 Employees", "Advanced Reporting", "Priority Email Support", "API Access"],
    current: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    features: ["Unlimited Warehouses", "Unlimited Employees", "Custom Reporting", "24/7 Phone Support", "Dedicated Account Manager"],
    current: false,
  },
];

export default function PackagesPage() {
  const { userRole } = useAuth();

  if (userRole !== 'admin') {
    return (
        <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
            <ShieldAlert className="w-16 h-16 text-destructive" />
            <h1 className="text-2xl font-bold">Access Denied</h1>
            <p className="text-muted-foreground">You do not have permission to view this page.</p>
        </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Subscription Plans</h1>
        <p className="text-muted-foreground mt-2">Choose the plan that's right for your business.</p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {plans.map((plan) => (
          <Card key={plan.name} className={`flex flex-col ${plan.current ? 'border-primary ring-2 ring-primary' : ''}`}>
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.price !== "Custom" && <span className="text-muted-foreground">/ month</span>}
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" disabled={plan.current}>
                {plan.current ? "Current Plan" : "Choose Plan"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
