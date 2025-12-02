"use client";

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { 
  X,
  Users,
  FileText,
  AlertCircle,
  CheckCircle,
  Send
} from 'lucide-react';
import { Cooperative, CooperativeRequest } from '@/types/nexus';

interface SolicitudMembresiaFormProps {
  cooperativa: Cooperative;
  userId: string;
  userName: string;
  userEmail: string;
  onSubmit: (request: Omit<CooperativeRequest, 'id' | 'requestDate'>) => void;
  onCancel: () => void;
  isOpen: boolean;
}

export const SolicitudMembresiaForm: React.FC<SolicitudMembresiaFormProps> = ({
  cooperativa,
  userId,
  userName,
  userEmail,
  onSubmit,
  onCancel,
  isOpen
}) => {
  const [motivation, setMotivation] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!motivation.trim() || !acceptTerms) return;

    setIsSubmitting(true);

    const request: Omit<CooperativeRequest, 'id' | 'requestDate'> = {
      type: 'join',
      userId,
      userName,
      userEmail,
      cooperativeId: cooperativa.id,
      cooperativeName: cooperativa.name,
      cooperativeData: undefined,
      status: 'pending',
      reviewedBy: undefined,
      reviewedAt: undefined,
      reviewNotes: motivation
    };

    // Simular delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onSubmit(request);
    setIsSubmitting(false);
  };

  const canSubmit = motivation.trim().length >= 50 && acceptTerms;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 sticky top-0 z-10">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <Users className="h-6 w-6" />
                Solicitar Membresía
              </h2>
              <p className="text-purple-100">
                {cooperativa.name}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onCancel}
              className="text-white hover:bg-white/20 shrink-0"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-6">
          {/* Info de la cooperativa */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-purple-900 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Sobre esta cooperativa
            </h3>
            <p className="text-sm text-purple-800">
              {cooperativa.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {cooperativa.category.map((cat, index) => (
                <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-700">
                  {cat}
                </Badge>
              ))}
            </div>
          </div>

          {/* Datos del solicitante */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Tus Datos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-muted-foreground">Nombre</label>
                <Input value={userName} disabled className="bg-gray-50" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Email</label>
                <Input value={userEmail} disabled className="bg-gray-50" />
              </div>
            </div>
          </div>

          {/* Motivación */}
          <div className="space-y-2">
            <label className="font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Cuéntanos por qué quieres unirte
              <span className="text-red-500">*</span>
            </label>
            <p className="text-sm text-muted-foreground">
              Describe tus productos, experiencia y qué esperas aportar a la cooperativa (mínimo 50 caracteres)
            </p>
            <textarea
              value={motivation}
              onChange={(e) => setMotivation(e.target.value)}
              placeholder="Ejemplo: Soy productor de café orgánico en Zongolica con 5 años de experiencia. Busco unirme a esta cooperativa para acceder a mejores mercados y compartir conocimientos con otros productores de la región..."
              className="w-full min-h-[120px] p-3 border border-input rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              maxLength={500}
            />
            <div className="flex justify-between text-xs">
              <span className={motivation.length < 50 ? 'text-red-500' : 'text-green-600'}>
                {motivation.length < 50 
                  ? `Faltan ${50 - motivation.length} caracteres`
                  : `✓ Mínimo alcanzado`
                }
              </span>
              <span className="text-muted-foreground">
                {motivation.length}/500
              </span>
            </div>
          </div>

          {/* Términos */}
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <input
                type="checkbox"
                id="terms"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-1 h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-600"
              />
              <label htmlFor="terms" className="text-sm cursor-pointer">
                <span className="font-medium">Acepto los términos de membresía</span>
                <ul className="mt-2 space-y-1 text-muted-foreground">
                  <li>• Compartir el ERP con otros miembros de la cooperativa</li>
                  <li>• Colaborar activamente en las actividades del grupo</li>
                  <li>• Respetar las decisiones colectivas</li>
                  <li>• Mantener la calidad de los productos</li>
                </ul>
              </label>
            </div>
          </div>

          {/* Proceso de aprobación */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 space-y-2">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-orange-900 mb-1">
                  Proceso de Aprobación
                </h4>
                <p className="text-sm text-orange-800">
                  Tu solicitud será revisada por un administrador y por los fundadores de la cooperativa. 
                  Recibirás una notificación con la respuesta en un plazo de 5-7 días hábiles.
                </p>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit || isSubmitting}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {isSubmitting ? (
                <>Enviando...</>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Enviar Solicitud
                </>
              )}
            </Button>
          </div>

          {!canSubmit && (
            <p className="text-sm text-muted-foreground text-center">
              {!motivation.trim() || motivation.length < 50
                ? 'Completa tu motivación (mínimo 50 caracteres)'
                : !acceptTerms
                ? 'Acepta los términos para continuar'
                : ''
              }
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};
