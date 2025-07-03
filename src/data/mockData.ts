import { Equipment, DivePackage, Order, Rental, User } from '../types';

// Diverse diving-related images from Pexels
export const divingImages = {
  equipment: {
    masks: 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg',
    fins: 'https://images.pexels.com/photos/3361022/pexels-photo-3361022.jpeg',
    regulators: 'https://images.pexels.com/photos/3361485/pexels-photo-3361485.jpeg',
    bcds: 'https://images.pexels.com/photos/3361483/pexels-photo-3361483.jpeg',
    wetsuits: 'https://images.pexels.com/photos/3361489/pexels-photo-3361489.jpeg',
    tanks: 'https://images.pexels.com/photos/3361486/pexels-photo-3361486.jpeg',
    accessories: 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg'
  },
  underwater: {
    coral: 'https://images.pexels.com/photos/3361524/pexels-photo-3361524.jpeg',
    fish: 'https://images.pexels.com/photos/3361520/pexels-photo-3361520.jpeg',
    diving: 'https://images.pexels.com/photos/3361517/pexels-photo-3361517.jpeg',
    ocean: 'https://images.pexels.com/photos/3361489/pexels-photo-3361489.jpeg'
  }
};

export const mockEquipment: Equipment[] = [
  {
    id: '1',
    name: 'Cressi Big Eyes Evolution Mask',
    brand: 'Cressi',
    category: 'masks',
    description: 'Professional diving mask with wide field of vision and comfortable silicone skirt. Perfect for underwater exploration with crystal clear visibility.',
    images: [divingImages.equipment.masks],
    price: 89.99,
    rentalPrice: 15.99,
    stock: 25,
    available: true,
    isRentable: true,
    specs: {
      'Lens Type': 'Tempered Glass',
      'Frame Material': 'Hypoallergenic Silicone',
      'Color': 'Clear/Black',
      'Field of Vision': 'Wide Angle',
      'Weight': '180g'
    },
    ratings: 4.8,
    reviews: []
  },
  {
    id: '2',
    name: 'Scubapro Hydros Pro BCD',
    brand: 'Scubapro',
    category: 'bcds',
    description: 'Modular BCD system with exceptional comfort and durability. Features advanced buoyancy control for professional divers.',
    images: [divingImages.equipment.bcds],
    price: 599.99,
    rentalPrice: 45.99,
    stock: 12,
    available: true,
    isRentable: true,
    specs: {
      'Size Range': 'XS to XXL',
      'Lift Capacity': '24-31 lbs',
      'Weight': '3.2 lbs',
      'Material': 'Cordura Fabric',
      'Pockets': '2 Cargo Pockets'
    },
    ratings: 4.9,
    reviews: []
  },
  {
    id: '3',
    name: 'Mares Avanti Quattro Plus Fins',
    brand: 'Mares',
    category: 'fins',
    description: 'Four-channel design for maximum thrust and efficiency underwater. Engineered for optimal propulsion and comfort.',
    images: [divingImages.equipment.fins],
    price: 79.99,
    rentalPrice: 12.99,
    stock: 30,
    available: true,
    isRentable: true,
    specs: {
      'Blade Length': '26cm',
      'Material': 'Thermoplastic Rubber',
      'Foot Pocket': 'Self-Adjusting',
      'Channel Design': '4-Channel',
      'Sizes': '36-47 EU'
    },
    ratings: 4.6,
    reviews: []
  },
  {
    id: '4',
    name: 'Aqualung Core Supreme Regulator',
    brand: 'Aqualung',
    category: 'regulators',
    description: 'Professional regulator set with exceptional breathing performance. Designed for deep water diving with reliable air delivery.',
    images: [divingImages.equipment.regulators],
    price: 799.99,
    rentalPrice: 65.99,
    stock: 8,
    available: true,
    isRentable: true,
    specs: {
      'First Stage': 'Balanced Diaphragm',
      'Second Stage': 'Pneumatically Balanced',
      'Cold Water Rated': 'Yes',
      'Working Pressure': '300 bar',
      'Certification': 'CE/EN250'
    },
    ratings: 4.9,
    reviews: []
  },
  {
    id: '5',
    name: 'Bare 3mm Velocity Wetsuit',
    brand: 'Bare',
    category: 'wetsuits',
    description: 'High-performance wetsuit with OMNIRED infrared technology. Provides optimal thermal protection and flexibility.',
    images: [divingImages.equipment.wetsuits],
    price: 299.99,
    rentalPrice: 25.99,
    stock: 18,
    available: true,
    isRentable: true,
    specs: {
      'Thickness': '3mm',
      'Material': 'Premium Neoprene',
      'Technology': 'OMNIRED Infrared',
      'Zipper': 'YKK Back Zip',
      'Sizes': 'XS to XXL'
    },
    ratings: 4.7,
    reviews: []
  },
  {
    id: '6',
    name: 'Luxfer Aluminum Tank 80cf',
    brand: 'Luxfer',
    category: 'tanks',
    description: 'Standard 80 cubic foot aluminum scuba tank with valve. Lightweight and durable for extended diving sessions.',
    images: [divingImages.equipment.tanks],
    price: 189.99,
    rentalPrice: 8.99,
    stock: 45,
    available: true,
    isRentable: true,
    specs: {
      'Capacity': '80 cubic feet',
      'Material': '6061 Aluminum',
      'Working Pressure': '3000 PSI',
      'Weight': '14.2 kg',
      'Valve Type': 'DIN/Yoke'
    },
    ratings: 4.5,
    reviews: []
  },
  {
    id: '7',
    name: 'Suunto D5 Dive Computer',
    brand: 'Suunto',
    category: 'accessories',
    description: 'Advanced dive computer with color display and wireless connectivity. Essential for safe diving with comprehensive data tracking.',
    images: [divingImages.equipment.accessories],
    price: 449.99,
    rentalPrice: 35.99,
    stock: 15,
    available: true,
    isRentable: true,
    specs: {
      'Display': 'Color Matrix',
      'Battery Life': '40 hours',
      'Depth Rating': '100m',
      'Connectivity': 'Bluetooth',
      'Algorithms': 'Suunto Fused RGBM'
    },
    ratings: 4.8,
    reviews: []
  },
  {
    id: '8',
    name: 'Oceanic Alpha 10 SPX Regulator',
    brand: 'Oceanic',
    category: 'regulators',
    description: 'Professional grade regulator system with superior breathing performance. Ideal for technical and recreational diving.',
    images: [divingImages.equipment.regulators],
    price: 649.99,
    rentalPrice: 55.99,
    stock: 10,
    available: true,
    isRentable: true,
    specs: {
      'First Stage': 'Balanced Piston',
      'Second Stage': 'Balanced Valve',
      'Ports': '4 LP, 2 HP',
      'Weight': '1.8 kg',
      'Certification': 'CE/EN250A'
    },
    ratings: 4.7,
    reviews: []
  }
];

export const mockDivePackages: DivePackage[] = [
  {
    id: '1',
    name: 'Sipadan Paradise Diving',
    level: 'advanced-open-water',
    price: 1299.99,
    duration: 4,
    location: 'Sipadan Island, Sabah',
    diveCenterPartner: 'Borneo Divers',
    description: 'Experience world-class diving at Sipadan with abundant marine life including hammerhead sharks, turtles, and barracuda schools. This exclusive package offers access to one of the world\'s top diving destinations.',
    images: [divingImages.underwater.coral],
    requirements: ['Advanced Open Water certification', 'Minimum 30 logged dives', 'Recent diving activity', 'Medical clearance'],
    minParticipants: 4,
    maxParticipants: 12,
    includedItems: ['Equipment rental', 'Boat transfers', '3 days accommodation', '12 dives', 'Meals', 'Dive guide', 'Marine park fees'],
    availableDates: [
      new Date('2024-03-15'),
      new Date('2024-04-12'),
      new Date('2024-05-20'),
      new Date('2024-06-18')
    ],
    difficulty: 'advanced'
  },
  {
    id: '2',
    name: 'Tioman Fun Diving Weekend',
    level: 'fun-diving',
    price: 599.99,
    duration: 3,
    location: 'Pulau Tioman, Pahang',
    diveCenterPartner: 'Tioman Dive Centre',
    description: 'Perfect weekend getaway for certified divers to explore Tioman\'s beautiful coral reefs and marine life. Discover colorful coral gardens and tropical fish species.',
    images: [divingImages.underwater.fish],
    requirements: ['Open Water certification', 'Basic swimming ability', 'Minimum age 12'],
    minParticipants: 2,
    maxParticipants: 8,
    includedItems: ['Equipment rental', 'Boat dives', '2 nights accommodation', '6 dives', 'Breakfast', 'Dive guide'],
    availableDates: [
      new Date('2024-03-08'),
      new Date('2024-03-22'),
      new Date('2024-04-05'),
      new Date('2024-04-19')
    ],
    difficulty: 'intermediate'
  },
  {
    id: '3',
    name: 'Open Water Certification Course',
    level: 'open-water',
    price: 899.99,
    duration: 4,
    location: 'Port Dickson, Negeri Sembilan',
    diveCenterPartner: 'PD Scuba Academy',
    description: 'Get your PADI Open Water certification with experienced instructors in calm, clear waters. Complete course includes theory, pool sessions, and open water dives.',
    images: [divingImages.underwater.diving],
    requirements: ['Age 10 and above', 'Basic swimming ability', 'Medical clearance', 'No prior experience needed'],
    minParticipants: 1,
    maxParticipants: 6,
    includedItems: ['All equipment', 'PADI materials', 'Certification fees', 'Pool sessions', 'Open water dives', 'Instructor', 'Digital certification'],
    availableDates: [
      new Date('2024-03-10'),
      new Date('2024-03-24'),
      new Date('2024-04-07'),
      new Date('2024-04-21')
    ],
    difficulty: 'beginner'
  },
  {
    id: '4',
    name: 'Redang Island Adventure',
    level: 'fun-diving',
    price: 799.99,
    duration: 3,
    location: 'Pulau Redang, Terengganu',
    diveCenterPartner: 'Redang Dive Adventures',
    description: 'Explore the pristine waters of Redang Island with its crystal clear visibility and diverse marine ecosystem. Perfect for underwater photography.',
    images: [divingImages.underwater.ocean],
    requirements: ['Open Water certification', 'Swimming proficiency', 'Minimum 10 logged dives'],
    minParticipants: 3,
    maxParticipants: 10,
    includedItems: ['Equipment rental', 'Boat transfers', '2 nights resort stay', '8 dives', 'All meals', 'Marine park fees', 'Underwater photography guide'],
    availableDates: [
      new Date('2024-03-16'),
      new Date('2024-04-13'),
      new Date('2024-05-11'),
      new Date('2024-06-08')
    ],
    difficulty: 'intermediate'
  }
];

// Enhanced user data with different roles
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@stg.com',
    name: 'STG Admin',
    phone: '+60123456789',
    address: 'Kuala Lumpur, Malaysia',
    membershipTier: 'sea-monsters',
    points: 5000,
    totalSpent: 15000,
    role: 'admin',
    department: 'management',
    permissions: ['all'],
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    email: 'john@example.com',
    name: 'John Diver',
    phone: '+60123456788',
    address: 'Petaling Jaya, Malaysia',
    membershipTier: 'dive-buddies',
    points: 1500,
    totalSpent: 4500,
    role: 'customer',
    permissions: ['purchase', 'rent', 'book_packages'],
    createdAt: new Date('2024-02-15'),
  },
  {
    id: '3',
    email: 'warehouse@stg.com',
    name: 'Ahmad Rahman',
    phone: '+60123456787',
    address: 'Kuala Lumpur, Malaysia',
    membershipTier: 'water-babies',
    points: 0,
    totalSpent: 0,
    role: 'staff',
    department: 'warehouse',
    permissions: ['inventory_management', 'equipment_handling'],
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '4',
    email: 'billing@stg.com',
    name: 'Siti Nurhaliza',
    phone: '+60123456786',
    address: 'Kuala Lumpur, Malaysia',
    membershipTier: 'water-babies',
    points: 0,
    totalSpent: 0,
    role: 'staff',
    department: 'billing',
    permissions: ['payment_processing', 'invoicing', 'financial_reports'],
    createdAt: new Date('2024-01-20'),
  },
  {
    id: '5',
    email: 'manager@stg.com',
    name: 'Tan Wei Ming',
    phone: '+60123456785',
    address: 'Kuala Lumpur, Malaysia',
    membershipTier: 'sea-monsters',
    points: 2000,
    totalSpent: 8000,
    role: 'manager',
    department: 'management',
    permissions: ['reports', 'staff_management', 'inventory_oversight', 'customer_management'],
    createdAt: new Date('2024-01-10'),
  },
  {
    id: '6',
    email: 'partner@borneo-divers.com',
    name: 'Captain James Lee',
    phone: '+60123456784',
    address: 'Kota Kinabalu, Sabah',
    membershipTier: 'dive-buddies',
    points: 800,
    totalSpent: 2400,
    role: 'dive_center_partner',
    department: 'partnerships',
    permissions: ['package_management', 'booking_management'],
    diveCenterName: 'Borneo Divers',
    createdAt: new Date('2024-01-25'),
  }
];

export const mockOrders: Order[] = [
  {
    id: '1',
    userId: '2',
    items: [
      {
        id: '1',
        type: 'purchase',
        equipmentId: '1',
        quantity: 1,
        price: 89.99
      }
    ],
    total: 89.99,
    status: 'delivered',
    deliveryAddress: 'Petaling Jaya, Malaysia',
    trackingNumber: 'STG123456789',
    createdAt: new Date('2024-02-20'),
    deliveredAt: new Date('2024-02-25')
  },
  {
    id: '2',
    userId: '2',
    items: [
      {
        id: '2',
        type: 'package',
        packageId: '2',
        quantity: 2,
        price: 599.99
      }
    ],
    total: 1199.98,
    status: 'confirmed',
    deliveryAddress: 'Petaling Jaya, Malaysia',
    trackingNumber: 'STG123456790',
    createdAt: new Date('2024-02-28'),
  }
];

export const mockRentals: Rental[] = [
  {
    id: '1',
    userId: '2',
    equipmentId: '2',
    quantity: 1,
    rentalDuration: 7,
    startDate: new Date('2024-03-01'),
    endDate: new Date('2024-03-08'),
    status: 'active',
    totalCost: 45.99
  },
  {
    id: '2',
    userId: '2',
    equipmentId: '4',
    quantity: 1,
    rentalDuration: 14,
    startDate: new Date('2024-02-15'),
    endDate: new Date('2024-03-01'),
    status: 'returned',
    totalCost: 131.98,
    inspectionNotes: 'Equipment returned in excellent condition'
  }
];