"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { Company } from "@/types/nexus";
import { Building2, MapPin, Star, Phone, CheckCircle2, Search, X, Heart, TrendingUp, DollarSign } from "lucide-react";

interface SwipeCardProps {
  company: Company;
  onLike: (companyId: string) => void;
  onPass: (companyId: string) => void;
}

export function SwipeCard({ company, onLike, onPass }: SwipeCardProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);

  const handleSwipe = (action: "like" | "pass") => {
    setIsAnimating(true);
    setDirection(action === "like" ? "right" : "left");
    
    setTimeout(() => {
      if (action === "like") {
        onLike(company.id);
      } else {
        onPass(company.id);
      }
      setIsAnimating(false);
      setDirection(null);
    }, 300);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "Alta": return "danger";
      case "Media": return "warning";
      case "Baja": return "success";
      default: return "default";
    }
  };

  const getFinancingBadge = (financing: string) => {
    switch (financing) {
      case "Busca": return { text: "Busca financiamiento", variant: "info" as const, icon: Search };
      case "Ofrece": return { text: "Ofrece financiamiento", variant: "success" as const, icon: DollarSign };
      default: return null;
    }
  };

  const financingBadge = getFinancingBadge(company.financing);

  return (
    <div
      className={`relative transition-all duration-300 ${
        isAnimating
          ? direction === "right"
            ? "translate-x-[500px] rotate-12 opacity-0"
            : "-translate-x-[500px] -rotate-12 opacity-0"
          : "translate-x-0 rotate-0 opacity-100"
      }`}
    >
      <Card className="max-w-md mx-auto overflow-hidden border-2 border-gray-200 hover:border-primary transition-all hover:shadow-2xl">
        {/* Header con Logo y Badges */}
        <CardHeader className="bg-linear-to-r from-primary/10 via-accent/10 to-secondary/10 pb-4 border-b border-gray-200">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {company.name}
              </h2>
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                {company.polo}
              </p>
            </div>
            <div className="w-16 h-16 bg-linear-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg">
              <Building2 className="w-8 h-8 text-white" />
            </div>
          </div>
          
          {/* Badges de tipo, tier, urgencia */}
          <div className="flex flex-wrap gap-2">
            <Badge variant={company.tier === "Premium" ? "premium" : company.tier === "Pro" ? "pro" : "free"}>
              {company.tier}
            </Badge>
            <Badge variant="default">{company.type}</Badge>
            <Badge variant="info">{company.industry}</Badge>
            <Badge variant={getUrgencyColor(company.urgency)} className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Urgencia: {company.urgency}
            </Badge>
            {financingBadge && (
              <Badge variant={financingBadge.variant} className="flex items-center gap-1">
                <financingBadge.icon className="w-3 h-3" />
                {financingBadge.text}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-4">
          {/* Descripción */}
          <div>
            <p className="text-gray-700 leading-relaxed">
              {company.description}
            </p>
          </div>

          {/* Lo que ofrece */}
          <div className="bg-linear-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200 shadow-sm">
            <h3 className="text-sm font-bold text-green-800 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Ofrece:
            </h3>
            <ul className="space-y-2">
              {company.offers.map((offer, index) => (
                <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-1.5 shrink-0"></div>
                  {offer}
                </li>
              ))}
            </ul>
          </div>

          {/* Lo que necesita */}
          <div className="bg-linear-to-br from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-200 shadow-sm">
            <h3 className="text-sm font-bold text-blue-800 mb-3 flex items-center gap-2">
              <Search className="w-4 h-4" />
              Necesita:
            </h3>
            <ul className="space-y-2">
              {company.needs.map((need, index) => (
                <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 shrink-0"></div>
                  {need}
                </li>
              ))}
            </ul>
          </div>

          {/* Rating y contacto */}
          {company.rating && (
            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <span className="font-semibold text-lg">{company.rating.toFixed(1)}</span>
                <span className="text-gray-500 text-sm">
                  ({company.reviewCount} reseñas)
                </span>
              </div>
              {company.phone && (
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <Phone className="w-4 h-4" />
                  {company.phone}
                </div>
              )}
            </div>
          )}

          {/* Botones de Swipe */}
          <div className="flex gap-4 pt-4">
            <Button
              variant="outline"
              size="lg"
              onClick={() => handleSwipe("pass")}
              className="flex-1 border-2 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-500 rounded-xl transition-all hover:scale-105"
              disabled={isAnimating}
            >
              <X className="w-6 h-6 mr-2" />
              Pasar
            </Button>
            <Button
              variant="default"
              size="lg"
              onClick={() => handleSwipe("like")}
              className="flex-1 bg-linear-to-r from-primary to-secondary shadow-lg hover:shadow-xl rounded-xl transition-all hover:scale-105"
              disabled={isAnimating}
            >
              <Heart className="w-6 h-6 mr-2 fill-white" />
              Me interesa
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
