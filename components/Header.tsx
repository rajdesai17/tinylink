import Link from "next/link";
import { Link as LinkIcon } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary hover:opacity-90 transition-opacity">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
            <LinkIcon className="h-5 w-5" />
          </div>
          <span>TinyLink</span>
        </Link>
        
        <nav className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            Dashboard
          </Link>
          <a 
            href="https://github.com/rajdesai17/tinylink" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}
