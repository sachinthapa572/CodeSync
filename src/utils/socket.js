import { io } from 'socket.io-client';

export const initSocket = async () => {
  const options = {
    'force new connection': true,
    reconnectionAttempts: 'Infinity',
    timeout: 10000,
    transports: ['websocket'],
  };

  const backendApiUrl = import.meta.env.VITE_BACKEND_API_URL;
  return io(backendApiUrl, options);
};
