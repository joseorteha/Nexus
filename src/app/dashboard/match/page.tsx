"use client";

import { useState, useEffect } from "react";
import { SwipeCard } from "@/components/modules/match/SwipeCard";
import { getMatches, swipeAction } from "@/lib/actions/match-actions";
import type { MatchResult } from "@/types/nexus";
import { Heart, X, Sparkles, MessageCircle, TrendingUp, Target, RefreshCw, ChevronRight } from "lucide-react";

export default function MatchPage() {
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showMatchModal, setShowMatchModal] = useState(false);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    setIsLoading(true);
    try {
      const results = await getMatches("1"); // ID de Cooperativa Café Sierra
      setMatches(results);
    } catch (error) {
      console.error("Error loading matches:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async (companyId: string) => {
    const result = await swipeAction(companyId, "like");
    
    if (result.matched) {
      setShowMatchModal(true);
      setTimeout(() => setShowMatchModal(false), 3000);
    }
    
    nextCard();
  };

  const handlePass = async (companyId: string) => {
    await swipeAction(companyId, "pass");
    nextCard();
  };

  const nextCard = () => {
    if (currentIndex < matches.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const currentMatch = matches[currentIndex];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <Sparkles className="w-6 h-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <p className="text-gray-600 font-medium">Buscando empresas compatibles...</p>
          <p className="text-gray-400 text-sm mt-1">Analizando oportunidades de negocio</p>
        </div>
      </div>
    );
  }

  if (!currentMatch) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="bg-linear-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-gray-100 p-12">
          <div className="w-20 h-20 bg-linear-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            ¡Has visto todas las empresas!
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Revisa tus matches en la sección de chat o espera nuevas oportunidades de negocio.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => {
                setCurrentIndex(0);
                loadMatches();
              }}
              className="bg-linear-to-r from-primary to-secondary text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all flex items-center gap-2 font-medium"
            >
              <RefreshCw className="w-5 h-5" />
              Volver a ver
            </button>
            <a
              href="/dashboard/match/chat"
              className="bg-white text-primary border-2 border-primary px-6 py-3 rounded-xl hover:bg-primary hover:text-white transition-all flex items-center gap-2 font-medium"
            >
              <MessageCircle className="w-5 h-5" />
              Ver Matches
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-linear-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Encuentra tu Match
          </h1>
        </div>
        <p className="text-gray-600 text-lg">
          Descubre empresas compatibles con tu negocio
        </p>
      </div>

      {/* Stats Bar */}
      <div className="bg-linear-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-linear-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Compatibilidad</p>
                <div className="flex items-center gap-3 mt-1">
                  <div className="w-40 h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-linear-to-r from-primary via-accent to-secondary transition-all duration-500"
                      style={{ width: `${currentMatch.score}%` }}
                    ></div>
                  </div>
                  <span className="font-bold text-lg bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {currentMatch.score}%
                  </span>
                </div>
              </div>
            </div>
            <div className="h-12 w-px bg-gray-200"></div>
            <div className="text-center">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Progreso</p>
              <p className="text-lg font-bold text-gray-800 mt-1">
                {currentIndex + 1} / {matches.length}
              </p>
            </div>
          </div>
          
          <a
            href="/dashboard/match/chat"
            className="bg-linear-to-r from-primary to-secondary text-white px-5 py-2.5 rounded-xl hover:shadow-lg transition-all flex items-center gap-2 font-medium group"
          >
            <MessageCircle className="w-5 h-5" />
            Ver Matches ({matches.filter(m => m.score > 50).length})
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>

      {/* Match Reasons */}
      {currentMatch.reasons.length > 0 && (
        <div className="bg-linear-to-br from-blue-50 to-cyan-50 border border-blue-200/50 rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Target className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-semibold text-blue-900 text-lg">
              ¿Por qué es compatible?
            </h3>
          </div>
          <ul className="space-y-2">
            {currentMatch.reasons.map((reason, index) => (
              <li key={index} className="text-sm text-blue-800 flex items-start gap-3 bg-white/50 rounded-lg p-3">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 shrink-0"></div>
                <span className="flex-1">{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Swipe Card */}
      <SwipeCard
        company={currentMatch.company}
        onLike={handleLike}
        onPass={handlePass}
      />

      {/* Match Modal */}
      {showMatchModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-300">
          <div className="bg-linear-to-br from-white to-gray-50 rounded-3xl p-10 max-w-md mx-4 text-center shadow-2xl border border-gray-200 animate-in zoom-in duration-500">
            <div className="w-20 h-20 bg-linear-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <Heart className="w-10 h-10 text-white fill-white" />
            </div>
            <h2 className="text-4xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent mb-3">
              ¡Es un Match!
            </h2>
            <p className="text-gray-600 text-lg mb-6">
              Ahora pueden chatear y hacer negocios juntos
            </p>
            <div className="flex gap-2 justify-center">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
              <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
