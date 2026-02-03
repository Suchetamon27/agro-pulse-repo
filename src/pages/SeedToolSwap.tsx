import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Plus, Package, Wrench, Tractor, Search, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getListings, createListingRequest } from '@/db/api';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';

interface Listing {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: string;
  item_type?: string;
  quantity: string;
  price_per_unit?: number;
  rental_price_per_day?: number;
  is_for_rent: boolean;
  is_for_sale: boolean;
  location: string;
  available: boolean;
  created_at: string;
}

const SeedToolSwap: React.FC = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [listings, setListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [requestType, setRequestType] = useState<'purchase' | 'rent'>('purchase');
  const [requestQuantity, setRequestQuantity] = useState('');
  const [requestMessage, setRequestMessage] = useState('');

  useEffect(() => {
    loadListings();
  }, []);

  useEffect(() => {
    filterListings();
  }, [listings, categoryFilter, searchQuery]);

  const loadListings = async () => {
    setLoading(true);
    const data = await getListings();
    setListings(data);
    setLoading(false);
  };

  const filterListings = () => {
    let filtered = [...listings];

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(l => l.category === categoryFilter);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(l =>
        l.title.toLowerCase().includes(query) ||
        l.description?.toLowerCase().includes(query) ||
        l.location.toLowerCase().includes(query)
      );
    }

    setFilteredListings(filtered);
  };

  const handleSendRequest = async () => {
    if (!selectedListing) return;

    const request = {
      listing_id: selectedListing.id,
      requester_id: 'mock-user-id',
      owner_id: selectedListing.user_id,
      message: requestMessage || `I would like to ${requestType} this item.`,
      request_type: requestType,
      quantity_requested: requestQuantity,
      status: 'pending'
    };

    const result = await createListingRequest(request);

    if (result) {
      toast({
        title: t('success'),
        description: t('requestSent'),
      });
      setRequestDialogOpen(false);
      setRequestMessage('');
      setRequestQuantity('');
    } else {
      toast({
        title: t('error'),
        description: 'Failed to send request. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'seed':
        return <Package className="w-5 h-5" />;
      case 'tool':
        return <Wrench className="w-5 h-5" />;
      case 'equipment':
        return <Tractor className="w-5 h-5" />;
      default:
        return <Package className="w-5 h-5" />;
    }
  };

  const getSeedTypeBadge = (itemType?: string) => {
    if (!itemType) return null;

    const variants: Record<string, { color: string; label: string }> = {
      organic: { color: 'bg-green-600', label: t('organic') },
      hybrid: { color: 'bg-blue-600', label: t('hybrid') },
      heirloom: { color: 'bg-purple-600', label: t('heirloom') },
    };

    const variant = variants[itemType];
    if (!variant) return null;

    return (
      <Badge className={`${variant.color} text-white`}>
        {variant.label}
      </Badge>
    );
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-primary">{t('seedToolSwapTitle')}</h1>
            <p className="text-muted-foreground">{t('peerToPeerMarketplace')}</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 gap-2">
            <Plus className="w-4 h-4" />
            {t('addListing')}
          </Button>
        </div>

        {/* Filters */}
        <Card className="border-none shadow-md">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder={t('search')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('allItems')}</SelectItem>
                  <SelectItem value="seed">{t('seeds')}</SelectItem>
                  <SelectItem value="tool">{t('tools')}</SelectItem>
                  <SelectItem value="equipment">{t('equipment')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Listings Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{t('loading')}</p>
          </div>
        ) : filteredListings.length === 0 ? (
          <Card className="border-none shadow-md">
            <CardContent className="py-12 text-center">
              <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-lg font-semibold mb-2">{t('noListings')}</p>
              <p className="text-sm text-muted-foreground">{t('addFirstListing')}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <Card key={listing.id} className="border-none shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2 text-primary">
                      {getCategoryIcon(listing.category)}
                      <span className="text-xs font-medium uppercase">{listing.category}</span>
                    </div>
                    {listing.category === 'seed' && getSeedTypeBadge(listing.item_type)}
                  </div>
                  <CardTitle className="text-lg">{listing.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{listing.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{t('quantity')}:</span>
                      <span className="font-semibold">{listing.quantity}</span>
                    </div>

                    {listing.is_for_sale && listing.price_per_unit && (
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">{t('forSale')}</Badge>
                        <span className="text-lg font-bold text-primary">₹{listing.price_per_unit}</span>
                      </div>
                    )}

                    {listing.is_for_rent && listing.rental_price_per_day && (
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">{t('forRent')}</Badge>
                        <span className="text-lg font-bold text-primary">₹{listing.rental_price_per_day}/{t('perDay')}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                      <span>{listing.location}</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        {t('available')}
                      </Badge>
                    </div>

                    <Dialog open={requestDialogOpen && selectedListing?.id === listing.id} onOpenChange={(open) => {
                      setRequestDialogOpen(open);
                      if (open) setSelectedListing(listing);
                    }}>
                      <DialogTrigger asChild>
                        <Button className="w-full bg-primary hover:bg-primary/90">
                          {t('sendRequest')}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{t('requestItem')}</DialogTitle>
                          <DialogDescription>{listing.title}</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label>{t('requestType')}</Label>
                            <Select value={requestType} onValueChange={(value: any) => setRequestType(value)}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {listing.is_for_sale && <SelectItem value="purchase">{t('purchase')}</SelectItem>}
                                {listing.is_for_rent && <SelectItem value="rent">{t('rent')}</SelectItem>}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>{t('quantityNeeded')}</Label>
                            <Input
                              value={requestQuantity}
                              onChange={(e) => setRequestQuantity(e.target.value)}
                              placeholder="e.g., 10 kg, 2 days"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>{t('message')}</Label>
                            <Textarea
                              value={requestMessage}
                              onChange={(e) => setRequestMessage(e.target.value)}
                              placeholder={t('optionalMessage')}
                              rows={3}
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" onClick={() => setRequestDialogOpen(false)} className="flex-1">
                            {t('cancel')}
                          </Button>
                          <Button onClick={handleSendRequest} className="flex-1 bg-primary hover:bg-primary/90">
                            {t('submit')}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default SeedToolSwap;
