'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import UserMenu from './UserMenu';

const NAV_ITEMS = [
  { href: '/', label: 'Mes tâches' },
  { href: '/shared', label: 'Listes partagées' },
];

const Navigation = () => {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navigation principale"
      className="w-full rounded-[2rem] border border-stone-200 bg-white p-4 shadow-sm"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <ul className="flex flex-wrap items-center gap-2" aria-label="Liens de navigation">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-bold transition ${
                    isActive
                      ? 'bg-[#3D6FE8] text-white shadow-sm'
                      : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="lg:min-w-[320px]">
          <UserMenu />
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
