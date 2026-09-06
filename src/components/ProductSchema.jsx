// JSON-LD Product rich result: invisible to visitors, read by Google only.
export default function ProductSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Coffret RADKO Doré",
    alternateName: ["RADKO Gold Set", "طقم الرادكو الذهبي"],
    image: "https://i.ibb.co/kVxmTJbw/displayed.webp",
    description:
      "Parure dorée complète : collier, bracelet, bague, boucles + coffret de luxe. Paiement à la livraison partout au Maroc.",
    brand: { "@type": "Brand", name: "Al Meknassi Jewelry" },
    offers: {
      "@type": "Offer",
      url: "https://almeknassijewelry.com/product/1",
      priceCurrency: "MAD",
      price: "279",
      availability: "https://schema.org/InStock",
    },
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  );
}
