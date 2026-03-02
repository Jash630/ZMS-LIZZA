export default function BlogPage() {
    return (
        <div className="w-full">

            {/* HEADER */}
            <section className="py-20 bg-slate-50">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        Blog & Insights
                    </h1>
                    <p className="max-w-2xl mx-auto text-slate-600">
                        Industry trends, machine insights, and embroidery innovations.
                    </p>
                </div>
            </section>

            {/* BLOG GRID */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6 grid gap-8 md:grid-cols-3">

                    {Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={i}
                            className="bg-slate-50 rounded-xl overflow-hidden hover:shadow-lg transition"
                        >
                            <div className="h-40 bg-slate-200 flex items-center justify-center text-slate-400">
                                Blog Image
                            </div>
                            <div className="p-6">
                                <h3 className="font-semibold mb-2">
                                    How Modern Embroidery Machines Improve Factory Productivity
                                </h3>
                                <p className="text-sm text-slate-600">
                                    Learn how automation, speed, and precision embroidery systems help textile
                                    manufacturers increase output while maintaining quality.
                                </p>
                            </div>
                        </div>
                    ))}

                </div>
            </section>

        </div>
    );
}
