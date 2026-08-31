import { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Section, { SectionHeader } from "../components/Section";
import ProductCard from "../components/ProductCard";
import { products, categories } from "../data/products";

export default function Collection() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCat = searchParams.get("category") || "all";
  const [activeCategory, setActiveCategory] = useState(initialCat);
  const [sort, setSort] = useState("featured");
  const [priceRange, setPriceRange] = useState("all");

  const filtered = useMemo(() => {
    let list = [...products];
    if (activeCategory !== "all") {
      list = list.filter((p) => p.category === activeCategory);
    }
    if (priceRange === "under50") list = list.filter((p) => p.price < 50);
    if (priceRange === "50-100") list = list.filter((p) => p.price >= 50 && p.price <= 100);
    if (priceRange === "over100") list = list.filter((p) => p.price > 100);

    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [activeCategory, sort, priceRange]);

  const setCategory = (cat) => {
    setActiveCategory(cat);
    if (cat === "all") searchParams.delete("category");
    else searchParams.set("category", cat);
    setSearchParams(searchParams, { replace: true });
  };

  return (
    <>
      {/* Header */}
      <div className="bg-muted border-b border-border">
        <div className="container-luxury py-12 text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-accent">Curated Selection</p>
          <h1 className="font-playfair text-4xl mt-3">The Collection</h1>
          <p className="text-secondary mt-3 max-w-xl mx-auto leading-relaxed">
            Explore our complete range of handcrafted jewelry. Filter by category, price or style.
          </p>
          <div className="flex items-center justify-center gap-2 mt-4 text-xs text-secondary">
            <Link to="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <span className="text-primary">Collection</span>
          </div>
        </div>
      </div>

      <Section padding="py-10">
        {/* Filters bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-border">
          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCategory("all")}
              className={`px-5 py-2.5 text-xs tracking-widest uppercase border transition-all ${
                activeCategory === "all"
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-primary border-border hover:border-primary"
              }`}
            >
              All ({products.length})
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={`px-5 py-2.5 text-xs tracking-widest uppercase border transition-all ${
                  activeCategory === c.id
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-primary border-border hover:border-primary"
                }`}
              >
                {c.name} ({products.filter((p) => p.category === c.id).length})
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="border border-border bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
            >
              <option value="all">All Prices</option>
              <option value="under50">Under $50</option>
              <option value="50-100">$50 - $100</option>
              <option value="over100">Over $100</option>
            </select>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border border-border bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Alphabetical</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between mt-6 mb-8">
          <p className="text-sm text-secondary">
            Showing <span className="text-primary font-medium">{filtered.length}</span> products
            {activeCategory !== "all" && <> in <span className="capitalize text-primary font-medium">{activeCategory}</span></>}
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-secondary">No products found in this category.</p>
            <button onClick={() => setCategory("all")} className="mt-4 text-sm underline hover:text-accent">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </Section>

      {/* Category showcase */}
      <Section className="bg-primary text-white" padding="py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/collection?category=${cat.id}`}
              onClick={() => setCategory(cat.id)}
              className="group relative overflow-hidden aspect-[3/4] bg-white/5"
            >
              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                <h3 className="font-playfair text-xl text-white">{cat.name}</h3>
                <span className="mt-2 text-[11px] tracking-widest uppercase text-white/80 border border-white/40 px-4 py-2 group-hover:bg-white group-hover:text-primary transition-colors">Explore</span>
              </div>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
