"use client"

import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured, demoActivities, type Activity } from '@/lib/supabase'
import { Plus, Calendar, Clock, Zap, TrendingUp } from 'lucide-react'

interface ActivitiesProps {
  userId: string
}

export function Activities({ userId }: ActivitiesProps) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchActivities()
  }, [userId])

  const fetchActivities = async () => {
    try {
      // Se Supabase não estiver configurado, usar dados demo
      if (!isSupabaseConfigured || !supabase) {
        setActivities(demoActivities)
        setLoading(false)
        return
      }

      // Só fazer requisição se Supabase estiver configurado
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false })

      if (error) throw error
      setActivities(data || [])
    } catch (error) {
      console.error('Erro ao buscar atividades:', error)
      // Em caso de erro, usar dados demo como fallback
      setActivities(demoActivities)
    } finally {
      setLoading(false)
    }
  }

  const addActivity = async (activity: Omit<Activity, 'id' | 'user_id' | 'created_at'>) => {
    try {
      // Se Supabase não estiver configurado, adicionar localmente
      if (!isSupabaseConfigured || !supabase) {
        const newActivity: Activity = {
          ...activity,
          id: Date.now().toString(),
          user_id: userId,
          created_at: new Date().toISOString()
        }
        setActivities(prev => [newActivity, ...prev])
        setShowForm(false)
        return
      }

      // Só fazer requisição se Supabase estiver configurado
      const { error } = await supabase
        .from('activities')
        .insert({
          ...activity,
          user_id: userId,
        })

      if (error) throw error
      await fetchActivities()
      setShowForm(false)
    } catch (error) {
      console.error('Erro ao adicionar atividade:', error)
      // Em caso de erro, adicionar localmente como fallback
      const newActivity: Activity = {
        ...activity,
        id: Date.now().toString(),
        user_id: userId,
        created_at: new Date().toISOString()
      }
      setActivities(prev => [newActivity, ...prev])
      setShowForm(false)
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'corrida':
        return '🏃‍♂️'
      case 'caminhada':
        return '🚶‍♂️'
      case 'pedalada':
        return '🚴‍♂️'
      case 'natação':
        return '🏊‍♂️'
      default:
        return '💪'
    }
  }

  const totalDistance = activities.reduce((sum, activity) => sum + activity.distance_km, 0)
  const totalCalories = activities.reduce((sum, activity) => sum + activity.calories, 0)
  const totalDuration = activities.reduce((sum, activity) => sum + activity.duration_min, 0)

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
                Você está vendo dados de exemplo. Para salvar suas atividades reais, conecte sua conta Supabase nas configurações.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-emerald-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Distância Total</p>
              <p className="text-2xl font-bold text-gray-900">{totalDistance.toFixed(1)} km</p>
            </div>
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-3 rounded-xl">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-emerald-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Calorias Queimadas</p>
              <p className="text-2xl font-bold text-gray-900">{totalCalories.toLocaleString()}</p>
            </div>
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-3 rounded-xl">
              <Zap className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-emerald-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tempo Total</p>
              <p className="text-2xl font-bold text-gray-900">{Math.floor(totalDuration / 60)}h {totalDuration % 60}m</p>
            </div>
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-3 rounded-xl">
              <Clock className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Add Activity Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Suas Atividades</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Nova Atividade
        </button>
      </div>

      {/* Activities List */}
      <div className="space-y-4">
        {activities.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg border border-emerald-100">
            <div className="text-6xl mb-4">🏃‍♂️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhuma atividade ainda</h3>
            <p className="text-gray-600 mb-6">Registre sua primeira atividade e comece sua jornada!</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-300"
            >
              Adicionar Atividade
            </button>
          </div>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="bg-white p-6 rounded-2xl shadow-lg border border-emerald-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{getActivityIcon(activity.type)}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 capitalize">{activity.type}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(activity.date).toLocaleDateString('pt-BR')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {activity.duration_min} min
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-emerald-600">{activity.distance_km} km</div>
                  <div className="text-sm text-gray-600">{activity.calories} cal</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Activity Form Modal */}
      {showForm && (
        <ActivityForm
          onSubmit={addActivity}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  )
}

interface ActivityFormProps {
  onSubmit: (activity: Omit<Activity, 'id' | 'user_id' | 'created_at'>) => void
  onClose: () => void
}

function ActivityForm({ onSubmit, onClose }: ActivityFormProps) {
  const [type, setType] = useState('corrida')
  const [distance, setDistance] = useState('')
  const [duration, setDuration] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const distanceKm = parseFloat(distance)
    const durationMin = parseInt(duration)
    const calories = Math.round(distanceKm * 60) // Estimativa simples

    onSubmit({
      type,
      distance_km: distanceKm,
      duration_min: durationMin,
      calories,
      date,
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Nova Atividade</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Atividade
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="corrida">Corrida</option>
              <option value="caminhada">Caminhada</option>
              <option value="pedalada">Pedalada</option>
              <option value="natação">Natação</option>
              <option value="musculação">Musculação</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Distância (km)
            </label>
            <input
              type="number"
              step="0.1"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="5.0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duração (minutos)
            </label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="30"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}