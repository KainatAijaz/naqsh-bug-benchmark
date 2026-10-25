import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Pencil, Trash2, Eye, EyeOff, X } from "lucide-react";

const categories = ["Cones", "Kits", "Stencils", "Aftercare", "Gift Boxes"];

const AdminProducts = () => {
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data } = await supabase.from("products" as any).select("*").order("created_at", { ascending: true });
      return (data || []) as any[];
    },
  });

  const upsertProduct = useMutation({
    mutationFn: async (product: any) => {
      if (product.id) {
        const { error } = await supabase.from("products" as any).update(product).eq("id", product.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("products" as any).insert(product);
        if (error) throw error;
      }
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-products"] }); setShowModal(false); setEditProduct(null); },
  });

  const deleteProduct = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products" as any).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-products"] }),
  });

  const toggleVisibility = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase.from("products" as any).update({ is_active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-products"] }),
  });

  const openEdit = (p: any) => { setEditProduct(p); setShowModal(true); };
  const openNew = () => { setEditProduct(null); setShowModal(true); };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-3xl md:text-4xl font-light text-white">Products</h1>
        <button onClick={openNew} className="flex items-center gap-2 font-sans text-xs tracking-[0.2em] uppercase px-4 py-2.5 rounded transition-all" style={{ background: "hsl(40 55% 55%)", color: "#0D0810" }}>
          <Plus size={14} /> Add Product
        </button>
      </div>

      <div className="overflow-x-auto rounded" style={{ border: "1px solid var(--a-border-subtle)" }}>
        <table className="w-full">
          <thead>
            <tr style={{ background: "var(--a-card)", borderBottom: "1px solid var(--a-border-subtle)" }}>
              {["Name", "Price", "Stock", "Category", "Bestseller", "Status", "Actions"].map((h) => (
                <th key={h} className="font-sans text-xs tracking-[0.08em] text-primary/75 uppercase font-medium py-3 px-3 text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={7} className="font-sans text-sm text-white/65 py-8 text-center">Loading...</td></tr>
            ) : products.map((p: any, i: number) => (
              <tr key={p.id} style={{ background: i % 2 === 0 ? "var(--a-row-even)" : "var(--a-row-odd)", borderBottom: "1px solid var(--a-border-faint)" }}>
                <td className="font-sans text-sm text-white/90 py-3 px-3">{p.name}</td>
                <td className="font-sans text-xs text-primary py-3 px-3">${p.price}</td>
                <td className={`font-sans text-xs py-3 px-3 ${p.stock < 5 ? "text-red-400" : "text-white/60"}`}>{p.stock}</td>
                <td className="font-sans text-xs text-white/50 py-3 px-3">{p.category}</td>
                <td className="font-sans text-xs py-3 px-3">{p.is_bestseller ? <span className="text-primary">★</span> : <span className="text-white/20">—</span>}</td>
                <td className="py-3 px-3">
                  <button onClick={() => toggleVisibility.mutate({ id: p.id, is_active: !p.is_active })} className="flex items-center gap-1.5">
                    {p.is_active ? <Eye size={14} className="text-green-400/70" /> : <EyeOff size={14} className="text-white/30" />}
                    <span className={`font-sans text-xs ${p.is_active ? "text-green-400/70" : "text-white/30"}`}>{p.is_active ? "Active" : "Hidden"}</span>
                  </button>
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(p)} className="text-white/30 hover:text-primary transition-colors"><Pencil size={14} /></button>
                    <button onClick={() => { if (confirm("Delete this product?")) deleteProduct.mutate(p.id); }} className="text-white/30 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && <ProductModal product={editProduct} onClose={() => { setShowModal(false); setEditProduct(null); }} onSave={(p: any) => upsertProduct.mutate(p)} />}
    </div>
  );
};

const ProductModal = ({ product, onClose, onSave }: { product: any; onClose: () => void; onSave: (p: any) => void }) => {
  const [form, setForm] = useState({
    name: product?.name || "",
    slug: product?.slug || "",
    price: product?.price || 0,
    stock: product?.stock || 100,
    category: product?.category || "Cones",
    short_description: product?.short_description || "",
    long_description: product?.long_description || "",
    is_bestseller: product?.is_bestseller || false,
    is_active: product?.is_active ?? true,
    stripe_price_id: product?.stripe_price_id || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = form.slug || form.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    onSave({ ...(product?.id ? { id: product.id } : {}), ...form, slug });
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/70 z-50" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg max-h-[85vh] overflow-y-auto rounded p-8" style={{ background: "var(--a-sidebar)", border: "1px solid var(--a-border-soft)" }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl text-white">{product ? "Edit Product" : "Add New Product"}</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: "Product Name", key: "name", type: "text" },
            { label: "Slug", key: "slug", type: "text" },
            { label: "Price ($)", key: "price", type: "number" },
            { label: "Stock", key: "stock", type: "number" },
            { label: "Stripe Price ID", key: "stripe_price_id", type: "text" },
          ].map(({ label, key, type }) => (
            <div key={key}>
              <label className="font-sans text-xs tracking-[0.08em] text-white/70 uppercase block mb-1">{label}</label>
              <input
                type={type}
                value={(form as any)[key]}
                onChange={(e) => setForm({ ...form, [key]: type === "number" ? Number(e.target.value) : e.target.value })}
                className="w-full px-3 py-2 font-sans text-sm bg-transparent text-white rounded focus:outline-none"
                style={{ border: "1px solid var(--a-border-soft)" }}
              />
            </div>
          ))}
          <div>
            <label className="font-sans text-xs tracking-[0.08em] text-white/70 uppercase block mb-1">Category</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 font-sans text-sm bg-transparent text-white rounded focus:outline-none" style={{ border: "1px solid var(--a-border-soft)" }}>
              {categories.map((c) => <option key={c} value={c} style={{ background: "var(--a-select-bg)" }}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="font-sans text-xs tracking-[0.08em] text-white/70 uppercase block mb-1">Short Description</label>
            <textarea value={form.short_description} onChange={(e) => setForm({ ...form, short_description: e.target.value })} rows={2} className="w-full px-3 py-2 font-sans text-sm bg-transparent text-white rounded focus:outline-none resize-none" style={{ border: "1px solid var(--a-border-soft)" }} />
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.is_bestseller} onChange={(e) => setForm({ ...form, is_bestseller: e.target.checked })} className="accent-primary" />
              <span className="font-sans text-sm text-white/80">Bestseller</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="accent-primary" />
              <span className="font-sans text-sm text-white/80">Active</span>
            </label>
          </div>
          <button type="submit" className="w-full font-sans text-sm tracking-widest uppercase py-3 rounded transition-all" style={{ background: "hsl(40 55% 55%)", color: "#0D0810" }}>
            {product ? "Update Product" : "Add Product"}
          </button>
        </form>
      </div>
    </>
  );
};

export default AdminProducts;
