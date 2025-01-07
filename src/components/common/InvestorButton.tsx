import React, { useState } from 'react';
import { Lock, Mail } from 'lucide-react';
import Modal from './Modal';
import { useForm } from './forms/useForm';
import { validateEmail } from './forms/validation';
import FormInput from './forms/FormInput';
import AnnouncementBanner from './modals/AnnouncementBanner';
import SuccessMessage from './modals/SuccessMessage';
import ShineButton from './buttons/ShineButton';

export default function InvestorButton() {
  const [showModal, setShowModal] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { 
    values, 
    errors, 
    handleChange, 
    handleSubmit,
    reset 
  } = useForm(
    { email: '' },
    { email: validateEmail }
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

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition-colors w-full lg:w-auto justify-center lg:justify-start"
      >
        <Lock className="h-4 w-4" />
        Investor Portal
      </button>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setIsSubmitted(false);
          reset();
        }}
        title="Investor Portal"
      >
        <div className="space-y-6">
          <AnnouncementBanner 
            title="Coming Soon!"
            message="Our secure investor portal is currently under development. Stay tuned for exclusive access to portfolio performance, investment opportunities, and detailed reports."
          />

          {!isSubmitted ? (
            <form onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(onSubmit);
            }} className="space-y-4">
              <p className="text-slate-600">
                Want to be notified when we launch? Leave your email below:
              </p>

              <FormInput
                icon={Mail}
                type="email"
                value={values.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="Enter your email"
                error={errors.email}
              />

              <ShineButton type="submit">
                Notify Me
              </ShineButton>
            </form>
          ) : (
            <SuccessMessage 
              message="Thank you! We'll notify you when the portal launches."
            />
          )}
        </div>
      </Modal>
    </>
  );
}