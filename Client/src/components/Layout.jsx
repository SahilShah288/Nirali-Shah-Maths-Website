import { Link, NavLink } from "react-router-dom";

const navClass = ({ isActive }) =>
  `rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
    isActive ? "nav-pill-active" : "nav-pill-inactive"
  }`;

export default function Layout({ children }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-slate-100/80 bg-white/75 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Nirali Shah Maths Tuitions"
              className="h-10 w-10 shrink-0 rounded-lg object-contain sm:h-11 sm:w-11"
              width={44}
              height={44}
            />
            <span className="hidden font-display text-lg font-semibold text-midnight sm:block">
              Nirali Shah
            </span>
          </Link>
          <nav className="flex gap-1 sm:gap-2">
            <NavLink to="/" end className={navClass}>
              Enquiry
            </NavLink>
            <NavLink to="/booking" className={navClass}>
              Book a Slot
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        {children}
      </main>

      <footer className="mt-auto border-t border-slate-100 bg-white py-10 text-center">
        <p className="font-display text-lg font-semibold text-midnight">
          Nirali Shah Maths Tuitions
        </p>
        <p className="mt-2 text-sm text-slate-600">
          © {new Date().getFullYear()} All rights reserved.
        </p>
      </footer>
    </div>
  );
}
