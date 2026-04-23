export function HeroBlock({ data }: { data: any }) {
    return (
      <section className="relative py-20 bg-slate-900 text-white overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <h1 className="text-5xl font-black uppercase mb-4">{data.title || "Titel fehlt"}</h1>
          <p className="text-xl text-slate-300 max-w-2xl">{data.subtitle}</p>
          {data.ctaText && (
            <button className="mt-8 bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-md font-bold transition">
              {data.ctaText}
            </button>
          )}
        </div>
        {/* Optionales Hintergrundbild-Overlay */}
        <div className="absolute inset-0 opacity-20 bg-gradient-to-r from-blue-900 to-black" />
      </section>
    );
  }