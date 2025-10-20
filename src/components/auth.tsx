"use client"

import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured, demoUser, type User } from '@/lib/supabase'
import { User as UserIcon } from 'lucide-react'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      // Modo demo - usar dados locais
      setUser(demoUser)
      setLoading(false)
      return
    }

    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await fetchUserProfile(session.user.id)
        } else {
          setUser(null)
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (userId: string) => {
    if (!supabase) return
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      setUser(data)
    } catch (error) {
      console.error('Erro ao buscar perfil:', error)
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured || !supabase) {
      // Modo demo - simular login
      setUser(demoUser)
      return { error: null }
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      return { error }
    } catch (error) {
      console.error('Erro no login:', error)
      return { error: { message: 'Erro de conexão. Tente novamente.' } }
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    if (!isSupabaseConfigured || !supabase) {
      // Modo demo - simular cadastro
      const newUser = {
        ...demoUser,
        name,
        email,
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
      }
      setUser(newUser)
      return { error: null }
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (data.user && !error) {
        // Criar perfil do usuário
        await supabase.from('users').insert({
          id: data.user.id,
          email,
          name,
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
        })
      }

      return { error }
    } catch (error) {
      console.error('Erro no cadastro:', error)
      return { error: { message: 'Erro de conexão. Tente novamente.' } }
    }
  }

  const signOut = async () => {
    if (!isSupabaseConfigured || !supabase) {
      // Modo demo - simular logout
      setUser(null)
      return
    }

    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Erro no logout:', error)
    }
  }

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  }
}

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn, signUp } = useAuth()

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isLogin) {
        const { error } = await signIn(email, password)
        if (error && isSupabaseConfigured) {
          throw error
        }
      } else {
        const { error } = await signUp(email, password, name)
        if (error && isSupabaseConfigured) {
          throw error
        }
      }
      
      // Sempre fechar o modal após a tentativa
      onClose()
      
      // Limpar campos
      setEmail('')
      setPassword('')
      setName('')
      
    } catch (error: any) {
      if (isSupabaseConfigured) {
        alert(error.message || 'Erro desconhecido')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md relative">
        <div className="text-center mb-6">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <UserIcon className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {isLogin ? 'Entrar na Andra' : 'Criar Conta'}
          </h2>
          <p className="text-gray-600 mt-2">
            {isLogin ? 'Continue sua jornada de bem-estar' : 'Comece sua transformação hoje'}
          </p>
          {!isSupabaseConfigured && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                🎯 <strong>Modo Demo:</strong> Explore todas as funcionalidades! Para salvar dados reais, conecte seu Supabase.
              </p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome Completo
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Seu nome"
                required
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="seu@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 disabled:opacity-50"
          >
            {loading ? 'Carregando...' : (isLogin ? 'Entrar' : 'Criar Conta')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-emerald-600 hover:text-emerald-700 font-medium"
          >
            {isLogin ? 'Não tem conta? Criar uma' : 'Já tem conta? Entrar'}
          </button>
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>
    </div>
  )
}