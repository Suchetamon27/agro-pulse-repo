import Dashboard from './pages/Dashboard';
import Marketplace from './pages/Marketplace';
import MarketIntelligence from './pages/MarketIntelligence';
import SeedToolSwap from './pages/SeedToolSwap';
import Financial from './pages/Financial';
import Map from './pages/Map';
import Shop from './pages/Shop';
import Community from './pages/Community';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Dashboard',
    path: '/',
    element: <Dashboard />
  },
  {
    name: 'Map',
    path: '/map',
    element: <Map />
  },
  {
    name: 'Market Intelligence',
    path: '/market',
    element: <MarketIntelligence />
  },
  {
    name: 'Shop',
    path: '/shop',
    element: <Shop />
  },
  {
    name: 'Seed & Tool Swap',
    path: '/swap',
    element: <SeedToolSwap />
  },
  {
    name: 'Financial',
    path: '/financial',
    element: <Financial />
  },
  {
    name: 'Community',
    path: '/community',
    element: <Community />
  },
  {
    name: 'Marketplace',
    path: '/marketplace',
    element: <Marketplace />
  }
];

export default routes;
