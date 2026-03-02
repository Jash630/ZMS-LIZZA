export default function AboutPage() {
  return (
    <div className="w-full">

      {/* HEADER */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            About ZMS LIZZA
          </h1>
          <p className="max-w-2xl mx-auto text-slate-600">
            European technology. Indian manufacturing excellence.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12">

          <div>
            <p className="text-slate-600 mb-6">
              ZMS LIZZA European Technology is focused on delivering advanced embroidery
              solutions that combine European engineering standards with the practical
              requirements of Indian textile manufacturing.
            </p>

            <p className="text-slate-600 mb-6">
              Our machines are designed for high-speed production, long operational life,
              and consistent embroidery quality — helping factories scale efficiently
              without compromising precision.
            </p>

            <p className="text-slate-600">
              From multi-function embroidery systems to specialized sequin and coding
              machines, ZMS LIZZA supports manufacturers at every stage of their growth
              journey.
            </p>
          </div>

          <div className="bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
            Company Image
          </div>

        </div>
      </section>

      {/* VALUES */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8 text-center">

          {[
            "European Engineering",
            "Customer-Centric Support",
            "Long-Term Reliability",
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-6 shadow-sm"
            >
              <h3 className="font-semibold text-lg mb-2">
                {item}
              </h3>
              <p className="text-slate-600 text-sm">
                Built to deliver consistent performance and dependable results.
              </p>
            </div>
          ))}

        </div>
      </section>

    </div>
  );
}
