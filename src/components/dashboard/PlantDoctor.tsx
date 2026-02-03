import React, { useState, useRef } from 'react';
import { Camera, Upload, Loader2, History, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { analyzePlantImage, getPlantDiagnosisHistory } from '@/db/api';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { VoiceAssistant } from '@/components/common/VoiceAssistant';

export const PlantDoctor: React.FC = () => {
  const [diagnosis, setDiagnosis] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [history, setHistory] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleVoiceCommand = () => {
    // When voice says "Doctor", trigger file upload
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setLoading(true);
    setError('');
    setDiagnosis('');

    try {
      // Convert to base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;
        const base64Data = base64.split(',')[1]; // Remove data:image/jpeg;base64, prefix
        
        setSelectedImage(base64);

        // Call API
        const result = await analyzePlantImage(base64Data, 'mock-user-id');
        
        if (result && result.success) {
          setDiagnosis(result.diagnosis);
        } else {
          setError('Failed to analyze image. Please try again.');
        }
        
        setLoading(false);
      };
      
      reader.onerror = () => {
        setError('Failed to read image file');
        setLoading(false);
      };
      
      reader.readAsDataURL(file);
    } catch (err) {
      setError('An error occurred while processing the image');
      setLoading(false);
    }
  };

  const loadHistory = async () => {
    const data = await getPlantDiagnosisHistory();
    setHistory(data);
    setShowHistory(true);
  };

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-md bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-green-900 dark:text-green-100">Plant Doctor</CardTitle>
              <CardDescription className="text-green-700 dark:text-green-300">
                AI-powered disease detection & treatment
              </CardDescription>
            </div>
            <VoiceAssistant variant="inline" onDoctorCommand={handleVoiceCommand} />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-600 rounded-lg">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">Plant Doctor</CardTitle>
                <CardDescription className="text-xs">
                  AI-powered disease detection & treatment
                </CardDescription>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={loadHistory}
              className="gap-2"
            >
              <History className="w-3 h-3" />
              History
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!diagnosis && !loading && !selectedImage && (
            <div className="text-center py-8">
              <div className="mb-4">
                <Camera className="w-16 h-16 mx-auto text-green-600 opacity-50" />
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Upload a photo of your plant leaf to detect diseases and get treatment recommendations
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="bg-green-600 hover:bg-green-700 gap-2"
              >
                <Upload className="w-4 h-4" />
                Upload Leaf Photo
              </Button>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="w-10 h-10 animate-spin text-green-600 mb-3" />
              <p className="text-sm text-muted-foreground">Analyzing leaf image...</p>
              <p className="text-xs text-muted-foreground mt-1">This may take up to 30 seconds</p>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {diagnosis && !loading && (
            <div className="space-y-4">
              {selectedImage && (
                <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-green-200">
                  <img
                    src={selectedImage}
                    alt="Uploaded leaf"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border-l-4 border-green-600">
                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    Diagnosis Complete
                  </Badge>
                </h4>
                <div className="text-sm leading-relaxed whitespace-pre-line">
                  {diagnosis}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    setDiagnosis('');
                    setSelectedImage('');
                    setError('');
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Analyze Another
                </Button>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  New Upload
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* History Section */}
      {showHistory && (
        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Diagnosis History</CardTitle>
          </CardHeader>
          <CardContent>
            {history.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No diagnosis history yet
              </p>
            ) : (
              <div className="space-y-3">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-lg border border-border hover:bg-accent/5 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {item.confidence_level} Confidence
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm line-clamp-2">{item.diagnosis}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
