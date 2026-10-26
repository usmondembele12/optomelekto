export default function SchemaMarkup() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": "https://optomelektro.uz/#store",
        "name": "Optom Elektro Toshkent",
        "alternateName": "OptomElektro.uz",
        "url": "https://optomelektro.uz",
        "logo": "https://optomelektro.uz/logo.png",
        "image": "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?w=1200",
        "description":
          "Toshkentda kabellar, avtomatika, elektr shitlar, rozetka va LED yoritish jihozlarining birinchi qo'l ulgurji va chakana savdo do'koni.",
        "telephone": "+998712004545",
        "email": "info@optomelektro.uz",
        "priceRange": "$$",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Yangi Sergeli ko'chasi, 12-uy (Elektr bozori 4-blok)",
          "addressLocality": "Toshkent",
          "addressRegion": "Toshkent shahri",
          "postalCode": "100140",
          "addressCountry": "UZ"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "41.2285",
          "longitude": "69.2155"
        },
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            "opens": "08:30",
            "closes": "18:30"
          },
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": "Sunday",
            "opens": "09:00",
            "closes": "15:00"
          }
        ],
        "sameAs": [
          "https://t.me/optomelektro_uz"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://optomelektro.uz/#website",
        "url": "https://optomelektro.uz",
        "name": "Optom Elektro - Toshkent Elektrotexnika Bozor",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://optomelektro.uz/katalog?search={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
