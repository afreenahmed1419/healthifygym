const SITE_URL = "https://www.healthifygym.in";

const healthClubSchema = {
  "@context": "https://schema.org",
  "@type": "HealthClub",
  "@id": `${SITE_URL}/#healthclub`,
  name: "Healthify",
  image: `${SITE_URL}/logo.jpg`,
  url: SITE_URL,
  telephone: "+919474287110",
  email: "Healthifyportblair@gmail.com",
  priceRange: "₹₹",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Opposite Petrol Pump, Delanipur",
    addressLocality: "Sri Vijaya Puram",
    addressRegion: "Andaman and Nicobar Islands",
    postalCode: "744102",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 11.6700076,
    longitude: 92.7277078,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "05:00",
      closes: "20:00",
    },
  ],
  sameAs: [
    "https://www.instagram.com/healthifyportblair/",
    "https://www.facebook.com/healthifyportblair",
  ],
};

export default function StructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(healthClubSchema) }}
    />
  );
}
