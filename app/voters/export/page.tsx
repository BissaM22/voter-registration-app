'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseClient } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { Download, FileText, Table, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'

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

export default function ExportPage() {
  const [voters, setVoters] = useState<Voter[]>([])
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  
  const router = useRouter()
  const supabase = createSupabaseClient()

  useEffect(() => {
    loadData()
  }, [])

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

  const exportToPDF = async () => {
    setExporting(true)
    
    try {
      const doc = new jsPDF()
      
      // Add title
      doc.setFontSize(20)
      doc.text('Liste des Électeurs', 14, 22)
      
      // Add date
      doc.setFontSize(12)
      doc.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')}`, 14, 32)
      doc.text(`Total: ${voters.length} électeur(s)`, 14, 40)
      
      // Prepare table data
      const tableData = voters.map(voter => [
        voter.noms,
        voter.qualite,
        voter.genre,
        voter.commune,
        voter.telephone1,
        voter.profession,
        voter.bureau_de_vote,
        voter.leader,
        voter.a_vote,
      ])
      
      // Add table
      autoTable(doc, {
        head: [['Noms', 'Qualité', 'Genre', 'Commune', 'Téléphone', 'Profession', 'Bureau', 'Leader', 'A Voté']],
        body: tableData,
        startY: 50,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [59, 130, 246] },
      })
      
      // Save the PDF
      doc.save('electeurs.pdf')
      toast.success('PDF exporté avec succès!')
    } catch (error) {
      toast.error('Erreur lors de l\'exportation PDF')
    } finally {
      setExporting(false)
    }
  }

  const exportToExcel = async () => {
    setExporting(true)
    
    try {
      // Prepare data for Excel
      const excelData = voters.map(voter => ({
        'Noms': voter.noms,
        'Qualité': voter.qualite,
        'Genre': voter.genre,
        'Commune': voter.commune,
        'Adresse': voter.adresse,
        'Téléphone 1': voter.telephone1,
        'Téléphone 2': voter.telephone2 || '',
        'Profession': voter.profession,
        'Bureau de vote': voter.bureau_de_vote,
        'Leader': voter.leader,
        'A Voté': voter.a_vote,
        'Observations': voter.observations || '',
        'Date d\'enregistrement': new Date(voter.created_at).toLocaleDateString('fr-FR'),
      }))
      
      // Create workbook and worksheet
      const wb = XLSX.utils.book_new()
      const ws = XLSX.utils.json_to_sheet(excelData)
      
      // Auto-size columns
      const colWidths = Object.keys(excelData[0] || {}).map(key => ({
        wch: Math.max(key.length, 15)
      }))
      ws['!cols'] = colWidths
      
      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Électeurs')
      
      // Save the file
      XLSX.writeFile(wb, 'electeurs.xlsx')
      toast.success('Excel exporté avec succès!')
    } catch (error) {
      toast.error('Erreur lors de l\'exportation Excel')
    } finally {
      setExporting(false)
    }
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/voters" className="inline-flex items-center gap-2 text-primary-300 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="h-5 w-5" />
            Retour à la liste
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-accent-yellow to-accent-blue rounded-full">
              <Download className="h-8 w-8 text-primary-900" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Exporter les Données</h1>
              <p className="text-primary-300">{voters.length} électeur(s) à exporter</p>
            </div>
          </div>
        </div>

        {/* Export Options */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* PDF Export */}
          <div className="card-gradient">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Exporter en PDF</h3>
              <p className="text-primary-300 mb-6">
                Générez un document PDF avec la liste complète des électeurs, 
                parfait pour l'impression et l'archivage.
              </p>
              <button
                onClick={exportToPDF}
                disabled={exporting || voters.length === 0}
                className="btn-primary flex items-center gap-2 mx-auto"
              >
                {exporting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <FileText className="h-5 w-5" />
                )}
                Télécharger PDF
              </button>
            </div>
          </div>

          {/* Excel Export */}
          <div className="card-gradient">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Table className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Exporter en Excel</h3>
              <p className="text-primary-300 mb-6">
                Téléchargez un fichier Excel avec toutes les données, 
                idéal pour l'analyse et la manipulation des données.
              </p>
              <button
                onClick={exportToExcel}
                disabled={exporting || voters.length === 0}
                className="btn-primary flex items-center gap-2 mx-auto"
              >
                {exporting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <Table className="h-5 w-5" />
                )}
                Télécharger Excel
              </button>
            </div>
          </div>
        </div>

        {/* Summary */}
        {voters.length > 0 && (
          <div className="card-gradient mt-8">
            <h3 className="text-xl font-bold text-white mb-4">Résumé des Données</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-accent-blue">{voters.length}</p>
                <p className="text-primary-300 text-sm">Total Électeurs</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-400">
                  {voters.filter(v => v.a_vote === 'Oui').length}
                </p>
                <p className="text-primary-300 text-sm">Ont Voté</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-400">
                  {voters.filter(v => v.a_vote === 'Non').length}
                </p>
                <p className="text-primary-300 text-sm">N'ont pas Voté</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-accent-yellow">
                  {new Set(voters.map(v => v.commune)).size}
                </p>
                <p className="text-primary-300 text-sm">Communes</p>
              </div>
            </div>
          </div>
        )}

        {voters.length === 0 && (
          <div className="card-gradient text-center">
            <p className="text-primary-400 text-lg">Aucune donnée à exporter</p>
            <Link href="/voters/register" className="btn-primary mt-4 inline-flex items-center gap-2">
              Enregistrer un électeur
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
