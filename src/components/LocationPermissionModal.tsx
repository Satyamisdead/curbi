
"use client";

import { motion } from 'framer-motion';
import { MapPin, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LocationPermissionModalProps {
  onAllow: () => void;
  onLater: () => void;
  status: PermissionState | 'prompt' | 'dismissed';
}

export function LocationPermissionModal({ onAllow, onLater, status }: LocationPermissionModalProps) {

  const isDenied = status === 'denied';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onLater}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-card rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center"
      >
        <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${isDenied ? 'bg-destructive/10' : 'bg-primary/10'} mb-6`}>
          {isDenied ? <AlertTriangle className="h-8 w-8 text-destructive" /> : <MapPin className="h-8 w-8 text-primary" />}
        </div>
        <h2 className="text-2xl font-bold mb-2">{isDenied ? 'Permission Denied' : 'Enable Location Services'}</h2>
        <p className="text-muted-foreground mb-8">
           {isDenied 
             ? "You have previously denied location access. Please enable it in your browser settings to continue."
             : "To help you find the best parking spots, Curbie needs to know your location."
           }
        </p>
        <div className="space-y-3">
          <Button size="lg" className="w-full h-14 text-lg font-bold rounded-2xl" onClick={onAllow} disabled={isDenied}>
            Allow Location Access
          </Button>
          <Button size="lg" variant="ghost" className="w-full h-14 text-lg rounded-2xl" onClick={onLater}>
            Maybe Later
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
