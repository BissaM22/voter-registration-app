'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseClient } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import { BarChart3, Users, UserCheck, LogOut, Plus, Filter, Download } from 'lucide-react'
import toast from 'react-hot-toast'

type Profile = {
  id: string
  email: string
  role: 'super_admin' | 'standard_user'
}

type VoterStats = {
  total: number
  voted: number
  notVoted: number
  byQualite: Record<string, number>
  byGenre: Record<string, number>
  byCommune: Record<string, number>
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [stats, setStats] = useState<VoterStats | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createSupabaseClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth/login')
        return
      }

      setUser(user)

      // Get user profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileData) {
        setProfile(profileData)
        await loadStats(profileData)
      }

      setLoading(false)
    }

    getUser()
  }, [supabase, router])

  const loadStats = async (userProfile: Profile) => {
    try {
      let query = supabase.from('voters').select('*')
      
      // If not super admin, only show user's own data
      if (userProfile.role !== 'super_admin') {
        query = query.eq('created_by', userProfile.id)
      }

      const { data: voters } = await query

      if (voters) {
        const stats: VoterStats = {
          total: voters.length,
          voted: voters.filter(v => v.a_vote === 'Oui').length,
          notVoted: voters.filter(v => v.a_vote === 'Non').length,
          byQualite: {},
          byGenre: {},
          byCommune: {}
        }

        // Calculate stats by qualite
        voters.forEach(voter => {
          stats.byQualite[voter.qualite] = (stats.byQualite[voter.qualite] || 0) + 1
          stats.byGenre[voter.genre] = (stats.byGenre[voter.genre] || 0) + 1
          stats.byCommune[voter.commune] = (stats.byCommune[voter.commune] || 0) + 1
        })

        setStats(stats)
      }
    } catch (error) {
      toast.error('Erreur lors du chargement des statistiques')
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent-yellow"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900">
      {/* Header */}
      <header className="bg-primary-800 border-b border-primary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-white">Tableau de Bord</h1>
              <p className="text-primary-300">
                Bienvenue, {profile?.email} 
                {profile?.role === 'super_admin' && (
                  <span className="ml-2 px-2 py-1 bg-accent-yellow text-primary-900 text-xs font-semibold rounded-full">
                    Super Admin
                  </span>
                )}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="btn-secondary flex items-center gap-2"
            >
              <LogOut className="h-5 w-5" />
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card-gradient">
              <div className="flex items-center">
                <div className="p-3 bg-accent-blue rounded-full">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-primary-300 text-sm">Total Électeurs</p>
                  <p className="text-3xl font-bold text-white">{stats.total}</p>
                </div>
              </div>
            </div>

            <div className="card-gradient">
              <div className="flex items-center">
                <div className="p-3 bg-green-500 rounded-full">
                  <UserCheck className="h-8 w-8 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-primary-300 text-sm">Ont Voté</p>
                  <p className="text-3xl font-bold text-white">{stats.voted}</p>
                </div>
              </div>
            </div>

            <div className="card-gradient">
              <div className="flex items-center">
                <div className="p-3 bg-red-500 rounded-full">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-primary-300 text-sm">N'ont pas Voté</p>
                  <p className="text-3xl font-bold text-white">{stats.notVoted}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => router.push('/voters/register')}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Enregistrer un Électeur
          </button>
          <button
            onClick={() => router.push('/voters')}
            className="btn-secondary flex items-center gap-2"
          >
            <Filter className="h-5 w-5" />
            Gérer les Électeurs
          </button>
          <button
            onClick={() => router.push('/voters/export')}
            className="btn-accent flex items-center gap-2"
          >
            <Download className="h-5 w-5" />
            Exporter les Données
          </button>
        </div>

        {/* Statistics Overview */}
        {stats && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* By Qualité */}
            <div className="card-gradient">
              <h3 className="text-xl font-bold text-white mb-4">Par Qualité</h3>
              <div className="space-y-3">
                {Object.entries(stats.byQualite).map(([qualite, count]) => (
                  <div key={qualite} className="flex justify-between items-center">
                    <span className="text-primary-300">{qualite}</span>
                    <span className="text-white font-semibold">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* By Genre */}
            <div className="card-gradient">
              <h3 className="text-xl font-bold text-white mb-4">Par Genre</h3>
              <div className="space-y-3">
                {Object.entries(stats.byGenre).map(([genre, count]) => (
                  <div key={genre} className="flex justify-between items-center">
                    <span className="text-primary-300">{genre}</span>
                    <span className="text-white font-semibold">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Communes */}
            <div className="card-gradient">
              <h3 className="text-xl font-bold text-white mb-4">Top Communes</h3>
              <div className="space-y-3">
                {Object.entries(stats.byCommune)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 5)
                  .map(([commune, count]) => (
                    <div key={commune} className="flex justify-between items-center">
                      <span className="text-primary-300">{commune}</span>
                      <span className="text-white font-semibold">{count}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
