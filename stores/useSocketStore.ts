"use client";

import { create } from "zustand";
import { Socket, io } from "socket.io-client";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";

interface IUseSocketStore {
  io: Socket;
  connected: boolean;
  setConnected: (value: boolean) => void;
}

const initSocket = io(`${process.env.NEXT_PUBLIC_QUEUE_SERVER_URL}`, {
  transports: ["websocket", "polling"],
});

export const useSocketStore = create<IUseSocketStore>((set) => ({
  io: initSocket.connect(),
  connected: false,
  setConnected: (value) => set((state) => ({ ...state, connected: value })),
}));

export const InitializeSocket = () => {
  const { setConnected, io, connected } = useSocketStore();

  const { toast } = useToast();
  const session = useSession();
  useEffect(() => {
    io.on("connect", () => setConnected(true));

    return () => {
      io.on("disconnect", () => setConnected(false));
    };
  }, [io, setConnected, connected]);

  useEffect(() => {
    const throwToast = (
      status: "success" | "error" | "warning",
      message: string,
    ) => {
      status === "success"
        ? toast({
            title: "Success",
            description: message,
          })
        : status === "warning"
        ? toast({
            title: "Warning",
            description: message,
            variant: "warning",
          })
        : toast({
            title: "Error",
            description: message,
            variant: "destructive",
          });
    };

    if (io && session?.data?.user.id) {
      const userIdMessageEvent = `${session.data.user.id}:message`;
      io.on(userIdMessageEvent, ({ status, message }) => {
        throwToast(status, message);
      });

      return () => {
        io.off(userIdMessageEvent);
      };
    }
  }, [io, session]);
  return null;
};
