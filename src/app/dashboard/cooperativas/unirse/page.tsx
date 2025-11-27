"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Users, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function UnirseCooperativaPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirigir automáticamente al Match después de 3 segundos
    const timer = setTimeout(() => {
      router.push("/dashboard/match");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[600px]">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl border border-gray-200 p-12">
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
              <Users className="w-12 h-12 text-white" />
            </div>
            <div className="absolute top-0 right-1/2 transform translate-x-1/2">
              <Sparkles className="w-8 h-8 text-yellow-400 animate-bounce" />
            </div>
          </div>

          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4">
            ¡Redirigiendo al Match!
          </h1>
          
          <p className="text-gray-600 text-lg mb-2">
            Las cooperativas activas las encuentras en el <strong>Match</strong>
          </p>
          <p className="text-gray-500 mb-8">
            Ahí podrás revisar cada cooperativa y unirte a la que más te guste
          </p>

          <div className="flex gap-2 justify-center mb-8">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          </div>

          <Link
            href="/dashboard/match"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold px-8 py-4 rounded-xl hover:shadow-xl transition-all"
          >
            Ir al Match ahora
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
