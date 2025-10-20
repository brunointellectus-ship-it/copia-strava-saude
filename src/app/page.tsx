"use client"

import { useState } from 'react'
import { Heart, Activity, Trophy, User, LogOut, Menu, X } from 'lucide-react'
import { useAuth, AuthModal } from '@/components/auth'
import { Activities } from '@/components/activities'
import { Challenges } from '@/components/challenges'

export default function Home() {
  const { user, loading, signOut } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-emerald-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-2 rounded-xl">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 tracking-tight">ANDRA</h1>
                  <p className="text-xs text-emerald-600 font-medium -mt-1">MOVIMENTO COM PROPÓSITO</p>
                </div>
              </div>
              
              {/* CTA Button */}
              <button 
                onClick={() => setShowAuthModal(true)}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-2 rounded-full font-medium hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Entrar
              </button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-16">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl mb-6 shadow-2xl">
                <Heart className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 tracking-tight">
                ANDRA
              </h1>
              <p className="text-lg text-emerald-600 font-semibold mb-6 tracking-wide">
                MOVIMENTO COM PROPÓSITO
              </p>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Transforme movimento em <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600">bem-estar</span>
            </h2>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              A plataforma mais humana e motivadora para quem quer se movimentar com propósito. 
              Conecte-se, desafie-se e conquiste uma vida mais saudável junto com nossa comunidade.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => setShowAuthModal(true)}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 flex items-center gap-2"
              >
                <Heart className="h-5 w-5" />
                Iniciar Jornada
              </button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-emerald-100">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Desafios Personalizados</h3>
              <p className="text-gray-600 leading-relaxed">
                Crie e participe de desafios que se adaptam ao seu ritmo e objetivos. 
                Cada conquista é um passo em direção ao seu bem-estar.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-emerald-100">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Registro de Atividades</h3>
              <p className="text-gray-600 leading-relaxed">
                Registre suas atividades físicas e acompanhe seu progresso de forma simples e motivadora.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-emerald-100">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Bem-estar Integral</h3>
              <p className="text-gray-600 leading-relaxed">
                Foque no bem-estar, não apenas na performance. Celebre cada vitória no caminho para uma vida mais ativa.
              </p>
            </div>
          </div>

          {/* CTA Final */}
          <div className="text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              Pronto para começar sua transformação?
            </h3>
            <button 
              onClick={() => setShowAuthModal(true)}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-10 py-4 rounded-full font-semibold text-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
            >
              Entrar na Andra
            </button>
          </div>
        </main>

        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-2 rounded-xl">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">ANDRA</h1>
                <p className="text-xs text-emerald-600 font-medium -mt-1">MOVIMENTO COM PROPÓSITO</p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`font-medium transition-colors ${
                  activeTab === 'dashboard' 
                    ? 'text-emerald-600' 
                    : 'text-gray-700 hover:text-emerald-600'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('activities')}
                className={`font-medium transition-colors ${
                  activeTab === 'activities' 
                    ? 'text-emerald-600' 
                    : 'text-gray-700 hover:text-emerald-600'
                }`}
              >
                Atividades
              </button>
              <button
                onClick={() => setActiveTab('challenges')}
                className={`font-medium transition-colors ${
                  activeTab === 'challenges' 
                    ? 'text-emerald-600' 
                    : 'text-gray-700 hover:text-emerald-600'
                }`}
              >
                Desafios
              </button>
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-3">
                <img
                  src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                  alt={user.name}
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-gray-700 font-medium">{user.name}</span>
              </div>
              
              <button
                onClick={signOut}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                title="Sair"
              >
                <LogOut className="h-5 w-5" />
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-gray-500 hover:text-gray-700"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-emerald-100 py-4">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center space-x-3 px-4 py-2">
                  <img
                    src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                    alt={user.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-gray-700 font-medium">{user.name}</span>
                </div>
                
                <button
                  onClick={() => {
                    setActiveTab('dashboard')
                    setMobileMenuOpen(false)
                  }}
                  className={`text-left px-4 py-2 font-medium transition-colors ${
                    activeTab === 'dashboard' 
                      ? 'text-emerald-600 bg-emerald-50' 
                      : 'text-gray-700 hover:text-emerald-600'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => {
                    setActiveTab('activities')
                    setMobileMenuOpen(false)
                  }}
                  className={`text-left px-4 py-2 font-medium transition-colors ${
                    activeTab === 'activities' 
                      ? 'text-emerald-600 bg-emerald-50' 
                      : 'text-gray-700 hover:text-emerald-600'
                  }`}
                >
                  Atividades
                </button>
                <button
                  onClick={() => {
                    setActiveTab('challenges')
                    setMobileMenuOpen(false)
                  }}
                  className={`text-left px-4 py-2 font-medium transition-colors ${
                    activeTab === 'challenges' 
                      ? 'text-emerald-600 bg-emerald-50' 
                      : 'text-gray-700 hover:text-emerald-600'
                  }`}
                >
                  Desafios
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && <Dashboard user={user} />}
        {activeTab === 'activities' && <Activities userId={user.id} />}
        {activeTab === 'challenges' && <Challenges userId={user.id} />}
      </main>
    </div>
  )
}

function Dashboard({ user }: { user: any }) {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-emerald-100">
        <div className="flex items-center space-x-4 mb-6">
          <img
            src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
            alt={user.name}
            className="w-16 h-16 rounded-full"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Olá, {user.name}! 👋</h1>
            <p className="text-gray-600">Pronto para mais um dia de movimento com propósito?</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl">
            <Activity className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">Atividades</h3>
            <p className="text-sm text-gray-600">Registre seus exercícios</p>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl">
            <Trophy className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">Desafios</h3>
            <p className="text-sm text-gray-600">Participe e crie desafios</p>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl">
            <Heart className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">Bem-estar</h3>
            <p className="text-sm text-gray-600">Foque na sua saúde</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-emerald-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Suas Estatísticas</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Atividades esta semana</span>
              <span className="font-semibold text-emerald-600">0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Distância total</span>
              <span className="font-semibold text-emerald-600">0 km</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Desafios ativos</span>
              <span className="font-semibold text-emerald-600">0</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-emerald-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Motivação do Dia</h3>
          <div className="text-center">
            <div className="text-4xl mb-3">💪</div>
            <p className="text-gray-600 italic">
              "O movimento é uma medicina para criar mudanças físicas, emocionais e mentais."
            </p>
            <p className="text-sm text-gray-500 mt-2">- Carol Welch</p>
          </div>
        </div>
      </div>
    </div>
  )
}