import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ToastContainer from "../components/ui/ToastContainer";
import { ToastContext } from "./toastContextValue";

const DEFAULT_TOAST_DURATION = 4500;
let toastCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timeoutMapRef = useRef(new Map());

  const removeToast = useCallback((toastId) => {
    const timeoutId = timeoutMapRef.current.get(toastId);
    if (timeoutId) {
      window.clearTimeout(timeoutId);
      timeoutMapRef.current.delete(toastId);
    }

    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== toastId)
    );
  }, []);

  const addToast = useCallback(
    ({ type = "info", title = "", message = "", duration = DEFAULT_TOAST_DURATION }) => {
      if (!message) {
        return null;
      }

      const toastId = ++toastCounter;
      const newToast = {
        id: toastId,
        type,
        title,
        message,
      };

      setToasts((currentToasts) => [...currentToasts, newToast].slice(-4));

      if (duration > 0) {
        const timeoutId = window.setTimeout(() => {
          removeToast(toastId);
        }, duration);

        timeoutMapRef.current.set(toastId, timeoutId);
      }

      return toastId;
    },
    [removeToast]
  );

  useEffect(() => {
    const timeoutMap = timeoutMapRef.current;

    return () => {
      timeoutMap.forEach((timeoutId) => {
        window.clearTimeout(timeoutId);
      });
      timeoutMap.clear();
    };
  }, []);

  const value = useMemo(
    () => ({
      addToast,
      removeToast,
      success: (message, options = {}) =>
        addToast({ ...options, type: "success", message }),
      error: (message, options = {}) =>
        addToast({ ...options, type: "error", message }),
      info: (message, options = {}) =>
        addToast({ ...options, type: "info", message }),
    }),
    [addToast, removeToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  );
}
