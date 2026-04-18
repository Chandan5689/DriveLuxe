import React from "react";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
  FaTimes,
} from "react-icons/fa";

const TOAST_VARIANTS = {
  success: {
    wrapper: "border-emerald-200 bg-emerald-50 text-emerald-800",
    icon: <FaCheckCircle className="h-5 w-5 text-emerald-600" />,
  },
  error: {
    wrapper: "border-red-200 bg-red-50 text-red-800",
    icon: <FaExclamationCircle className="h-5 w-5 text-red-600" />,
  },
  info: {
    wrapper: "border-blue-200 bg-blue-50 text-blue-800",
    icon: <FaInfoCircle className="h-5 w-5 text-blue-600" />,
  },
};

function ToastContainer({ toasts, onDismiss }) {
  if (!toasts.length) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed left-1/2 top-20 z-[100] w-[calc(100vw-2rem)] max-w-sm -translate-x-1/2 space-y-3 sm:left-auto sm:right-4 sm:translate-x-0">
      {toasts.map((toast) => {
        const variant = TOAST_VARIANTS[toast.type] || TOAST_VARIANTS.info;

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-xl border shadow-lg backdrop-blur-sm ${variant.wrapper}`}
            role={toast.type === "error" ? "alert" : "status"}
            aria-live={toast.type === "error" ? "assertive" : "polite"}
          >
            <div className="flex items-start gap-3 px-4 py-3">
              <div className="mt-0.5 shrink-0">{variant.icon}</div>
              <div className="min-w-0 flex-1">
                {toast.title && (
                  <p className="text-sm font-semibold leading-5">{toast.title}</p>
                )}
                <p className="text-sm leading-5">{toast.message}</p>
              </div>
              <button
                type="button"
                onClick={() => onDismiss(toast.id)}
                className="rounded-md p-1 text-gray-500 transition-colors hover:bg-white/50 hover:text-gray-700"
                aria-label="Dismiss notification"
              >
                <FaTimes className="h-4 w-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ToastContainer;
