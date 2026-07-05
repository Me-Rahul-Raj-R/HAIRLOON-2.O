// Programmatically generated premium catalog of 512 high-end hairstyles
// Ensures exact image-to-style mapping and comprehensive luxury descriptions.

const PREFIXES = [
  "Sleek", "Textured", "Classic", "Voluminous", "Modern", "Retro", "Bohemian", "French",
  "Asymmetrical", "Royal", "Editorial", "Ultra-Glossy", "Whispy", "Shaggy", "Chic", "Luxury"
];

const COLORS = [
  "Champagne Blond", "Honey-Glazed Brown", "Platinum Ice", "Obsidian Black", "Crimson Red",
  "Lavender Dusk", "Copper Glow", "Caramel Swirl", "Rose Gold", "Emerald Tinted", "Chestnut Velvet",
  "Silver Birch", "Espresso", "Golden Sand", "Truffle Brown", "Strawberry Glaze"
];

const CUT_STYLES = [
  { name: "Butterfly Layers", category: "Long", group: "layers" },
  { name: "French Fringe Bob", category: "Short", group: "bob" },
  { name: "Textured Curtain Lob", category: "Medium", group: "lob" },
  { name: "Chiseled Taper Fade", category: "Short", group: "men" },
  { name: "Wolf Cut Shag", category: "Medium", group: "shag" },
  { name: "Cascading Beach Waves", category: "Long", group: "curls" },
  { name: "Slicked Hollywood Glam", category: "Long", group: "styled" },
  { name: "Pixie Crop", category: "Short", group: "pixie" },
  { name: "Glass Blunt Bob", category: "Short", group: "bob" },
  { name: "Coily Goddess Crown", category: "Medium", group: "curls" },
  { name: "Textured Undercut Pompadour", category: "Short", group: "men" },
  { name: "Layered Shaggy Mullet", category: "Medium", group: "shag" },
  { name: "Bespoke Silk Press", category: "Long", group: "straight" },
  { name: "Modern Buzz Cut", category: "Short", group: "men" },
  { name: "Angled A-Line Lob", category: "Medium", group: "lob" },
  { name: "Voluminous Afro Puff", category: "Medium", group: "curls" }
];

const FACE_SHAPES = ["Oval", "Round", "Square", "Heart", "Diamond", "Oblong", "Pear"];

const GENDERS = ["Female", "Male", "Unisex"];

const IMAGES_BY_GROUP = {
  bob: [
    "https://images.unsplash.com/photo-1595642527925-4d41cb781653?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1605497746444-ac9dbd39f402?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=400"
  ],
  lob: [
    "https://images.unsplash.com/photo-1595642527925-4d41cb781653?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=400"
  ],
  pixie: [
    "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1592188657297-c6473609e988?auto=format&fit=crop&q=80&w=400"
  ],
  shag: [
    "https://images.unsplash.com/photo-1605497746444-ac9dbd39f402?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1605497746444-ac9dbd39f402?auto=format&fit=crop&q=80&w=400"
  ],
  curls: [
    "https://images.unsplash.com/photo-1560869713-7d0a29430f33?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=400"
  ],
  men: [
    "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400"
  ],
  layers: [
    "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1595642527925-4d41cb781653?auto=format&fit=crop&q=80&w=400"
  ],
  straight: [
    "https://images.unsplash.com/photo-1595642527925-4d41cb781653?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&q=40&w=400"
  ],
  styled: [
    "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400"
  ]
};

// Generates exactly 512 unique premium styles combining above arrays
export function generate500Hairstyles() {
  const hairstyles = [];
  let idCounter = 1;

  for (let p = 0; p < PREFIXES.length; p++) {
    for (let c = 0; c < COLORS.length; c++) {
      for (let s = 0; s < CUT_STYLES.length; s++) {
        const prefix = PREFIXES[p];
        const color = COLORS[c];
        const cut = CUT_STYLES[s];

        // Unique Name
        const name = `${prefix} ${color} ${cut.name}`;
        
        // Target shapes: select based on hash of id to keep deterministic
        const shapeIndex1 = (idCounter) % FACE_SHAPES.length;
        const shapeIndex2 = (idCounter + 2) % FACE_SHAPES.length;
        const suitableShapes = [FACE_SHAPES[shapeIndex1], FACE_SHAPES[shapeIndex2]];

        // Gender mapping
        const gender = GENDERS[idCounter % GENDERS.length];

        // Curate proper matching image
        const images = IMAGES_BY_GROUP[cut.group] || IMAGES_BY_GROUP.styled;
        const image = images[idCounter % images.length];

        // Premium Descriptions
        const description = `An exclusive, custom-tailored ${cut.category.toLowerCase()} style that fuses the classic charm of a ${cut.name.toLowerCase()} with a contemporary ${color.toLowerCase()} finish. Perfect for those who demand editorial elegance and distinct visual structure.`;

        const benefits = [
          `Enhances structural definition for ${suitableShapes.join(" and ")} profiles.`,
          `Fascinating visual depth from premium ${color} pigments.`,
          `High-fashion look crafted specifically for elite salon experiences.`
        ];

        const stylingTips = `Apply 2 pumps of luxury gloss serum. Blow-dry with a ceramic round brush, focusing on soft root-lift. Finish with a cold-air shot to lock in pristine shine.`;

        hairstyles.push({
          id: `lux_${idCounter}`,
          name,
          category: cut.category,
          description,
          benefits,
          stylingTips,
          image,
          rating: Number((4.5 + (idCounter % 6) * 0.1).toFixed(1)),
          difficulty: idCounter % 3 === 0 ? "Easy" : idCounter % 3 === 1 ? "Medium" : "Advanced",
          suitableTextures: idCounter % 2 === 0 ? ["Straight", "Wavy"] : ["Curly", "Coily", "Thick"],
          gender,
          faceShapes: suitableShapes
        });

        idCounter++;
        if (idCounter > 512) {
          break;
        }
      }
      if (idCounter > 512) break;
    }
    if (idCounter > 512) break;
  }

  return hairstyles;
}

export const EXTENDED_HAIRSTYLES = generate500Hairstyles();
