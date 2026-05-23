const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8 lg:px-12">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300">
            ResumeIQ
          </p>
          <h1 className="mt-1 text-xl font-bold text-white md:text-2xl">
            AI Resume Analyzer
          </h1>
        </div>

        <a
          href="#"
          className="rounded-2xl border border-cyan-400/20 bg-gradient-to-r from-cyan-500/15 to-blue-600/15 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:border-cyan-300/40 hover:shadow-[0_0_30px_rgba(34,211,238,0.12)]"
        >
          Premium Screening Flow
        </a>
      </div>
    </header>
  );
};

export default Navbar;
