import Link from "next/link";
import { Button } from "@repo/ui/core/button";

const NotFound = () => {
  return (
    <div className="container flex flex-col items-center justify-center gap-4 py-24 text-center">
      <h1 className="font-display text-4xl text-foreground">404</h1>
      <p className="text-muted-foreground">Nie znaleziono strony, której szukasz.</p>
      <Button asChild>
        <Link href="/dashboard">Wróć do pulpitu</Link>
      </Button>
    </div>
  );
};

export default NotFound;
