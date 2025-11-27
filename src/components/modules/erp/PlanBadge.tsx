"use client";

import { Badge } from "@/components/ui/Badge";
import { Crown, Lock } from "lucide-react";
import type { PlanType } from "@/types/nexus";

interface PlanBadgeProps {
  planType: PlanType;
  status?: "active" | "trial" | "expired" | "cancelled";
  size?: "sm" | "md" | "lg";
}

export function PlanBadge({ planType, status, size = "md" }: PlanBadgeProps) {
  const getVariant = () => {
    switch (planType) {
      case "Plus":
        return "default";
      case "Premium":
        return "success";
      case "Free":
        return "secondary";
    }
  };

  const getIcon = () => {
    if (planType === "Free") return null;
    return <Crown className={size === "sm" ? "w-3 h-3" : "w-4 h-4"} />;
  };

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-2",
  };

  return (
    <Badge variant={getVariant()} size={size === "sm" ? "sm" : undefined} className={`flex items-center gap-1 ${sizeClasses[size]}`}>
      {getIcon()}
      {planType}
      {status === "trial" && " (Prueba)"}
    </Badge>
  );
}

interface FeatureLockedProps {
  featureName: string;
  requiredPlan: PlanType;
  currentPlan: PlanType;
  message?: string;
}

export function FeatureLocked({ featureName, requiredPlan, currentPlan, message }: FeatureLockedProps) {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-8 text-center">
      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
        <Lock className="w-8 h-8 text-white" />
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 mb-2">{featureName}</h3>
      <p className="text-gray-600 mb-4">
        {message || `Esta función está disponible en el plan ${requiredPlan}`}
      </p>
      
      <div className="flex items-center justify-center gap-3 mb-6">
        <PlanBadge planType={currentPlan} size="md" />
        <span className="text-gray-400">→</span>
        <PlanBadge planType={requiredPlan} size="md" />
      </div>

      <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg">
        Actualizar a {requiredPlan}
      </button>
    </div>
  );
}
