import { useState } from "react";
import { User, UserStar } from "lucide-react";
export default function Another() {
  const [role, setRole] = useState("employee");

  return (
    <>
      <div className="flex pt-3 font-body pb-3">
        <main className="lg:ml-64 p-6 md:p-10 bg-[#f7f9fb]">
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="space-y-1">
              <p className="text-[#45464d] font-medium tracking-tight">
                Monday, October 23
              </p>
              <h1 className="text-4xl md:text-5xl font-extrabold font-headline text-[#191c1e] tracking-tight">
                Good morning, Alex
              </h1>
            </div>
          </header>
          <div className="lg:col-span-8 space-y-8">
            <section className="relative overflow-hidden rounded-4xl bg-[#497cff] p-12 text-white shadow-2xl shadow-[#497cff]/20 group">
              <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDsAxAAsT5weME4V5VGDt3lKLdSHsI5d7zaiZsdZYtHmxGPDG4imzUEey3qICi4sJFNrK6mFUpPKv3O85R_VrRFevKkekTyIL8cOYn-k795agxys-HBZGZia3eKHk-7pdUXKLe4pQ_yOOHzGF7z2XUzl6vAV9hWQCkuPIw7tsKfcD26fu1WFcQMaV0nvqQb47ohvJVq6DgqJ-9vAwH-a-xbWy4H7YDyGkf9QMtOVlMGPoDwhXgDykGCEiCNQCYGBoUvxhuhD3jCMsQ')",
                }}
              ></div>
              <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-3xl transition-transform duration-700 group-hover:scale-125"></div>
              <div className="relative z-10 flex flex-col items-center justify-center text-center">
                <span className="text-lg font-medium tracking-[0.2em] uppercase text-white/60 mb-2">
                  Current Time
                </span>
                <div className="text-7xl md:text-9xl font-extrabold font-headline tracking-tighter mb-4">
                  08:42:60
                </div>
                <div className="flex items-center gap-4 text-white/80 font-medium">
                  <div className="flex items-center gap-1.5 px-4 py-1 rounded-full bg-white/10">
                    <span className="material-symbols-outlined text-sm">
                      schedule
                    </span>
                    GMT+2
                  </div>
                  <span>San Francisco, USA</span>
                </div>
              </div>
            </section>
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button className="group flex items-center gap-4 justify-center p-4 bg-white rounded-4xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 active:scale-[0.98]">
                <span className="material-symbols-outlined text-[#003ea8]">
                  login
                </span>
                <h3 className="text-xl font-bold font-headline">Check In</h3>
              </button>
              <button className="group flex items-center gap-4 justify-center p-4 bg-white rounded-4xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 active:scale-[0.98]">
                <span className="material-symbols-outlined text-[#574425]">
                  logout
                </span>
                <h3 className="text-xl font-bold font-headline">Check Out</h3>
              </button>
            </section>
            <section>
              <div className="flex items-center gap-4 bg-white px-6 py-4 rounded-full shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#497cff] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#497cff]"></span>
                  </span>
                  <span className="font-semibold text-[#191c1e]">
                    Checked Out
                  </span>
                </div>
                <div className="h-6 w-px bg-[#c6c6cd]/30 mx-2"></div>
                <div className="text-sm text-[#45464d]">
                  <span className="text-[#191c1e] font-medium">
                    Friday, 5:42 PM
                  </span>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}

/**
 * 
 *  <div className="flex items-center gap-4 bg-white px-6 py-4 rounded-full shadow-sm">
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#497cff] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#497cff]"></span>
                </span>
                <span className="font-semibold text-[#191c1e]">
                  Checked Out
                </span>
              </div>
              <div className="h-6 w-px bg-[#c6c6cd]/30 mx-2"></div>
              <div className="text-sm text-[#45464d]">
                Last Activity:{" "}
                <span className="text-[#191c1e] font-medium">
                  Friday, 5:42 PM
                </span>
              </div>
            </div>
 */
