import { supabase } from './supabase';

export interface FarmLocation {
  id: string;
  name: string;
  state: string;
  district: string | null;
  latitude: number;
  longitude: number;
  created_at: string;
}

export interface WeatherData {
  current: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
    wind_speed: number;
    uvi: number;
    clouds: number;
    weather: {
      id?: number;
      main?: string;
      description?: string;
      icon?: string;
    };
  };
  hourly: Array<{
    dt: number;
    temp: number;
    humidity: number;
    weather: Array<{ description: string }>;
  }>;
  daily: Array<{
    dt: number;
    temp: { min: number; max: number };
    weather: Array<{ description: string }>;
  }>;
  timezone: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'farmer' | 'buyer';
  phone?: string;
  wallet_balance: number;
  farm_locations?: FarmLocation;
}

export interface SensorData {
  id: string;
  user_id: string;
  timestamp: string;
  latitude: number;
  longitude: number;
  soil_moisture: number;
  temperature: number;
  humidity: number;
}

export interface Alert {
  id: string;
  alert_type: string;
  severity: string;
  latitude: number;
  longitude: number;
  area_radius: number;
  title: string;
  description: string;
  affected_farms: number;
  is_active: boolean;
  created_at: string;
  expires_at: string;
}

export interface Transaction {
  id: string;
  sender_id: string;
  receiver_id: string;
  amount: number;
  data_type: string;
  status: string;
  description: string;
  created_at: string;
}

// Fetch all farm locations
export const getFarmLocations = async (): Promise<FarmLocation[]> => {
  const { data, error } = await supabase
    .from('farm_locations')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching farm locations:', error);
    return [];
  }

  return Array.isArray(data) ? data : [];
};

// Fetch weather data for a specific location
export const getWeatherData = async (lat: number, lon: number): Promise<WeatherData | null> => {
  try {
    const { data, error } = await supabase.functions.invoke('get-weather', {
      body: { lat, lon },
    });

    if (error) {
      console.error('Error fetching weather data:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Exception fetching weather data:', error);
    return null;
  }
};

// Guardian API - Analyze sensor data for anomalies
export const analyzeGuardianData = async (latitude: number, longitude: number, radius: number = 10) => {
  try {
    const { data, error } = await supabase.functions.invoke('api-guardian', {
      body: { latitude, longitude, radius },
    });

    if (error) {
      console.error('Error calling guardian API:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Exception calling guardian API:', error);
    return null;
  }
};

// Marketplace API - Fetch available data streams
export const getMarketplaceData = async (limit: number = 10) => {
  try {
    const { data, error } = await supabase.functions.invoke('api-marketplace', {
      method: 'GET',
    });

    if (error) {
      console.error('Error fetching marketplace data:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Exception fetching marketplace data:', error);
    return null;
  }
};

// Authentication - Login
export const loginUser = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('auth-login', {
      body: { email, password },
    });

    if (error) {
      throw new Error(error.message || 'Login failed');
    }

    if (data.token) {
      localStorage.setItem('agropulse_token', data.token);
      localStorage.setItem('agropulse_user', JSON.stringify(data.user));
    }

    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Authentication - Register
export const registerUser = async (userData: {
  email: string;
  password: string;
  name: string;
  role: 'farmer' | 'buyer';
  phone?: string;
  farm_location_id?: string;
}) => {
  try {
    const { data, error } = await supabase.functions.invoke('auth-register', {
      body: userData,
    });

    if (error) {
      throw new Error(error.message || 'Registration failed');
    }

    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Get current user from localStorage
export const getCurrentUser = (): User | null => {
  try {
    const userStr = localStorage.getItem('agropulse_user');
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

// Logout
export const logoutUser = () => {
  localStorage.removeItem('agropulse_token');
  localStorage.removeItem('agropulse_user');
};

// Get active alerts
export const getActiveAlerts = async (): Promise<Alert[]> => {
  const { data, error } = await supabase
    .from('alerts')
    .select('*')
    .eq('is_active', true)
    .gte('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Error fetching alerts:', error);
    return [];
  }

  return Array.isArray(data) ? data : [];
};

// Get recent transactions
export const getRecentTransactions = async (userId?: string): Promise<Transaction[]> => {
  let query = supabase
    .from('transactions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);

  if (userId) {
    query = query.or(`sender_id.eq.${userId},receiver_id.eq.${userId}`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }

  return Array.isArray(data) ? data : [];
};

// AI Advisor - Get AI guidance based on agricultural data
export const getAIGuidance = async (
  soilMoisture: number,
  temperature: number,
  humidity: number,
  cropType: string,
  weatherForecast?: string
) => {
  try {
    const { data, error } = await supabase.functions.invoke('ai-advisor', {
      body: {
        soilMoisture,
        temperature,
        humidity,
        cropType,
        weatherForecast
      },
    });

    if (error) {
      console.error('Error calling AI advisor:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Exception calling AI advisor:', error);
    return null;
  }
};

// Simulate Sensor - Generate random sensor data
export const simulateSensor = async (userId: string, farmLocationId?: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('simulate-sensor', {
      body: { userId, farmLocationId },
    });

    if (error) {
      console.error('Error simulating sensor:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Exception simulating sensor:', error);
    return null;
  }
};

// Plant Doctor - Analyze plant image for diseases
export const analyzePlantImage = async (imageBase64: string, userId: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('plant-doctor', {
      body: { imageBase64, userId },
    });

    if (error) {
      console.error('Error analyzing plant image:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Exception analyzing plant image:', error);
    return null;
  }
};

// Get plant diagnosis history
export const getPlantDiagnosisHistory = async (userId?: string) => {
  let query = supabase
    .from('plant_diagnoses')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);

  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching diagnosis history:', error);
    return [];
  }

  return Array.isArray(data) ? data : [];
};

// Market Intelligence - Get market prices and predictions
export const getMarketIntelligence = async (weatherAnomaly?: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('market-intelligence', {
      body: { weatherAnomaly },
    });

    if (error) {
      console.error('Error fetching market intelligence:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Exception fetching market intelligence:', error);
    return null;
  }
};

// Carbon Credits - Get user's carbon credits
export const getCarbonCredits = async (userId: string) => {
  const { data, error } = await supabase
    .from('carbon_credits')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching carbon credits:', error);
    return null;
  }

  return data;
};

// Calculate and update carbon credits
export const calculateCarbonCredits = async (userId: string) => {
  try {
    // Get recent sensor data
    const { data: sensorData } = await supabase
      .from('sensor_data')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(10);

    if (!sensorData || sensorData.length === 0) {
      return null;
    }

    // Calculate scores
    const avgSoilMoisture = sensorData.reduce((sum, d) => sum + parseFloat(d.soil_moisture.toString()), 0) / sensorData.length;
    const avgTemp = sensorData.reduce((sum, d) => sum + parseFloat(d.temperature.toString()), 0) / sensorData.length;

    // Water efficiency score (optimal soil moisture: 40-60%)
    const waterEfficiency = Math.max(0, Math.min(100, 100 - Math.abs(50 - avgSoilMoisture) * 2));
    
    // Soil health score (based on moisture consistency)
    const soilHealth = Math.max(0, Math.min(100, avgSoilMoisture * 1.5));
    
    // Overall sustainability score
    const sustainabilityScore = Math.round((waterEfficiency + soilHealth) / 2);
    
    // Credits earned (1 credit per 10 sustainability points)
    const creditsEarned = sustainabilityScore / 10;

    // Update database
    const { data, error } = await supabase
      .from('carbon_credits')
      .upsert({
        user_id: userId,
        credits_earned: creditsEarned,
        sustainability_score: sustainabilityScore,
        water_efficiency_score: Math.round(waterEfficiency),
        soil_health_score: Math.round(soilHealth),
        last_calculated_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) {
      console.error('Error updating carbon credits:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Exception calculating carbon credits:', error);
    return null;
  }
};

// Exchange carbon credits for wallet balance
export const exchangeCarbonCredits = async (userId: string, credits: number) => {
  try {
    // Exchange rate: 1 credit = ₹100
    const amount = credits * 100;

    // Update wallet balance
    const { error: walletError } = await supabase.rpc('increment_wallet_balance', {
      user_id: userId,
      amount: amount
    });

    if (walletError) {
      // Fallback: direct update
      const { data: user } = await supabase
        .from('users')
        .select('wallet_balance')
        .eq('id', userId)
        .single();

      if (user) {
        await supabase
          .from('users')
          .update({ wallet_balance: parseFloat(user.wallet_balance.toString()) + amount })
          .eq('id', userId);
      }
    }

    // Reset carbon credits
    await supabase
      .from('carbon_credits')
      .update({ credits_earned: 0 })
      .eq('user_id', userId);

    return { success: true, amount };
  } catch (error) {
    console.error('Exception exchanging carbon credits:', error);
    return null;
  }
};

// Marketplace - Get all listings
export const getListings = async (category?: string) => {
  let query = supabase
    .from('listings')
    .select('*')
    .eq('available', true)
    .order('created_at', { ascending: false });

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching listings:', error);
    return [];
  }

  return Array.isArray(data) ? data : [];
};

// Create a new listing
export const createListing = async (listing: any) => {
  const { data, error } = await supabase
    .from('listings')
    .insert(listing)
    .select()
    .single();

  if (error) {
    console.error('Error creating listing:', error);
    return null;
  }

  return data;
};

// Update a listing
export const updateListing = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from('listings')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating listing:', error);
    return null;
  }

  return data;
};

// Delete a listing
export const deleteListing = async (id: string) => {
  const { error } = await supabase
    .from('listings')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting listing:', error);
    return false;
  }

  return true;
};

// Create a listing request
export const createListingRequest = async (request: any) => {
  const { data, error } = await supabase
    .from('listing_requests')
    .insert(request)
    .select()
    .single();

  if (error) {
    console.error('Error creating request:', error);
    return null;
  }

  // Create notification for owner
  await supabase
    .from('notifications')
    .insert({
      user_id: request.owner_id,
      title: 'New Request Received',
      message: `You have a new ${request.request_type} request for your listing.`,
      type: 'request',
      related_id: data.id
    });

  return data;
};

// Get user's notifications
export const getNotifications = async (userId: string) => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }

  return Array.isArray(data) ? data : [];
};

// Mark notification as read
export const markNotificationRead = async (id: string) => {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', id);

  if (error) {
    console.error('Error marking notification as read:', error);
    return false;
  }

  return true;
};
