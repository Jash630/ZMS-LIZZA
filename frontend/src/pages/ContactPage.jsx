import { useState, useEffect } from "react";

export default function ContactPage() {

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!message && !error) return;

    const timer = setTimeout(() => {
      setMessage("");
      setError("");
    }, 4000);

    return () => clearTimeout(timer);
  }, [message, error]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      location: e.target.location.value,
      machine: e.target.machine.value,
      message: e.target.message.value,
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/contact`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      let data = null;
      if (response.headers.get("content-type")?.includes("application/json")) {
        data = await response.json();
      }

      if (!response.ok) {
        throw new Error(
          data?.detail?.[0]?.msg || "Submission failed"
        );
      }

      setMessage("Thank you! We will contact you shortly.");
      e.target.reset();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="w-full">

      {/* PAGE HEADER */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Get in Touch
          </h1>
          <p className="max-w-2xl mx-auto text-slate-600">
            Speak with our experts to find the perfect embroidery solution
            for your production needs.
          </p>
        </div>
      </section>

      {/* CONTACT CONTENT */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12">

          {/* FORM */}
          <div className="bg-slate-50 rounded-xl p-8 shadow-sm">
            <h2 className="text-2xl font-semibold mb-6">
              Request a Demo / Quote
            </h2>

            <form
              className="space-y-5"
              onSubmit={handleSubmit}
            >


              <input
                name="name"
                type="text"
                placeholder="Full Name"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />

              <input
                name="email"
                type="email"
                placeholder="Email Address"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />

              <input
                name="location"
                type="text"
                placeholder="City / Location"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />

              <select name="machine" className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                <option>Interested Machine Type</option>
                <option>Multi-Function Machine</option>
                <option>High-Speed Machine</option>
                <option>Sequin Machine</option>
                <option>Bead Machine</option>
              </select>

              <textarea
                name="message"
                rows="4"
                placeholder="Tell us about your requirement"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />

              <button
                type="submit"
                className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition"
              >
                Submit Inquiry
              </button>

              {message && (
                <p className="text-sm text-green-600 mt-3">
                  {message}
                </p>
              )}

              {error && (
                <p className="text-sm text-red-600 mt-3">
                  {error}
                </p>
              )}


            </form>
          </div>

          {/* CONTACT INFO */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">
              Contact Information
            </h2>

            <div className="space-y-4 text-slate-600">
              <p>
                <strong>Address:</strong><br />
                ZMS LIZZA European Technology<br />
                Surat, Gujarat, India
              </p>

              <p>
                <strong>Phone:</strong><br />
                +91 9XXXXXXXXX
              </p>

              <p>
                <strong>Email:</strong><br />
                info@zmslizza.com
              </p>

              <p>
                <strong>Working Hours:</strong><br />
                Monday – Saturday, 9:00 AM – 6:00 PM
              </p>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
