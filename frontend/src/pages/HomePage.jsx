export default function HomePage() {
  return (
    <div className="w-full">

      {/* HERO */}
      <section className="min-h-[80vh] flex items-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10">
          <div>
            <p className="text-sm tracking-wide text-orange-600 font-semibold mb-3">
              EUROPEAN TECHNOLOGY | MADE FOR INDIA
            </p>

            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Precision. <span className="text-orange-500">Power.</span> Performance.
            </h1>

            <p className="text-slate-600 mb-8">
              High-performance embroidery machines built with European precision
              for India’s leading textile manufacturers.
            </p>

            <div className="flex gap-4">
              <button className="px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition">
                Request Demo
              </button>
              <button className="px-6 py-3 border border-slate-300 rounded-lg hover:bg-slate-100 transition">
                Call Us Now
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg h-[350px] flex items-center justify-center">
            <span className="text-slate-400">Hero Machine Image</span>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Leading Factories Choose ZMS LIZZA
          </h2>

          <p className="text-slate-600 max-w-2xl mx-auto mb-12">
            Built with European engineering and tailored for Indian production demands.
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

            {[
              {
                title: "High-Speed Performance",
                desc: "Optimized for maximum output without compromising stitch quality."
              },
              {
                title: "European Technology",
                desc: "Precision-engineered systems inspired by German manufacturing."
              },
              {
                title: "Multi-Function Capability",
                desc: "Sequin, bead, coding, and mixed embroidery in one platform."
              },
              {
                title: "Complete Support",
                desc: "Installation, training, service, and long-term maintenance."
              }
            ].map((item, i) => (
              <div
                key={i}
                className="bg-slate-50 rounded-xl p-6 hover:shadow-lg transition"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                  {i + 1}
                </div>

                <h3 className="font-semibold text-lg mb-2">
                  {item.title}
                </h3>

                <p className="text-slate-600 text-sm">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* PREMIUM MACHINE RANGE */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Premium Machine Range
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Precision-built embroidery solutions for every production requirement.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

            {/* CARD 1 */}
            <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden">
              <div className="h-48 bg-slate-200 flex items-center justify-center text-slate-500">
                Machine Image
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">
                  Multi-Function Pro Series
                </h3>

                <p className="text-slate-600 text-sm mb-4">
                  Sequin, bead, and coding in one powerful embroidery system.
                </p>

                <div className="flex gap-3">
                  <button className="border border-slate-300 px-4 py-2 rounded-md text-sm hover:bg-slate-100">
                    View Details
                  </button>

                  <button className="bg-orange-500 text-white px-4 py-2 rounded-md text-sm hover:bg-orange-600">
                    Request Quote
                  </button>
                </div>
              </div>
            </div>

            {/* CARD 2 */}
            <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden">
              <div className="h-48 bg-slate-200 flex items-center justify-center text-slate-500">
                Machine Image
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">
                  High-Speed Embroidery Machine
                </h3>

                <p className="text-slate-600 text-sm mb-4">
                  Built for factories demanding speed, consistency, and durability.
                </p>

                <div className="flex gap-3">
                  <button className="border border-slate-300 px-4 py-2 rounded-md text-sm hover:bg-slate-100">
                    View Details
                  </button>

                  <button className="bg-orange-500 text-white px-4 py-2 rounded-md text-sm hover:bg-orange-600">
                    Get Quote
                  </button>
                </div>
              </div>
            </div>

            {/* CARD 3 */}
            <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden">
              <div className="h-48 bg-slate-200 flex items-center justify-center text-slate-500">
                Machine Image
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">
                  Sequin Embroidery Machine
                </h3>

                <p className="text-slate-600 text-sm mb-4">
                  Dedicated solution for high-precision sequin embroidery work.
                </p>

                <div className="flex gap-3">
                  <button className="border border-slate-300 px-4 py-2 rounded-md text-sm hover:bg-slate-100">
                    View Details
                  </button>

                  <button className="bg-orange-500 text-white px-4 py-2 rounded-md text-sm hover:bg-orange-600">
                    Get Quote
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* TRUST METRICS */}
      <section className="py-16 bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-6">

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">

            <div>
              <h3 className="text-4xl font-bold mb-2">500+</h3>
              <p className="text-sm text-blue-200">
                Projects Completed
              </p>
            </div>

            <div>
              <h3 className="text-4xl font-bold mb-2">15+</h3>
              <p className="text-sm text-blue-200">
                Factory Installations
              </p>
            </div>

            <div>
              <h3 className="text-4xl font-bold mb-2">10,000+</h3>
              <p className="text-sm text-blue-200">
                Designs Produced
              </p>
            </div>

            <div>
              <h3 className="text-4xl font-bold mb-2">100%</h3>
              <p className="text-sm text-blue-200">
                Quality Satisfaction
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              What Our Customers Say
            </h2>
            <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
              Trusted by textile manufacturers across India for performance, reliability, and support.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">

            {/* Card 1 */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
              <div className="flex items-center mb-4 text-orange-500">
                ★★★★★
              </div>
              <p className="text-slate-600 mb-6">
                ZMS LIZZA machines transformed our production speed and quality. Their support team is exceptional.
              </p>
              <div className="font-semibold text-slate-900">
                Rajesh Patel
              </div>
              <div className="text-sm text-slate-500">
                Textile Manufacturer, Surat
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
              <div className="flex items-center mb-4 text-orange-500">
                ★★★★★
              </div>
              <p className="text-slate-600 mb-6">
                European precision with Indian reliability. The machines deliver consistent results every day.
              </p>
              <div className="font-semibold text-slate-900">
                Priya Mehta
              </div>
              <div className="text-sm text-slate-500">
                Factory Owner, Ahmedabad
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
              <div className="flex items-center mb-4 text-orange-500">
                ★★★★★
              </div>
              <p className="text-slate-600 mb-6">
                From installation to training, ZMS LIZZA handled everything professionally.
              </p>
              <div className="font-semibold text-slate-900">
                Anil Shah
              </div>
              <div className="text-sm text-slate-500">
                Production Head, Mumbai
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* GALLERY PREVIEW */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              See the Quality Our Machines Deliver
            </h2>
            <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
              Real embroidery work produced using ZMS LIZZA machines in factories across India.
            </p>
          </div>

          {/* Image Grid */}
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">

            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-slate-100 rounded-xl aspect-square flex items-center justify-center text-slate-400 font-medium hover:shadow-lg transition"
              >
                Gallery Image
              </div>
            ))}

          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <a
              href="/gallery"
              className="inline-block bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition"
            >
              View Full Gallery
            </a>
          </div>

        </div>
      </section>


      {/* SERVICES PREVIEW */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Complete Support Beyond the Machine
            </h2>
            <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
              From installation to after-sales service, we support your success at every step.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">

            {[
              {
                title: "Installation & Setup",
                desc: "Professional on-site installation ensuring optimal performance from day one.",
              },
              {
                title: "Operator Training",
                desc: "Hands-on training programs to help your team master machine operations.",
              },
              {
                title: "Technical Support",
                desc: "Fast and reliable support from trained engineers whenever you need it.",
              },
              {
                title: "Maintenance & Spare Parts",
                desc: "Genuine spare parts and preventive maintenance for long-term reliability.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition"
              >
                <div className="w-12 h-12 mb-4 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                  {i + 1}
                </div>

                <h3 className="font-semibold text-lg mb-2">
                  {item.title}
                </h3>

                <p className="text-slate-600 text-sm">
                  {item.desc}
                </p>
              </div>
            ))}

          </div>

        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">

          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Upgrade Your Production?
          </h2>

          <p className="max-w-2xl mx-auto text-lg text-orange-100 mb-10">
            Get in touch with our experts to find the perfect embroidery solution
            for your factory’s needs.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="/contact"
              className="px-8 py-4 bg-white text-orange-600 font-semibold rounded-lg hover:bg-orange-100 transition"
            >
              Request a Demo
            </a>

            <a
              href="/contact"
              className="px-8 py-4 border border-white text-white font-semibold rounded-lg hover:bg-white hover:text-orange-600 transition"
            >
              Talk to an Expert
            </a>
          </div>

        </div>
      </section>

    </div>
  );
}
