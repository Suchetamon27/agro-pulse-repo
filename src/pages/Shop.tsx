import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, ShoppingCart, MapPin, Package, Search, Wallet } from 'lucide-react';
import { supabase } from '@/db/supabase';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ProduceListing {
  id: string;
  user_id: string;
  crop_type: string;
  quantity: string;
  price_per_unit: number;
  total_price: number;
  image_url?: string;
  location: string;
  status: string;
  created_at: string;
}

const Shop: React.FC = () => {
  const { toast } = useToast();
  const [listings, setListings] = useState<ProduceListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [walletBalance, setWalletBalance] = useState(2450.0);

  // Form state
  const [cropType, setCropType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [pricePerUnit, setPricePerUnit] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('produce_listings')
      .select('*')
      .eq('status', 'available')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setListings(data);
    }
    setLoading(false);
  };

  const addListing = async () => {
    if (!cropType || !quantity || !pricePerUnit || !location) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    const price = parseFloat(pricePerUnit);
    const quantityNum = parseFloat(quantity);
    
    if (isNaN(price) || price <= 0 || isNaN(quantityNum) || quantityNum <= 0) {
      toast({
        title: 'Invalid Input',
        description: 'Please enter valid numbers for quantity and price',
        variant: 'destructive',
      });
      return;
    }

    const totalPrice = price * quantityNum;

    const { data, error } = await supabase
      .from('produce_listings')
      .insert([{
        user_id: 'mock-user-id',
        crop_type: cropType,
        quantity: `${quantity} quintals`,
        price_per_unit: price,
        total_price: totalPrice,
        location: location,
        status: 'available'
      }] as any)
      .select()
      .single();

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to create listing. Please try again.',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Listing Created',
      description: `Your ${cropType} listing has been posted successfully!`,
    });

    // Reset form
    setCropType('');
    setQuantity('');
    setPricePerUnit('');
    setLocation('');
    setDialogOpen(false);

    // Reload listings
    loadListings();
  };

  const handleBuyNow = async (listing: ProduceListing) => {
    if (walletBalance < listing.total_price) {
      toast({
        title: 'Insufficient Balance',
        description: `You need ₹${listing.total_price} but only have ₹${walletBalance}`,
        variant: 'destructive',
      });
      return;
    }

    // Update listing status
    const { error: listingError } = await (supabase as any)
      .from('produce_listings')
      .update({ status: 'sold' })
      .eq('id', listing.id);

    if (listingError) {
      toast({
        title: 'Error',
        description: 'Failed to complete purchase. Please try again.',
        variant: 'destructive',
      });
      return;
    }

    // Create transaction
    const { error: transactionError } = await supabase
      .from('produce_transactions')
      .insert([{
        listing_id: listing.id,
        buyer_id: 'mock-user-id',
        seller_id: listing.user_id,
        amount: listing.total_price,
        quantity: listing.quantity
      }] as any);

    if (transactionError) {
      console.error('Transaction error:', transactionError);
    }

    // Update wallet balance
    const newBalance = walletBalance - listing.total_price;
    setWalletBalance(newBalance);

    toast({
      title: 'Purchase Successful! 🎉',
      description: `You bought ${listing.quantity} of ${listing.crop_type} for ₹${listing.total_price}`,
    });

    // Reload listings
    loadListings();
  };

  const filteredListings = listings.filter(listing =>
    listing.crop_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    listing.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const cropTypes = ['Wheat', 'Rice', 'Corn', 'Cotton', 'Sugarcane', 'Potato', 'Tomato', 'Onion', 'Mustard'];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-primary">Produce Shop</h1>
            <p className="text-muted-foreground">Buy and sell harvested crops directly</p>
          </div>
          <div className="flex items-center gap-3">
            <Card className="border-none shadow-md bg-gradient-to-br from-primary to-primary/80">
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-primary-foreground" />
                  <div>
                    <p className="text-xs text-primary-foreground/80">Balance</p>
                    <p className="text-lg font-bold text-primary-foreground">₹{walletBalance.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 gap-2">
                  <Plus className="w-4 h-4" />
                  Sell Produce
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>List Your Produce</DialogTitle>
                  <DialogDescription>
                    Create a listing to sell your harvested crops
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Crop Type *</Label>
                    <Select value={cropType} onValueChange={setCropType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select crop" />
                      </SelectTrigger>
                      <SelectContent>
                        {cropTypes.map(crop => (
                          <SelectItem key={crop} value={crop}>{crop}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Quantity (quintals) *</Label>
                    <Input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="e.g., 50"
                      min="0"
                      step="0.1"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Price per Quintal (₹) *</Label>
                    <Input
                      type="number"
                      value={pricePerUnit}
                      onChange={(e) => setPricePerUnit(e.target.value)}
                      placeholder="e.g., 2150"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Location *</Label>
                    <Input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g., Ludhiana, Punjab"
                    />
                  </div>

                  {quantity && pricePerUnit && (
                    <Alert className="bg-green-50 border-green-200">
                      <AlertDescription className="text-green-900">
                        Total Price: <strong>₹{(parseFloat(quantity) * parseFloat(pricePerUnit)).toFixed(2)}</strong>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setDialogOpen(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={addListing} className="flex-1 bg-primary hover:bg-primary/90">
                    Create Listing
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Search */}
        <Card className="border-none shadow-md">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by crop type or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Listings Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading listings...</p>
          </div>
        ) : filteredListings.length === 0 ? (
          <Card className="border-none shadow-md">
            <CardContent className="py-12 text-center">
              <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-lg font-semibold mb-2">No Produce Available</p>
              <p className="text-sm text-muted-foreground">Be the first to list your harvest!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <Card key={listing.id} className="border-none shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                  <span className="text-6xl">
                    {listing.crop_type === 'Wheat' && '🌾'}
                    {listing.crop_type === 'Rice' && '🌾'}
                    {listing.crop_type === 'Corn' && '🌽'}
                    {listing.crop_type === 'Cotton' && '🌸'}
                    {listing.crop_type === 'Sugarcane' && '🎋'}
                    {listing.crop_type === 'Potato' && '🥔'}
                    {listing.crop_type === 'Tomato' && '🍅'}
                    {listing.crop_type === 'Onion' && '🧅'}
                    {listing.crop_type === 'Mustard' && '🌼'}
                    {!['Wheat', 'Rice', 'Corn', 'Cotton', 'Sugarcane', 'Potato', 'Tomato', 'Onion', 'Mustard'].includes(listing.crop_type) && '🌱'}
                  </span>
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-xl">{listing.crop_type}</CardTitle>
                    <Badge className="bg-green-600 text-white">Available</Badge>
                  </div>
                  <CardDescription className="flex items-center gap-1 text-sm">
                    <MapPin className="w-3 h-3" />
                    {listing.location}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Quantity:</span>
                      <span className="font-semibold">{listing.quantity}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Price/Quintal:</span>
                      <span className="font-semibold">₹{listing.price_per_unit.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <span className="font-semibold">Total Price:</span>
                      <span className="text-xl font-bold text-primary">₹{listing.total_price.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button 
                    onClick={() => handleBuyNow(listing)}
                    className="w-full bg-primary hover:bg-primary/90 gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Buy Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Shop;
