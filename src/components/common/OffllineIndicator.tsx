import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useTranslation } from 'react-i18next';

export const OfflineIndicator: React.FC = () => {
  const { t, ready } = useTranslation();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showAlert, setShowAlert] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowAlert(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowAlert(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showAlert) return null;

  // Fallback text if i18n is not ready
  const offlineModeText = ready ? t('offlineMode') : 'You are currently offline';
  const offlineMessageText = ready ? t('offlineMessage') : 'Some features may be limited. Data will sync when connection is restored.';

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
      <Alert variant="destructive" className="bg-orange-50 border-orange-200 text-orange-900">
        <WifiOff className="h-4 w-4 text-orange-600" />
        <AlertTitle className="text-orange-900">{offlineModeText}</AlertTitle>
        <AlertDescription className="text-orange-800">
          {offlineMessageText}
        </AlertDescription>
      </Alert>
    </div>
  );
};

export const OnlineStatus: React.FC = () => {
  const { t, ready } = useTranslation();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Fallback text if i18n is not ready
  const onlineText = ready ? t('online') : 'Online';
  const offlineText = ready ? t('offline') : 'Offline';

  return (
    <div className="flex items-center gap-2 text-sm">
      {isOnline ? (
        <>
          <Wifi className="w-4 h-4 text-green-600" />
          <span className="text-green-600">{onlineText}</span>
        </>
      ) : (
        <>
          <WifiOff className="w-4 h-4 text-orange-600" />
          <span className="text-orange-600">{offlineText}</span>
        </>
      )}
    </div>
  );
};
