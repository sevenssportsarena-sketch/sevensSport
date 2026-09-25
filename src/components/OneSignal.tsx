"use client";

import { useEffect } from 'react';
import OneSignal from 'react-onesignal';

export function OneSignalComponent() {
  useEffect(() => {
    // Ensure this code runs only on the client side
    if (typeof window !== 'undefined') {
      OneSignal.init({
        appId: 'a6d3840e-b5a5-4a3d-9d95-72f36ee32adb',
        notifyButton: {
          enable: true,
        },
        allowLocalhostAsSecureOrigin: true, // often useful for development
      }).catch(err => {
        console.error("OneSignal init error:", err);
      });
    }
  }, []);
  return null;
}
