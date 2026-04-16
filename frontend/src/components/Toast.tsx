import { motion, AnimatePresence } from "motion/react";
import { X, CheckCircle2 } from "lucide-react";
import useSuccessStore from "../../stores/SuccessStore";

export const SuccessNote = ({ message }: { message: string }) => {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="fixed top-9 right-9 z-100 group bg-[#f0fdf4] flex items-stretch rounded-2xl overflow-hidden min-h-[80px] transition-all hover:scale-[1.01] hover:shadow-xl hover:shadow-[#3b142a]/5 min-w-[320px] max-w-[420px]"
        >
          <div className="w-1.5 bg-green-500"></div>
          <div className="flex items-start gap-4 p-5 flex-1">
            <div className="mt-0.5 text-white">
              <span>
                <CheckCircle2 className="fill-green-600" />
              </span>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-green-900 text-lg mb-1 leading-none">
                Success
              </h4>
              <p className="text-green-800/80 font-body text-sm leading-relaxed">
                {message}
              </p>
            </div>
            <button
              onClick={clearMessage}
              className="text-green-600/40 hover:text-green-600 transition-colors"
            >
              <span></span>
              <X />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
