import Link from 'next/link';

export default function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700">
          TinyLink
        </Link>
      </div>
    </header>
  );
}
