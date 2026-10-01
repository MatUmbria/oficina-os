'use client';

import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import Link from 'next/link';

export default function Navbar() {
  const { user, userData } = useAuth();

  if (!user) return null; // Não mostra a barra se não estiver logado

  return (
    <nav className="bg-gray-800 text-white px-4 py-3 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold text-lg hover:text-gray-300 transition">
            🛠️ Oficina OS
          </Link>

          {/* Links visíveis apenas para Administrador */}
          {userData?.role === 'admin' && (
            <div className="flex gap-4 text-sm font-medium">
              <Link href="/nova-os" className="hover:text-blue-400 transition">
                + Nova OS
              </Link>
              <Link href="/catalogo" className="hover:text-blue-400 transition">
                ⚙️ Catálogo
              </Link>
              <Link href="/admin/configuracoes" className="hover:text-blue-400 transition">
                🏢 Oficina
              </Link>
              <Link href="/admin/usuarios" className="hover:text-blue-400 transition">
                👥 Usuários
              </Link>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 text-xs md:text-sm">
          <div className="text-right">
            <span className="block font-semibold">{userData?.nome || user.email}</span>
            <span className="text-gray-400 text-xs capitalize">{userData?.role || 'Usuário'}</span>
          </div>

          <button
            onClick={() => signOut(auth)}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md transition font-medium"
          >
            Sair
          </button>
        </div>

      </div>
    </nav>
  );
}