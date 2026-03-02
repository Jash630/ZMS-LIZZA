import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiRequest } from "../lib/api";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const data = await apiRequest(`/products/${id}`);
        setProduct(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchProduct();
  }, [id]);

  if (!product) {
    return <div className="text-center py-20">Loading...</div>;
  }

  return (
    <div className="w-full">
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-sm text-orange-600 font-semibold mb-2 uppercase">
            Embroidery Machine
          </p>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {product.title}
          </h1>

          <p className="max-w-2xl text-slate-600">
            {product.shortDescription}
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12">
          <img
            src={`http://localhost:5000/${product.images[0]}`}
            alt={product.title}
            className="rounded-xl"
          />

          <div>
            <h2 className="text-2xl font-semibold mb-4">
              Description
            </h2>

            <p className="text-slate-600 mb-8">
              {product.fullDescription}
            </p>

            <div className="flex gap-4">
              <Link
                to="/contact"
                className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600"
              >
                Request a Quote
              </Link>

              <Link
                to="/products"
                className="border border-slate-300 px-6 py-3 rounded-lg hover:bg-slate-100"
              >
                Back to Products
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
