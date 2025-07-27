"use client";

import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LocationPermissionModalProps {
  onPermissionGranted: () => void;
}

export function LocationPermissionModal({ onPermissionGranted }: LocationPermissionModalProps) {

  const handleAllow = () => {
    navigator.permissions.query({ name: 'geolocation' }).then((result) => {
      if (result.state === 'granted' || result.state === 'prompt') {
        onPermissionGranted();
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-card rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-6">
          <MapPin className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Enable Location Services</h2>
        <p className="text-muted-foreground mb-8">
          To help you find the best parking spots, we need to know your current location.
        </p>
        <div className="space-y-3">
          <Button size="lg" className="w-full h-14 text-lg font-bold rounded-2xl" onClick={handleAllow}>
            Allow Location Access
          </Button>
          <Button size="lg" variant="ghost" className="w-full h-12 text-base font-bold rounded-2xl" onClick={handleAllow}>
            Maybe Later
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
