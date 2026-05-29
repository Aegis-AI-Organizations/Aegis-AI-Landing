import Image from "next/image";

export default function Home() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050810] px-6 py-16 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#1047ff33,transparent_34%),radial-gradient(circle_at_bottom_right,#00d4ff1f,transparent_30%)]" />
      <div className="absolute inset-x-8 top-8 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <section className="relative z-10 flex w-full max-w-3xl flex-col items-center gap-10 rounded-[2rem] border border-white/10 bg-white/[0.04] px-8 py-14 text-center shadow-2xl shadow-blue-950/30 backdrop-blur md:px-16">
        <Image
          src="/logo.svg"
          alt="Aegis AI"
          width={420}
          height={210}
          priority
          className="h-auto w-full max-w-sm"
        />

        <div className="flex flex-col items-center gap-5">
          <p className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-cyan-100">
            Lancement en cours
          </p>
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-white md:text-6xl">
            Le site Aegis AI est en construction.
          </h1>
          <p className="max-w-xl text-base leading-8 text-slate-300 md:text-lg">
            Nous préparons une nouvelle expérience pour présenter notre
            plateforme de cybersécurité et d&apos;observabilité
            d&apos;infrastructure.
          </p>
        </div>

        <p className="text-sm text-slate-400">
          Revenez bientôt. La landing page publique arrive prochainement.
        </p>
      </section>
    </main>
  );
}
