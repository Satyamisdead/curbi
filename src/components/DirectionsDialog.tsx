"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Navigation } from "lucide-react";

interface DirectionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  spotName: string;
}

const steps = [
  { instruction: "Head north on Main St toward Park Ave", distance: "200m" },
  { instruction: "Turn left onto Park Ave", distance: "500m" },
  { instruction: "Turn right onto Oak St", distance: "300m" },
  { instruction: "The destination will be on your left", distance: "" },
];

export function DirectionsDialog({ open, onOpenChange, spotName }: DirectionsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Navigation className="text-accent" />
            Directions to {spotName}
          </DialogTitle>
          <DialogDescription>
            Follow the steps below to reach your destination.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {steps.map((step, index) => (
            <div key={index}>
              <div className="flex justify-between items-center">
                <p className="font-medium">{step.instruction}</p>
                {step.distance && (
                  <p className="text-sm text-muted-foreground">{step.distance}</p>
                )}
              </div>
              {index < steps.length - 1 && <Separator className="mt-2" />}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
