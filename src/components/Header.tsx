import { Car } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full bg-background/95">
      <div className="container flex flex-col h-24 justify-center">
        <h1 className="text-4xl font-bold text-primary">Curbie</h1>
        <p className="text-muted-foreground mt-1">Find & share parking spots</p>
      </div>
    </header>
  );
}
