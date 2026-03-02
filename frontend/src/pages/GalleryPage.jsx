export default function GalleryPage() {
  return (
    <div className="w-full">

      {/* PAGE HEADER */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Embroidery Gallery
          </h1>
          <p className="max-w-2xl mx-auto text-slate-600">
            Explore real embroidery work produced using ZMS LIZZA machines
            across different factories and applications.
          </p>
        </div>
      </section>

      {/* GALLERY GRID */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="bg-slate-100 rounded-xl aspect-square flex items-center justify-center text-slate-400 font-medium hover:shadow-lg transition"
            >
              Gallery Image
            </div>
          ))}

        </div>
      </section>

    </div>
  );
}
