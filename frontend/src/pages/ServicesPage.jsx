export default function ServicesPage() {
  return (
    <div className="w-full">

      {/* HEADER */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Our Services
          </h1>
          <p className="max-w-2xl mx-auto text-slate-600">
            Comprehensive support to ensure maximum productivity and machine life.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid gap-12 md:grid-cols-2">

          <div>
            <h2 className="text-2xl font-semibold mb-4">
              Installation & Commissioning
            </h2>
            <p className="text-slate-600 mb-6">
              Our engineers ensure professional installation, calibration,
              and commissioning so your machines operate at peak performance
              from day one.
            </p>

            <h2 className="text-2xl font-semibold mb-4">
              Operator Training
            </h2>
            <p className="text-slate-600 mb-6">
              Hands-on training programs help your operators understand machine
              functions, maintenance routines, and productivity optimization.
            </p>

            <h2 className="text-2xl font-semibold mb-4">
              After-Sales Support
            </h2>
            <p className="text-slate-600">
              Fast technical support, preventive maintenance, and genuine spare
              parts ensure long-term reliability and minimal downtime.
            </p>
          </div>

          <div className="bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
            Service & Support Image
          </div>

        </div>
      </section>

    </div>
  );
}
