import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { FarmerList, WalletCard } from '@/components/marketplace/MarketplaceComponents';
import { ShoppingCart, Search, Filter, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Marketplace: React.FC = () => {
  const [stats, setStats] = useState<any>(null);

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-primary">Data Marketplace</h1>
            <p className="text-muted-foreground">Exchange agricultural insights with your community and earn.</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-4 py-2 rounded-full border border-border">
            <ShieldCheck className="w-4 h-4 text-accent" />
            Verified Blockchain Transactions
          </div>
        </div>

        {/* Search & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
           <div className="lg:col-span-3 space-y-6">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input className="pl-10 bg-card border-none shadow-sm h-11" placeholder="Search for specific crop data or locations..." />
                </div>
                <Button variant="outline" className="h-11 px-4 gap-2">
                  <Filter className="w-4 h-4" />
                  Filters
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="px-3 py-1 cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors">Soil Health</Badge>
                <Badge variant="secondary" className="px-3 py-1 cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors">Pest Monitoring</Badge>
                <Badge variant="secondary" className="px-3 py-1 cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors">Irrigation Efficiency</Badge>
                <Badge variant="secondary" className="px-3 py-1 cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors">Yield History</Badge>
              </div>

              <FarmerList />
              
              <div className="relative overflow-hidden rounded-2xl bg-secondary text-secondary-foreground p-8">
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-3">Maximize Your Farm's Potential</h3>
                    <p className="opacity-80 mb-6">Join our network of 500+ local farmers sharing real-time soil and pest data. Gain insights you can't get anywhere else.</p>
                    <Button className="bg-white text-secondary hover:bg-white/90">Get Started Today</Button>
                  </div>
                  <div className="w-48 h-48 rounded-2xl overflow-hidden shadow-2xl rotate-3 shrink-0">
                    <img src="https://miaoda-site-img.s3cdn.medo.dev/images/KLing_3644813d-0b71-4805-bdc9-16f31a0d9cf6.jpg" alt="Farmer using tablet" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
           </div>

           <div className="space-y-6">
              <WalletCard />
              
              <div className="bg-card p-6 rounded-2xl shadow-md border-none space-y-4">
                 <h4 className="font-bold flex items-center gap-2">
                   <ArrowUpRight className="w-4 h-4 text-accent" />
                   Market Trends
                 </h4>
                 <div className="space-y-4">
                    <div className="flex justify-between items-end border-b border-border pb-3">
                       <span className="text-xs text-muted-foreground uppercase">Total Providers</span>
                       <span className="font-bold">10</span>
                    </div>
                    <div className="flex justify-between items-end border-b border-border pb-3">
                       <span className="text-xs text-muted-foreground uppercase">Avg Price</span>
                       <span className="font-bold">₹6 / req</span>
                    </div>
                    <div className="flex justify-between items-end border-b border-border pb-3">
                       <span className="text-xs text-muted-foreground uppercase">Demand Index</span>
                       <span className="font-bold text-accent">High</span>
                    </div>
                    <div className="flex justify-between items-end">
                       <span className="text-xs text-muted-foreground uppercase">Top Demand</span>
                       <span className="font-bold">Soil Health</span>
                    </div>
                 </div>
              </div>

              <Button variant="outline" className="w-full border-dashed border-2 py-8 flex flex-col gap-2 h-auto text-muted-foreground hover:text-accent hover:border-accent">
                 <ShoppingCart className="w-6 h-6" />
                 <span>List Your Own Data</span>
              </Button>
           </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Marketplace;
