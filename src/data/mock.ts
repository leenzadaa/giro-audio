import type { Project, Profile, Equipment, Listing } from '@/types'

export const MOCK_PROFILES: Profile[] = [
  {
    id: 'p1',
    user_id: 'u1',
    username: 'blackbass',
    full_name: 'Rafael Mendes',
    city: 'Brasília',
    state: 'DF',
    bio: 'Projetos Trio Goiano e Treme Lata. Som é vida.',
    followers_count: 1842,
    following_count: 312,
    projects_count: 4,
    likes_received: 5230,
    avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop',
  },
  {
    id: 'p2',
    user_id: 'u2',
    username: 'tremeterra',
    full_name: 'Lucas Ferreira',
    city: 'Goiânia',
    state: 'GO',
    bio: 'Trio Goiano raiz. Respeita o grave.',
    followers_count: 2150,
    following_count: 180,
    projects_count: 3,
    likes_received: 4890,
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
  },
  {
    id: 'p3',
    user_id: 'u3',
    username: 'nordestesom',
    full_name: 'André Oliveira',
    city: 'Salvador',
    state: 'BA',
    bio: 'Nordeste e paredão. A cultura do som automotivo.',
    followers_count: 980,
    following_count: 420,
    projects_count: 2,
    likes_received: 2100,
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
  },
]

export const MOCK_PROJECTS: Project[] = []

export const MOCK_EQUIPMENT: Equipment[] = [
  {
    id: 'eq-1',
    category_id: 'cat-sub',
    brand: 'Eros',
    model: 'E-15 3K',
    power_rms: 3000,
    impedance: '2+2 ohms',
    specifications: { size: '15"', sensitivity: '92dB', frequency: '30-200Hz' },
    image_url: 'https://images.unsplash.com/photo-1558403194-611308249627?w=400&h=400&fit=crop',
  },
  {
    id: 'eq-2',
    category_id: 'cat-amp',
    brand: 'Taramps',
    model: 'MD 5000',
    power_rms: 5000,
    impedance: '1 ohm',
    specifications: { channels: '1', class: 'D', snr: '>90dB' },
    image_url: 'https://images.unsplash.com/photo-1558403194-611308249627?w=400&h=400&fit=crop',
  },
  {
    id: 'eq-3',
    category_id: 'cat-bat',
    brand: 'Moura',
    model: 'MI220GD',
    specifications: { capacity: '220Ah', voltage: '12V', type: 'Gel' },
    image_url: 'https://images.unsplash.com/photo-1558403194-611308249627?w=400&h=400&fit=crop',
  },
]

export const MOCK_LISTINGS: Listing[] = [
  {
    id: 'list-1',
    user_id: 'u1',
    title: 'Kit Trio Goiano Completo - 2x Sub 15" + Módulo 5K',
    description: 'Kit completo para Trio Goiano. 2 subwoofers Eros 15" 3K RMS cada + módulo Taramps 5K.',
    price: 4500,
    category: 'Kits',
    condition: 'Usado',
    city: 'Brasília',
    state: 'DF',
    is_active: true,
    is_sponsored: false,
    views_count: 320,
    created_at: '2025-12-05T10:00:00Z',
    images: [
      { id: 'limg1', listing_id: 'list-1', url: 'https://images.unsplash.com/photo-1489824904134-897ab2764a9c?w=600&h=400&fit=crop', order: 0, is_cover: true },
    ],
    profile: MOCK_PROFILES[0],
  },
  {
    id: 'list-2',
    user_id: 'u2',
    title: 'Gol G6 2018 - Projeto Som Completo',
    description: 'Gol G6 com projeto de som instalado. 8K RMS, tudo funcionando perfeitamente.',
    price: 52000,
    category: 'Carros com Som',
    condition: 'Usado',
    city: 'Goiânia',
    state: 'GO',
    is_active: true,
    is_sponsored: true,
    views_count: 890,
    created_at: '2025-12-08T10:00:00Z',
    images: [
      { id: 'limg2', listing_id: 'list-2', url: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=400&fit=crop', order: 0, is_cover: true },
    ],
    profile: MOCK_PROFILES[1],
  },
]

export const SOUND_TYPES = ['Trio Goiano', 'Nordeste', 'Treme Lata'] as const
export const VEHICLE_TYPES = ['SUV', 'Sedan', 'Hatch', 'Picape', 'Esportivo'] as const