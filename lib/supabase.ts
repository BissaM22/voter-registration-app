import { createClient } from '@supabase/supabase-js'

// Fallback values for build time
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

// Client-side Supabase client
export const createSupabaseClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey)
}

// Default client for compatibility
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          role: 'super_admin' | 'standard_user'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          role?: 'super_admin' | 'standard_user'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: 'super_admin' | 'standard_user'
          created_at?: string
          updated_at?: string
        }
      }
      voters: {
        Row: {
          id: string
          noms: string
          qualite: 'Candidat' | 'Électeur' | 'Responsable du bureau de vote' | 'Responsable de la commune'
          genre: 'Homme' | 'Femme'
          commune: string
          adresse: string
          telephone1: string
          telephone2: string | null
          profession: string
          bureau_de_vote: string
          leader: string
          a_vote: 'Oui' | 'Non'
          observations: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          noms: string
          qualite: 'Candidat' | 'Électeur' | 'Responsable du bureau de vote' | 'Responsable de la commune'
          genre: 'Homme' | 'Femme'
          commune: string
          adresse: string
          telephone1: string
          telephone2?: string | null
          profession: string
          bureau_de_vote: string
          leader: string
          a_vote: 'Oui' | 'Non'
          observations?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          noms?: string
          qualite?: 'Candidat' | 'Électeur' | 'Responsable du bureau de vote' | 'Responsable de la commune'
          genre?: 'Homme' | 'Femme'
          commune?: string
          adresse?: string
          telephone1?: string
          telephone2?: string | null
          profession?: string
          bureau_de_vote?: string
          leader?: string
          a_vote?: 'Oui' | 'Non'
          observations?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
