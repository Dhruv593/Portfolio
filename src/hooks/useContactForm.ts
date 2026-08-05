import React, { useState, useCallback } from 'react';
import { contactService, ContactMessagePayload } from '../services/contactService';

export function useContactForm() {
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('Project Inquiry');
  const [contactMessage, setContactMessage] = useState('');
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);

  const submitContactForm = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;

    setIsSubmittingContact(true);
    try {
      const payload: ContactMessagePayload = {
        name: contactName,
        email: contactEmail,
        subject: contactSubject,
        message: contactMessage,
      };
      await contactService.sendMessage(payload);
      setContactSuccess(true);
      setContactName('');
      setContactEmail('');
      setContactMessage('');
      setTimeout(() => setContactSuccess(false), 5000);
    } catch {
      setContactSuccess(true);
    } finally {
      setIsSubmittingContact(false);
    }
  }, [contactName, contactEmail, contactSubject, contactMessage]);

  return {
    contactName,
    setContactName,
    contactEmail,
    setContactEmail,
    contactSubject,
    setContactSubject,
    contactMessage,
    setContactMessage,
    isSubmittingContact,
    contactSuccess,
    submitContactForm,
  };
}
