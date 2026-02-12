import React from "react";
import ThemeTogglerTwo from "../components/common/ThemeTogglerTwo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full bg-white transition-colors duration-300 dark:bg-gray-900">
      <div className="flex w-full">
        <section className="relative hidden flex-1 lg:block">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
            style={{ backgroundImage: "url(/images/login/login-image1.jpeg)" }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/100 via-gray-900/30 to-gray-900/100 flex flex-col justify-between p-12 xl:p-20">
            <div className="flex items-center gap-6 animate-fade-in">
              <img
                width={220}
                height={45}
                src="/images/logo/auth-logo-white.png"
                alt="UDIPSAI Logo"
              />
              <div className="w-px h-16 bg-white/30" />
              <div className="flex flex-col text-white">
                <h2 className="text-2xl font-bold tracking-[0.2em] uppercase">
                  UDIPSAI
                </h2>
                <p className="text-xs font-medium tracking-[0.3em] uppercase opacity-80">
                  Excelencia en Inclusión
                </p>
              </div>
            </div>

            <div className="max-w-xl animate-fade-in-up">
              <div className="h-1.5 w-12 bg-red-600 mb-8 rounded-full" />
              <h3 className="text-4xl xl:text-5xl font-extrabold text-gray-200 mb-6 leading-tight">
                Innovación y Compromiso <br />
                <span className="text-brand-400">en cada Diagnóstico.</span>
              </h3>
              <p className="text-lg text-gray-200 leading-relaxed font-normal max-w-md">
                Unidad de Diagnóstico, Investigación Psicopedagógica y Apoyo a
                la Inclusión. Gestión integral y humanizada.
              </p>
            </div>
          </div>
        </section>

        <main className="relative flex flex-col justify-center w-full lg:w-[480px] xl:w-[560px] p-8 sm:p-12 lg:p-16 bg-white dark:bg-gray-900 shadow-2xl z-10">
          <div className="absolute top-8 right-8">
            <ThemeTogglerTwo />
          </div>

          <div className="mx-auto w-full max-w-sm">
            <div className="lg:hidden mb-12 flex justify-center">
              <img
                src="/images/logo/logo-dark.png"
                alt="Logo"
                className="h-12 dark:hidden"
              />
              <img
                src="/images/logo/logo-light.png"
                alt="Logo"
                className="h-12 hidden dark:block"
              />
            </div>

            <div className="space-y-6">{children}</div>
          </div>

          <footer className="absolute bottom-8 left-0 w-full text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} UDIPSAI. Todos los derechos
            reservados.
          </footer>
        </main>
      </div>
    </div>
  );
}
