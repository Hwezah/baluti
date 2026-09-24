import { currentUser } from "@clerk/nextjs/server";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function DashboardPage() {
  const user = await currentUser();

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-16">
      <Card>
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
          <CardDescription>This route is protected by Clerk.</CardDescription>
        </CardHeader>
        <CardContent>
          Welcome, {user?.firstName ?? user?.emailAddresses[0]?.emailAddress}.
        </CardContent>
      </Card>
    </div>
  );
}
