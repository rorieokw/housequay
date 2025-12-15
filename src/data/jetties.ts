export interface Jetty {
  id: string;
  title: string;
  description: string;
  location: string;
  city: string;
  coordinates: { lat: number; lng: number };
  pricePerNight: number;
  maxBoatLength: number;
  maxBoatLengthCategory: 'small' | 'medium' | 'large' | 'xlarge' | 'yacht';
  images: string[];
  amenities: string[];
  rating: number;
  reviewCount: number;
  host: {
    id: string;
    name: string;
    avatar: string;
    superhost: boolean;
    responseRate: number;
    responseTime: string;
  };
  availability: {
    instantBook: boolean;
    minimumStay: number;
  };
  features: {
    depth: number;
    width: number;
    power: boolean;
    water: boolean;
    wifi: boolean;
    security: boolean;
    lighting: boolean;
    fuel: boolean;
  };
}

export const jetties: Jetty[] = [
  {
    id: '1',
    title: 'Private Jetty in Sydney Harbour',
    description: 'Beautiful private jetty with stunning views of the Sydney Opera House and Harbour Bridge. Perfect for medium-sized boats with easy access to the harbour. Recently renovated with modern amenities.',
    location: 'Point Piper, Sydney',
    city: 'Sydney Harbour',
    coordinates: { lat: -33.8568, lng: 151.2153 },
    pricePerNight: 150,
    maxBoatLength: 35,
    maxBoatLengthCategory: 'medium',
    images: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&h=600&fit=crop',
    ],
    amenities: ['Power', 'Water', 'WiFi', 'Security Camera', 'Lighting', 'Parking'],
    rating: 4.9,
    reviewCount: 127,
    host: {
      id: 'h1',
      name: 'James Wilson',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
      superhost: true,
      responseRate: 98,
      responseTime: 'within an hour',
    },
    availability: {
      instantBook: true,
      minimumStay: 1,
    },
    features: {
      depth: 3.5,
      width: 4,
      power: true,
      water: true,
      wifi: true,
      security: true,
      lighting: true,
      fuel: false,
    },
  },
  {
    id: '2',
    title: 'Gold Coast Marina Berth',
    description: 'Premium marina berth in the heart of the Gold Coast. Walking distance to restaurants, shops, and nightlife. Ideal for larger vessels with full-service facilities.',
    location: 'Main Beach, Gold Coast',
    city: 'Gold Coast',
    coordinates: { lat: -27.9866, lng: 153.4214 },
    pricePerNight: 200,
    maxBoatLength: 50,
    maxBoatLengthCategory: 'large',
    images: [
      'https://images.unsplash.com/photo-1571704258042-1f1a2bbb7e55?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800&h=600&fit=crop',
    ],
    amenities: ['Power', 'Water', 'WiFi', 'Security', 'Fuel Station', 'Showers', 'Laundry'],
    rating: 4.7,
    reviewCount: 89,
    host: {
      id: 'h2',
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      superhost: true,
      responseRate: 100,
      responseTime: 'within an hour',
    },
    availability: {
      instantBook: true,
      minimumStay: 2,
    },
    features: {
      depth: 4.5,
      width: 5,
      power: true,
      water: true,
      wifi: true,
      security: true,
      lighting: true,
      fuel: true,
    },
  },
  {
    id: '3',
    title: 'Quiet Riverfront Mooring',
    description: 'Peaceful mooring spot on the Brisbane River. Perfect for weekend getaways. Surrounded by nature with easy access to the city.',
    location: 'Bulimba, Brisbane',
    city: 'Brisbane',
    coordinates: { lat: -27.4517, lng: 153.0555 },
    pricePerNight: 75,
    maxBoatLength: 25,
    maxBoatLengthCategory: 'medium',
    images: [
      'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&h=600&fit=crop',
    ],
    amenities: ['Power', 'Water', 'Parking', 'BBQ Area'],
    rating: 4.6,
    reviewCount: 45,
    host: {
      id: 'h3',
      name: 'Mike Thompson',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      superhost: false,
      responseRate: 92,
      responseTime: 'within a few hours',
    },
    availability: {
      instantBook: false,
      minimumStay: 1,
    },
    features: {
      depth: 2.5,
      width: 3.5,
      power: true,
      water: true,
      wifi: false,
      security: false,
      lighting: true,
      fuel: false,
    },
  },
  {
    id: '4',
    title: 'Luxury Yacht Berth - Whitsundays',
    description: 'Premium berth suitable for superyachts in the stunning Whitsundays. Concierge service available. Gateway to the Great Barrier Reef.',
    location: 'Airlie Beach, Whitsundays',
    city: 'Whitsundays',
    coordinates: { lat: -20.2673, lng: 148.7183 },
    pricePerNight: 500,
    maxBoatLength: 100,
    maxBoatLengthCategory: 'yacht',
    images: [
      'https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1571704258042-1f1a2bbb7e55?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop',
    ],
    amenities: ['Power', 'Water', 'WiFi', 'Security', 'Fuel', 'Concierge', 'Provisioning', 'Waste Pump-out'],
    rating: 5.0,
    reviewCount: 34,
    host: {
      id: 'h4',
      name: 'Whitsunday Marina Co',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop',
      superhost: true,
      responseRate: 100,
      responseTime: 'within an hour',
    },
    availability: {
      instantBook: false,
      minimumStay: 3,
    },
    features: {
      depth: 6,
      width: 8,
      power: true,
      water: true,
      wifi: true,
      security: true,
      lighting: true,
      fuel: true,
    },
  },
  {
    id: '5',
    title: 'Cozy Kayak & Small Boat Dock',
    description: 'Perfect for kayaks, paddleboards, and small boats. Friendly neighbourhood with beach access. Great for families.',
    location: 'Manly, Sydney',
    city: 'Sydney Harbour',
    coordinates: { lat: -33.7970, lng: 151.2869 },
    pricePerNight: 35,
    maxBoatLength: 15,
    maxBoatLengthCategory: 'small',
    images: [
      'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop',
    ],
    amenities: ['Lighting', 'Beach Access', 'Storage'],
    rating: 4.8,
    reviewCount: 67,
    host: {
      id: 'h5',
      name: 'Emma Roberts',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      superhost: true,
      responseRate: 95,
      responseTime: 'within a few hours',
    },
    availability: {
      instantBook: true,
      minimumStay: 1,
    },
    features: {
      depth: 1.5,
      width: 2,
      power: false,
      water: false,
      wifi: false,
      security: false,
      lighting: true,
      fuel: false,
    },
  },
  {
    id: '6',
    title: 'Great Barrier Reef Marina',
    description: 'Direct access to the Great Barrier Reef. Full-service marina with dive shop on-site. Perfect base for reef exploration.',
    location: 'Cairns, Queensland',
    city: 'Great Barrier Reef',
    coordinates: { lat: -16.9186, lng: 145.7781 },
    pricePerNight: 180,
    maxBoatLength: 45,
    maxBoatLengthCategory: 'large',
    images: [
      'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1571704258042-1f1a2bbb7e55?w=800&h=600&fit=crop',
    ],
    amenities: ['Power', 'Water', 'WiFi', 'Fuel', 'Dive Shop', 'Restaurant', 'Showers'],
    rating: 4.9,
    reviewCount: 156,
    host: {
      id: 'h6',
      name: 'Reef Marina Group',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop',
      superhost: true,
      responseRate: 99,
      responseTime: 'within an hour',
    },
    availability: {
      instantBook: true,
      minimumStay: 1,
    },
    features: {
      depth: 4,
      width: 5,
      power: true,
      water: true,
      wifi: true,
      security: true,
      lighting: true,
      fuel: true,
    },
  },
  {
    id: '7',
    title: 'Fishing Boat Heaven',
    description: 'Ideal spot for fishing enthusiasts. Close to the best fishing grounds. Fish cleaning station and bait available.',
    location: 'Port Douglas, Queensland',
    city: 'Great Barrier Reef',
    coordinates: { lat: -16.4837, lng: 145.4654 },
    pricePerNight: 95,
    maxBoatLength: 30,
    maxBoatLengthCategory: 'medium',
    images: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&h=600&fit=crop',
    ],
    amenities: ['Power', 'Water', 'Fish Cleaning Station', 'Bait Shop', 'Ice'],
    rating: 4.7,
    reviewCount: 78,
    host: {
      id: 'h7',
      name: 'Dave Fisher',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
      superhost: false,
      responseRate: 88,
      responseTime: 'within a day',
    },
    availability: {
      instantBook: true,
      minimumStay: 1,
    },
    features: {
      depth: 3,
      width: 4,
      power: true,
      water: true,
      wifi: false,
      security: false,
      lighting: true,
      fuel: false,
    },
  },
  {
    id: '8',
    title: 'Superyacht Berth - Sydney',
    description: 'Exclusive superyacht berth in the most prestigious location in Sydney Harbour. White-glove service and 24/7 security.',
    location: 'Rose Bay, Sydney',
    city: 'Sydney Harbour',
    coordinates: { lat: -33.8708, lng: 151.2631 },
    pricePerNight: 750,
    maxBoatLength: 120,
    maxBoatLengthCategory: 'yacht',
    images: [
      'https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1571704258042-1f1a2bbb7e55?w=800&h=600&fit=crop',
    ],
    amenities: ['Power', 'Water', 'WiFi', '24/7 Security', 'Concierge', 'Helipad Access', 'Provisioning'],
    rating: 5.0,
    reviewCount: 23,
    host: {
      id: 'h8',
      name: 'Harbour Elite',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop',
      superhost: true,
      responseRate: 100,
      responseTime: 'within an hour',
    },
    availability: {
      instantBook: false,
      minimumStay: 7,
    },
    features: {
      depth: 8,
      width: 10,
      power: true,
      water: true,
      wifi: true,
      security: true,
      lighting: true,
      fuel: true,
    },
  },
  {
    id: '9',
    title: 'Budget-Friendly Jetty',
    description: 'Affordable mooring option for small to medium boats. Basic amenities in a convenient location. Great for overnight stays.',
    location: 'Southport, Gold Coast',
    city: 'Gold Coast',
    coordinates: { lat: -27.9633, lng: 153.4000 },
    pricePerNight: 45,
    maxBoatLength: 20,
    maxBoatLengthCategory: 'small',
    images: [
      'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1571704258042-1f1a2bbb7e55?w=800&h=600&fit=crop',
    ],
    amenities: ['Power', 'Lighting'],
    rating: 4.3,
    reviewCount: 112,
    host: {
      id: 'h9',
      name: 'Budget Boats QLD',
      avatar: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=100&h=100&fit=crop',
      superhost: false,
      responseRate: 85,
      responseTime: 'within a day',
    },
    availability: {
      instantBook: true,
      minimumStay: 1,
    },
    features: {
      depth: 2,
      width: 3,
      power: true,
      water: false,
      wifi: false,
      security: false,
      lighting: true,
      fuel: false,
    },
  },
  {
    id: '10',
    title: 'Secluded Island Mooring',
    description: 'Private mooring at a secluded island in the Whitsundays. Perfect for those seeking privacy and natural beauty.',
    location: 'Hamilton Island, Whitsundays',
    city: 'Whitsundays',
    coordinates: { lat: -20.3519, lng: 148.9556 },
    pricePerNight: 280,
    maxBoatLength: 60,
    maxBoatLengthCategory: 'xlarge',
    images: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800&h=600&fit=crop',
    ],
    amenities: ['Power', 'Water', 'WiFi', 'Security', 'Resort Access'],
    rating: 4.9,
    reviewCount: 56,
    host: {
      id: 'h10',
      name: 'Island Escapes',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop',
      superhost: true,
      responseRate: 97,
      responseTime: 'within a few hours',
    },
    availability: {
      instantBook: false,
      minimumStay: 2,
    },
    features: {
      depth: 5,
      width: 6,
      power: true,
      water: true,
      wifi: true,
      security: true,
      lighting: true,
      fuel: false,
    },
  },
];

export function getJettyById(id: string): Jetty | undefined {
  return jetties.find((jetty) => jetty.id === id);
}

export function filterJetties(filters: {
  location?: string;
  boatSize?: string;
  minPrice?: number;
  maxPrice?: number;
  amenities?: string[];
}): Jetty[] {
  return jetties.filter((jetty) => {
    if (filters.location && !jetty.city.toLowerCase().includes(filters.location.toLowerCase()) &&
        !jetty.location.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }
    if (filters.boatSize) {
      const sizeMap: Record<string, string[]> = {
        small: ['small'],
        medium: ['small', 'medium'],
        large: ['small', 'medium', 'large'],
        xlarge: ['small', 'medium', 'large', 'xlarge'],
        yacht: ['small', 'medium', 'large', 'xlarge', 'yacht'],
      };
      if (!sizeMap[filters.boatSize]?.includes(jetty.maxBoatLengthCategory)) {
        return false;
      }
    }
    if (filters.minPrice && jetty.pricePerNight < filters.minPrice) {
      return false;
    }
    if (filters.maxPrice && jetty.pricePerNight > filters.maxPrice) {
      return false;
    }
    if (filters.amenities && filters.amenities.length > 0) {
      const jettyAmenities = jetty.amenities.map((a) => a.toLowerCase());
      if (!filters.amenities.every((a) => jettyAmenities.includes(a.toLowerCase()))) {
        return false;
      }
    }
    return true;
  });
}
