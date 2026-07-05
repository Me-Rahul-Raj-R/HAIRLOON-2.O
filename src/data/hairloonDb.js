const FACE_SHAPES_INFO = {
  Oval: {
    name: "Oval Face Shape",
    description: "Considered the most versatile face shape. The face length is slightly greater than the width, with a forehead slightly wider than the jaw, and softly rounded curves.",
    characteristics: [
      "Face length is about 1.5 times the width",
      "Forehead is slightly wider than the jawline",
      "Softly rounded curves with no sharp angles"
    ],
    stylingGoal: "Maintain the natural balanced proportions and show off the clean facial symmetry.",
    keyAestheticRule: "You can pull off almost any style! Focus on keeping hair away from your face to highlight your perfect symmetry.",
    avoidStyles: [
      "Heavy, straight-across fringes that shorten the face",
      "Styles that cover your eyes or add too much height at the crown which can over-elongate your silhouette"
    ]
  },
  Round: {
    name: "Round Face Shape",
    description: "The face has a similar width and length, with soft, non-angular features and full cheeks. The jawline is soft and rounded.",
    characteristics: [
      "Face width and length are almost equal",
      "Cheeks are the widest part of the face",
      "Soft, curved jawline with minimal angles"
    ],
    stylingGoal: "Create the illusion of length and definition to slim the features and add structure.",
    keyAestheticRule: "Opt for volume at the crown, sleek long layers, or dramatic side parts to create flattering angles.",
    avoidStyles: [
      "Sleek chin-length bobs that hug the face and emphasize roundness",
      "Tight center-parted styles with volume at the cheeks"
    ]
  },
  Square: {
    name: "Square Face Shape",
    description: "A strong, structured face shape where the forehead, cheekbones, and jawline are almost equal in width. Characterized by a sharp, prominent jawline.",
    characteristics: [
      "Forehead, cheekbones, and jaw are of equal width",
      "Sharp, angular jawline is the defining feature",
      "Side profile curves are straight rather than soft"
    ],
    stylingGoal: "Soften the sharp angles of the jaw and forehead, creating a more gentle framing effect.",
    keyAestheticRule: "Choose wispy layers, textured lobs, side-swept bangs, or soft waves that break up the linear structure.",
    avoidStyles: [
      "Blunt, straight-across bangs that accentuate the strong jaw outline",
      "Severe center parts or slicked-back high-contrast cuts"
    ]
  },
  Heart: {
    name: "Heart Face Shape",
    description: "A face that is wider at the forehead and cheekbones, and tapers down gracefully to a narrow, pointed chin.",
    characteristics: [
      "Forehead and cheeks are significantly wider than the jaw",
      "Face tapers down to a delicate, prominent chin",
      "Often accompanied by a widow's peak hairline"
    ],
    stylingGoal: "Add volume and width around the lower half of the face to balance the wider forehead.",
    keyAestheticRule: "Bangs are your best friend! Try side-swept bangs paired with shoulder-length curls or layered bobs that flare out at the chin.",
    avoidStyles: [
      "High, slicked-back ponytails that make the forehead look broader",
      "Heavy height at the top with slicked-tight sides"
    ]
  },
  Diamond: {
    name: "Diamond Face Shape",
    description: "A highly striking, dramatic face shape where the cheekbones are the widest point. The forehead and jawline are both narrow, with a pointed chin.",
    characteristics: [
      "Cheekbones are prominently wide and high",
      "Forehead and jawline are narrow and roughly equal in width",
      "Chin is sharply pointed"
    ],
    stylingGoal: "Soften the prominent cheekbones while adding volume to the narrow forehead and jawline.",
    keyAestheticRule: "Frame the cheekbones with sweeping side fringes, textured lobs, shag cuts, or tuck-behind-the-ear styles.",
    avoidStyles: [
      "Excessive volume on the sides which over-widens the cheeks",
      "Severe middle parts with flat, straight hair"
    ]
  },
  Oblong: {
    name: "Oblong Face Shape",
    description: "The face is noticeably longer than it is wide, with a straight outline and cheekbones, forehead, and jaw of equal, narrow width.",
    characteristics: [
      "Face length is significantly greater than the width",
      "Forehead, cheeks, and jawline are equal in width",
      "Often a high forehead and long, narrow chin"
    ],
    stylingGoal: "Create the illusion of width and shorten the overall silhouette to create balance.",
    keyAestheticRule: "Go for wide curls, horizontal beach waves, deep side parts, or thick, full fringes that visually cut the length.",
    avoidStyles: [
      "Sleek, ultra-long straight styles that drag the face down further",
      "High pompous pompadours or high buns with no side volume"
    ]
  },
  Pear: {
    name: "Pear Face Shape",
    description: "Also known as a triangular face shape. The jawline is the widest part of the face, and the forehead is narrow and small.",
    characteristics: [
      "Jawline is broad, strong, and the widest point",
      "Cheekbones are slightly narrower",
      "Forehead is the narrowest part of the face"
    ],
    stylingGoal: "Add volume and width to the forehead and upper temples to balance the prominent jawline.",
    keyAestheticRule: "Maximize volume at the temples and crown! Shag cuts, layered pixies with heavy fringes, or heavy crown curls look phenomenal.",
    avoidStyles: [
      "Center parts with flat hair on top that widens the jaw",
      "Sleek ponytails or chin-length cuts that terminate directly at the widest jaw point"
    ]
  }
};
const HAIRSTYLES_DB = {
  Oval: [
    {
      id: "oval_lob",
      name: "Sleek Textured Lob",
      category: "Medium",
      description: "A modern shoulder-grazing collarbone cut with soft interior texturizing that adds movement and dimension.",
      benefits: ["Effortlessly flatters symmetric proportions", "Adapts to both curly and super straight textures", "Super low-maintenance style"],
      stylingTips: "Use a small amount of sea-salt spray on damp hair, then rough-dry with a blow dryer to create a natural, modern grit.",
      image: "https://images.unsplash.com/photo-1605497746444-ac9dbd39f402?auto=format&fit=crop&q=80&w=400",
      rating: 4.9,
      difficulty: "Easy",
      suitableTextures: ["Straight", "Wavy", "Fine", "Medium"],
      gender: "Female"
    },
    {
      id: "oval_curls",
      name: "Long Cascading Waves",
      category: "Long",
      description: "Dramatic long beachy waves that sweep gracefully down past the shoulders, highlighting symmetric facial geometry.",
      benefits: ["Adds beautiful romantic framing", "Keeps focus on high cheekbones", "Adds high movement and luxury styling feel"],
      stylingTips: "Wrap 1-inch sections around a curling wand away from the face, leaving the ends straight. Brush out softly with a wide-tooth comb.",
      image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=400",
      rating: 4.8,
      difficulty: "Medium",
      suitableTextures: ["Wavy", "Thick", "Coarse"],
      gender: "Female"
    },
    {
      id: "oval_pixie",
      name: "Chic Textured Pixie",
      category: "Short",
      description: "A bold, elegant cropped cut with soft crown layers and piecey bangs that celebrate an oval profile.",
      benefits: ["Extremely striking and modern", "Highlights long necklines and eyes", "Dries in under 5 minutes"],
      stylingTips: "Apply a small pea-sized amount of texturizing paste to fingertips and piece out the tips of the crown layers.",
      image: "https://images.unsplash.com/photo-1592188657297-c6473609e988?auto=format&fit=crop&q=80&w=400",
      rating: 4.7,
      difficulty: "Medium",
      suitableTextures: ["Straight", "Fine", "Coarse"],
      gender: "Female"
    },
    {
      id: "m_oval_crew_taper",
      name: "Classic Crew Cut with Tapered Sides",
      category: "Classic",
      description: "A clean-cut style featuring a short top that tapers into neatly cropped sides, accentuating symmetric oval features.",
      benefits: ["Highlights natural facial balance", "Extremely easy to style", "Sleek and professional"],
      stylingTips: "Apply a small dab of matte pomade and sweep the front up and slightly to the side.",
      image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=400",
      rating: 4.8,
      difficulty: "Easy",
      suitableTextures: ["Straight", "Wavy", "Thick", "Fine"],
      gender: "Male"
    },
    {
      id: "m_oval_ivy_side",
      name: "Ivy League Cut with Side Part",
      category: "Classic",
      description: "A sophisticated longer crew cut that is parted cleanly on one side, offering a polished Ivy League aesthetic.",
      benefits: ["Perfect for formal or business settings", "Polishes facial lines", "Very easy upkeep"],
      stylingTips: "Comb hair wet with a side parting, then apply a medium-hold gel for a structured, classic look.",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400",
      rating: 4.9,
      difficulty: "Easy",
      suitableTextures: ["Straight", "Wavy", "Medium"],
      gender: "Male"
    },
    {
      id: "m_oval_caesar_temple",
      name: "Caesar Cut with Temple Fade",
      category: "Fringe",
      description: "A horizontal fringe cut short on top with a clean temple fade that blends seamlessly into the sides.",
      benefits: ["Brings subtle horizontal lines", "Frames forehead nicely", "Extremely tidy layout"],
      stylingTips: "Blow-dry forward and use a light texturizing clay to piece out the fringe.",
      image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=400",
      rating: 4.7,
      difficulty: "Easy",
      suitableTextures: ["Straight", "Wavy", "Medium"],
      gender: "Male"
    },
    {
      id: "m_oval_induction_mid",
      name: "Induction Cut with Mid Taper",
      category: "Short",
      description: "The shortest buzz cut style that highlights an impeccable oval head shape, finished with a subtle mid-level taper.",
      benefits: ["Zero styling time", "Keeps head perfectly cool", "Sleek, minimalist aesthetic"],
      stylingTips: "Keep your scalp hydrated with a light hair oil after showering.",
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400",
      rating: 4.6,
      difficulty: "Easy",
      suitableTextures: ["Straight", "Coarse", "Thick"],
      gender: "Male"
    },
    {
      id: "m_oval_burr_line",
      name: "Burr Cut with Line Up",
      category: "Short",
      description: "Slightly longer than an induction cut, this Burr cut features a razor-sharp line-up along the temples and forehead.",
      benefits: ["Extremely clean look", "Accentuates cheekbones", "Requires zero daily styling"],
      stylingTips: "Visit your barber every 1.5 to 2 weeks to keep the line-up sharp.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
      rating: 4.8,
      difficulty: "Easy",
      suitableTextures: ["Straight", "Wavy", "Coarse"],
      gender: "Male"
    }
  ],
  Round: [
    {
      id: "round_lob_side",
      name: "Asymmetric Angled Lob",
      category: "Medium",
      description: "A sleek, sharp long bob that is slightly longer in the front and parting deeply on the side. This elongates the face.",
      benefits: ["Visually slims full cheeks", "Adds flattering structural angles", "Highly professional appearance"],
      stylingTips: "Apply a heat protection cream and flat iron with a slight bevel towards the collarbone for sharp, defined lines.",
      image: "https://images.unsplash.com/photo-1620331311520-246422fd82f9?auto=format&fit=crop&q=80&w=400",
      rating: 4.9,
      difficulty: "Medium",
      suitableTextures: ["Straight", "Fine", "Medium"],
      gender: "Female"
    },
    {
      id: "round_shag",
      name: "Voluminous Shag with Curtain Bangs",
      category: "Fringe",
      description: "A highly textured, retro shaggy cut with layers starting high on the crown and wispy curtain bangs parting the forehead.",
      benefits: ["Crown volume visually elongates face", "Curtain bangs slim down cheeks", "Incredibly fun and trendy style"],
      stylingTips: "Blow-dry curtain bangs using a medium round brush away from your face to create a flattering 'curtain opening' frame.",
      image: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&q=80&w=400",
      rating: 4.8,
      difficulty: "Medium",
      suitableTextures: ["Wavy", "Curly", "Thick"],
      gender: "Female"
    },
    {
      id: "round_long_layers",
      name: "Sleek Ultra-Long Layers",
      category: "Long",
      description: "Sleek straight hair past the chest with dynamic vertical layers starting strictly below the chin.",
      benefits: ["Draws the eye down to lengthen face", "Adds sleekness to round profiles", "Highly versatile styling base"],
      stylingTips: "Use a glossing serum after straightening to minimize flyaways and create a mirror-like finish.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400",
      rating: 4.6,
      difficulty: "Easy",
      suitableTextures: ["Straight", "Medium"],
      gender: "Female"
    },
    {
      id: "m_round_angular_undercut",
      name: "Angular Fringe with Undercut",
      category: "Fringe",
      description: "An asymmetrical fringe cut at an angle on top, paired with disconnected undercut sides to visually slim and lengthen the face.",
      benefits: ["Breaks up facial roundness", "Adds modern asymmetric contrast", "Provides visual height"],
      stylingTips: "Blow dry hair upwards and forwards with a vent brush, using texturizing paste to pinch the ends into points.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400",
      rating: 4.9,
      difficulty: "Medium",
      suitableTextures: ["Straight", "Wavy", "Medium"],
      gender: "Male"
    },
    {
      id: "m_round_french_high_skin",
      name: "French Crop with High Skin Fade",
      category: "Fringe",
      description: "A neat textured crop with a blunt fringe paired with a high-contrast skin fade that draws all focus upwards.",
      benefits: ["Creates distinct geometric angles", "Slims down full cheeks", "Incredibly popular, low-maintenance look"],
      stylingTips: "Apply a small amount of styling dust or salt spray to damp hair, then scrunch the top for high-textured volume.",
      image: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&q=80&w=400",
      rating: 4.8,
      difficulty: "Easy",
      suitableTextures: ["Straight", "Wavy", "Thick"],
      gender: "Male"
    },
    {
      id: "m_round_crop_burst",
      name: "Textured Crop with Burst Fade",
      category: "Short",
      description: "A choppy top cropped style with a beautiful circular burst fade curving around the ear, adding sharp contrast to a rounded face.",
      benefits: ["Focuses height on the crown", "Cleans up side bulk", "Bold, streetwear-approved style"],
      stylingTips: "Use a dry clay or fiber pomade to pull sections of the top forward while styling.",
      image: "https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&q=80&w=400",
      rating: 4.7,
      difficulty: "Medium",
      suitableTextures: ["Straight", "Wavy", "Curly"],
      gender: "Male"
    },
    {
      id: "m_round_burr_mid_bald",
      name: "Burr Cut with Mid Bald Fade",
      category: "Short",
      description: "A close burr crop that blends into a mid bald fade, shaving off bulk on the sides to visually slim down cheekbones.",
      benefits: ["Provides maximum side contrast", "Highlights jaw definition", "Perfect for busy routines"],
      stylingTips: "Use a premium scalp moisturizer to prevent dryness and maintain a healthy shine.",
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400",
      rating: 4.6,
      difficulty: "Easy",
      suitableTextures: ["Coarse", "Thick", "Straight"],
      gender: "Male"
    },
    {
      id: "m_round_brush_mid",
      name: "Brush Cut with Mid Fade",
      category: "Short",
      description: "A short, structured brush cut standing upright, paired with a neat mid fade that frames the forehead and temples.",
      benefits: ["Visual vertical height", "Keeps hair neat and tidy", "Professional and athletic look"],
      stylingTips: "Blow dry upwards and apply a high-hold wax for a brush-like vertical lock.",
      image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=400",
      rating: 4.7,
      difficulty: "Easy",
      suitableTextures: ["Straight", "Coarse", "Thick"],
      gender: "Male"
    }
  ],
  Square: [
    {
      id: "square_waves",
      name: "Tousled Messy Waves",
      category: "Curly",
      description: "Soft, unstructured medium-length waves with deep feathering to break the rigid jawline structure.",
      benefits: ["Subtly offsets sharp angles", "Creates romantic and soft facial framing", "Ideal for daily casual styling"],
      stylingTips: "Diffuse wet waves with an orchid diffuser attachment on low-heat to avoid frizz and preserve natural wave curls.",
      image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&q=80&w=400",
      rating: 4.9,
      difficulty: "Easy",
      suitableTextures: ["Wavy", "Curly", "Thick"],
      gender: "Female"
    },
    {
      id: "square_bangs",
      name: "Side-Swept Feathered Bangs",
      category: "Fringe",
      description: "A beautiful long-layered cut featuring soft, wispy bangs swept to one side, cutting across the square forehead.",
      benefits: ["Disrupts linear symmetry beautifully", "Directs focus towards the eyes and lips", "Extremely romantic framing"],
      stylingTips: "Use a flat paddle brush to blow dry the bangs in an 'S' shape to add high-gloss sweeping movement.",
      image: "https://images.unsplash.com/photo-1595959183075-c1d0a1653de6?auto=format&fit=crop&q=80&w=400",
      rating: 4.7,
      difficulty: "Medium",
      suitableTextures: ["Straight", "Wavy", "Fine"],
      gender: "Female"
    },
    {
      id: "square_bob",
      name: "Soft Layered Collarbone Bob",
      category: "Classic",
      description: "A texturised bob ending 2 inches below the chin with highly feathered ends that curve inwards toward the neck.",
      benefits: ["Avoids boxed jaw outlines", "Adds lightweight structure and volume", "Sits beautifully on collarbones"],
      stylingTips: "Use texturizing volume spray at the roots and brush up-wards when drying to add modern, light texture.",
      image: "https://images.unsplash.com/photo-1617331140180-e8262094733a?auto=format&fit=crop&q=80&w=400",
      rating: 4.8,
      difficulty: "Easy",
      suitableTextures: ["Straight", "Wavy", "Fine", "Medium"],
      gender: "Female"
    },
    {
      id: "m_square_crew_scissor",
      name: "Crew Cut with Scissor Fade",
      category: "Classic",
      description: "A classic crew cut where the sides are hand-blended with scissors rather than clippers, creating a softer frame around the sharp jawline.",
      benefits: ["Softens square temple corners", "Traditional yet stylish", "Gentle, non-aggressive gradient"],
      stylingTips: "Towel-dry and apply a soft styling cream, brushing it loosely backwards and to the side.",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400",
      rating: 4.8,
      difficulty: "Easy",
      suitableTextures: ["Straight", "Wavy", "Fine", "Medium"],
      gender: "Male"
    },
    {
      id: "m_square_ivy_low",
      name: "Ivy League Cut with Low Taper",
      category: "Classic",
      description: "A longer classic top swept neatly sideways, tapering down very low near the collar and neck to retain weight on the sides.",
      benefits: ["Blends seamlessly with facial symmetry", "Low contrast side silhouette", "Extremely neat professional cut"],
      stylingTips: "Blow dry with a side part and finish with a grooming spray for a natural, clean hold.",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400",
      rating: 4.9,
      difficulty: "Easy",
      suitableTextures: ["Straight", "Wavy", "Medium"],
      gender: "Male"
    },
    {
      id: "m_square_butch_temple",
      name: "Butch Cut with Temple Taper",
      category: "Short",
      description: "A short, uniform butch crop with slight temple fading that rounds out the sharp upper corners of a square forehead.",
      benefits: ["Balances strong jawlines", "Rugged and athletic style", "No morning maintenance needed"],
      stylingTips: "A tiny touch of light pomade on damp hair gives a nice clean sheen.",
      image: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&q=80&w=400",
      rating: 4.6,
      difficulty: "Easy",
      suitableTextures: ["Straight", "Coarse", "Thick"],
      gender: "Male"
    },
    {
      id: "m_square_brush_razor",
      name: "Brush Cut with Razor Edge",
      category: "Short",
      description: "A textured upright crop with sharp razor-edged styling details that add a modern, edgy frame to strong bone structures.",
      benefits: ["Accentuates chiseled jaw features", "Adds contemporary flair", "Tidy profile"],
      stylingTips: "Use a high-hold clay to define the brush lines and keep hair upright.",
      image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=400",
      rating: 4.7,
      difficulty: "Easy",
      suitableTextures: ["Straight", "Thick", "Coarse"],
      gender: "Male"
    },
    {
      id: "m_square_crop_drop",
      name: "Textured Crop with Low Drop Fade",
      category: "Short",
      description: "A choppy top cropped cut that curves low behind the ears, adding roundness to the rear while preserving volume on top.",
      benefits: ["Breaks up boxy facial profiles", "Offers subtle, neat framing", "Very trendy style"],
      stylingTips: "Apply texturizing powder at the roots and pinch the top sections together for high texture.",
      image: "https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&q=80&w=400",
      rating: 4.8,
      difficulty: "Medium",
      suitableTextures: ["Wavy", "Curly", "Thick"],
      gender: "Male"
    }
  ],
  Heart: [
    {
      id: "heart_lob_curls",
      name: "Chin-Flaring Layered Lob",
      category: "Medium",
      description: "A gorgeous lob starting sleek on top and flaring out into rich bouncy curls starting from the ears down to the chin.",
      benefits: ["Creates jawline width to balance forehead", "Accentuates delicate high heart cheekbones", "Breathtakingly elegant style"],
      stylingTips: "Focus volumizing products from the ears downwards and use a 1.5-inch barrel curler on the lower sections only.",
      image: "https://images.unsplash.com/photo-1620331311520-246422fd82f9?auto=format&fit=crop&q=80&w=400",
      rating: 4.9,
      difficulty: "Medium",
      suitableTextures: ["Wavy", "Curly", "Thick"],
      gender: "Female"
    },
    {
      id: "heart_side_bangs",
      name: "Wispy Full Fringe",
      category: "Fringe",
      description: "Soft wispy forehead-grazing fringe paired with long, heavily layered romantic framing locks.",
      benefits: ["Visually minimizes broad heart forehead", "Softens a sharp chin", "Creates a mysterious, romantic aesthetic"],
      stylingTips: "Blow-dry the fringe straight down with a round brush on low speed, and spray a small mist of flexible-hold spray.",
      image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=400",
      rating: 4.8,
      difficulty: "Medium",
      suitableTextures: ["Straight", "Wavy", "Fine", "Medium"],
      gender: "Female"
    },
    {
      id: "heart_pixie",
      name: "Side-Parted Pixie with Fringe",
      category: "Short",
      description: "A pixie cut that keeps the sides sleek and tight while utilizing a long, sweeping, textured fringe across the crown.",
      benefits: ["Highlights a beautiful pointed jawline", "Adds visual symmetry to forehead shape", "Sophisticated and modern look"],
      stylingTips: "Apply high-shine pomade and use a comb to sleek-back the sides, allowing the top fringe to fall naturally forward and across.",
      image: "https://images.unsplash.com/photo-1503104834685-7205e8607eb9?auto=format&fit=crop&q=80&w=400",
      rating: 4.6,
      difficulty: "Medium",
      suitableTextures: ["Straight", "Fine"],
      gender: "Female"
    },
    {
      id: "m_heart_angular_mid",
      name: "Angular Fringe with Mid Skin Fade",
      category: "Fringe",
      description: "An angular, texturized front fringe swept side-ways, paired with a neat mid fade to balance a wider forehead.",
      benefits: ["Masks a wide hairline", "Directs focus to the eyes", "Creates balanced symmetry"],
      stylingTips: "Blow-dry forward with a flat brush and swoop the fringe across. Secure with a light clay.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400",
      rating: 4.9,
      difficulty: "Medium",
      suitableTextures: ["Straight", "Wavy", "Fine"],
      gender: "Male"
    },
    {
      id: "m_heart_french_mid_skin",
      name: "French Crop with Mid Skin Fade",
      category: "Fringe",
      description: "A neat crop with horizontal textured bangs, faded moderately along the sides to blend and minimize forehead width.",
      benefits: ["Saves styling effort", "Frames high cheekbones perfectly", "Extremely neat profile"],
      stylingTips: "Pinch the bangs with styling paste to add structure.",
      image: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&q=80&w=400",
      rating: 4.8,
      difficulty: "Easy",
      suitableTextures: ["Straight", "Wavy", "Medium"],
      gender: "Male"
    },
    {
      id: "m_heart_caesar_taper",
      name: "Caesar Cut with Taper Fade",
      category: "Fringe",
      description: "A short horizontal crop with a clean taper fade that retains weight near the temples, framing wide foreheads softly.",
      benefits: ["Provides clean, compact volume", "Traditional barber design", "Low maintenance"],
      stylingTips: "Blow dry forward with low heat, combing the fringe straight down.",
      image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=400",
      rating: 4.7,
      difficulty: "Easy",
      suitableTextures: ["Straight", "Wavy", "Medium"],
      gender: "Male"
    },
    {
      id: "m_heart_burr_low",
      name: "Burr Cut with Low Taper",
      category: "Short",
      description: "A close, uniform crop that tapers down gently only at the sideburns and neckline, keeping a fuller upper head.",
      benefits: ["Reduces top-heaviness of face shape", "Sleek and clean", "Zero daily hassle"],
      stylingTips: "Apply a drop of tea tree oil to keep the scalp healthy and shiny.",
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400",
      rating: 4.6,
      difficulty: "Easy",
      suitableTextures: ["Coarse", "Thick", "Straight"],
      gender: "Male"
    },
    {
      id: "m_heart_induction_low",
      name: "Induction Cut with Low Skin Fade",
      category: "Short",
      description: "A clean induction buzz cut that transitions into a low skin fade right above the ears, adding subtle structure to a heart chin.",
      benefits: ["Crisp and sharp look", "No product needed", "Extremely low-key styling"],
      stylingTips: "Moisturize your scalp daily to prevent dryness.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
      rating: 4.7,
      difficulty: "Easy",
      suitableTextures: ["Straight", "Wavy", "Coarse"],
      gender: "Male"
    }
  ],
  Diamond: [
    {
      id: "diamond_fringe_shag",
      name: "Wispy Shag with Cheekbone Frame",
      category: "Curly",
      description: "A highly-stylized, layered modern shag with piecey cheekbone-grazing layers and curtain bangs.",
      benefits: ["Softens high, prominent diamond cheekbones", "Balances narrow jawline and forehead", "Rich in vintage editorial aesthetic"],
      stylingTips: "Use a texturizing balm and scrunch heavily from the bottom upwards. Air dry or diffuse on cool mode.",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
      rating: 4.9,
      difficulty: "Medium",
      suitableTextures: ["Wavy", "Curly", "Thick"],
      gender: "Female"
    },
    {
      id: "diamond_lob_side",
      name: "Deep Side-Parted Lob",
      category: "Medium",
      description: "A shoulder-length lob styled with a deep, dramatic side part and sleek, face-framing waves.",
      benefits: ["Creates flattering asymmetric angles", "Draws attention away from severe cheekbone width", "Incredibly classy and polished"],
      stylingTips: "Create a side-part in line with the arch of your eyebrow. Blow dry opposite the parting to create instant root lift.",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400",
      rating: 4.8,
      difficulty: "Easy",
      suitableTextures: ["Straight", "Wavy", "Medium"],
      gender: "Female"
    },
    {
      id: "diamond_pixie",
      name: "Tapered Pixie with Long Top",
      category: "Short",
      description: "A pixie with extremely tight, tapered sides and a long, voluminous textured top that cascades forward.",
      benefits: ["Draws attention upwards to eyes", "Balances high cheekbones elegantly", "Dramatically modern design"],
      stylingTips: "Blow dry the top forwards with a styling cream, using a vent brush to create elegant structured volume.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400",
      rating: 4.7,
      difficulty: "Expert",
      suitableTextures: ["Straight", "Wavy", "Coarse"],
      gender: "Female"
    },
    {
      id: "m_diamond_crop_lineup",
      name: "Textured Crop with Sharp Line-Up",
      category: "Short",
      description: "A heavily textured top crop paired with a sharp forehead line-up, creating a structured top that offsets wide cheekbones.",
      benefits: ["Defines forehead line elegantly", "Brings horizontal focus above the cheekbones", "Contemporary streetwear look"],
      stylingTips: "Sprinkle styling powder and use fingers to messily define the textured top.",
      image: "https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&q=80&w=400",
      rating: 4.9,
      difficulty: "Medium",
      suitableTextures: ["Straight", "Wavy", "Thick"],
      gender: "Male"
    },
    {
      id: "m_diamond_french_drop",
      name: "French Crop with Bald Drop Fade",
      category: "Fringe",
      description: "A dense top crop with a blunt fringe that drops down in a curved fade around the ear, softening angular cheek line structures.",
      benefits: ["Curved lines blend sharp bones", "Rich vertical crown presence", "Highly defined look"],
      stylingTips: "Apply a touch of sea salt spray and air dry for a natural, soft top texture.",
      image: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&q=80&w=400",
      rating: 4.8,
      difficulty: "Easy",
      suitableTextures: ["Straight", "Wavy", "Thick"],
      gender: "Male"
    },
    {
      id: "m_diamond_angular_high",
      name: "Angular Fringe with High Fade",
      category: "Fringe",
      description: "An edgy top-heavy fringe swept sideways, contrasted by high, tight sides to minimize temple bulk.",
      benefits: ["Visually balances high cheekbone lines", "Youthful, expressive design", "Adds rich asymmetry"],
      stylingTips: "Blow-dry upwards with a flat brush, then use molding wax to sweep the top forward and sideways.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400",
      rating: 4.7,
      difficulty: "Medium",
      suitableTextures: ["Straight", "Wavy", "Fine"],
      gender: "Male"
    },
    {
      id: "m_diamond_butch_low",
      name: "Butch Cut with Low Skin Fade",
      category: "Short",
      description: "A masculine butch cut with a very low skin fade, leaving subtle volume around the temples to balance diamond lines.",
      benefits: ["Athletic and rugged look", "Extremely neat profile", "Requires no upkeep"],
      stylingTips: "Keep the low fade tidy by visiting your barber every two weeks.",
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400",
      rating: 4.6,
      difficulty: "Easy",
      suitableTextures: ["Coarse", "Thick", "Straight"],
      gender: "Male"
    },
    {
      id: "m_diamond_brush_low",
      name: "Brush Cut with Low Skin Fade",
      category: "Short",
      description: "An upright styled brush cut blended with a low skin fade to retain texture near the temples, framing a diamond face structure.",
      benefits: ["Provides subtle softness near eyes", "Provides horizontal definition on top", "Neat and clean"],
      stylingTips: "Apply strong wax and comb upwards to keep the brush bristles standing.",
      image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=400",
      rating: 4.7,
      difficulty: "Easy",
      suitableTextures: ["Straight", "Coarse", "Thick"],
      gender: "Male"
    }
  ],
  Oblong: [
    {
      id: "oblong_full_waves",
      name: "Bouncy Voluminous Waves",
      category: "Curly",
      description: "Wide, bouncy spiral waves starting high up near the eyes to add horizontal width to a narrow oblong profile.",
      benefits: ["Visually widens narrow face shapes", "Provides romantic, luxury styling depth", "Superb movement and bounce"],
      stylingTips: "Use a 1-inch curling iron, wrapping horizontal sections. Pin the curls to cool, then brush out for vintage Hollywood waves.",
      image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=400",
      rating: 4.9,
      difficulty: "Expert",
      suitableTextures: ["Wavy", "Thick", "Coarse"],
      gender: "Female"
    },
    {
      id: "oblong_straight_bangs",
      name: "Heavy Straight-Across Bangs",
      category: "Fringe",
      description: "Thick, glossy bangs cut straight across the eyebrow line, paired with long or medium sleek cascading length.",
      benefits: ["Slashes the vertical length in half", "Highlights eyes and creates beautiful symmetry", "Bold fashion statement"],
      stylingTips: "Blow dry the bangs instantly after washing. Use a fine-tooth comb to ensure they dry perfectly flat with zero split.",
      image: "https://images.unsplash.com/photo-1595959183075-c1d0a1653de6?auto=format&fit=crop&q=80&w=400",
      rating: 4.8,
      difficulty: "Medium",
      suitableTextures: ["Straight", "Thick", "Medium"],
      gender: "Female"
    },
    {
      id: "oblong_shag",
      name: "Wide Retro Shaggy Lob",
      category: "Medium",
      description: "A wide shag with extreme texturing on the sides, creating a highly balanced, airy horizontal wing silhouette.",
      benefits: ["Perfectly offsets oblong profiles", "Extremely comfortable and easy to wear", "High texture hiding fine strands"],
      stylingTips: "Apply texturizing salt spray at the sides, scrunching horizontally, then use a styling powder to create airy width.",
      image: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&q=80&w=400",
      rating: 4.7,
      difficulty: "Easy",
      suitableTextures: ["Wavy", "Fine", "Medium"],
      gender: "Female"
    },
    {
      id: "m_oblong_ivy_taper",
      name: "Ivy League Cut with Low Taper",
      category: "Classic",
      description: "A neat classic sweep cut that tapers gently only at the very bottom, retaining side width to balance vertical facial length.",
      benefits: ["Adds horizontal width visually", "Highly respectable cut", "Super clean outline"],
      stylingTips: "Comb the hair flat to the side rather than sweeping it up to keep height minimal.",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400",
      rating: 4.9,
      difficulty: "Easy",
      suitableTextures: ["Straight", "Wavy", "Medium"],
      gender: "Male"
    },
    {
      id: "m_oblong_caesar_drop",
      name: "Caesar Cut with Drop Fade",
      category: "Fringe",
      description: "A compact horizontal crop with short bangs that visually 'cut' the high forehead, finished with a beautiful drop fade.",
      benefits: ["Effectively shortens face profile", "Highlights the eye line", "Extremely neat and professional"],
      stylingTips: "Apply a tiny bit of cream pomade and brush the fringe straight down over the forehead.",
      image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=400",
      rating: 4.8,
      difficulty: "Easy",
      suitableTextures: ["Straight", "Wavy", "Medium"],
      gender: "Male"
    },
    {
      id: "m_oblong_burr_high",
      name: "Burr Cut with High Skin Fade",
      category: "Short",
      description: "A tidy close burr crop that blends cleanly into a high skin fade, keeping the top extremely low and flat.",
      benefits: ["Avoids any vertical volume on top", "Crisp, neat outline", "Completely maintenance-free"],
      stylingTips: "Use a small towel-dry and enjoy your instant style.",
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400",
      rating: 4.7,
      difficulty: "Easy",
      suitableTextures: ["Coarse", "Thick", "Straight"],
      gender: "Male"
    },
    {
      id: "m_oblong_butch_high",
      name: "Butch Cut with High Fade",
      category: "Short",
      description: "A uniform butch buzz cut paired with a high bald fade, maintaining a flat top profile that doesn't exaggerate length.",
      benefits: ["Stops face from looking elongated", "Aggressive, masculine design", "Zero morning styling needed"],
      stylingTips: "Visit your barber every two weeks to keep the high fade crisp.",
      image: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&q=80&w=400",
      rating: 4.8,
      difficulty: "Easy",
      suitableTextures: ["Straight", "Wavy", "Coarse"],
      gender: "Male"
    },
    {
      id: "m_oblong_brush_mid",
      name: "Brush Cut with Mid Fade",
      category: "Short",
      description: "A neat upright crop kept short and compact on top, blended into a tidy mid fade that aligns with the cheekbone lines.",
      benefits: ["Provides clean, compact structure", "Does not drag facial lines down", "Athletic and versatile"],
      stylingTips: "Rub a tiny pea-sized wax between fingers and pat the top down slightly so it sits compact.",
      image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=400",
      rating: 4.6,
      difficulty: "Easy",
      suitableTextures: ["Straight", "Thick", "Coarse"],
      gender: "Male"
    }
  ],
  Pear: [
    {
      id: "pear_pixie_crown",
      name: "Voluminous Textured Pixie",
      category: "Short",
      description: "A short tapered pixie with significant tousled volume and structure built directly on the top crown and temples.",
      benefits: ["Balances narrow temples and forehead", "Brings attention upwards away from heavy jawline", "Fierce, striking, and modern"],
      stylingTips: "Use a heavy volumizing clay. Blow dry upside down to generate massive root lift, then piece out with clay.",
      image: "https://images.unsplash.com/photo-1503104834685-7205e8607eb9?auto=format&fit=crop&q=80&w=400",
      rating: 4.9,
      difficulty: "Expert",
      suitableTextures: ["Straight", "Wavy", "Coarse"],
      gender: "Female"
    },
    {
      id: "pear_curtain_shag",
      name: "Temple-Volumizing Shag",
      category: "Medium",
      description: "A layered mid-length shaggy cut featuring curtain bangs that flare outwards precisely at the temples.",
      benefits: ["Adds critical volume at the upper head", "Frames and softens a wide jaw structure", "Effortlessly casual and modern"],
      stylingTips: "Apply root-lifting mousse to wet hair. Blow dry the temple areas with a round brush directing hair out and back.",
      image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=400",
      rating: 4.8,
      difficulty: "Medium",
      suitableTextures: ["Wavy", "Curly", "Thick"],
      gender: "Female"
    },
    {
      id: "pear_long_curls",
      name: "Long Layers with Crown Volume",
      category: "Long",
      description: "Long layers with deep texturing starting at the temples, providing an airy crown and soft face framing.",
      benefits: ["Draws eye line up to temples", "Softens and frames triangular profiles", "Luxurious, flowing look"],
      stylingTips: "Use large velcro rollers on the crown section while cooling to ensure high crown bounce that balances the jawline.",
      image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=400",
      rating: 4.7,
      difficulty: "Medium",
      suitableTextures: ["Wavy", "Thick"],
      gender: "Female"
    },
    {
      id: "m_pear_brush_razor",
      name: "Brush Cut with Razor Edge",
      category: "Short",
      description: "A structured upright styled brush cut with sharp razor-edged temple definition, visually widening the narrow upper skull.",
      benefits: ["Directs focus upwards", "Balances a wider jawline structure", "Very neat and sharp appearance"],
      stylingTips: "Apply clay and style vertically, combing outwards at the sides of the forehead.",
      image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=400",
      rating: 4.8,
      difficulty: "Easy",
      suitableTextures: ["Straight", "Coarse", "Thick"],
      gender: "Male"
    },
    {
      id: "m_pear_crop_burst",
      name: "Textured Crop with Burst Fade",
      category: "Short",
      description: "A voluminous choppy crop where the circular burst fade keeps the temple areas looking textured and full, offsetting wide jaw lines.",
      benefits: ["Brings high volume to the temples", "Disrupts triangular shape", "Trendy and eye-catching"],
      stylingTips: "Blow dry upwards at the temples and use texturizing spray for maximum lift.",
      image: "https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&q=80&w=400",
      rating: 4.9,
      difficulty: "Medium",
      suitableTextures: ["Straight", "Wavy", "Thick"],
      gender: "Male"
    },
    {
      id: "m_pear_caesar_temple",
      name: "Caesar Cut with Temple Fade",
      category: "Fringe",
      description: "A classic horizontal crop that retains some weight above the temples, faded nicely around the ears to balance triangular faces.",
      benefits: ["Brings horizontal symmetry above the jaw", "Super structured", "Low styling effort"],
      stylingTips: "Apply styling fiber and brush forward and outward at the temples.",
      image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=400",
      rating: 4.7,
      difficulty: "Easy",
      suitableTextures: ["Straight", "Wavy", "Medium"],
      gender: "Male"
    },
    {
      id: "m_pear_ivy_high",
      name: "Ivy League Cut with High Taper",
      category: "Classic",
      description: "A neat Ivy League haircut swept diagonally, tapering high up near the temple to emphasize upper crown volume.",
      benefits: ["Adds elegant vertical-diagonal lines", "Lifts the profile visually", "Extremely neat professional cut"],
      stylingTips: "Blow dry diagonal-forward with a high-hold clay to keep the crown lift all day.",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400",
      rating: 4.8,
      difficulty: "Easy",
      suitableTextures: ["Straight", "Wavy", "Medium"],
      gender: "Male"
    },
    {
      id: "m_pear_induction_high_bald",
      name: "Induction Cut with High Bald Fade",
      category: "Short",
      description: "A clean, high-fade induction buzz cut that shaves side bulk completely, emphasizing a strong jawline with minimalist top coverage.",
      benefits: ["Sleek and low-friction", "No styling needed", "Modern masculine look"],
      stylingTips: "Use a premium skin hydration oil on your fade after daily shaving.",
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400",
      rating: 4.6,
      difficulty: "Easy",
      suitableTextures: ["Straight", "Coarse", "Thick"],
      gender: "Male"
    }
  ]
};
const MOCK_SALONS = [
  {
    id: "salon_luxe",
    name: "Aura Luxe Hair Lounge",
    address: "742 Elite Boulevard, Metro District",
    distance: "0.8 miles",
    rating: 4.9,
    reviews: 324,
    priceLevel: "$$$",
    phone: "+1 (555) 345-7890",
    hours: "9:00 AM - 8:00 PM",
    specialties: ["Face-Shape Bespoke Cuts", "Balayage & Coloring", "Keratin Therapy"],
    services: [
      { name: "Signature Hairloon Analysis & Bespoke Cut", price: 120, duration: "75 min" },
      { name: "Full Balayage & Blow-Dry", price: 240, duration: "150 min" },
      { name: "Olaplex Revitalising Therapy", price: 85, duration: "45 min" },
      { name: "Premium Blow-Out & Styling", price: 65, duration: "45 min" }
    ],
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "salon_vintage",
    name: "Metropolitan Grooming & Co.",
    address: "128 Heritage Street, Old Town",
    distance: "1.4 miles",
    rating: 4.8,
    reviews: 189,
    priceLevel: "$$",
    phone: "+1 (555) 987-6543",
    hours: "8:00 AM - 7:00 PM",
    specialties: ["Textured Shags & Retro Cuts", "Beard Sculpting", "Classic Barber Cuts"],
    services: [
      { name: "Retro Shag / Pixie Razor Cut", price: 95, duration: "60 min" },
      { name: "Men's Luxury Sculpt & Beard Grooming", price: 65, duration: "45 min" },
      { name: "Head Massage & Hot Towel Treatment", price: 40, duration: "30 min" },
      { name: "Full Head Custom Color Tinting", price: 150, duration: "120 min" }
    ],
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "salon_boho",
    name: "Botanical Hair Garden",
    address: "44 Green Willow Lane, Eco District",
    distance: "2.3 miles",
    rating: 4.7,
    reviews: 142,
    priceLevel: "$$",
    phone: "+1 (555) 432-1098",
    hours: "10:00 AM - 6:00 PM",
    specialties: ["Organic Hair Care", "Curls & Natural Textures", "Herbaceous Treatments"],
    services: [
      { name: "Organic Custom Shape Trim & Hydrate", price: 85, duration: "60 min" },
      { name: "Botanical Scalp Detox Treatment", price: 75, duration: "45 min" },
      { name: "Natural Curl Defining & Diffuse Style", price: 70, duration: "50 min" },
      { name: "Plant-Based Semi-Permanent Dye", price: 110, duration: "90 min" }
    ],
    image: "https://images.unsplash.com/photo-1633681926035-ec1ac984418a?auto=format&fit=crop&q=80&w=600"
  }
];
const MOCK_STYLISTS = [
  "Master Stylist Genevieve",
  "Senior Creator Antoine",
  "Director Evelyn",
  "Stylist & Barber Marcus"
];
const STYLISTS_DB = [
  // salon_luxe
  {
    id: "stylist_genevieve",
    salonId: "salon_luxe",
    name: "Master Stylist Genevieve",
    rating: 4.9,
    reviewsCount: 124,
    experience: "12 years",
    specialties: ["Precision Cuts", "French Balayage", "Pixie Haircuts"],
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300",
    recentReview: {
      author: "Charlotte M.",
      rating: 5,
      text: "Genevieve is an absolute artist! She gave me the most magnificent French Balayage and customized a sharp Pixie cut that fits my cheekbones perfectly. Exceptionally talented!"
    }
  },
  {
    id: "stylist_antoine",
    salonId: "salon_luxe",
    name: "Senior Creator Antoine",
    rating: 4.8,
    reviewsCount: 98,
    experience: "8 years",
    specialties: ["Geometric Cuts", "High-Contrast Color", "Textured Shags"],
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300",
    recentReview: {
      author: "Julien R.",
      rating: 5,
      text: "Antoine is amazing. He knows facial geometry like nobody else. His shaggy layers are effortlessly cool, and the high-contrast highlights are incredible."
    }
  },
  {
    id: "stylist_evelyn",
    salonId: "salon_luxe",
    name: "Director Evelyn",
    rating: 5,
    reviewsCount: 145,
    experience: "15 years",
    specialties: ["Bridal Styling", "Silk Presses", "Voluminous Blowouts"],
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300",
    recentReview: {
      author: "Sophia L.",
      rating: 5,
      text: "Evelyn's signature blowout gave me massive volume that lasted four full days! She has an exquisite touch, truly deserving of her director title."
    }
  },
  // salon_vintage
  {
    id: "stylist_marcus",
    salonId: "salon_vintage",
    name: "Senior Barber Marcus",
    rating: 4.8,
    reviewsCount: 85,
    experience: "7 years",
    specialties: ["Fades & Tapers", "Straight Razor Shaves", "Beard Grooming"],
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300",
    recentReview: {
      author: "Arthur K.",
      rating: 5,
      text: "Best taper shave in town! Marcus takes his time and uses traditional hot towels. A genuinely premium barbershop experience."
    }
  },
  {
    id: "stylist_clara",
    salonId: "salon_vintage",
    name: "Classic Stylist Clara",
    rating: 4.7,
    reviewsCount: 62,
    experience: "5 years",
    specialties: ["Retro Pompadours", "Traditional Shaves", "Classic Mullets"],
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
    recentReview: {
      author: "Miles D.",
      rating: 4,
      text: "Clara did a phenomenal retro pompadour. Highly skilled with classical shear-work, and very friendly!"
    }
  },
  // salon_boho
  {
    id: "stylist_chloe",
    salonId: "salon_boho",
    name: "Organic Guru Chloe",
    rating: 4.9,
    reviewsCount: 110,
    experience: "10 years",
    specialties: ["Organic Treatments", "DevaCurl Cuts", "Hand-Painted Highlights"],
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300",
    recentReview: {
      author: "Elena P.",
      rating: 5,
      text: "Chloe revived my natural curls! She uses botanical products that smell heavenly and did a spectacular DevaCurl shape cut that brought my pattern to life."
    }
  },
  {
    id: "stylist_liam",
    salonId: "salon_boho",
    name: "Texturist Liam",
    rating: 4.6,
    reviewsCount: 75,
    experience: "6 years",
    specialties: ["Curly Shags", "Botanical Scalp Detox", "Coily Styling"],
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300",
    recentReview: {
      author: "Tariq S.",
      rating: 5,
      text: "Liam is an absolute expert in coily textures. My hair has never felt healthier or more structured after his customized botanical scalp detox."
    }
  }
];
const HISTORICAL_TRENDS_DATA = [
  {
    id: "trend_wolf_cut",
    name: "The Shaggy Wolf Cut",
    platform: "TikTok",
    popularityScore: 98,
    growthRate: "+210% search volume",
    description: "A wild, heavily-layered hybrid of the classic shag and retro mullet. Employs a voluminous top crown transitioning to ultra-wispy lengths.",
    faceShapes: ["Oval", "Round", "Square", "Heart", "Diamond"],
    keyAesthetic: "Grungy rockstar rebel. Excellent for low-maintenance, messy, effortless styling."
  },
  {
    id: "trend_birkin_bangs",
    name: "Birkin Bangs",
    platform: "Instagram",
    popularityScore: 95,
    growthRate: "+140% post tags",
    description: "Wispy, soft, eyelash-grazing French girl fringe paired with delicate cascading long layers. Highly breezy and chic.",
    faceShapes: ["Oval", "Oblong", "Heart", "Pear"],
    keyAesthetic: "Parisian model nonchalance. Ideal for shortening high foreheads and adding soft elegance."
  },
  {
    id: "trend_barbie_bob",
    name: "90s Barbie Blonde Bob",
    platform: "Pinterest",
    popularityScore: 92,
    growthRate: "+85% pin boards",
    description: "A bright, high-impact blonde blunt bob cut precisely at chin level. Highly structured, polished, with inward-curling ends.",
    faceShapes: ["Oval", "Heart", "Diamond", "Square"],
    keyAesthetic: "High-glamour retro-chic. Promotes sharp symmetry and high gloss."
  },
  {
    id: "trend_butterfly_cut",
    name: "Cascading Butterfly Layers",
    platform: "TikTok",
    popularityScore: 99,
    growthRate: "+320% video creation",
    description: "Multi-layered blowout cut combining short, jaw-framing layers with long, cascading lengths. Visually mimics a bouncy faux-bob in front.",
    faceShapes: ["Round", "Square", "Oval", "Oblong"],
    keyAesthetic: "Maximum luxury volume. Recreates high-glam 90s superslayer bounciness."
  },
  {
    id: "trend_glass_lob",
    name: "High-Gloss Glass Lob",
    platform: "Instagram",
    popularityScore: 94,
    growthRate: "+115% saves",
    description: "An ultra-straight long bob trimmed with razor-sharp precision, ironed completely flat, and styled with high-sheen serums.",
    faceShapes: ["Round", "Oval", "Square", "Heart"],
    keyAesthetic: "Clean-girl luxury minimalism. Demands absolute straight texture and reflective luster."
  }
];
export {
  FACE_SHAPES_INFO,
  HAIRSTYLES_DB,
  HISTORICAL_TRENDS_DATA,
  MOCK_SALONS,
  MOCK_STYLISTS,
  STYLISTS_DB
};
