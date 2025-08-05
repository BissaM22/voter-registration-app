'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseClient } from '@/lib/supabase'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { UserPlus, ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

type VoterForm = {
  noms: string
  qualite: 'Candidat' | 'Électeur' | 'Responsable du bureau de vote' | 'Responsable de la commune'
  genre: 'Homme' | 'Femme'
  commune: string
  adresse: string
  telephone1: string
  telephone2: string
  profession: string
  bureau_de_vote: string
  leader: string
  a_vote: 'Oui' | 'Non'
  observations: string
}

export default function RegisterVoterPage() {
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const supabase = createSupabaseClient()
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<VoterForm>()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth/login')
        return
      }

      setUser(user)
    }

    getUser()
  }, [supabase, router])

  const onSubmit = async (data: VoterForm) => {
    if (!user) return

    setLoading(true)
    
    try {
      const { error } = await supabase
        .from('voters')
        .insert({
          ...data,
          created_by: user.id,
        })

      if (error) {
        toast.error('Erreur lors de l\'enregistrement')
        console.error(error)
      } else {
        toast.success('Électeur enregistré avec succès!')
        reset()
        router.push('/voters')
      }
    } catch (error) {
      toast.error('Une erreur est survenue')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent-yellow"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-primary-300 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="h-5 w-5" />
            Retour au tableau de bord
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-accent-blue to-accent-violet rounded-full">
              <UserPlus className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Enregistrer un Électeur</h1>
              <p className="text-primary-300">Saisissez les informations de l'électeur</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="card-gradient">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Noms */}
              <div>
                <label className="block text-sm font-medium text-primary-200 mb-2">
                  Noms *
                </label>
                <input
                  {...register('noms', { required: 'Les noms sont requis' })}
                  type="text"
                  className="input-field w-full"
                  placeholder="Nom et prénom"
                />
                {errors.noms && (
                  <p className="text-red-400 text-sm mt-1">{errors.noms.message}</p>
                )}
              </div>

              {/* Qualité */}
              <div>
                <label className="block text-sm font-medium text-primary-200 mb-2">
                  Qualité *
                </label>
                <select
                  {...register('qualite', { required: 'La qualité est requise' })}
                  className="select-field w-full"
                >
                  <option value="">Sélectionner une qualité</option>
                  <option value="Candidat">Candidat</option>
                  <option value="Électeur">Électeur</option>
                  <option value="Responsable du bureau de vote">Responsable du bureau de vote</option>
                  <option value="Responsable de la commune">Responsable de la commune</option>
                </select>
                {errors.qualite && (
                  <p className="text-red-400 text-sm mt-1">{errors.qualite.message}</p>
                )}
              </div>

              {/* Genre */}
              <div>
                <label className="block text-sm font-medium text-primary-200 mb-2">
                  Genre *
                </label>
                <select
                  {...register('genre', { required: 'Le genre est requis' })}
                  className="select-field w-full"
                >
                  <option value="">Sélectionner un genre</option>
                  <option value="Homme">Homme</option>
                  <option value="Femme">Femme</option>
                </select>
                {errors.genre && (
                  <p className="text-red-400 text-sm mt-1">{errors.genre.message}</p>
                )}
              </div>

              {/* Commune */}
              <div>
                <label className="block text-sm font-medium text-primary-200 mb-2">
                  Commune *
                </label>
                <input
                  {...register('commune', { required: 'La commune est requise' })}
                  type="text"
                  className="input-field w-full"
                  placeholder="Nom de la commune"
                />
                {errors.commune && (
                  <p className="text-red-400 text-sm mt-1">{errors.commune.message}</p>
                )}
              </div>

              {/* Adresse */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-primary-200 mb-2">
                  Adresse *
                </label>
                <input
                  {...register('adresse', { required: 'L\'adresse est requise' })}
                  type="text"
                  className="input-field w-full"
                  placeholder="Adresse complète"
                />
                {errors.adresse && (
                  <p className="text-red-400 text-sm mt-1">{errors.adresse.message}</p>
                )}
              </div>

              {/* Téléphone 1 */}
              <div>
                <label className="block text-sm font-medium text-primary-200 mb-2">
                  Téléphone 1 *
                </label>
                <input
                  {...register('telephone1', { required: 'Le téléphone 1 est requis' })}
                  type="tel"
                  className="input-field w-full"
                  placeholder="+33 1 23 45 67 89"
                />
                {errors.telephone1 && (
                  <p className="text-red-400 text-sm mt-1">{errors.telephone1.message}</p>
                )}
              </div>

              {/* Téléphone 2 */}
              <div>
                <label className="block text-sm font-medium text-primary-200 mb-2">
                  Téléphone 2
                </label>
                <input
                  {...register('telephone2')}
                  type="tel"
                  className="input-field w-full"
                  placeholder="+33 1 23 45 67 89 (optionnel)"
                />
              </div>

              {/* Profession */}
              <div>
                <label className="block text-sm font-medium text-primary-200 mb-2">
                  Profession *
                </label>
                <input
                  {...register('profession', { required: 'La profession est requise' })}
                  type="text"
                  className="input-field w-full"
                  placeholder="Profession"
                />
                {errors.profession && (
                  <p className="text-red-400 text-sm mt-1">{errors.profession.message}</p>
                )}
              </div>

              {/* Bureau de vote */}
              <div>
                <label className="block text-sm font-medium text-primary-200 mb-2">
                  Bureau de vote *
                </label>
                <input
                  {...register('bureau_de_vote', { required: 'Le bureau de vote est requis' })}
                  type="text"
                  className="input-field w-full"
                  placeholder="Bureau de vote"
                />
                {errors.bureau_de_vote && (
                  <p className="text-red-400 text-sm mt-1">{errors.bureau_de_vote.message}</p>
                )}
              </div>

              {/* Leader */}
              <div>
                <label className="block text-sm font-medium text-primary-200 mb-2">
                  Leader *
                </label>
                <input
                  {...register('leader', { required: 'Le leader est requis' })}
                  type="text"
                  className="input-field w-full"
                  placeholder="Nom du leader"
                />
                {errors.leader && (
                  <p className="text-red-400 text-sm mt-1">{errors.leader.message}</p>
                )}
              </div>

              {/* A Voté */}
              <div>
                <label className="block text-sm font-medium text-primary-200 mb-2">
                  A Voté *
                </label>
                <select
                  {...register('a_vote', { required: 'Ce champ est requis' })}
                  className="select-field w-full"
                >
                  <option value="">Sélectionner</option>
                  <option value="Oui">Oui</option>
                  <option value="Non">Non</option>
                </select>
                {errors.a_vote && (
                  <p className="text-red-400 text-sm mt-1">{errors.a_vote.message}</p>
                )}
              </div>

              {/* Observations */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-primary-200 mb-2">
                  Observations
                </label>
                <textarea
                  {...register('observations')}
                  rows={4}
                  className="input-field w-full resize-none"
                  placeholder="Observations ou commentaires (optionnel)"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center gap-2 px-8"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    Enregistrer l'Électeur
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
