'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { onboardingAPI } from '@/lib/api';
import { OnboardingData, INVESTOR_TYPES, CONTENT_PREFERENCES, POPULAR_CRYPTOS, InvestorType } from '@crypto-dashboard/shared';
import { toast } from 'sonner';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingData>({
    cryptoInterests: [],
    investorType: InvestorType.NEWBIE,
    contentPreferences: [],
  });

  const savePreferencesMutation = useMutation({
    mutationFn: onboardingAPI.savePreferences,
    onSuccess: () => {
      router.push('/dashboard');
    },
    onError: (error: any) => {
      toast.error('Failed to save preferences. Please try again.');
    },
  });

  const handleCryptoToggle = (cryptoId: string) => {
    setFormData(prev => ({
      ...prev,
      cryptoInterests: prev.cryptoInterests.includes(cryptoId)
        ? prev.cryptoInterests.filter(id => id !== cryptoId)
        : [...prev.cryptoInterests, cryptoId],
    }));
  };

  const handleInvestorTypeSelect = (type: string) => {
    setFormData(prev => ({ ...prev, investorType: type as InvestorType }));
  };

  const handleContentPreferenceToggle = (preference: string) => {
    setFormData(prev => ({
      ...prev,
      contentPreferences: prev.contentPreferences.includes(preference as any)
        ? prev.contentPreferences.filter(p => p !== preference)
        : [...prev.contentPreferences, preference as any],
    }));
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      savePreferencesMutation.mutate(formData);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.cryptoInterests.length > 0;
      case 2:
        return formData.investorType !== InvestorType.NEWBIE;
      case 3:
        return formData.contentPreferences.length > 0;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome to Crypto Dashboard</h1>
          <p className="text-gray-600 mt-2">Let's personalize your experience</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= stepNumber ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>
              {step === 1 && 'What cryptocurrencies interest you?'}
              {step === 2 && 'What type of investor are you?'}
              {step === 3 && 'What content would you like to see?'}
            </CardTitle>
            <CardDescription>
              {step === 1 && 'Select the cryptocurrencies you want to track'}
              {step === 2 && 'This helps us personalize your dashboard'}
              {step === 3 && 'Choose the types of content you prefer'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 1 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {POPULAR_CRYPTOS.map((crypto) => (
                  <Button
                    key={crypto.id}
                    variant={formData.cryptoInterests.includes(crypto.id) ? 'default' : 'outline'}
                    className="h-auto p-3 flex flex-col items-center space-y-1"
                    onClick={() => handleCryptoToggle(crypto.id)}
                  >
                    <span className="text-lg">{crypto.icon}</span>
                    <span className="text-sm font-medium">{crypto.name}</span>
                    <span className="text-xs text-gray-500">{crypto.symbol}</span>
                  </Button>
                ))}
              </div>
            )}

            {step === 2 && (
              <div className="grid gap-4">
                {INVESTOR_TYPES.map((type) => (
                  <Button
                    key={type.value}
                    variant={formData.investorType === type.value ? 'default' : 'outline'}
                    className="h-auto p-4 justify-start text-left"
                    onClick={() => handleInvestorTypeSelect(type.value)}
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">{type.icon}</span>
                      <div>
                        <div className="font-medium">{type.label}</div>
                        <div className="text-sm text-gray-500">{type.description}</div>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            )}

            {step === 3 && (
              <div className="grid gap-4">
                {CONTENT_PREFERENCES.map((pref) => (
                  <Button
                    key={pref.value}
                    variant={formData.contentPreferences.includes(pref.value as any) ? 'default' : 'outline'}
                    className="h-auto p-4 justify-start text-left"
                    onClick={() => handleContentPreferenceToggle(pref.value)}
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">{pref.icon}</span>
                      <div>
                        <div className="font-medium">{pref.label}</div>
                        <div className="text-sm text-gray-500">{pref.description}</div>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            )}

            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={step === 1}
              >
                Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={!canProceed() || savePreferencesMutation.isPending}
              >
                {step === 3 
                  ? (savePreferencesMutation.isPending ? 'Saving...' : 'Complete Setup')
                  : 'Next'
                }
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
