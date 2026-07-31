import { createRoot } from "react-dom/client";
import { CheckCircle, AlertCircle, X, Info } from "lucide-react";

let toastContainer: HTMLDivElement | null = null;

export const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.className = "fixed top-5 right-5 z-[9999] flex flex-col gap-3";
    document.body.appendChild(toastContainer);
  }

  const toastEl = document.createElement("div");
  toastContainer.appendChild(toastEl);
  const root = createRoot(toastEl);

  const removeToast = () => {
    root.unmount();
    if (toastEl.parentNode) {
      toastEl.parentNode.removeChild(toastEl);
    }
  };

  setTimeout(removeToast, 4000);

  root.render(
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border animate-fade-in min-w-[300px] ${
      type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
      type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
      'bg-blue-50 border-blue-200 text-blue-800'
    }`}>
      {type === 'success' && <CheckCircle className="text-green-500 shrink-0" size={20} />}
      {type === 'error' && <AlertCircle className="text-red-500 shrink-0" size={20} />}
      {type === 'info' && <Info className="text-blue-500 shrink-0" size={20} />}
      
      <span className="font-medium flex-1 whitespace-pre-wrap">{message}</span>
      <button onClick={removeToast} className="text-slate-400 hover:text-slate-600 transition shrink-0">
        <X size={16} />
      </button>
    </div>
  );
};

export const showConfirm = (message: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const confirmContainer = document.createElement("div");
    document.body.appendChild(confirmContainer);
    const root = createRoot(confirmContainer);

    const handleAction = (result: boolean) => {
      root.unmount();
      if (confirmContainer.parentNode) {
        confirmContainer.parentNode.removeChild(confirmContainer);
      }
      resolve(result);
    };

    root.render(
      <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 animate-fade-in backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 w-full max-w-sm animate-scale-in">
          <div className="flex items-center gap-3 text-red-600 mb-4">
            <div className="bg-red-100 p-2 rounded-full">
              <AlertCircle size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Please Confirm</h3>
          </div>
          <p className="text-slate-600 mb-6 whitespace-pre-wrap">{message}</p>
          <div className="flex justify-end gap-3">
            <button 
              onClick={() => handleAction(false)}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button 
              onClick={() => handleAction(true)}
              className="px-5 py-2.5 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 shadow-md transition"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  });
};
