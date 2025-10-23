import React, { useState, useRef, useEffect } from "react";
import Logo from "@assets/logoooooooo.png";
import { escapeHTML } from "astro/runtime/server/escape.js";
const menuItems = [
  { label: "Jobs", href: "/" },
  { label: "About", href: "/about-us" },
  // { label: "Our Services", href: "/our-services" },
  { label: "How It Works", href: "/how-it-works" },
  // { label: "Tax Optimized Income", href: "/tax-optimized-income" },
  { label: "FAQ's", href: "/faqs" },
];

const MenuIcon: React.FC<{ className?: string }> = ({ className }) => (
<svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
<path fillRule="evenodd" clipRule="evenodd" d="M4 5C3.44772 5 3 5.44772 3 6C3 6.55228 3.44772 7 4 7H20C20.5523 7 21 6.55228 21 6C21 5.44772 20.5523 5 20 5H4ZM7 12C7 11.4477 7.44772 11 8 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H8C7.44772 13 7 12.5523 7 12ZM13 18C13 17.4477 13.4477 17 14 17H20C20.5523 17 21 17.4477 21 18C21 18.5523 20.5523 19 20 19H14C13.4477 19 13 18.5523 13 18Z" fill="#000000"/>
</svg>
);

const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    width="24"
    height="24"
    aria-hidden="true"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <path d="M6 6l12 12M6 18L18 6" />
  </svg>
);

const Header: React.FC = () => {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [authentication, setAuthentication] = useState<string | null>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (open && panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  // lock scroll when menu open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [open]);
  useEffect(() => {
    const authenticated = sessionStorage.getItem("userToken");
    if (authenticated) {
      setAuthentication(authenticated);
    }
  }, []);

  return (
    <header className="web-header fixed inset-x-0 top-0 z-50 bg-white shadow-sm py-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center gap-2">
              <img src={Logo.src} alt="Uni Jobs in Sri Lanka" className="h-16 w-auto" />
            </a>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8 text-md font-medium desktop-nav">
            {menuItems.map((m) => (
              <a
                key={m.href}
                href={m.href}
                className="relative hover:text-gray-800 transition"
              >
                {m.label}
              </a>
            ))}

          </nav>
          <div className="post-a-job hidden md:block">
            <a
              href={authentication ? `/post-a-job` : `/login`}
              className="ml-2 inline-block px-4 py-2 font-semibold text-white transition post-job-button"
            >
                
              + Post A Job
            </a>
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden">
            <button
              aria-label="Toggle menu"
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
              className="p-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500"
            >
              {open ? <CloseIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile off-canvas menu */}
      <div
        aria-hidden={!open}
        className={`fixed inset-0 z-40 transition-opacity duration-200 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* backdrop */}
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

        {/* panel */}
        <div
          ref={(el) => (panelRef.current = el)}
          className={`absolute top-0 right-0 h-full w-72 bg-white shadow-xl flex flex-col p-6 space-y-6 transform transition-transform duration-200 ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center">
            <div className="font-semibold text-lg">Menu</div>
            <button
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="p-1 rounded-md hover:bg-gray-100"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>
          <div className="flex flex-col gap-3 flex-1 overflow-auto">
            {menuItems.map((m) => (
              <a
                key={m.href}
                href={m.href}
                onClick={() => setOpen(false)}
                className="block text-base font-medium px-2 py-2 rounded hover:bg-gray-100 transition"
              >
                {m.label}
              </a>
            ))}
          </div>
          <div>
            <a
              href={authentication ? `/post-a-job` : `/login`}
              onClick={() => setOpen(false)}
              className="block w-full text-center px-4 py-2 rounded-md bg-red-500 text-white font-semibold hover:bg-red-600 transition"
            >
              Post A Job
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
