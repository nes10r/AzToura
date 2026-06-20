export type Role = 'USER' | 'ADMIN';
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
export type PriceRange = 'BUDGET' | 'MODERATE' | 'EXPENSIVE' | 'LUXURY';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  phone?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
}

export interface Destination {
  id: string;
  name: string;
  slug: string;
  description: string;
  region: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  coverImage?: string;
  imageSpring?: string;
  imageSummer?: string;
  imageAutumn?: string;
  imageWinter?: string;
  featured: boolean;
  category?: Category;
  images?: Image[];
  _count?: { tours: number; hotels: number; restaurants: number; reviews: number };
  tours?: Tour[];
  hotels?: Hotel[];
  restaurants?: Restaurant[];
  events?: Event[];
  reviews?: Review[];
  createdAt: string;
}

export interface TourDestinationStop {
  tourId: string;
  destinationId: string;
  order: number;
  destination: Destination;
}

export interface Tour {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  duration: number;
  maxGroupSize: number;
  coverImage?: string;
  featured: boolean;
  destination?: Destination;
  category?: Category;
  images?: Image[];
  reviews?: Review[];
  additionalDestinations?: TourDestinationStop[];
  _count?: { bookings: number; reviews: number };
  createdAt: string;
}

export interface Hotel {
  id: string;
  name: string;
  slug: string;
  description: string;
  city: string;
  address: string;
  stars: number;
  pricePerNight: number;
  coverImage?: string;
  featured: boolean;
  amenities: string[];
  destination?: Destination;
  images?: Image[];
  reviews?: Review[];
  _count?: { bookings: number; reviews: number };
  latitude?: number;
  longitude?: number;
  createdAt: string;
}

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  description: string;
  city: string;
  address: string;
  cuisine: string;
  priceRange: PriceRange;
  coverImage?: string;
  featured: boolean;
  destination?: Destination;
  images?: Image[];
  reviews?: Review[];
  phone?: string;
  website?: string;
  createdAt: string;
}

export interface Event {
  id: string;
  name: string;
  slug: string;
  description: string;
  city: string;
  address: string;
  startDate: string;
  endDate: string;
  price: number;
  coverImage?: string;
  featured: boolean;
  destination?: Destination;
  category?: Category;
  images?: Image[];
  createdAt: string;
}

export interface Booking {
  id: string;
  userId: string;
  tourId?: string;
  hotelId?: string;
  restaurantId?: string;
  eventId?: string;
  status: BookingStatus;
  startDate: string;
  endDate?: string;
  guests: number;
  totalPrice: number;
  notes?: string;
  user?: Pick<User, 'id' | 'name' | 'email'>;
  tour?: Tour;
  hotel?: Hotel;
  restaurant?: Restaurant;
  event?: Event;
  createdAt: string;
}

export interface Review {
  id: string;
  userId: string;
  rating: number;
  comment: string;
  user?: Pick<User, 'id' | 'name' | 'avatar'>;
  createdAt: string;
}

export interface Favorite {
  id: string;
  userId: string;
  destination?: Destination;
  tour?: Tour;
  hotel?: Hotel;
  restaurant?: Restaurant;
  event?: Event;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  published: boolean;
  author?: Pick<User, 'id' | 'name' | 'avatar'>;
  createdAt: string;
}

export interface Image {
  id: string;
  url: string;
  alt?: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  pagination?: Pagination;
  errors?: string[];
}

export interface SearchResults {
  destinations: Partial<Destination>[];
  tours: Partial<Tour>[];
  hotels: Partial<Hotel>[];
  restaurants: Partial<Restaurant>[];
  events: Partial<Event>[];
  posts: Partial<BlogPost>[];
}
