// src/components/navigation/navItems.ts

import { Hash, Home, CalendarIcon, Settings, Heart, Ticket } from 'lucide-react';

export const navItems = [
  { title: 'Accueil', url: '', icon: Home },
  { title: 'Explorer', url: 'explorer', icon: Hash },
  { title: 'Mes Événements', url: 'mes-evenements', icon: CalendarIcon },
  { title: 'Paramètres', url: 'settings', icon: Settings },
  {
    title: 'Liste de Souhaits',
    url: 'liste-de-souhaits',
    icon: Heart,
    subItems: [
      { title: 'Conférences', url: 'liste-de-souhaits/conferences' },
      { title: 'Festivals', url: 'liste-de-souhaits/festivals' },
      { title: 'Expositions', url: 'liste-de-souhaits/expositions' },
    ],
  },
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
