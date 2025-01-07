import React, { useState } from 'react';
import { Mail, Building2, User, ArrowRight } from 'lucide-react';
import Modal from './Modal';
import { useForm } from './forms/useForm';
import { validateEmail, validateName } from './forms/validation';
import FormInput from './forms/FormInput';
import RadioGroup from './forms/RadioGroup';
import AnnouncementBanner from './modals/AnnouncementBanner';
import SuccessMessage from './modals/SuccessMessage';
import ShineButton from './buttons/ShineButton';
import { gradients } from '../../constants/colors';

interface FormData {
  name: string;
  email: string;
  company: string;
  investorType: 'individual' | 'institutional';
}

const initialFormData: FormData = {
  name: '',
  email: '',
  company: '',
  investorType: 'individual',
};

export default function OwnerRegistrationButton() {
  const [showModal, setShowModal] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { 
    values, 
    errors, 
    handleChange, 
    handleSubmit,
    reset 
  } = useForm<FormData>(
    initialFormData,
    {
      name: validateName,
      email: validateEmail,
    }
  );

  const onSubmit = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitted(true);
    
    setTimeout(() => {
      setIsSubmitted(false);
      reset();
      setShowModal(false);
    }, 3000);
  };

  const handleClose = () => {
    setShowModal(false);
    setIsSubmitted(false);
    reset();
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={`inline-flex items-center gap-2 rounded-lg ${gradients.background.primary} px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-all w-full lg:w-auto justify-center`}
      >
        Become an Owner
        <ArrowRight className="h-4 w-4" />
      </button>

      <Modal
        isOpen={showModal}
        onClose={handleClose}
        title="Private Placement Registration"
      >
        <div className="space-y-6">
          <AnnouncementBanner 
            title="Opening Soon!"
            message="Private Placement Opening Soon for Eligible Investors – Stay Tuned!"
          />

          {!isSubmitted ? (
            <form onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(onSubmit);
            }} className="space-y-4">
              <p className="text-slate-600">
                Register your interest to receive exclusive early access:
              </p>

              <FormInput
                icon={User}
                type="text"
                value={values.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Full Name"
                error={errors.name}
              />

              <FormInput
                icon={Mail}
                type="email"
                value={values.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="Email Address"
                error={errors.email}
              />

              <FormInput
                icon={Building2}
                type="text"
                value={values.company}
                onChange={(e) => handleChange('company', e.target.value)}
                placeholder="Company (Optional)"
              />

              <RadioGroup
                name="investorType"
                label="Investor Type"
                value={values.investorType}
                onChange={(value) => handleChange('investorType', value)}
                options={[
                  { value: 'individual', label: 'Individual' },
                  { value: 'institutional', label: 'Institutional' }
                ]}
              />

              <ShineButton type="submit">
                Register Interest
              </ShineButton>
            </form>
          ) : (
            <SuccessMessage 
              message="Thank you for your interest! We'll notify you when the private placement opens."
            />
          )}
        </div>
      </Modal>
    </>
  );
}