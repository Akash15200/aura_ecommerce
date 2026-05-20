import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

export const useWebSockets = () => {
  const queryClient = useQueryClient();
  const stompClientRef = useRef(null);

  useEffect(() => {
    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
    const wsUrl = apiBase.replace('/api', '') + '/ws';
    const socket = new SockJS(wsUrl);
    const stompClient = Stomp.over(socket);
    stompClient.debug = null; // Mute console tracing

    stompClient.connect({}, () => {
      stompClientRef.current = stompClient;

      // Subscribe to real-time notification broadcasts
      stompClient.subscribe('/topic/alerts', (message) => {
        try {
          const alert = JSON.parse(message.body);

          // 1. Dispatch custom event to invoke Toast notifications instantly!
          window.dispatchEvent(new CustomEvent('show-toast', {
            detail: {
              message: alert.message,
              type: alert.type === 'INVENTORY' ? 'warning' : 'success'
            }
          }));

          // 2. React Query: invalidate caches based on event tags to refresh screens live!
          if (alert.type === 'ORDER' || alert.type === 'PAYMENT') {
            queryClient.invalidateQueries({ queryKey: ['salesHistory'] });
            queryClient.invalidateQueries({ queryKey: ['ordersList'] });
          } else if (alert.type === 'INVENTORY') {
            queryClient.invalidateQueries({ queryKey: ['catalogPage'] });
            queryClient.invalidateQueries({ queryKey: ['productDetails'] });
          } else if (alert.type === 'REVIEW') {
            queryClient.invalidateQueries({ queryKey: ['sentimentStats'] });
            queryClient.invalidateQueries({ queryKey: ['reviewsList'] });
          }
        } catch (e) {
          // Ignore parse errors
        }
      });
    }, (err) => {
      // Reconnect fallback if gateway is loading
      setTimeout(() => {
        stompClientRef.current = null;
      }, 5000);
    });

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.disconnect();
      }
    };
  }, [queryClient]);
};
