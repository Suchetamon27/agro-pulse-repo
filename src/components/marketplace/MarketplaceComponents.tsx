import React, { useEffect, useState } from 'react';
import { User, MapPin, Share2, DollarSign, Clock, ArrowRight, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getMarketplaceData, getRecentTransactions, Transaction } from '@/db/api';

export const FarmerList: React.FC = () => {
  const [dataStreams, setDataStreams] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMarketplace = async () => {
      setLoading(true);
      const data = await getMarketplaceData();
      if (data) {
        setDataStreams(data.data_streams?.slice(0, 3) || []);
        setStats(data.marketplace_stats);
      }
      setLoading(false);
    };
    loadMarketplace();
  }, []);

  if (loading) {
    return (
      <Card className="border-none shadow-md bg-card">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-md bg-card">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Share2 className="w-5 h-5 text-accent" />
          Nearby Data Providers
        </CardTitle>
        <CardDescription>
          Micro-climate and soil data shared by local agricultural partners across India
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {dataStreams.map((stream) => {
          const initials = stream.farm_name?.split(' ').map((w: string) => w[0]).join('').slice(0, 2) || 'FA';
          return (
            <div key={stream.farmer_id} className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-accent/50 hover:bg-accent/5 transition-all group">
              <Avatar className="h-12 w-12 border-2 border-background">
                <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold truncate">{stream.farm_name}</h4>
                  <div className={`w-2 h-2 rounded-full ${stream.status === 'online' ? 'bg-green-500' : 'bg-slate-300'}`} />
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                  <MapPin className="w-3 h-3" />
                  <span>{stream.location?.district}, {stream.location?.state}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {stream.available_data?.soil_health && (
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Soil Health</Badge>
                  )}
                  {stream.available_data?.temperature && (
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Temperature</Badge>
                  )}
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-sm font-bold text-primary mb-1">₹{stream.price_per_request}/req</div>
                <Button size="sm" variant="outline" className="h-8 text-xs group-hover:bg-accent group-hover:text-accent-foreground">
                  Buy Data
                  <ArrowRight className="ml-1 w-3 h-3" />
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export const WalletCard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTransactions = async () => {
      const data = await getRecentTransactions();
      setTransactions(data.slice(0, 3));
      setLoading(false);
    };
    loadTransactions();
  }, []);

  return (
    <Card className="border-none shadow-md bg-primary text-primary-foreground">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <CardTitle className="text-lg font-medium opacity-80">Wallet Balance</CardTitle>
          <div className="p-2 bg-white/10 rounded-full">
            <DollarSign className="w-5 h-5 text-accent" />
          </div>
        </div>
        <div className="text-4xl font-bold tracking-tight">₹4,265</div>
        <CardDescription className="text-primary-foreground/60">
          Accumulated earnings from data sharing
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <h5 className="text-xs font-semibold uppercase tracking-wider mb-3 opacity-60">Recent Activity</h5>
        {loading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between text-sm py-2 border-b border-white/10 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-full bg-green-500/20">
                    <Clock className="w-3 h-3" />
                  </div>
                  <span className="truncate">{tx.data_type}</span>
                </div>
                <span className="font-mono font-bold text-accent">
                  +₹{Math.abs(parseFloat(tx.amount.toString()))}
                </span>
              </div>
            ))}
          </div>
        )}
        <Button className="w-full mt-6 bg-accent text-accent-foreground hover:bg-accent/90">
          Withdraw Funds
        </Button>
      </CardContent>
    </Card>
  );
};
