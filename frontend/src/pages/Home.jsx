import Navbar from "../components/Navbar";
import UploadBox from "../components/UploadBox";

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main className="relative overflow-hidden px-5 pb-16 pt-8 md:px-8 lg:px-12">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[520px] bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.16),transparent_45%),radial-gradient(circle_at_80%_20%,rgba(37,99,235,0.18),transparent_30%)]" />
        <section className="relative z-10 mx-auto max-w-7xl">
          <div className="mb-12 max-w-4xl">
            <div className="mb-4 inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
              AI Resume Analyzer SaaS
            </div>
            <h1 className="max-w-4xl text-5xl font-black leading-tight text-white md:text-6xl xl:text-7xl">
              Elevate resume screening with a premium ATS scoring experience
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300 md:text-lg">
              Upload a resume, paste the target job description, and get an
              instant match score powered by your FastAPI NLP pipeline. Built
              for modern recruiting workflows, candidate optimization, and SaaS-ready UX.
            </p>
          </div>

          <UploadBox />
        </section>
      </main>
    </div>
  );
};

export default Home;
