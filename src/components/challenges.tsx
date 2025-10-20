"use client"

import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured, demoChallenges, demoParticipants, type Challenge, type ChallengeParticipant } from '@/lib/supabase'
import { Trophy, Users, Calendar, Target, Plus } from 'lucide-react'

interface ChallengesProps {
  userId: string
}

export function Challenges({ userId }: ChallengesProps) {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [myParticipations, setMyParticipations] = useState<ChallengeParticipant[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchChallenges()
    fetchMyParticipations()
  }, [userId])

  const fetchChallenges = async () => {
    try {
      // Se Supabase não estiver configurado, usar dados demo
      if (!isSupabaseConfigured || !supabase) {
        setChallenges(demoChallenges)
        setLoading(false)
        return
      }

      // Só fazer requisição se Supabase estiver configurado
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .order('start_date', { ascending: false })

      if (error) throw error
      setChallenges(data || [])
    } catch (error) {
      console.error('Erro ao buscar desafios:', error)
      // Em caso de erro, usar dados demo como fallback
      setChallenges(demoChallenges)
    } finally {
      setLoading(false)
    }
  }

  const fetchMyParticipations = async () => {
    try {
      // Se Supabase não estiver configurado, usar dados demo
      if (!isSupabaseConfigured || !supabase) {
        setMyParticipations(demoParticipants)
        return
      }

      // Só fazer requisição se Supabase estiver configurado
      const { data, error } = await supabase
        .from('challenge_participants')
        .select('*')
        .eq('user_id', userId)

      if (error) throw error
      setMyParticipations(data || [])
    } catch (error) {
      console.error('Erro ao buscar participações:', error)
      // Em caso de erro, usar dados demo como fallback
      setMyParticipations(demoParticipants)
    }
  }

  const joinChallenge = async (challengeId: string) => {
    try {
      // Se Supabase não estiver configurado, adicionar localmente
      if (!isSupabaseConfigured || !supabase) {
        const newParticipation: ChallengeParticipant = {
          id: Date.now().toString(),
          challenge_id: challengeId,
          user_id: userId,
          progress_km: 0,
          joined_at: new Date().toISOString()
        }
        setMyParticipations(prev => [...prev, newParticipation])
        return
      }

      // Só fazer requisição se Supabase estiver configurado
      const { error } = await supabase
        .from('challenge_participants')
        .insert({
          challenge_id: challengeId,
          user_id: userId,
          progress_km: 0,
        })

      if (error) throw error
      await fetchMyParticipations()
    } catch (error) {
      console.error('Erro ao participar do desafio:', error)
      // Em caso de erro, adicionar localmente como fallback
      const newParticipation: ChallengeParticipant = {
        id: Date.now().toString(),
        challenge_id: challengeId,
        user_id: userId,
        progress_km: 0,
        joined_at: new Date().toISOString()
      }
      setMyParticipations(prev => [...prev, newParticipation])
    }
  }

  const createChallenge = async (challenge: Omit<Challenge, 'id' | 'created_by'>) => {
    try {
      // Se Supabase não estiver configurado, adicionar localmente
      if (!isSupabaseConfigured || !supabase) {
        const newChallenge: Challenge = {
          ...challenge,
          id: Date.now().toString(),
          created_by: userId
        }
        setChallenges(prev => [newChallenge, ...prev])
        setShowForm(false)
        return
      }

      // Só fazer requisição se Supabase estiver configurado
      const { error } = await supabase
        .from('challenges')
        .insert({
          ...challenge,
          created_by: userId,
        })

      if (error) throw error
      await fetchChallenges()
      setShowForm(false)
    } catch (error) {
      console.error('Erro ao criar desafio:', error)
      // Em caso de erro, adicionar localmente como fallback
      const newChallenge: Challenge = {
        ...challenge,
        id: Date.now().toString(),
        created_by: userId
      }
      setChallenges(prev => [newChallenge, ...prev])
      setShowForm(false)
    }
  }

  const isParticipating = (challengeId: string) => {
    return myParticipations.some(p => p.challenge_id === challengeId)
  }

  const getParticipation = (challengeId: string) => {
    return myParticipations.find(p => p.challenge_id === challengeId)
  }

  const getChallengeStatus = (challenge: Challenge) => {
    const now = new Date()
    const start = new Date(challenge.start_date)
    const end = new Date(challenge.end_date)

    if (now < start) return 'upcoming'
    if (now > end) return 'finished'
    return 'active'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800'
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'finished':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'Em breve'
      case 'active':
        return 'Ativo'
      case 'finished':
        return 'Finalizado'
      default:
        return 'Desconhecido'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Demo Notice */}
      {!isSupabaseConfigured && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center gap-2">
            <span className="text-blue-600">🎯</span>
            <div>
              <p className="text-blue-800 font-medium">Modo Demonstração</p>
              <p className="text-blue-700 text-sm">
                Você está vendo dados de exemplo. Para criar e participar de desafios reais, conecte sua conta Supabase nas configurações.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Desafios</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Criar Desafio
        </button>
      </div>

      {/* My Active Challenges */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-emerald-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Meus Desafios Ativos</h3>
        <div className="space-y-4">
          {myParticipations.length === 0 ? (
            <p className="text-gray-600">Você ainda não está participando de nenhum desafio.</p>
          ) : (
            myParticipations.map((participation) => {
              const challenge = challenges.find(c => c.id === participation.challenge_id)
              if (!challenge || getChallengeStatus(challenge) !== 'active') return null

              const progress = (participation.progress_km / challenge.goal_distance_km) * 100

              return (
                <div key={participation.id} className="border border-emerald-200 rounded-xl p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">{challenge.title}</h4>
                      <p className="text-sm text-gray-600">{challenge.description}</p>
                    </div>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      Ativo
                    </span>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progresso</span>
                      <span>{participation.progress_km.toFixed(1)} / {challenge.goal_distance_km} km</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      ></div>
                    </div>
                    <div className="text-right text-sm text-emerald-600 font-medium mt-1">
                      {progress.toFixed(1)}% completo
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* All Challenges */}
      <div className="grid gap-6">
        {challenges.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg border border-emerald-100">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum desafio disponível</h3>
            <p className="text-gray-600 mb-6">Seja o primeiro a criar um desafio para a comunidade!</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-300"
            >
              Criar Primeiro Desafio
            </button>
          </div>
        ) : (
          challenges.map((challenge) => {
            const status = getChallengeStatus(challenge)
            const participating = isParticipating(challenge.id)
            const participation = getParticipation(challenge.id)

            return (
              <div key={challenge.id} className="bg-white p-6 rounded-2xl shadow-lg border border-emerald-100 hover:shadow-xl transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{challenge.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
                        {getStatusText(status)}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">{challenge.description}</p>
                    
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Target className="h-4 w-4" />
                        Meta: {challenge.goal_distance_km} km
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(challenge.start_date).toLocaleDateString('pt-BR')} - {new Date(challenge.end_date).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-3 rounded-xl">
                      <Trophy className="h-6 w-6 text-white" />
                    </div>
                    
                    {status === 'active' && !participating && (
                      <button
                        onClick={() => joinChallenge(challenge.id)}
                        className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-lg font-medium hover:from-emerald-600 hover:to-teal-700 transition-all duration-300"
                      >
                        Participar
                      </button>
                    )}
                    
                    {participating && participation && (
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Seu progresso</div>
                        <div className="text-lg font-semibold text-emerald-600">
                          {participation.progress_km.toFixed(1)} km
                        </div>
                        <div className="text-sm text-gray-500">
                          {((participation.progress_km / challenge.goal_distance_km) * 100).toFixed(1)}%
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Create Challenge Form Modal */}
      {showForm && (
        <ChallengeForm
          onSubmit={createChallenge}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  )
}

interface ChallengeFormProps {
  onSubmit: (challenge: Omit<Challenge, 'id' | 'created_by'>) => void
  onClose: () => void
}

function ChallengeForm({ onSubmit, onClose }: ChallengeFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [goalDistance, setGoalDistance] = useState('')
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
  const [endDate, setEndDate] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    onSubmit({
      title,
      description,
      goal_distance_km: parseFloat(goalDistance),
      start_date: startDate,
      end_date: endDate,
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Criar Novo Desafio</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título do Desafio
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Ex: Desafio 100km em Janeiro"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Descreva o desafio e motive os participantes..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta de Distância (km)
            </label>
            <input
              type="number"
              step="0.1"
              value={goalDistance}
              onChange={(e) => setGoalDistance(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="100"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data de Início
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data de Término
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              min={startDate}
              required
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-300"
            >
              Criar Desafio
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}