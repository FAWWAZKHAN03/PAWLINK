// PawLink Premium Mock Database & Core Constants

export const COLOR_PALETTE = {
  primary: "#14532D",   // Deep Forest Green
  secondary: "#16A34A", // Rich Green
  accent: "#22C55E",    // Vibrant Emerald
  background: "#F8FAFC",// Ice Blue/Slate Off-white
  card: "#FFFFFF",      // Pure White
  dark: "#0F172A",      // Dark Slate
  text: "#111827",      // Dark Charcoal
  muted: "#6B7280",     // Cool Gray
  danger: "#DC2626",    // Deep Red
  warning: "#F59E0B"    // Warm Amber
};

export const MOCK_PETS = [
  {
    id: "pet-1",
    name: "Milo",
    type: "dog",
    breed: "Golden Retriever",
    age: "2 years",
    gender: "Male",
    size: "Large",
    image: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=600",
    status: "Available",
    character: ["Playful", "Gentle", "Kid-friendly", "House-trained"],
    story: "Milo is a energetic golden ball of love. He was found wandering near a park, very friendly but without a microchip. He loves playing fetch, swimming, and is incredibly social with kids and other dogs.",
    medicalHistory: {
      vaccinated: "Yes",
      neutered: "Yes",
      dewormed: "Yes",
      lastCheckup: "2026-06-15"
    }
  },
  {
    id: "pet-2",
    name: "Luna",
    type: "cat",
    breed: "British Shorthair",
    age: "1 year",
    gender: "Female",
    size: "Medium",
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=600",
    status: "Available",
    character: ["Calm", "Independent", "Affectionate", "Lap Cat"],
    story: "Luna was rescued from a high-rise balcony where she had been abandoned. She is quiet, majestic, and enjoys watching birds from the window. She is extremely loving once she warms up to you.",
    medicalHistory: {
      vaccinated: "Yes",
      neutered: "Yes",
      dewormed: "Yes",
      lastCheckup: "2026-05-20"
    }
  },
  {
    id: "pet-3",
    name: "Rocky",
    type: "dog",
    breed: "Siberian Husky",
    age: "3 years",
    gender: "Male",
    size: "Large",
    image: "https://images.unsplash.com/photo-1531804055935-76f44d7c3621?auto=format&fit=crop&q=80&w=600",
    status: "Saved",
    character: ["Vocal", "High Energy", "Adventurous", "Extremely Smart"],
    story: "Rocky is a stunning Husky who needs an active household. He was rescued from a cold shelter in the north. He knows how to open doors, sing when happy, and requires daily running sessions.",
    medicalHistory: {
      vaccinated: "Yes",
      neutered: "Yes",
      dewormed: "Yes",
      lastCheckup: "2026-06-01"
    }
  },
  {
    id: "pet-4",
    name: "Bella",
    type: "dog",
    breed: "Pembroke Welsh Corgi",
    age: "6 months",
    gender: "Female",
    size: "Small",
    image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=600",
    status: "Available",
    character: ["Goofy", "Highly Active", "Cuddly", "Quick Learner"],
    story: "Bella is a young corgi puppy surrendered by an owner who couldn't keep up with her puppy training. She is fast, loves squeaky toys, and falls asleep in hilarious upside-down positions.",
    medicalHistory: {
      vaccinated: "First Dose Done",
      neutered: "No (Scheduled)",
      dewormed: "Yes",
      lastCheckup: "2026-06-28"
    }
  },
  {
    id: "pet-5",
    name: "Oliver",
    type: "cat",
    breed: "Siam Mix",
    age: "4 years",
    gender: "Male",
    size: "Medium",
    image: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&q=80&w=600",
    status: "Pending",
    character: ["Highly Vocal", "Social", "Inquisitive", "Companion"],
    story: "Oliver was rescued during a winter blizzard. He was hypothermic but made a full recovery. He acts more like a dog than a cat; he follows you everywhere and chats with everyone.",
    medicalHistory: {
      vaccinated: "Yes",
      neutered: "Yes",
      dewormed: "Yes",
      lastCheckup: "2026-04-10"
    }
  },
  {
    id: "pet-6",
    name: "Zeke",
    type: "dog",
    breed: "Border Collie",
    age: "4 years",
    gender: "Male",
    size: "Medium",
    image: "https://images.unsplash.com/photo-1503256207526-0d5d80fa2f47?auto=format&fit=crop&q=80&w=600",
    status: "Available",
    character: ["Athletic", "Work-oriented", "Intense Focus", "Protective"],
    story: "Zeke is a working breed Collie that was found at a farm gate. He has incredible natural herding instincts. He would excel in agility courses, frisbee competitions, and active training setups.",
    medicalHistory: {
      vaccinated: "Yes",
      neutered: "Yes",
      dewormed: "Yes",
      lastCheckup: "2026-06-12"
    }
  }
];

export const MOCK_LOST_PETS = [
  {
    id: "lost-1",
    name: "Coco",
    type: "dog",
    breed: "Chihuahua",
    status: "Lost",
    lastSeen: "7th Avenue, near Central Park",
    date: "2026-06-30",
    owner: "Jessica Miller",
    phone: "+1 (555) 381-0291",
    reward: "$500",
    description: "Coco is extremely small, wearing a red sparkly collar with a gold bell. She is nervous around strangers and will run if chased. Please report sightings immediately.",
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "lost-2",
    name: "Unknown Tabby",
    type: "cat",
    breed: "Domestic Shorthair",
    status: "Found",
    lastSeen: "Saratoga Retail Block, Sector 4",
    date: "2026-07-01",
    owner: "Found by Arthur Vance (Volunteer)",
    phone: "+1 (555) 912-4011",
    reward: "None",
    description: "Extremely friendly ginger tabby cat found sleeping in an engine bay. Healthy, well-fed, clearly has a home. No microchip was found at the local vet office.",
    image: "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "lost-3",
    name: "Simba",
    type: "cat",
    breed: "Persian Cat",
    status: "Lost",
    lastSeen: "Hillcrest Gardens, Block C",
    date: "2026-06-25",
    owner: "Robert Chen",
    phone: "+1 (555) 128-4491",
    reward: "$1000",
    description: "Simba is a purebred white Persian cat with piercing blue eyes. Requires medication daily. Needs gentle care.",
    image: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&q=80&w=600"
  }
];

export const MOCK_RESCUES = [
  {
    id: "res-101",
    reporter: "Clara Oswald",
    reporterPhone: "+1 (555) 782-1201",
    petType: "Dog",
    location: "41st Boulevard, under the Overpass",
    emergencyLevel: "Critical", // Critical, High, Medium, Low
    status: "Dispatched", // Reported, Dispatched, On-Site, Rescued, Vet-Care, Completed
    description: "Injured stray dog hit by a vehicle. Unable to stand, has a visible leg injury and is whimpering in a ditch.",
    timestamp: "2026-07-02T07:15:00-07:00",
    image: "https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&q=80&w=600",
    assignedVolunteer: {
      name: "Markus Aurel",
      phone: "+1 (555) 882-9011",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150"
    },
    timeline: [
      { status: "Reported", time: "07:15 AM", desc: "Report filed with photo verification via PawLink App." },
      { status: "Verified", time: "07:22 AM", desc: "AI priority system matched to Critical (Traffic Collision)." },
      { status: "Dispatched", time: "07:30 AM", desc: "Responder Markus Aurel accepted and is en route with rescue van." }
    ]
  },
  {
    id: "res-102",
    reporter: "Devin Blake",
    reporterPhone: "+1 (555) 238-1992",
    petType: "Cats (Litter)",
    location: "Construction Site - Sector 12",
    emergencyLevel: "High",
    status: "On-Site",
    description: "A litter of four newborn kittens abandoned in a cement mixer. Mother cat is nowhere to be found, rain is starting.",
    timestamp: "2026-07-02T06:40:00-07:00",
    image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=600",
    assignedVolunteer: {
      name: "Elena Rostova",
      phone: "+1 (555) 441-2092",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
    },
    timeline: [
      { status: "Reported", time: "06:40 AM", desc: "Litter spotted by site supervisor." },
      { status: "Dispatched", time: "06:55 AM", desc: "Elena dispatched from Sector 12 warehouse." },
      { status: "On-Site", time: "07:25 AM", desc: "Elena reached site. Kittens are warm but hungry. Preparing transport." }
    ]
  },
  {
    id: "res-103",
    reporter: "Sasha Grey",
    reporterPhone: "+1 (555) 990-2104",
    petType: "Injured Bird",
    location: "Greenwood Lake Trail Head",
    emergencyLevel: "Medium",
    status: "Completed",
    description: "Osprey entangled in discarded monofilament fishing lines. Hanging from a low pine branch, flapping weakly.",
    timestamp: "2026-07-01T14:10:00-07:00",
    image: "https://images.unsplash.com/photo-1452857297128-d9c29adba80b?auto=format&fit=crop&q=80&w=600",
    assignedVolunteer: {
      name: "David Atten",
      phone: "+1 (555) 111-2233",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"
    },
    timeline: [
      { status: "Reported", time: "02:10 PM", desc: "Bird reported by hikers." },
      { status: "Dispatched", time: "02:25 PM", desc: "David Atten dispatched with tree scaling kit." },
      { status: "On-Site", time: "03:00 PM", desc: "Bird successfully cut free, wings inspected, minor skin abrasions treated." },
      { status: "Completed", time: "04:15 PM", desc: "Released successfully back into the wild. Beautiful takeoff!" }
    ]
  }
];

export const MOCK_DONATIONS = {
  totalRaised: 184910,
  monthlyGoal: 250000,
  campaigns: [
    {
      id: "don-1",
      title: "Emergency Medical & Trauma Fund",
      category: "Medical",
      desc: "Providing instant financial coverage for emergency surgeries, orthopedics, and blood transfusions for injured street animals.",
      raised: 78500,
      goal: 100000,
      contributors: 1420,
      daysLeft: 12,
      image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: "don-2",
      title: "Sector-9 Shelter Winter Warmth Expansion",
      category: "Shelter",
      desc: "Renovating our main shelter to install central radiant heating, insulated kennels, and weatherproofing for 200+ rescue dogs and cats.",
      raised: 42100,
      goal: 80000,
      contributors: 920,
      daysLeft: 24,
      image: "https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: "don-3",
      title: "Mobile Veterinary Clinic Van",
      category: "Equipment",
      desc: "Purchasing a dedicated vehicle and stocking it with surgery tables, oxygen concentrators, and portable X-ray equipment for rapid on-site action.",
      raised: 64310,
      goal: 70000,
      contributors: 1105,
      daysLeft: 5,
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600"
    }
  ],
  history: [
    { id: "tx-901", user: "Sophia Loren", amount: 150, date: "2026-07-02", campaign: "Emergency Medical & Trauma Fund", status: "Completed" },
    { id: "tx-902", user: "Anonymous Backer", amount: 1000, date: "2026-07-01", campaign: "Mobile Veterinary Clinic Van", status: "Completed" },
    { id: "tx-903", user: "Peter Parker", amount: 45, date: "2026-06-30", campaign: "Sector-9 Shelter Winter Warmth Expansion", status: "Completed" }
  ]
};

export const MOCK_VOLUNTEERS = {
  leaderboard: [
    { rank: 1, name: "Elena Rostova", points: 4290, rescues: 87, hours: 320, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150" },
    { rank: 2, name: "Markus Aurel", points: 3810, rescues: 71, hours: 280, avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150" },
    { rank: 3, name: "Siddharth Roy", points: 3540, rescues: 64, hours: 245, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150" },
    { rank: 4, name: "David Atten", points: 3200, rescues: 59, hours: 210, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150" }
  ],
  missions: [
    { id: "mis-1", title: "Feral Cat Neutering Camp (Sector 4)", date: "2026-07-05", volunteersNeeded: 8, volunteersSigned: 6, points: 150, status: "Active" },
    { id: "mis-2", title: "Greenwood Floods Animal Safe Haven Prep", date: "2026-07-08", volunteersNeeded: 15, volunteersSigned: 4, points: 300, status: "Urgent" },
    { id: "mis-3", title: "Adopt-a-Thon Mega Weekend (Central Mall)", date: "2026-07-12", volunteersNeeded: 12, volunteersSigned: 12, points: 100, status: "Filled" }
  ]
};

export const MOCK_MESSAGES = [
  {
    chatId: "chat-1",
    partner: {
      name: "Dr. Catherine Shaw",
      role: "Veterinary Specialist",
      status: "Online",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150"
    },
    conversation: [
      { sender: "doctor", text: "Hello! I reviewed Milo's blood work and everything looks excellent. His liver values are back to normal.", time: "09:30 AM" },
      { sender: "user", text: "That is amazing news, Dr. Catherine! Can we schedule his microchipping session for this weekend?", time: "09:32 AM" },
      { sender: "doctor", text: "Yes, we can do Saturday morning at 10:00 AM. Does that work?", time: "09:35 AM" },
      { sender: "user", text: "Saturday at 10 works perfectly. I will bring his records. Thank you!", time: "09:36 AM" }
    ]
  },
  {
    chatId: "chat-2",
    partner: {
      name: "Markus Aurel",
      role: "Rescue Dispatcher",
      status: "On Call",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150"
    },
    conversation: [
      { sender: "dispatcher", text: "Hi, I am approaching the 41st Overpass coordinate now. Did you see the dog hide behind the concrete slabs?", time: "07:32 AM" },
      { sender: "user", text: "Yes, he's nestled right behind the third slab. He looks scared but too weak to run.", time: "07:33 AM" },
      { sender: "dispatcher", text: "Understood. Bringing the slip-lead and a crate now. Keep a safe distance.", time: "07:35 AM" }
    ]
  }
];

export const MOCK_SHELTERS = [
  { id: "sh-1", name: "Greenwood Animal Haven", type: "Shelter", coords: { x: 35, y: 40 }, address: "102 Greenwood Rd, Sector 5", phone: "+1 (555) 301-2091", capacity: "120 Pets", rating: "4.9" },
  { id: "sh-2", name: "Metro Veterinary & Trauma Hospital", type: "Veterinary", coords: { x: 65, y: 25 }, address: "440 Broadway, Sector 9", phone: "+1 (555) 991-4402", capacity: "24/7 ICU", rating: "4.8" },
  { id: "sh-3", name: "Bark & Purr Sanctuary", type: "NGO Shelter", coords: { x: 20, y: 70 }, address: "89 Lakeside Lane, Sector 12", phone: "+1 (555) 440-2092", capacity: "80 Pets", rating: "4.7" },
  { id: "sh-4", name: "Apex Wildlife Rehabilitation Center", type: "Specialist", coords: { x: 75, y: 75 }, address: "Rural Parkway, North Woods", phone: "+1 (555) 811-3091", capacity: "Avian & Mammal", rating: "4.9" }
];

export const FAQ_DATA = [
  { q: "How do I report an injured animal?", a: "Simply open our Rescue Hub, fill in the quick dispatch form, specify location and priority, and upload a picture. Our AI priority engine matches it to the nearest verified responder immediately." },
  { q: "Is PawLink a registered NGO?", a: "PawLink is a unified tech platform partnering with registered regional NGOs, licensed clinics, and local animal care centers to consolidate resources and dispatch actions seamlessly." },
  { q: "Are donations tax-deductible?", a: "Yes, all donations are direct-routed to our verified partner NGOs who issue direct 501(c)(3) equivalent tax-exempt receipts instantly through the donation history module." },
  { q: "How does the microchip lost-and-found system work?", a: "When you upload a lost or found report, our system scans visual tags, breed profiles, and location matrices to calculate probabilistic matches, notifying owners automatically." }
];
