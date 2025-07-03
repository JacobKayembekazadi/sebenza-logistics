
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, CreditCard, Download } from "lucide-react";
import Link from "next/link";

const currentPlan = {
    name: "Professional",
    price: "$99",
    features: ["5 Warehouses", "50 Employees", "Advanced Reporting", "Priority Email Support", "API Access"],
    renewalDate: "December 5, 2024",
};

const paymentMethods = [
    { type: "Visa", last4: "4242", expires: "12/25" },
    { type: "Mastercard", last4: "5555", expires: "08/26" },
];

const billingHistory = [
    { date: "November 5, 2024", amount: "$99.00", status: "Paid", invoiceId: "INV-B123" },
    { date: "October 5, 2024", amount: "$99.00", status: "Paid", invoiceId: "INV-B122" },
    { date: "September 5, 2024", amount: "$99.00", status: "Paid", invoiceId: "INV-B121" },
];

export default function BillingPage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold tracking-tight">Billing & Subscriptions</h1>
      
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Manage your saved payment methods.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {paymentMethods.map((method, i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <CreditCard className="h-8 w-8 text-muted-foreground"/>
                    <div>
                      <p className="font-medium">{method.type} ending in {method.last4}</p>
                      <p className="text-sm text-muted-foreground">Expires {method.expires}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Edit</Button>
                </div>
              ))}
            </CardContent>
            <CardFooter>
                <Button>Add New Payment Method</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>Review your past payments.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Invoice</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {billingHistory.map((item) => (
                    <TableRow key={item.invoiceId}>
                      <TableCell>{item.date}</TableCell>
                      <TableCell className="font-medium">{item.amount}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-accent text-accent-foreground">{item.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                            <Download className="h-4 w-4"/>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">{currentPlan.price}</span>
                <span className="text-muted-foreground">/ month</span>
              </div>
              <p className="text-sm text-muted-foreground">Renews on {currentPlan.renewalDate}</p>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-3">
                {currentPlan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="flex-col gap-2 items-stretch">
                <Button asChild>
                    <Link href="/packages">Change Plan</Link>
                </Button>
                <Button variant="outline">Cancel Subscription</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
