"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { X, Crown, Sparkles, Check } from "lucide-react";
import type { Subscription } from "@/types/nexus";
import { getTrialDaysRemaining } from "@/lib/services/erp/subscription-service";

interface TrialBannerProps {
  subscription: Subscription;
}

export function TrialBanner({ subscription }: TrialBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (subscription.status !== "trial" || dismissed) {
    return null;
  }

  const daysRemaining = getTrialDaysRemaining(subscription);

  if (daysRemaining <= 0) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 border-none shadow-2xl mb-6 overflow-hidden relative">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative p-6">
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4 text-white" />
        </button>

        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shrink-0">
            <Crown className="w-8 h-8 text-yellow-300" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-6 h-6" />
                Prueba Premium Activa
              </h3>
              <Badge variant="default" className="bg-yellow-400 text-yellow-900 border-none">
                {daysRemaining} {daysRemaining === 1 ? "día" : "días"} restantes
              </Badge>
            </div>
            
            <p className="text-white/90 text-lg mb-4">
              Estás disfrutando de todas las funciones Premium. Actualiza antes de que termine tu prueba para mantener el acceso.
            </p>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <div className="flex items-center gap-2 text-white mb-1">
                  <Check className="w-4 h-4 text-green-300" />
                  <span className="font-medium">500 Productos</span>
                </div>
                <p className="text-white/70 text-sm">vs 50 en Free</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <div className="flex items-center gap-2 text-white mb-1">
                  <Check className="w-4 h-4 text-green-300" />
                  <span className="font-medium">Reportes Avanzados</span>
                </div>
                <p className="text-white/70 text-sm">Gráficas y análisis</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <div className="flex items-center gap-2 text-white mb-1">
                  <Check className="w-4 h-4 text-green-300" />
                  <span className="font-medium">Múltiples Usuarios</span>
                </div>
                <p className="text-white/70 text-sm">Colabora con tu equipo</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="px-6 py-3 bg-white text-purple-600 font-bold rounded-lg hover:bg-gray-100 transition-colors shadow-lg">
                Actualizar a Premium
              </button>
              <button className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white font-medium rounded-lg hover:bg-white/20 transition-colors">
                Ver Planes
              </button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
