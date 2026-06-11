export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  profile_picture_url?: string;
  bio?: string;
  city?: string;
  country?: string;
  is_verified: boolean;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon_url?: string;
}

export interface Listing {
  id: string;
  user_id: string;
  category_id: number;
  title: string;
  description: string;
  price: number;
  currency: string;
  city: string;
  neighborhood?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  status: 'active' | 'inactive' | 'sold' | 'flagged';
  is_featured: boolean;
  views_count: number;
  photos?: ListingPhoto[];
  user?: User;
  category?: Category;
  created_at: string;
  updated_at: string;
}

export interface ListingPhoto {
  id: string;
  listing_id: string;
  photo_url: string;
  display_order: number;
  is_primary: boolean;
}

export interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  listing_id?: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

export interface Review {
  id: string;
  reviewer_id: string;
  reviewed_user_id: string;
  listing_id?: string;
  rating: number;
  comment?: string;
  created_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  listing_id: string;
  created_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
