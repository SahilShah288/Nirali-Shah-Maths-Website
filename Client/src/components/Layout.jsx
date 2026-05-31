import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

const navClass = ({ isActive }) =>
  `nav-mobile-link ${isActive ? "nav-pill-active" : "nav-pill-inactive"}`;

const desktopNavClass = ({ isActive }) =>
  `rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 min-h-[2.75rem] inline-flex items-center ${
    isActive ? "nav-pill-active" : "nav-pill-inactive"
  }`;

export default function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="app-shell">
      <header className="sticky top-0 z-40 border-b border-slate-100/80 bg-white/90 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
          <Link
            to="/"
            className="flex min-h-[2.75rem] items-center gap-3"
            onClick={closeMenu}
          >
            <img
              src="/logo.png"
              alt="Nirali Shah Maths Tuitions"
              className="h-10 w-10 shrink-0 rounded-lg object-contain sm:h-11 sm:w-11"
              width={44}
              height={44}
            />
            <span className="font-display text-base font-semibold text-midnight sm:text-lg">
              Nirali Shah
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex md:gap-2" aria-label="Main">
            <NavLink to="/" end className={desktopNavClass}>
              Enquiry
            </NavLink>
            <NavLink to="/booking" className={desktopNavClass}>
              Book a Slot
            </NavLink>
          </nav>

          <button
            type="button"
            className="inline-flex min-h-[2.75rem] min-w-[2.75rem] items-center justify-center rounded-xl border border-slate-200 bg-white text-midnight shadow-sm transition-colors hover:bg-slate-50 md:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? (
              <X className="h-6 w-6" aria-hidden />
            ) : (
              <Menu className="h-6 w-6" aria-hidden />
            )}
          </button>
        </div>

        {menuOpen && (
          <>
            <button
              type="button"
              className="fixed inset-0 z-40 bg-midnight/30 md:hidden"
              aria-label="Close menu overlay"
              onClick={closeMenu}
            />
            <nav
              id="mobile-nav"
              className="fixed left-0 right-0 top-[4.25rem] z-50 border-b border-slate-100 bg-white px-4 py-4 shadow-lg md:hidden"
              aria-label="Mobile"
            >
              <div className="flex flex-col gap-2">
                <NavLink to="/" end className={navClass} onClick={closeMenu}>
                  Enquiry
                </NavLink>
                <NavLink to="/booking" className={navClass} onClick={closeMenu}>
                  Book a Slot
                </NavLink>
              </div>
            </nav>
          </>
        )}
      </header>

      <main className="app-main">{children}</main>

      <footer className="mt-auto border-t border-slate-100 bg-white px-4 py-8 text-center sm:py-10">
        <p className="font-display text-base font-semibold text-midnight sm:text-lg">
          Nirali Shah Maths Tuitions
        </p>
        <p className="mt-2 text-sm text-slate-600">
          © {new Date().getFullYear()} All rights reserved.
        </p>
      </footer>
    </div>
  );
}
