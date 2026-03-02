import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../lib/api";
import { BASE_URL } from "../lib/api";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await apiRequest("/products");
        setProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  return (
    <div className="w-full">
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Our Embroidery Machines
          </h1>
          <p className="max-w-2xl mx-auto text-slate-600">
            Explore our complete range of high-performance embroidery machines.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden"
            >
              <img
                src={`${BASE_URL}/${product.images[0]}`}
                alt={product.title}
                className="h-48 w-full object-cover"
              />

              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">
                  {product.title}
                </h3>

                <p className="text-slate-600 text-sm mb-4">
                  {product.shortDescription}
                </p>

                <div className="flex gap-3">
                  <Link
                    to={`/products/${product.slug}`}
                    className="border border-slate-300 px-4 py-2 rounded-md text-sm hover:bg-slate-100"
                  >
                    View Details
                  </Link>

                  <Link
                    to="/contact"
                    className="bg-orange-500 text-white px-4 py-2 rounded-md text-sm hover:bg-orange-600"
                  >
                    Get Quote
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
