import { createClient } from '@supabase/supabase-js'

// Verificar se as variáveis de ambiente estão configuradas
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Criar cliente apenas se as variáveis estiverem configuradas
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Flag para verificar se o Supabase está configurado
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

// Tipos para o banco de dados
export interface User {
  id: string
  name: string
  email: string
  avatar_url?: string
  created_at: string
}

export interface Activity {
  id: string
  user_id: string
  type: string
  distance_km: number
  duration_min: number
  calories: number
  date: string
  created_at: string
}

export interface Challenge {
  id: string
  title: string
  description: string
  goal_distance_km: number
  start_date: string
  end_date: string
  created_by: string
}

export interface ChallengeParticipant {
  id: string
  challenge_id: string
  user_id: string
  progress_km: number
  joined_at: string
}

export interface Achievement {
  id: string
  user_id: string
  title: string
  description: string
  earned_at: string
}

// Dados de demonstração para quando o Supabase não estiver configurado
export const demoUser: User = {
  id: 'demo-user-1',
  name: 'Usuário Demo',
  email: 'demo@andra.com',
  avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
  created_at: new Date().toISOString()
}

export const demoActivities: Activity[] = [
  {
    id: '1',
    user_id: 'demo-user-1',
    type: 'corrida',
    distance_km: 5.2,
    duration_min: 32,
    calories: 312,
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0], // ontem
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    user_id: 'demo-user-1',
    type: 'caminhada',
    distance_km: 3.1,
    duration_min: 45,
    calories: 186,
    date: new Date(Date.now() - 172800000).toISOString().split('T')[0], // 2 dias atrás
    created_at: new Date().toISOString()
  }
]

export const demoChallenges: Challenge[] = [
  {
    id: '1',
    title: 'Desafio 50km em Janeiro',
    description: 'Complete 50km de atividades físicas durante o mês de janeiro. Qualquer modalidade conta!',
    goal_distance_km: 50,
    start_date: '2024-01-01',
    end_date: '2024-01-31',
    created_by: 'demo-user-1'
  },
  {
    id: '2',
    title: 'Corrida Semanal',
    description: 'Corra pelo menos 15km por semana. Vamos manter a consistência!',
    goal_distance_km: 15,
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 604800000).toISOString().split('T')[0], // 7 dias
    created_by: 'demo-user-1'
  }
]

export const demoParticipants: ChallengeParticipant[] = [
  {
    id: '1',
    challenge_id: '1',
    user_id: 'demo-user-1',
    progress_km: 8.3,
    joined_at: new Date().toISOString()
  }
]