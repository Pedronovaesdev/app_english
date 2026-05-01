import { NavLink, Outlet } from "react-router-dom";

const link =
  "rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition hover:bg-slate-800 hover:text-white";
const activeLink = "bg-slate-800 text-ember-400";

export function AppShell() {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="border-b border-slate-800 bg-ink-900/80 px-4 py-4 md:w-52 md:border-b-0 md:border-r">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">English</p>
          <h1 className="text-lg font-bold text-white">Mastery OS</h1>
        </div>
        <nav className="flex flex-wrap gap-1 md:flex-col">
          <NavLink end className={({ isActive }) => `${link} ${isActive ? activeLink : ""}`} to="/">
            Foco 15 min
          </NavLink>
          <NavLink className={({ isActive }) => `${link} ${isActive ? activeLink : ""}`} to="/cards">
            Flashcards
          </NavLink>
          <NavLink className={({ isActive }) => `${link} ${isActive ? activeLink : ""}`} to="/saturday">
            Missões Sábado
          </NavLink>
          <NavLink className={({ isActive }) => `${link} ${isActive ? activeLink : ""}`} to="/shadowing">
            Shadowing YT
          </NavLink>
          <NavLink className={({ isActive }) => `${link} ${isActive ? activeLink : ""}`} to="/practice">
            Active Practice
          </NavLink>
          <NavLink className={({ isActive }) => `${link} ${isActive ? activeLink : ""}`} to="/articles">
            Artigos → Anki
          </NavLink>
        </nav>
      </aside>
      <main className="flex-1 overflow-auto p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}
