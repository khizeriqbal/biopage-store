"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { Plus, Edit2, Trash2, Eye, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { AiDescribeButton } from "@/components/products/AiDescribeButton";
import { AiPricingButton } from "@/components/products/AiPricingButton";

interface Product {
  id: string;
  name: string;
  type: string;
  price: number;
  sales: number;
  revenue: number;
  status: "draft" | "published";
  createdAt: string;
}

export default function ProductsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "DIGITAL",
    description: "",
    price: "",
  });
  const [selectedPrice, setSelectedPrice] = useState("");
  const [selectedDescription, setSelectedDescription] = useState("");

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  // Sample products for demonstration
  useEffect(() => {
    if (user) {
      setProducts([
        {
          id: "1",
          name: "Email Template Bundle",
          type: "DIGITAL",
          price: 27,
          sales: 42,
          revenue: 1134,
          status: "published",
          createdAt: "2026-04-01",
        },
        {
          id: "2",
          name: "Notion Dashboard Template",
          type: "DIGITAL",
          price: 37,
          sales: 28,
          revenue: 1036,
          status: "published",
          createdAt: "2026-04-02",
        },
      ]);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate product creation
      const newProduct: Product = {
        id: Date.now().toString(),
        name: formData.name,
        type: formData.type,
        price: selectedPrice ? parseInt(selectedPrice) : parseInt(formData.price),
        sales: 0,
        revenue: 0,
        status: "draft",
        createdAt: new Date().toISOString().split("T")[0],
      };

      setProducts([...products, newProduct]);
      setFormData({ name: "", type: "DIGITAL", description: "", price: "" });
      setSelectedPrice("");
      setSelectedDescription("");
      setShowForm(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const handleToggleStatus = (id: string) => {
    setProducts(
      products.map((p) =>
        p.id === id
          ? { ...p, status: p.status === "draft" ? "published" : "draft" }
          : p
      )
    );
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-brand animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Products</h1>
          <p className="text-muted-foreground mt-2">Create and manage your digital products</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-brand hover:bg-brand/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Create Product Form */}
      {showForm && (
        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <h2 className="text-xl font-bold text-white mb-6">Create New Product</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Product Name
              </label>
              <Input
                placeholder="e.g., Email Template Bundle"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-white/5 border-white/10"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Product Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-brand"
                >
                  <option value="DIGITAL">Digital Download</option>
                  <option value="COURSE">Online Course</option>
                  <option value="BOOKING">Coaching Session</option>
                  <option value="MEMBERSHIP">Membership</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Price ($)
                </label>
                <Input
                  type="number"
                  placeholder="27"
                  value={selectedPrice || formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="bg-white/5 border-white/10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Brief Description
              </label>
              <textarea
                placeholder="What is this product? What will users get?"
                value={selectedDescription || formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-muted-foreground focus:outline-none focus:border-brand"
              />
            </div>

            {/* AI Helpers */}
            <div className="grid md:grid-cols-2 gap-4">
              <AiDescribeButton
                productTitle={formData.name}
                productType={formData.type}
                briefDescription={formData.description}
                onSelectDescription={(desc) => setSelectedDescription(desc)}
              />
              <AiPricingButton
                productType={formData.type}
                niche="general"
                description={formData.description}
                onSelectPrice={(price) => setSelectedPrice(price.toString())}
              />
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={loading || !formData.name}
                className="flex-1 bg-brand hover:bg-brand/90"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Product"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1 border-white/20 hover:bg-white/5"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Products List */}
      <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
        {products.length === 0 ? (
          <div className="p-12 text-center">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground mb-4">No products yet. Create your first product to get started!</p>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-brand hover:bg-brand/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Product
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-white">Product</th>
                  <th className="px-6 py-4 text-sm font-semibold text-white">Type</th>
                  <th className="px-6 py-4 text-sm font-semibold text-white">Price</th>
                  <th className="px-6 py-4 text-sm font-semibold text-white">Sales</th>
                  <th className="px-6 py-4 text-sm font-semibold text-white">Revenue</th>
                  <th className="px-6 py-4 text-sm font-semibold text-white">Status</th>
                  <th className="px-6 py-4 text-sm font-semibold text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-white/10 hover:bg-white/5 transition">
                    <td className="px-6 py-4">
                      <p className="text-white font-medium">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.createdAt}</p>
                    </td>
                    <td className="px-6 py-4 text-white text-sm">{product.type}</td>
                    <td className="px-6 py-4 text-white font-semibold">${product.price}</td>
                    <td className="px-6 py-4 text-white">{product.sales}</td>
                    <td className="px-6 py-4 text-brand font-semibold">${product.revenue}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(product.id)}
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold transition ${
                          product.status === "published"
                            ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                            : "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30"
                        }`}
                      >
                        {product.status === "published" ? "Published" : "Draft"}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          className="p-2 text-muted-foreground hover:text-white hover:bg-white/10 rounded-lg transition"
                          title="View product"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 text-muted-foreground hover:text-white hover:bg-white/10 rounded-lg transition"
                          title="Edit product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
