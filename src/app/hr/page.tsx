import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function HRPage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold tracking-tight">Human Resources</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>HR Module</CardTitle>
          <CardDescription>This section is under development. Future features for managing HR tasks will be available here.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">Coming Soon</p>
            <p className="text-sm text-muted-foreground mt-2">Features like payroll, benefits administration, and compliance management will be integrated here.</p>
            <Button variant="outline" className="mt-4">Request a Feature</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
