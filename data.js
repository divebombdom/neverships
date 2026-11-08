// All brands and products are fictional. Nothing here exists, which is the point.
window.CATEGORIES = [
  { id: "all", name: "Everything", icon: "layout-grid" },
  { id: "phones", name: "Phones", icon: "smartphone" },
  { id: "laptops", name: "Laptops", icon: "laptop" },
  { id: "pc", name: "PC Parts", icon: "cpu" },
  { id: "audio", name: "Audio", icon: "headphones" },
  { id: "wearables", name: "Wearables", icon: "watch" },
  { id: "gaming", name: "Gaming", icon: "gamepad-2" },
  { id: "home", name: "Smart Home", icon: "house" },
  { id: "camera", name: "Cameras", icon: "camera" },
  { id: "weird", name: "Questionable", icon: "flask-conical" }
];

const STORAGE = { name: "Storage", choices: [["128 GB", 0], ["512 GB", 200], ["2 TB", 600], ["Infinite", 9999]] };
const COLOR = (list) => ({ name: "Color", choices: list.map((c) => [c, 0]) });
const RAM = { name: "Memory", choices: [["16 GB", 0], ["32 GB", 300], ["128 GB", 1100], ["Yes", 4000]] };

window.PRODUCTS = [
  // Phones
  { id: "p1", cat: "phones", icon: "smartphone", brand: "Orchard", name: "oPhone 19 Pro Max Ultra Plus", price: 1599, rating: 4.9, reviews: 18233, blurb: "Seven cameras. Zero arrivals. Now with a titanium-adjacent frame.", options: [STORAGE, COLOR(["Desert Mirage", "Space Never", "Lost-in-Transit Blue"])] },
  { id: "p2", cat: "phones", icon: "smartphone", brand: "Galaxion", name: "Fold Fold Fold 4", price: 2199, rating: 4.6, reviews: 9021, blurb: "Folds three times, like your hopes of receiving it.", options: [STORAGE, COLOR(["Phantom Ink", "Ghost Silver"])] },
  { id: "p3", cat: "phones", icon: "smartphone", brand: "Pixelate", name: "Pixelate 12a", price: 499, rating: 4.4, reviews: 4410, blurb: "AI erases photobombers. Also erases tracking updates.", options: [STORAGE, COLOR(["Obsidian", "Porcelain", "Hazel"])] },
  { id: "p4", cat: "phones", icon: "phone", brand: "Retrotel", name: "Brick Phone Mini (flip edition)", price: 89, rating: 4.8, reviews: 702, blurb: "Battery lasts 3 weeks. Shipping lasts forever.", options: [COLOR(["Charcoal", "Nostalgia Pink"])] },

  // Laptops
  { id: "l1", cat: "laptops", icon: "laptop", brand: "Orchard", name: "OrchardBook Pro 18\"", price: 3499, rating: 4.9, reviews: 12002, blurb: "M7 Max chip. Renders 8K video and imaginary shipping labels.", options: [RAM, STORAGE] },
  { id: "l2", cat: "laptops", icon: "laptop", brand: "Thinkster", name: "ThinkTank X1 Carbon-ish", price: 1899, rating: 4.7, reviews: 3311, blurb: "The red nub is still there. The laptop is not.", options: [RAM] },
  { id: "l3", cat: "laptops", icon: "laptop-minimal", brand: "Razr-ish", name: "Bladeish 16 Gaming", price: 2999, rating: 4.5, reviews: 2184, blurb: "RGB keyboard visible from space. Package visible from nowhere.", options: [RAM, COLOR(["Black", "Mercury"])] },
  { id: "l4", cat: "laptops", icon: "tablet", brand: "Orchard", name: "oPad Air Thin", price: 799, rating: 4.8, reviews: 8320, blurb: "So thin it slipped through the mail slot of reality.", options: [STORAGE, COLOR(["Starlight", "Purple-ish", "Blue-ish"])] },

  // PC Parts
  { id: "c1", cat: "pc", icon: "microchip", brand: "Nvidiot", name: "RTX 9090 Ti Super Duper", price: 2499, rating: 5.0, reviews: 44120, blurb: "In stock! (It is not in stock. It never was. Nobody has one.)", options: [{ name: "Edition", choices: [["Founders", 0], ["OC", 150], ["Space Heater", 400]] }] },
  { id: "c2", cat: "pc", icon: "cpu", brand: "AMV", name: "Ryzenator 9 9950X3D3", price: 699, rating: 4.9, reviews: 6020, blurb: "Three layers of cache. Zero layers of delivery.", options: [] },
  { id: "c3", cat: "pc", icon: "memory-stick", brand: "Corsaire", name: "Vengeful RGB DDR6 64GB", price: 329, rating: 4.7, reviews: 1983, blurb: "Faster than light. Slower than your order.", options: [{ name: "Speed", choices: [["8000 MT/s", 0], ["12000 MT/s", 120]] }] },
  { id: "c4", cat: "pc", icon: "hard-drive", brand: "Samsing", name: "990 Pro Max NVMe 8TB", price: 649, rating: 4.8, reviews: 3870, blurb: "Stores 2 million photos of the empty porch.", options: [] },
  { id: "c5", cat: "pc", icon: "fan", brand: "Noctuish", name: "Beige-Brown Silent Fan 3-Pack", price: 89, rating: 4.9, reviews: 12880, blurb: "Whisper quiet. Just like the delivery driver.", options: [] },

  // Audio
  { id: "a1", cat: "audio", icon: "headphones", brand: "Bosé", name: "QuietComfort Ultra Never", price: 429, rating: 4.7, reviews: 15433, blurb: "Noise cancelling so good you won't hear the doorbell that never rings.", options: [COLOR(["Black", "Sandstone", "Lunar"])] },
  { id: "a2", cat: "audio", icon: "headset", brand: "Orchard", name: "oPods Pro 4", price: 249, rating: 4.6, reviews: 30210, blurb: "Lose one earbud before it even arrives.", options: [] },
  { id: "a3", cat: "audio", icon: "speaker", brand: "Sonosish", name: "Era 900 Surround Bundle", price: 1299, rating: 4.5, reviews: 2290, blurb: "Spatial audio. Spatial shipping (it's somewhere in space).", options: [] },
  { id: "a4", cat: "audio", icon: "disc-3", brand: "Audiophool", name: "Gold-Plated Ethernet Cable (Audiophile Grade)", price: 1499, rating: 3.1, reviews: 88, blurb: "Makes your MP3s sound warmer. Allegedly.", options: [{ name: "Length", choices: [["1 m", 0], ["3 m", 800], ["Spiritual", 5000]] }] },

  // Wearables
  { id: "w1", cat: "wearables", icon: "watch", brand: "Orchard", name: "oWatch Ultra 4", price: 799, rating: 4.8, reviews: 9930, blurb: "Tracks your steps to the mailbox. Again. And again.", options: [{ name: "Band", choices: [["Trail Loop", 0], ["Titanium Milanese", 199]] }] },
  { id: "w2", cat: "wearables", icon: "glasses", brand: "Meta-ish", name: "Ray-Bam Smart Glasses Gen 4", price: 379, rating: 4.2, reviews: 2110, blurb: "Record your face when the package doesn't come.", options: [COLOR(["Matte Black", "Tortoise"])] },
  { id: "w3", cat: "wearables", icon: "circle-dot", brand: "Ouro", name: "Ouro Ring Gen 5", price: 349, rating: 4.4, reviews: 4400, blurb: "Measures your resting heart rate and your anxious refreshing rate.", options: [{ name: "Size", choices: [["6", 0], ["8", 0], ["10", 0], ["12", 0]] }] },
  { id: "w4", cat: "wearables", icon: "scan-face", brand: "Orchard", name: "Vision Pro Max (Head Optional)", price: 3499, rating: 4.0, reviews: 610, blurb: "See your delivery in mixed reality. That's the only reality it's in.", options: [] },

  // Gaming
  { id: "g1", cat: "gaming", icon: "gamepad-2", brand: "Sonyish", name: "PlayStatic 6 Pro", price: 699, rating: 4.9, reviews: 51200, blurb: "8K at 240fps. 0K at your door.", options: [{ name: "Bundle", choices: [["Console only", 0], ["+ 2 controllers", 80], ["+ the game you wanted", 70]] }] },
  { id: "g2", cat: "gaming", icon: "joystick", brand: "Nintendough", name: "Switcheroo 2 OLED", price: 449, rating: 4.9, reviews: 38001, blurb: "Switch between excitement and disappointment.", options: [COLOR(["Neon", "Grey"])] },
  { id: "g3", cat: "gaming", icon: "box", brand: "Microsofty", name: "Xbax Series Z", price: 599, rating: 4.6, reviews: 22340, blurb: "It's a box. You will never receive the box.", options: [] },
  { id: "g4", cat: "gaming", icon: "keyboard", brand: "Keychronic", name: "Mechanical Keyboard (Thocc Edition)", price: 219, rating: 4.8, reviews: 6655, blurb: "Hand-lubed switches. Hand-delayed shipping.", options: [{ name: "Switches", choices: [["Linear", 0], ["Tactile", 0], ["Clicky (sorry roommates)", 0]] }] },
  { id: "g5", cat: "gaming", icon: "mouse", brand: "Logitek", name: "G Pro Superlight 5", price: 169, rating: 4.7, reviews: 10023, blurb: "Weighs 38 grams. Package weighs 0.", options: [COLOR(["Black", "White", "Magenta"])] },

  // Smart Home
  { id: "h1", cat: "home", icon: "tv", brand: "LGee", name: "OLED 97\" Evo Wallpaper TV", price: 24999, rating: 4.9, reviews: 410, blurb: "Hangs flat on the wall. Ships flat out never.", options: [] },
  { id: "h2", cat: "home", icon: "bot", brand: "Roomboo", name: "Robot Vacuum + Mop + Opinions", price: 1099, rating: 4.3, reviews: 7120, blurb: "Maps your entire house. Still can't find your package.", options: [] },
  { id: "h3", cat: "home", icon: "bell-ring", brand: "Rang", name: "Video Doorbell Pro 3", price: 249, rating: 4.4, reviews: 19820, blurb: "Ironically, records the delivery that never happens.", options: [] },
  { id: "h4", cat: "home", icon: "lightbulb", brand: "Hue-ish", name: "Smart Bulb Starter Kit", price: 199, rating: 4.6, reviews: 8800, blurb: "16 million colors. 0 tracking numbers that work.", options: [] },
  { id: "h5", cat: "home", icon: "router", brand: "Eeroh", name: "Mesh Wi-Fi 8 (3-Pack)", price: 699, rating: 4.5, reviews: 3020, blurb: "Coverage everywhere except your doorstep.", options: [] },

  // Camera
  { id: "k1", cat: "camera", icon: "camera", brand: "Sonyish", name: "Alpha 1 III Mirrorless", price: 6499, rating: 4.9, reviews: 920, blurb: "Captures 120fps. Package captured by nobody.", options: [{ name: "Kit", choices: [["Body only", 0], ["+ 24-70mm f/2.8", 2100]] }] },
  { id: "k2", cat: "camera", icon: "video", brand: "GoFar", name: "GoFar Hero 14 Black", price: 399, rating: 4.6, reviews: 11300, blurb: "Waterproof to 33 feet. Delivery-proof to infinity.", options: [] },
  { id: "k3", cat: "camera", icon: "plane", brand: "DJ-Eye", name: "Mavic 5 Pro Drone", price: 2199, rating: 4.8, reviews: 4501, blurb: "Can fly 30 km. Still can't reach your house.", options: [] },

  // Questionable
  { id: "q1", cat: "weird", icon: "usb", brand: "SketchyCo", name: "USB-C to USB-C to USB-C Cable", price: 49, rating: 2.9, reviews: 77, blurb: "Both ends are the same. So is the middle.", options: [] },
  { id: "q2", cat: "weird", icon: "battery-charging", brand: "Ankor", name: "Power Bank 900,000 mAh", price: 79, rating: 3.6, reviews: 991, blurb: "Charges your phone 400 times. Not TSA approved. Not real.", options: [] },
  { id: "q3", cat: "weird", icon: "zap", brand: "Vaporware Labs", name: "Download More RAM (Physical Edition)", price: 19, rating: 5.0, reviews: 1, blurb: "Plug it in. Feel faster. Results not guaranteed or possible.", options: [{ name: "Amount", choices: [["8 GB", 0], ["1 TB", 10], ["All of it", 99]] }] },
  { id: "q4", cat: "weird", icon: "wifi", brand: "Vaporware Labs", name: "Wireless Wi-Fi Extender Cable", price: 39, rating: 1.8, reviews: 412, blurb: "Wired wireless. Wirelessly not delivered.", options: [] },
  { id: "q5", cat: "weird", icon: "cloud", brand: "Vaporware Labs", name: "A Literal Cloud (Storage)", price: 999, rating: 4.1, reviews: 22, blurb: "Hand-harvested cumulus. May rain on your files.", options: [{ name: "Type", choices: [["Cumulus", 0], ["Stratus", 0], ["Thunderhead", 300]] }] }
];

window.DRIVERS = [
  { name: "Gary", vehicle: "a drone with one working propeller", avatar: "plane" },
  { name: "Unit 7", vehicle: "a delivery robot that fears curbs", avatar: "bot" },
  { name: "Brenda", vehicle: "a cargo e-bike at 4% battery", avatar: "bike" },
  { name: "Steve", vehicle: "a van that is mostly vibes", avatar: "truck" },
  { name: "Captain Lag", vehicle: "a satellite with 900ms ping", avatar: "satellite" }
];

window.TRACK_STEPS = [
  { t: "Order confirmed", d: "Payment of $0.00 captured successfully. Our accountants are thrilled." },
  { t: "Packed with care", d: "Bubble wrap applied. Item not applied." },
  { t: "Left the warehouse", d: "The warehouse is also imaginary, so this was easy." },
  { t: "In transit", d: "Your package is between here and there. Mostly there. Possibly nowhere." },
  { t: "Out for delivery", d: "The driver is approaching. Keep the door open. Not literally." },
  { t: "Delivered", d: "Left at front door. Please check your front door." }
];
