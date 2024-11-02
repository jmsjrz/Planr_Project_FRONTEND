// src/components/navigation/navItems.ts

import { Hash, Home, CalendarIcon, Settings, Heart, Ticket } from 'lucide-react';

export const navItems = [
  { title: 'Accueil', url: '', icon: Home },
  { title: 'Explorer', url: 'explorer', icon: Hash },
  { title: 'Mes Événements', url: 'my-events', icon: CalendarIcon },
  { title: 'Paramètres', url: 'settings', icon: Settings },
  { title: 'Liste de Souhaits', url: 'my-wishlist', icon: Heart },
  {
    title: 'Mes Billets',
    url: 'mes-billets',
    icon: Ticket,
    subItems: [
      { title: 'À venir', url: 'mes-billets/a-venir' },
      { title: 'Passés', url: 'mes-billets/passes' },
    ],
  },
];
