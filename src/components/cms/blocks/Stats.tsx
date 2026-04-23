export function StatsBlock({ data }: { data: any }) {
    return (
      <section className="py-12 bg-white border-y">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {data.items?.map((item: any, i: number) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-bold text-blue-600">{item.value}</div>
                <div className="text-sm text-muted-foreground uppercase tracking-wider">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }