'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseClient } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { Search, Filter, Edit, Trash2, ArrowLeft, Plus, Download } from 'lucide-react'
import Link from 'next/link'

type Voter = {
  id: string
  noms: string
  qualite: string
  genre: string
  commune: string
  adresse: string
  telephone1: string
  telephone2: string | null
  profession: string
  bureau_de_vote: string
  leader: string
  a_vote: string
  observations: string | null
  created_at: string
}

type Profile = {
  id: string
  role: 'super_admin' | 'standard_user'
}

export default function VotersPage() {
  const [voters, setVoters] = useState<Voter[]>([])
  const [filteredVoters, setFilteredVoters] = useState<Voter[]>([])
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    qualite: '',
    genre: '',
    commune: '',
    a_vote: '',
  })
  const [showFilters, setShowFilters] = useState(false)
  
  const router = useRouter()
  const supabase = createSupabaseClient()

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [voters, searchTerm, filters])

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth/login')
        return
      }

      // Get user profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileData) {
        setProfile(profileData)
        
        // Load voters based on role
        let query = supabase.from('voters').select('*').order('created_at', { ascending: false })
        
        if (profileData.role !== 'super_admin') {
          query = query.eq('created_by', user.id)
        }

        const { data: votersData } = await query
        
        if (votersData) {
          setVoters(votersData)
        }
      }
    } catch (error) {
      toast.error('Erreur lors du chargement des données')
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = voters

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(voter =>
        voter.noms.toLowerCase().includes(searchTerm.toLowerCase()) ||
        voter.commune.toLowerCase().includes(searchTerm.toLowerCase()) ||
        voter.profession.toLowerCase().includes(searchTerm.toLowerCase()) ||
        voter.leader.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter(voter => voter[key as keyof typeof filters] === value)
      }
    })

    setFilteredVoters(filtered)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet électeur ?')) return

    try {
      const { error } = await supabase
        .from('voters')
        .delete()
        .eq('id', id)

      if (error) {
        toast.error('Erreur lors de la suppression')
      } else {
        toast.success('Électeur supprimé avec succès')
        setVoters(voters.filter(v => v.id !== id))
      }
    } catch (error) {
      toast.error('Une erreur est survenue')
    }
  }

  const clearFilters = () => {
    setFilters({
      qualite: '',
      genre: '',
      commune: '',
      a_vote: '',
    })
    setSearchTerm('')
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-primary-300 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="h-5 w-5" />
            Retour au tableau de bord
          </Link>
          
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">Gestion des Électeurs</h1>
              <p className="text-primary-300">{filteredVoters.length} électeur(s) trouvé(s)</p>
            </div>
            
            <div className="flex gap-4">
              <Link href="/voters/register" className="btn-primary flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Ajouter
              </Link>
              <Link href="/voters/export" className="btn-accent flex items-center gap-2">
                <Download className="h-5 w-5" />
                Exporter
              </Link>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="card-gradient mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Rechercher par nom, commune, profession, leader..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field w-full pl-10"
              />
            </div>
            
            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary flex items-center gap-2"
            >
              <Filter className="h-5 w-5" />
              Filtres
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-primary-700">
              <select
                value={filters.qualite}
                onChange={(e) => setFilters({...filters, qualite: e.target.value})}
                className="select-field"
              >
                <option value="">Toutes les qualités</option>
                <option value="Candidat">Candidat</option>
                <option value="Électeur">Électeur</option>
                <option value="Responsable du bureau de vote">Responsable du bureau de vote</option>
                <option value="Responsable de la commune">Responsable de la commune</option>
              </select>

              <select
                value={filters.genre}
                onChange={(e) => setFilters({...filters, genre: e.target.value})}
                className="select-field"
              >
                <option value="">Tous les genres</option>
                <option value="Homme">Homme</option>
                <option value="Femme">Femme</option>
              </select>

              <input
                type="text"
                placeholder="Filtrer par commune"
                value={filters.commune}
                onChange={(e) => setFilters({...filters, commune: e.target.value})}
                className="input-field"
              />

              <select
                value={filters.a_vote}
                onChange={(e) => setFilters({...filters, a_vote: e.target.value})}
                className="select-field"
              >
                <option value="">Statut de vote</option>
                <option value="Oui">A voté</option>
                <option value="Non">N'a pas voté</option>
              </select>

              <div className="md:col-span-4 flex justify-end">
                <button onClick={clearFilters} className="btn-secondary">
                  Effacer les filtres
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Voters Table */}
        <div className="card-gradient overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary-700">
                  <th className="text-left py-4 px-4 text-primary-200 font-semibold">Noms</th>
                  <th className="text-left py-4 px-4 text-primary-200 font-semibold">Qualité</th>
                  <th className="text-left py-4 px-4 text-primary-200 font-semibold">Genre</th>
                  <th className="text-left py-4 px-4 text-primary-200 font-semibold">Commune</th>
                  <th className="text-left py-4 px-4 text-primary-200 font-semibold">Téléphone</th>
                  <th className="text-left py-4 px-4 text-primary-200 font-semibold">A Voté</th>
                  <th className="text-left py-4 px-4 text-primary-200 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVoters.map((voter) => (
                  <tr key={voter.id} className="border-b border-primary-800 hover:bg-primary-700/50 transition-colors">
                    <td className="py-4 px-4 text-white font-medium">{voter.noms}</td>
                    <td className="py-4 px-4 text-primary-300">{voter.qualite}</td>
                    <td className="py-4 px-4 text-primary-300">{voter.genre}</td>
                    <td className="py-4 px-4 text-primary-300">{voter.commune}</td>
                    <td className="py-4 px-4 text-primary-300">{voter.telephone1}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        voter.a_vote === 'Oui' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {voter.a_vote}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => router.push(`/voters/edit/${voter.id}`)}
                          className="p-2 text-accent-blue hover:bg-accent-blue/20 rounded-lg transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(voter.id)}
                          className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredVoters.length === 0 && (
              <div className="text-center py-12">
                <p className="text-primary-400">Aucun électeur trouvé</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
