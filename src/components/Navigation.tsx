'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Banknote, 
  CreditCard, 
  BarChart3, 
  Settings, 
  Menu, 
  X,
  Shield,
  TrendingUp,
  PiggyBank,
  Building2
} from 'lucide-react';

const navigation = [
  {
    name: 'Tableau de Bord',
    href: '/',
    icon: LayoutDashboard,
    description: 'Vue d\'ensemble de vos finances'
  },
  {
    name: 'TrueLayer Open Banking',
    href: '/truelayer',
    icon: Building2,
    description: 'Connectez vos comptes bancaires européens'
  },
  {
    name: 'Mes Comptes',
    href: '/accounts',
    icon: CreditCard,
    description: 'Gérez vos comptes et cartes'
  },
  {
    name: 'Analyses',
    href: '/analytics',
    icon: BarChart3,
    description: 'Graphiques et tendances'
  },
  {
    name: 'Épargne',
    href: '/savings',
    icon: PiggyBank,
    description: 'Suivi de votre épargne'
  },
  {
    name: 'Objectifs',
    href: '/goals',
    icon: TrendingUp,
    description: 'Définissez vos objectifs financiers'
  },
  {
    name: 'Paramètres',
    href: '/settings',
    icon: Settings,
    description: 'Configuration de votre compte'
  }
];

export default function Navigation() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Navigation mobile */}
      <div className="lg:hidden">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSidebarOpen(true)}
          className="p-2"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      {/* Sidebar mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-gray-900/80" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl">
            <div className="flex h-full flex-col">
                             {/* Header mobile */}
               <div className="flex h-16 items-center justify-between px-6 border-b">
                 <div className="flex items-center space-x-2">
                   <Shield className="h-8 w-8 text-blue-600" />
                   <span className="text-xl font-bold">OBA</span>
                 </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(false)}
                  className="p-2"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>

              {/* Navigation mobile */}
              <nav className="flex-1 space-y-1 px-4 py-4">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <item.icon
                        className={`mr-3 h-5 w-5 flex-shrink-0 ${
                          isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
                        }`}
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>

              {/* Footer mobile */}
              <div className="border-t p-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Shield className="h-4 w-4" />
                  <span>Sécurisé par Open Banking</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
                     {/* Header desktop */}
           <div className="flex h-16 shrink-0 items-center">
             <div className="flex items-center space-x-2">
               <Shield className="h-8 w-8 text-blue-600" />
               <span className="text-xl font-bold">OBA</span>
             </div>
           </div>

          {/* Navigation desktop */}
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                            isActive
                              ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                              : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                        >
                          <item.icon
                            className={`mr-3 h-5 w-5 flex-shrink-0 ${
                              isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
                            }`}
                          />
                          {item.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>

              {/* Section d'aide */}
              <li className="mt-auto">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Besoin d'aide ?</span>
                  </div>
                  <p className="text-xs text-blue-700 mb-3">
                    Notre équipe est là pour vous accompagner dans vos démarches Open Banking.
                  </p>
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    Contacter le support
                  </Button>
                </div>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Contenu principal avec padding pour le sidebar */}
      <div className="lg:pl-64">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1 items-center">
                             <h1 className="text-lg font-semibold text-gray-900">
                 {navigation.find(item => item.href === pathname)?.name || 'OBA'}
               </h1>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 