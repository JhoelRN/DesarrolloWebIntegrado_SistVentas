// src/api/products.js

// --- MOCKS (para desarrollo y visualización) ---
const MOCK_PRODUCTS = [
  // Alfombras
  { id: 1, name: "Alfombra Persa", category: "alfombras", price: 250, oldPrice: 300, image: "https://placehold.co/300x200", brand: "Persian" },
  { id: 2, name: "Alfombra Moderna", category: "alfombras", price: 180, image: "https://placehold.co/300x200", brand: "UrbanStyle" },
  { id: 3, name: "Alfombra Shaggy", category: "alfombras", price: 200, image: "https://placehold.co/300x200", brand: "ComfortHome" },
  { id: 4, name: "Alfombra Minimalista", category: "alfombras", price: 220, image: "https://placehold.co/300x200", brand: "DecoHome" },
  { id: 5, name: "Alfombra Vintage", category: "alfombras", price: 300, image: "https://placehold.co/300x200", brand: "ClassicStyle" },

  // Cortinas
  { id: 6, name: "Cortina Blackout", category: "cortinas", price: 120, oldPrice: 150, image: "https://placehold.co/300x200", brand: "DecoHome" },
  { id: 7, name: "Cortina Translúcida", category: "cortinas", price: 90, image: "https://placehold.co/300x200", brand: "DecoHome" },
  { id: 8, name: "Cortina Roller", category: "cortinas", price: 150, image: "https://placehold.co/300x200", brand: "UrbanStyle" },
  { id: 9, name: "Cortina de Lino", category: "cortinas", price: 200, image: "https://placehold.co/300x200", brand: "NaturalHome" },
  { id: 10, name: "Cortina Estampada", category: "cortinas", price: 170, image: "https://placehold.co/300x200", brand: "DecoHome" },

  // Accesorios
  { id: 11, name: "Soporte Laptop", category: "accesorios", price: 80, image: "https://placehold.co/300x200", brand: "TechOffice" },
  { id: 12, name: "Mouse Ergonómico", category: "accesorios", price: 60, image: "https://placehold.co/300x200", brand: "TechOffice" },
  { id: 13, name: "Teclado Mecánico", category: "accesorios", price: 150, image: "https://placehold.co/300x200", brand: "KeyMaster" },
  { id: 14, name: "Hub USB-C", category: "accesorios", price: 70, image: "https://placehold.co/300x200", brand: "ConnectPro" },
  { id: 15, name: "Base Refrigerante", category: "accesorios", price: 95, image: "https://placehold.co/300x200", brand: "CoolTech" },
];


// --- Productos destacados (mock) ---
export const getFeaturedProducts = async () => {
  // MOCK: devolvemos los 4 primeros
  return MOCK_PRODUCTS.slice(0, 4);

  /*
  // IMPLEMENTACIÓN REAL (cuando el backend esté listo)
  const res = await fetch("http://localhost:8081/api/products/featured");
  if (!res.ok) throw new Error("Error cargando destacados");
  return await res.json();
  */
};

// --- Catálogo completo con filtros (mock) ---
export const getProducts = async ({ query, category, tag }) => {
  // MOCK: filtramos localmente
  let filtered = [...MOCK_PRODUCTS];

  // ✅ Cambio aplicado: filtramos por campo category
  if (category) {
    filtered = filtered.filter(p => p.category === category);
  }

  if (query) {
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  if (tag) {
    filtered = filtered.filter(p =>
      p.brand && p.brand.toLowerCase().includes(tag.toLowerCase())
    );
  }

  return filtered;

  /*
  // IMPLEMENTACIÓN REAL (cuando conectes con Spring Boot + MySQL)
  const params = new URLSearchParams();
  if (query) params.append("q", query);
  if (category) params.append("c", category);
  if (tag) params.append("tag", tag);

  const res = await fetch(`http://localhost:8081/api/products?${params.toString()}`);
  if (!res.ok) throw new Error("Error cargando productos");
  return await res.json();
  */
};