import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormField } from './FormField';
import { StatusAlert } from '../status/StatusAlert';
import { CustomerInfo, PersonDetails } from '@/types/customer';
import { useVerification } from '@/hooks/useVerification';
import { Loader2 } from 'lucide-react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { VerificationFlow } from '../verification/VerificationFlow';

interface FormData extends PersonDetails {
  email: string;
  phone: string;
}

const initialFormState: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  dob: '',
  phone: ''
};

export const CustomerForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialFormState);
  const [enterredPhone, setEnterredPhone] = useState({ phone: false });

  const { verificationState, startVerification } = useVerification();
  const [verificationData, setVerificationData] = useState<{ clientId: string } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhoneChange = (value: string, country: { countryCode: string }) => {
    setFormData(prev => ({
      ...prev,
      phone: value,
      nationality: country.countryCode.toUpperCase(),
    }));
    setEnterredPhone(prev => ({ ...prev, phone: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const customerData: CustomerInfo = {
      type: 'person',
      email: formData.email,
      mobile: `+${formData.phone}`,
      personDetails: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        dob: formData.dob,
      }
    };

    try {
      const response = await startVerification(customerData);
      setVerificationData({ clientId: response.clientId });
    } catch (error) {
      console.error('Verification error:', error);
    }
  };


  return (
    <>
      {!verificationData ? (
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Identity Verification</CardTitle>
            <CardDescription>
              Please provide your information in order to begin verification process
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
              <FormField
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
              <FormField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />

              <div className="space-y-2">
                <label className="block text-sm font-medium">Phone Number</label>
                <PhoneInput
                  country={'gb'}
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  inputClass="w-full p-2 border rounded-md"
                  containerClass="phone-input"
                  enableSearch
                  countryCodeEditable={false}
                  isValid={(value) => {
                    if (enterredPhone.phone && (!value || value.length < 10)) {
                      return 'Invalid phone number';
                    }
                    return true;
                  }}
                />

              </div>

              <FormField
                label="Date of Birth"
                name="dob"
                type="date"
                value={formData.dob}
                onChange={handleInputChange}
                required
              />


              <Button
                type="submit"
                className="w-full"
              >
                {verificationState.status === 'pending' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing
                  </>
                ) : (
                  'Initialize Verification Process'
                )}
              </Button>
            </form>

            <StatusAlert
              status={verificationState.status}
              message={verificationState.message}
            />
          </CardContent>
        </Card>) : (
        <VerificationFlow
          clientId={verificationData.clientId}
        />
      )}
    </>
  )
}