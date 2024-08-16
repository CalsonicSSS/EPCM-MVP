'use client';

import { isActive } from '@/utils/helperFunction';
import { PersonIcon, GearIcon, ExitIcon, DashboardIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { href: '/', icon: DashboardIcon, label: 'Dashboard' },
    { href: '/profile', icon: PersonIcon, label: 'Profile' },
    { href: '/settings', icon: GearIcon, label: 'Settings' },
  ];

  return (
    <div className='w-64 bg-gray-800 text-white h-full flex flex-col p-5'>
      <div className='flex justify-left items-center mb-10'>
        <Image src='/epcm_logo.png' alt='EPCM Logo' width={65} height={50} quality={100} />
        <span className='p-4 text-3xl font-bold flex justify-center'>EPCM</span>
      </div>
      <nav className='flex-1'>
        <ul className='space-y-5'>
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className={`flex items-center space-x-2 p-2 rounded-lg ${isActive(pathname, item.href) ? 'bg-gray-700 text-white' : 'hover:bg-gray-700'}`}>
                <item.icon className='w-5 h-5' />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div>
        <Link href='/logout' className='flex items-center space-x-2 p-2 hover:bg-gray-700 rounded-lg'>
          <ExitIcon className='w-5 h-5' />
          <span>Logout</span>
        </Link>
      </div>
    </div>
  );
}
