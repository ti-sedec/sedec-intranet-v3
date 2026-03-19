"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  type LinkItem = {
    href: string;
    label: string;
    subLinks?: { href: string; label: string }[];
  };

  const links: LinkItem[] = [
    { href: "/", label: "Início" },
    {
      href: "/institucional",
      label: "Institucional",
      subLinks: [
        { href: "/eventos", label: "Eventos" }
      ]
    },
  ];

  return (
    <header className="border-b-2 border-[#0f1115] p-6 flex justify-between items-center sticky top-0 bg-white z-50">
      <Link href="/" className="font-bold text-2xl uppercase tracking-tighter hover:opacity-80 transition-opacity">
        SEDEC<span className="text-[rgb(25,50,130)]">.NEWS</span>
      </Link>
      <nav className="hidden md:flex gap-8 font-medium text-sm tracking-wide uppercase">
        {links.map((link, index) => {
          const isActive = pathname === link.href || (link.subLinks && link.subLinks.some(sub => pathname === sub.href));
          const isLastItem = index === links.length - 1;

          return (
            <div key={link.href} className="relative group">
              {link.subLinks ? (
                <button
                  type="button"
                  className={`transition-colors relative pb-1 block uppercase cursor-default ${isActive
                      ? "text-[rgb(25,50,130)] before:content-[''] before:absolute before:-bottom-1 before:left-0 before:w-full before:h-0.5 before:bg-[rgb(25,50,130)]"
                      : "text-[#0f1115] group-hover:text-[rgb(25,50,130)]"
                    }`}
                >
                  {link.label}
                </button>
              ) : (
                <Link
                  href={link.href}
                  className={`transition-colors relative pb-1 block ${isActive
                      ? "text-[rgb(25,50,130)] before:content-[''] before:absolute before:-bottom-1 before:left-0 before:w-full before:h-0.5 before:bg-[rgb(25,50,130)]"
                      : "text-[#0f1115] hover:text-[rgb(25,50,130)]"
                    }`}
                >
                  {link.label}
                </Link>
              )}

              {link.subLinks && (
                <div className={`absolute top-full ${isLastItem ? 'right-0' : 'left-0'} pt-6 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto z-50`}>
                  <div className={`bg-[#0f1115] text-white min-w-[200px] ${isLastItem ? 'border-r-4' : 'border-l-4'} border-[rgb(25,50,130)] shadow-xl flex flex-col ${isLastItem ? 'text-right' : 'text-left'}`}>
                    {link.subLinks.map((subLink) => (
                      <Link
                        key={subLink.href}
                        href={subLink.href}
                        className="px-5 py-4 hover:bg-white/10 transition-colors block first:pt-4 last:pb-4"
                      >
                        {subLink.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </header>
  );
}
