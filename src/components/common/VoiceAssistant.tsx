import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface VoiceAssistantProps {
  variant?: 'header' | 'inline';
  onDoctorCommand?: () => void;
}

export const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ 
  variant = 'header',
  onDoctorCommand 
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const keywords = {
    weather: ['weather', 'climate', 'temperature', 'rain', 'forecast'],
    market: ['market', 'price', 'sell', 'buy', 'crop price', 'intelligence'],
    doctor: ['doctor', 'disease', 'plant', 'leaf', 'diagnosis', 'health'],
    financial: ['financial', 'money', 'insurance', 'expense', 'profit', 'wallet'],
    swap: ['swap', 'seed', 'tool', 'equipment', 'exchange'],
    map: ['map', 'field', 'satellite', 'ndvi', 'sector'],
    shop: ['shop', 'produce', 'harvest', 'listing'],
    community: ['community', 'question', 'answer', 'help', 'forum']
  };

  const simulateVoiceRecognition = () => {
    setIsListening(true);
    setTranscript('Listening...');

    // Simulate listening delay
    setTimeout(() => {
      // Randomly select a keyword category for simulation
      const categories = Object.keys(keywords);
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      const categoryKeywords = keywords[randomCategory as keyof typeof keywords];
      const randomKeyword = categoryKeywords[Math.floor(Math.random() * categoryKeywords.length)];
      
      setTranscript(`"${randomKeyword}"`);

      // Process the command
      setTimeout(() => {
        processCommand(randomKeyword);
        setIsListening(false);
        setTranscript('');
      }, 1000);
    }, 2000);
  };

  const processCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();

    // Check for weather keywords
    if (keywords.weather.some(kw => lowerCommand.includes(kw))) {
      toast({
        title: '🌤️ Voice Command Recognized',
        description: 'Navigating to Dashboard for weather information...',
      });
      setTimeout(() => navigate('/'), 500);
      return;
    }

    // Check for market keywords
    if (keywords.market.some(kw => lowerCommand.includes(kw))) {
      toast({
        title: '📈 Voice Command Recognized',
        description: 'Opening Market Intelligence...',
      });
      setTimeout(() => navigate('/market'), 500);
      return;
    }

    // Check for doctor keywords
    if (keywords.doctor.some(kw => lowerCommand.includes(kw))) {
      toast({
        title: '🔬 Voice Command Recognized',
        description: 'Opening Plant Doctor...',
      });
      if (onDoctorCommand) {
        onDoctorCommand();
      } else {
        setTimeout(() => navigate('/'), 500);
      }
      return;
    }

    // Check for financial keywords
    if (keywords.financial.some(kw => lowerCommand.includes(kw))) {
      toast({
        title: '💰 Voice Command Recognized',
        description: 'Opening Financial Management...',
      });
      setTimeout(() => navigate('/financial'), 500);
      return;
    }

    // Check for map keywords
    if (keywords.map.some(kw => lowerCommand.includes(kw))) {
      toast({
        title: '🗺️ Voice Command Recognized',
        description: 'Opening Field Map...',
      });
      setTimeout(() => navigate('/map'), 500);
      return;
    }

    // Check for shop keywords
    if (keywords.shop.some(kw => lowerCommand.includes(kw))) {
      toast({
        title: '🛒 Voice Command Recognized',
        description: 'Opening Produce Shop...',
      });
      setTimeout(() => navigate('/shop'), 500);
      return;
    }

    // Check for community keywords
    if (keywords.community.some(kw => lowerCommand.includes(kw))) {
      toast({
        title: '👥 Voice Command Recognized',
        description: 'Opening Community Q&A...',
      });
      setTimeout(() => navigate('/community'), 500);
      return;
    }

    // Check for swap keywords
    if (keywords.swap.some(kw => lowerCommand.includes(kw))) {
      toast({
        title: '🔄 Voice Command Recognized',
        description: 'Opening Seed & Tool Swap...',
      });
      setTimeout(() => navigate('/swap'), 500);
      return;
    }

    // Default response
    toast({
      title: '🎤 Command Not Recognized',
      description: 'Try saying: Weather, Market, Doctor, Map, Shop, Community, Financial, or Swap',
      variant: 'destructive',
    });
  };

  const handleClick = () => {
    if (isListening) {
      setIsListening(false);
      setTranscript('');
      toast({
        title: 'Voice Assistant Stopped',
        description: 'Listening cancelled',
      });
    } else {
      simulateVoiceRecognition();
    }
  };

  if (variant === 'inline') {
    return (
      <div className="flex flex-col items-center gap-2">
        <Button
          onClick={handleClick}
          disabled={isListening}
          size="lg"
          className={cn(
            "relative w-16 h-16 rounded-full transition-all duration-300",
            isListening 
              ? "bg-red-600 hover:bg-red-700 animate-pulse" 
              : "bg-primary hover:bg-primary/90"
          )}
        >
          {isListening ? (
            <MicOff className="w-6 h-6 text-white" />
          ) : (
            <Mic className="w-6 h-6 text-white" />
          )}
          {isListening && (
            <span className="absolute inset-0 rounded-full bg-red-600 animate-ping opacity-75" />
          )}
        </Button>
        {transcript && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground animate-fade-in">
            <Volume2 className="w-4 h-4" />
            <span>{transcript}</span>
          </div>
        )}
        <p className="text-xs text-muted-foreground text-center max-w-xs">
          {isListening 
            ? 'Listening... Say: Weather, Market, Doctor, Map, Shop, or Community' 
            : 'Click to use voice commands'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      <Button
        onClick={handleClick}
        variant="ghost"
        size="icon"
        className={cn(
          "relative transition-all duration-300",
          isListening && "bg-red-100 hover:bg-red-200"
        )}
        title="Voice Assistant"
      >
        {isListening ? (
          <MicOff className="w-5 h-5 text-red-600" />
        ) : (
          <Mic className="w-5 h-5" />
        )}
        {isListening && (
          <span className="absolute inset-0 rounded-md bg-red-600 animate-ping opacity-20" />
        )}
      </Button>
      {transcript && variant === 'header' && (
        <div className="absolute top-full right-0 mt-2 px-3 py-2 bg-popover border rounded-md shadow-lg whitespace-nowrap animate-fade-in z-50">
          <div className="flex items-center gap-2 text-sm">
            <Volume2 className="w-4 h-4 text-primary" />
            <span>{transcript}</span>
          </div>
        </div>
      )}
    </div>
  );
};
