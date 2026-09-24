import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const stack = [
  { name: "Next.js", detail: "App Router" },
  { name: "Tailwind CSS", detail: "v4, CSS-first config" },
  { name: "shadcn/ui", detail: "Components in src/components/ui" },
  { name: "Context API", detail: "Global state in src/context" },
  { name: "Clerk", detail: "Auth, protected /dashboard" },
];

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Baluti</h1>
      <p className="mt-2 text-muted-foreground">
        Edit <code className="font-mono">src/app/page.tsx</code> to get started.
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stack.map((item) => (
          <Card key={item.name}>
            <CardHeader>
              <CardTitle>{item.name}</CardTitle>
              <CardDescription>{item.detail}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
