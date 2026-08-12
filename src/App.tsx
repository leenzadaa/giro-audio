import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { MobileNav } from '@/components/layout/MobileNav'
import { HomePage } from '@/pages/HomePage'
import { ProjectsPage } from '@/pages/ProjectsPage'
import { ProjectDetailPage } from '@/pages/ProjectDetailPage'
import { CreateProjectPage } from '@/pages/CreateProjectPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { ListingsPage } from '@/pages/ListingsPage'
import { RankingPage } from '@/pages/RankingPage'
import { CalculatorsPage } from '@/pages/CalculatorsPage'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Header />
        <main className="flex-1 pb-20 md:pb-0">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/projetos" element={<ProjectsPage />} />
            <Route path="/projeto/:id" element={<ProjectDetailPage />} />
            <Route path="/criar-projeto" element={<CreateProjectPage />} />
            <Route path="/perfil/:username" element={<ProfilePage />} />
            <Route path="/entrar" element={<LoginPage />} />
            <Route path="/cadastrar" element={<RegisterPage />} />
            <Route path="/anuncios" element={<ListingsPage />} />
            <Route path="/ranking" element={<RankingPage />} />
            <Route path="/calculadoras" element={<CalculatorsPage />} />
          </Routes>
        </main>
        <MobileNav />
      </div>
    </BrowserRouter>
  )
}