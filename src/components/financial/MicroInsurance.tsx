import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Shield, AlertTriangle, CheckCircle, Clock, DollarSign } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';

interface MicroInsuranceProps {
  walletBalance: number;
  onBalanceUpdate: (newBalance: number) => void;
}

interface InsurancePolicy {
  id: string;
  type: string;
  premium: number;
  coverage: number;
  date: string;
  status: 'active' | 'claimed' | 'expired';
  claimAmount?: number;
}

interface ActiveAlert {
  type: 'frost' | 'pest' | 'drought' | 'flood' | 'heatwave';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
}

export const MicroInsurance: React.FC<MicroInsuranceProps> = ({ walletBalance, onBalanceUpdate }) => {
  const { t, ready } = useTranslation();
  const { toast } = useToast();
  const [activeAlerts, setActiveAlerts] = useState<ActiveAlert[]>([]);
  const [policies, setPolicies] = useState<InsurancePolicy[]>([]);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    // Load active alerts (simulated from localStorage or API)
    const alerts = getActiveAlerts();
    setActiveAlerts(alerts);

    // Load existing policies from localStorage
    const savedPolicies = localStorage.getItem('insurance_policies');
    if (savedPolicies) {
      setPolicies(JSON.parse(savedPolicies));
    }
  }, []);

  const getActiveAlerts = (): ActiveAlert[] => {
    // Check for active alerts from various sources
    const alerts: ActiveAlert[] = [];
    
    // Simulate checking current conditions
    const currentHour = new Date().getHours();
    const currentMonth = new Date().getMonth();
    
    // Winter months (Nov-Feb) - frost risk
    if (currentMonth >= 10 || currentMonth <= 1) {
      alerts.push({
        type: 'frost',
        severity: 'high',
        message: 'Frost warning active for next 24 hours. Temperatures expected to drop below 2°C.'
      });
    }
    
    // Random pest alert (30% chance)
    if (Math.random() > 0.7) {
      alerts.push({
        type: 'pest',
        severity: 'medium',
        message: 'Pest activity detected in nearby farms. Aphid infestation risk elevated.'
      });
    }

    return alerts;
  };

  const getInsuranceDetails = (alertType: string) => {
    const insuranceTypes: Record<string, { premium: number; coverage: number; description: string }> = {
      frost: {
        premium: 50,
        coverage: 2000,
        description: 'Covers crop damage from frost and freezing temperatures'
      },
      pest: {
        premium: 40,
        coverage: 1500,
        description: 'Covers losses from pest infestations and disease'
      },
      drought: {
        premium: 60,
        coverage: 2500,
        description: 'Covers crop failure due to water scarcity'
      },
      flood: {
        premium: 70,
        coverage: 3000,
        description: 'Covers damage from excessive rainfall and flooding'
      },
      heatwave: {
        premium: 45,
        coverage: 1800,
        description: 'Covers heat stress damage to crops'
      }
    };

    return insuranceTypes[alertType] || insuranceTypes.frost;
  };

  const purchaseInsurance = async (alertType: string) => {
    const details = getInsuranceDetails(alertType);
    
    if (walletBalance < details.premium) {
      toast({
        title: 'Insufficient Balance',
        description: `You need ₹${details.premium} to purchase this policy. Current balance: ₹${walletBalance}`,
        variant: 'destructive',
      });
      return;
    }

    // Check if already have active policy for today
    const today = new Date().toISOString().split('T')[0];
    const existingPolicy = policies.find(p => p.type === alertType && p.date === today && p.status === 'active');
    
    if (existingPolicy) {
      toast({
        title: 'Policy Already Active',
        description: `You already have an active ${alertType} insurance policy for today.`,
        variant: 'destructive',
      });
      return;
    }

    setPurchasing(true);

    // Simulate purchase delay
    setTimeout(() => {
      const newPolicy: InsurancePolicy = {
        id: `policy-${Date.now()}`,
        type: alertType,
        premium: details.premium,
        coverage: details.coverage,
        date: today,
        status: 'active'
      };

      const updatedPolicies = [...policies, newPolicy];
      setPolicies(updatedPolicies);
      localStorage.setItem('insurance_policies', JSON.stringify(updatedPolicies));

      // Deduct premium from wallet
      const newBalance = walletBalance - details.premium;
      onBalanceUpdate(newBalance);

      toast({
        title: 'Insurance Purchased',
        description: `${alertType.charAt(0).toUpperCase() + alertType.slice(1)} insurance policy activated. Premium: ₹${details.premium}`,
      });

      setPurchasing(false);

      // Simulate weather disaster check (20% chance)
      setTimeout(() => {
        if (Math.random() > 0.8) {
          processClaimPayout(newPolicy.id, alertType, details.coverage);
        }
      }, 5000);
    }, 1000);
  };

  const processClaimPayout = (policyId: string, alertType: string, coverageAmount: number) => {
    const updatedPolicies = policies.map(p => {
      if (p.id === policyId) {
        return {
          ...p,
          status: 'claimed' as const,
          claimAmount: coverageAmount
        };
      }
      return p;
    });

    setPolicies(updatedPolicies);
    localStorage.setItem('insurance_policies', JSON.stringify(updatedPolicies));

    // Add payout to wallet
    const newBalance = walletBalance + coverageAmount;
    onBalanceUpdate(newBalance);

    toast({
      title: '🎉 Claim Approved!',
      description: `Weather disaster confirmed. Insurance payout of ₹${coverageAmount} credited to your wallet.`,
    });
  };

  const getAlertIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'high':
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'medium':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-blue-600" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 border-red-300 text-red-900';
      case 'high':
        return 'bg-orange-100 border-orange-300 text-orange-900';
      case 'medium':
        return 'bg-yellow-100 border-yellow-300 text-yellow-900';
      default:
        return 'bg-blue-100 border-blue-300 text-blue-900';
    }
  };

  const todayPolicies = policies.filter(p => p.date === new Date().toISOString().split('T')[0]);
  const recentPolicies = policies.slice(-5).reverse();

  return (
    <div className="space-y-6">
      {/* Active Alerts */}
      <Card className="border-none shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            Active Weather Alerts
          </CardTitle>
          <CardDescription>
            Purchase one-tap insurance policies to protect against weather disasters
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {activeAlerts.length === 0 ? (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-900">No Active Alerts</AlertTitle>
              <AlertDescription className="text-green-800">
                Weather conditions are favorable. No immediate insurance needed.
              </AlertDescription>
            </Alert>
          ) : (
            activeAlerts.map((alert, index) => {
              const details = getInsuranceDetails(alert.type);
              const hasActivePolicy = todayPolicies.some(p => p.type === alert.type && p.status === 'active');

              return (
                <Alert key={index} className={getSeverityColor(alert.severity)}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getAlertIcon(alert.severity)}
                        <AlertTitle className="capitalize">
                          {alert.type} Alert - {alert.severity} Risk
                        </AlertTitle>
                      </div>
                      <AlertDescription className="mb-3">
                        {alert.message}
                      </AlertDescription>
                      <div className="flex flex-wrap gap-2 text-sm mb-3">
                        <Badge variant="outline" className="bg-white/50">
                          Premium: ₹{details.premium}
                        </Badge>
                        <Badge variant="outline" className="bg-white/50">
                          Coverage: ₹{details.coverage}
                        </Badge>
                        <Badge variant="outline" className="bg-white/50">
                          24-hour protection
                        </Badge>
                      </div>
                      <p className="text-xs opacity-80 mb-3">{details.description}</p>
                    </div>
                    <div className="flex-shrink-0">
                      {hasActivePolicy ? (
                        <Badge className="bg-green-600 text-white">
                          <Shield className="w-3 h-3 mr-1" />
                          Protected
                        </Badge>
                      ) : (
                        <Button
                          onClick={() => purchaseInsurance(alert.type)}
                          disabled={purchasing}
                          className="bg-primary hover:bg-primary/90"
                        >
                          <Shield className="w-4 h-4 mr-2" />
                          {purchasing ? 'Processing...' : `Buy ₹${details.premium}`}
                        </Button>
                      )}
                    </div>
                  </div>
                </Alert>
              );
            })
          )}
        </CardContent>
      </Card>

      {/* Policy History */}
      <Card className="border-none shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Recent Policies
          </CardTitle>
          <CardDescription>Your insurance purchase and claim history</CardDescription>
        </CardHeader>
        <CardContent>
          {recentPolicies.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No insurance policies yet. Purchase protection when alerts are active.
            </p>
          ) : (
            <div className="space-y-3">
              {recentPolicies.map((policy) => (
                <div
                  key={policy.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      policy.status === 'claimed' ? 'bg-green-100' :
                      policy.status === 'active' ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      <Shield className={`w-4 h-4 ${
                        policy.status === 'claimed' ? 'text-green-600' :
                        policy.status === 'active' ? 'text-blue-600' : 'text-gray-600'
                      }`} />
                    </div>
                    <div>
                      <p className="font-semibold capitalize">{policy.type} Insurance</p>
                      <p className="text-sm text-muted-foreground">{policy.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {policy.status === 'claimed' ? (
                      <>
                        <p className="text-sm font-semibold text-green-600">
                          +₹{policy.claimAmount}
                        </p>
                        <Badge className="bg-green-600 text-white text-xs">Claimed</Badge>
                      </>
                    ) : policy.status === 'active' ? (
                      <>
                        <p className="text-sm font-semibold text-blue-600">
                          -₹{policy.premium}
                        </p>
                        <Badge className="bg-blue-600 text-white text-xs">Active</Badge>
                      </>
                    ) : (
                      <>
                        <p className="text-sm font-semibold text-gray-600">
                          -₹{policy.premium}
                        </p>
                        <Badge variant="outline" className="text-xs">Expired</Badge>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
