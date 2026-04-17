import { io } from "socket.io-client";
import { useAuthStore } from "../store/useAuthStore";

const user = useAuthStore.getState().user;

export const socket = io(`${import.meta.env.VITE_BASE_URL || "http://localhost:3000"}`, {
  autoConnect: false,
  auth: {
    token: user?.token,
  },
});
