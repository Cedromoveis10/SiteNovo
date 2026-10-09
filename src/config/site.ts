export type Showroom = {
  id: string;
  name: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  whatsapp: string;
  whatsappNumber: string;
  email: string;
  instagram: string;
  hours: ReadonlyArray<{ days: string; time: string }>;
  mapsQuery: string;
  mapsUrl: string;
};

export const siteConfig = {
  name: "Cedro",
  legalName: "Cedro Móveis & Ambientes",
  tagline: "Móveis & Ambientes",
  headline: "Design que transforma ambientes.",
  description:
    "Uma curadoria de móveis para ambientes que valorizam design, qualidade e personalidade. Mesas, cadeiras e banquetas de alto padrão em Florianópolis.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  locale: "pt_BR",
  founded: "1998",
  city: "Florianópolis",
  state: "SC",
  whatsappNumber:
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5548999930026",
  email: process.env.NEXT_PUBLIC_EMAIL || "contato@cedromoveis.com.br",
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM || "cedromoveisestreito",
  gaId: (process.env.NEXT_PUBLIC_GA_ID || "G-N1VT96SE3G").replace(
    /[^A-Z0-9-]/gi,
    "",
  ),
  gtmId: process.env.NEXT_PUBLIC_GTM_ID || "",
  metaPixelId:
    (process.env.NEXT_PUBLIC_META_PIXEL_ID || "1098776615876594").replace(
      /\D/g,
      "",
    ),
  showrooms: [
    {
      id: "estreito",
      name: "Showroom Estreito",
      street: "Rua General Valgas Neves, 100",
      neighborhood: "Estreito",
      city: "Florianópolis",
      state: "SC",
      zip: "88075-001",
      phone: "+55 48 99993-0026",
      whatsapp: "",
      whatsappNumber: "5548999930026",
      email: "contato@cedromoveis.com.br",
      instagram: "cedromoveisestreito",
      hours: [
        { days: "Segunda a sexta", time: "9h – 18h" },
        { days: "Sábado", time: "9h – 13h" },
      ],
      mapsQuery: "Rua General Valgas Neves, 100, Estreito, Florianópolis - SC",
      mapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Rua+General+Valgas+Neves,+100,+Estreito,+Florian%C3%B3polis+-+SC",
    },
    {
      id: "sc-401",
      name: "Showroom SC-401",
      street: "Rod. José Carlos Daux, 4939",
      neighborhood: "Saco Grande",
      city: "Florianópolis",
      state: "SC",
      zip: "88032-005",
      phone: "+55 48 98814-9811",
      whatsapp: "",
      whatsappNumber: "5548988149811",
      email: "Cedromoveisdesign@yahoo.com.br",
      instagram: "cedromoveissc401",
      hours: [
        { days: "Segunda a sexta", time: "9h – 18h" },
        { days: "Sábado", time: "9h – 16h" },
      ],
      mapsQuery:
        "Rodovia José Carlos Daux, 4939, Saco Grande, Florianópolis - SC",
      mapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Rod.+Jos%C3%A9+Carlos+Daux,+4939,+Saco+Grande,+Florian%C3%B3polis+-+SC",
    },
  ] satisfies Showroom[],
} as const;
