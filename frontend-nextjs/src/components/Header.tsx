"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Início" },
    { href: "/institucional", label: "Institucional" },
    { href: "/comunicados", label: "Comunicados" },
  ];

  return (
    <header className="border-b-2 border-[#0f1115] p-6 flex justify-between items-center sticky top-0 bg-white z-50">
      <Link href="/" className="font-bold text-2xl uppercase tracking-tighter hover:opacity-80 transition-opacity">
        SEDEC<span className="text-[rgb(25,50,130)]">.NEWS</span>
      </Link>
      <nav className="hidden md:flex gap-8 font-medium text-sm tracking-wide uppercase">
        {links.map((link) => {
          const isActive = pathname === link.href;
          
          return (
            <Link 
              key={link.href} 
              href={link.href} 
              className={`transition-colors relative pb-1 ${
                isActive 
                  ? "text-[rgb(25,50,130)] before:content-[''] before:absolute before:-bottom-1 before:left-0 before:w-full before:h-0.5 before:bg-[rgb(25,50,130)]" 
                  : "text-[#0f1115] hover:text-[rgb(25,50,130)]"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
