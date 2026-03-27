"use client";

import * as Toast from "@radix-ui/react-toast";
import { create } from "zustand";
import { X } from "lucide-react";

interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant?: "default" | "success" | "celebration";
}

interface ToastState {
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, "id">) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (toast) =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        { ...toast, id: Math.random().toString(36).slice(2) },
      ],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { toasts, removeToast } = useToastStore();

  return (
    <Toast.Provider swipeDirection="right">
      {children}
      {toasts.map((toast) => (
        <Toast.Root
          key={toast.id}
          open
          onOpenChange={() => removeToast(toast.id)}
          duration={toast.variant === "celebration" ? 5000 : 3000}
          className={`rounded-xl p-4 shadow-lg border ${
            toast.variant === "celebration"
              ? "bg-green-50 border-green-200"
              : toast.variant === "success"
              ? "bg-[#FDFDF8] border-green-200"
              : "bg-[#FDFDF8] border-gray-100"
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <Toast.Title className="font-semibold text-[#1D2939] text-sm">
                {toast.variant === "celebration" && "🎉 "}
                {toast.title}
              </Toast.Title>
              {toast.description && (
                <Toast.Description className="text-sm text-[#667085] mt-1">
                  {toast.description}
                </Toast.Description>
              )}
            </div>
            <Toast.Close className="text-[#667085] hover:text-[#1D2939]">
              <X className="w-4 h-4" />
            </Toast.Close>
          </div>
        </Toast.Root>
      ))}
      <Toast.Viewport className="fixed bottom-20 right-4 left-4 md:left-auto md:w-96 flex flex-col gap-2 z-50" />
    </Toast.Provider>
  );
}
