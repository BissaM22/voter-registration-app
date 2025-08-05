'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseClient } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import { LogIn, UserPlus, Vote } from 'lucide-react'
import Image from 'next/image'

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createSupabaseClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent-yellow"></div>
      </div>
    )
  }

  if (user) {
    router.push('/dashboard')
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900">
      {/* Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-accent-blue/20 to-accent-violet/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <Image
                  src="/logo.png"
                  alt="Univers Universe Logo"
                  width={120}
                  height={120}
                  className="rounded-full shadow-lg"
                />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-accent-yellow via-accent-blue to-accent-violet bg-clip-text text-transparent mb-6">
              Système d'Enregistrement des Électeurs
            </h1>
            <p className="text-xl md:text-2xl text-primary-300 mb-12 max-w-3xl mx-auto">
              Une plateforme moderne et sécurisée pour gérer l'enregistrement et le suivi des électeurs
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button
                onClick={() => router.push('/auth/login')}
                className="btn-primary flex items-center gap-3 text-lg px-8 py-4"
              >
                <LogIn className="h-6 w-6" />
                Se Connecter
              </button>
              <button
                onClick={() => router.push('/auth/register')}
                className="btn-accent flex items-center gap-3 text-lg px-8 py-4"
              >
                <UserPlus className="h-6 w-6" />
                Créer un Compte
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Fonctionnalités Principales</h2>
            <p className="text-xl text-primary-300">Tout ce dont vous avez besoin pour gérer efficacement les électeurs</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card-gradient text-center">
              <div className="w-16 h-16 bg-accent-blue rounded-full flex items-center justify-center mx-auto mb-6">
                <UserPlus className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Enregistrement Facile</h3>
              <p className="text-primary-300">Interface intuitive pour enregistrer rapidement les informations des électeurs</p>
            </div>
            
            <div className="card-gradient text-center">
              <div className="w-16 h-16 bg-accent-violet rounded-full flex items-center justify-center mx-auto mb-6">
                <Vote className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Gestion Complète</h3>
              <p className="text-primary-300">Suivi complet des électeurs avec filtrage et options d'exportation</p>
            </div>
            
            <div className="card-gradient text-center">
              <div className="w-16 h-16 bg-accent-yellow rounded-full flex items-center justify-center mx-auto mb-6">
                <LogIn className="h-8 w-8 text-primary-900" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Sécurité Avancée</h3>
              <p className="text-primary-300">Authentification sécurisée avec gestion des rôles utilisateurs</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary-800 border-t border-primary-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-primary-400">
            © 2024 Système d'Enregistrement des Électeurs. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  )
}
