import { useEffect } from 'react';

const ALIVE_ALERTS = [
  { message: "New 5-star review left on Apex Slim Laptop!", type: "success" },
  { message: "Only 3 items left in stock for Aura Pro Phone!", type: "warning" },
  { message: "A customer from New York, USA just purchased Presto Espresso Machine.", type: "success" },
  { message: "Flash Sale: Enter coupon WELCOME10 for 10% off your entire order!", type: "success" },
  { message: "New order processed: Aura Heritage Hoodie is on its way.", type: "success" },
  { message: "Low stock alert: Classic Crewneck Tee is running low.", type: "warning" },
  { message: "A customer from London, UK just purchased Quantum Noise-Canceling Headphones.", type: "success" }
];

export const useWebSockets = () => {
  useEffect(() => {
    // Background simulation of real-time server alerts
    // Triggers an alert every 45 seconds to make the app feel responsive and alive!
    const triggerAlert = () => {
      const randomAlert = ALIVE_ALERTS[Math.floor(Math.random() * ALIVE_ALERTS.length)];
      
      window.dispatchEvent(new CustomEvent('show-toast', {
        detail: {
          message: randomAlert.message,
          type: randomAlert.type
        }
      }));
    };

    // Trigger first alert after 15 seconds, then every 45 seconds
    const firstTimeout = setTimeout(triggerAlert, 15000);
    const interval = setInterval(triggerAlert, 45000);

    return () => {
      clearTimeout(firstTimeout);
      clearInterval(interval);
    };
  }, []);
};
export default useWebSockets;
