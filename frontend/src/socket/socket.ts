import { io } from "socket.io-client";
import { useAuthStore } from "../store/useAuthStore";

const user = useAuthStore.getState().user;

export const socket = io("http://localhost:3000", {
  autoConnect: false,
  auth: {
    employeeId: user?.email,
    role: user?.role,
  },
});
