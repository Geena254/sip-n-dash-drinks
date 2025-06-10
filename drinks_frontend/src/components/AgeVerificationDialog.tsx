import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const AgeVerificationDialog = () => {
  const [open, setOpen] = useState(false);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    // Check if user has already verified age
    const isVerified = localStorage.getItem("age-verified") === "true";
    if (isVerified) {
      setVerified(true);
    } else {
      setOpen(true);
    }
  }, []);

  const handleVerify = () => {
    localStorage.setItem("age-verified", "true");
    setVerified(true);
    setOpen(false);
    toast.success("Welcome to Booze To You!");
  };

  const handleUnderAge = () => {
    toast.error("Sorry, you must be 18+ to access this site");
    // Redirect or show alternative content for underage visitors
    window.location.href = "https://www.google.com";
  };

  return (
    <Dialog open={open && !verified} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Age Verification Required</DialogTitle>
          <DialogDescription className="pt-2 text-base">
            This website contains alcohol-related content. You must be 18 years or older to view it.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-center font-medium">
            Are you 18 years or older?
          </p>
        </div>
        <DialogFooter className="sm:justify-center gap-4">
          <Button variant="outline" onClick={handleUnderAge}>
            No, I'm under 18
          </Button>
          <Button onClick={handleVerify}>
            Yes, I'm 18 or older
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AgeVerificationDialog;
