export interface User {
  id: string
  username: string
  email: string
  full_name: string
  avatar_url?: string
  city: string
  state: string
  bio?: string
  created_at: string
}

export interface Profile {
  id: string
  user_id: string
  username: string
  full_name: string
  avatar_url?: string
  city: string
  state: string
  bio?: string
  followers_count: number
  following_count: number
  projects_count: number
  likes_received: number
}

export type SoundType = 'SPL' | 'Trio' | 'Pancadão' | 'SQ' | 'Hi-Fi' | 'Misto'

export type VehicleType = 'Carro' | 'Pickup' | 'SUV' | 'Van' | 'Moto'

export interface Project {
  id: string
  user_id: string
  title: string
  description: string
  car_make: string
  car_model: string
  car_year: number
  vehicle_type: VehicleType
  sound_type: SoundType
  city: string
  state: string
  rms_power: number
  battery_count: number
  alternator_amps: number
  equipment_count: number
  views_count: number
  likes_count: number
  is_featured: boolean
  status: 'draft' | 'published' | 'archived'
  created_at: string
  updated_at: string
  images: ProjectImage[]
  equipment: ProjectEquipment[]
  profile?: Profile
}

export interface ProjectImage {
  id: string
  project_id: string
  url: string
  order: number
  is_cover: boolean
}

export interface EquipmentCategory {
  id: string
  name: string
  slug: string
}

export interface Equipment {
  id: string
  category_id: string
  brand: string
  model: string
  power_rms?: number
  impedance?: string
  specifications: Record<string, string>
  image_url?: string
  category?: EquipmentCategory
}

export interface ProjectEquipment {
  id: string
  project_id: string
  equipment_id: string
  quantity: number
  notes?: string
  equipment?: Equipment
}

export interface Listing {
  id: string
  user_id: string
  title: string
  description: string
  price: number
  category: string
  condition: 'Novo' | 'Usado' | 'Recondicionado'
  city: string
  state: string
  images: ListingImage[]
  is_active: boolean
  is_sponsored: boolean
  views_count: number
  created_at: string
  profile?: Profile
}

export interface ListingImage {
  id: string
  listing_id: string
  url: string
  order: number
  is_cover: boolean
}

export interface Comment {
  id: string
  project_id: string
  user_id: string
  content: string
  created_at: string
  profile?: Profile
}

export interface Like {
  id: string
  user_id: string
  project_id: string
  created_at: string
}

export interface Favorite {
  id: string
  user_id: string
  project_id?: string
  listing_id?: string
  created_at: string
}

export interface Follower {
  id: string
  follower_id: string
  following_id: string
  created_at: string
}