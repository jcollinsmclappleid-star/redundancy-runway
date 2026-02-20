import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-4 px-4 py-3">
        <Logo showTagline />
        <ThemeToggle />
      </div>
    </header>
  );
}
