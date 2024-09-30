import { BreadcrumbItem, Breadcrumbs } from '@nextui-org/breadcrumbs';
import React, { ReactNode, useState } from 'react';

type NavItem = {
  name: string;
  href: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
};

type BrandSidebarProps = {
  children: ReactNode;
};

const navigation: NavItem[] = [
  {
    name: 'Cursos',
    href: '/Cursos',
    icon: (props) => (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    name: 'Usuarios',
    href: '#',
    icon: (props) => (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
  {
    name: 'Productos',
    href: '/Productos',
    icon: (props) => (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    name: 'Noticias',
    href: '/Noticias',
    icon: (props) => (
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props} strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
</svg>

    ),
  },
  {
    name: 'Analíticas',
    href: '#',
    icon: (props) => (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
];

export default function BrandSidebar({ children }: BrandSidebarProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-fit bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`bg-white text-gray-600 w-64 min-h-screen p-4 ${isSidebarOpen ? 'block' : 'hidden'} md:block transition-all duration-200 ease-in-out`}
      >
        <div className="flex items-center justify-between mb-6 pr-4">
          <div className="flex items-center">
            <svg className="h-8 w-8 fill-current text-blue-300" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
            <span className="text-xl font-bold ml-2">Basquet Formativo</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden focus:outline-none"
            aria-label="Cerrar menú"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav>
          <ul className="space-y-2">
            {navigation.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  className="flex items-center space-x-2 px-4 py-2  hover:bg-blue-600 transition-colors  hover:shadow-blue-500 rounded  hover:shadow-xl hover:text-white ease-out duration-300"
                >
                  <item.icon className="h-5 w-5" aria-hidden="true" />
                  <span>{item.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

      </aside>

      {/* Área de contenido principal */}
      <div className="flex-1">
        {/* Header */}
        <header className="bg-white shadow-sm">
          {/* <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="md:hidden bg-blue-600 text-white p-2 rounded-md focus:outline-none"
                aria-label="Abrir menú"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div> */}
        </header>

        {/* Contenido dinámico */}
        <div className='w-full min-h-[100vh] p-3 bg-white' >
        <main className="overflow-hidden  max-w-7xl mx-auto h-full py-6 sm:px-6 lg:px-8 rounded bg-gray-100 ">

          {children}
        </main>
        </div>
      </div>
    </div>
  );
}
