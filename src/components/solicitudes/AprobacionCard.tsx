"use client";

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  X,
  CheckCircle,
  XCircle,
  Users,
  Building2,
  Mail,
  Calendar,
  MapPin,
  Package,
  Award,
  FileText,
  AlertCircle,
  Send
} from 'lucide-react';
import { CooperativeRequest } from '@/types/nexus';

interface AprobacionCardProps {
  solicitud: CooperativeRequest;
  onAprobar: (id: string, notes?: string) => void;
  onRechazar: (id: string, notes: string) => void;
  onCerrar: () => void;
  isOpen: boolean;
}

export const AprobacionCard: React.FC<AprobacionCardProps> = ({
  solicitud,
  onAprobar,
  onRechazar,
  onCerrar,
  isOpen
}) => {
  const [notes, setNotes] = useState('');
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleConfirm = async () => {
    if (!action) return;
    
    if (action === 'reject' && notes.trim().length < 20) {
      alert('Por favor proporciona una razón detallada para el rechazo (mínimo 20 caracteres)');
      return;
    }

    setIsProcessing(true);
    
    // Simular delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (action === 'approve') {
      onAprobar(solicitud.id, notes.trim() || undefined);
    } else {
      onRechazar(solicitud.id, notes.trim());
    }

    setIsProcessing(false);
    setAction(null);
    setNotes('');
  };

  const handleCancel = () => {
    setAction(null);
    setNotes('');
  };

  if (!isOpen) return null;

  const isCreateType = solicitud.type === 'create';
  const cooperativeData = solicitud.cooperativeData;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className={`text-white p-6 sticky top-0 z-10 ${
          isCreateType 
            ? 'bg-gradient-to-r from-purple-600 to-pink-600'
            : 'bg-gradient-to-r from-blue-600 to-indigo-600'
        }`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {isCreateType ? (
                <Building2 className="h-8 w-8" />
              ) : (
                <Users className="h-8 w-8" />
              )}
              <div>
                <h2 className="text-2xl font-bold mb-1">
                  {isCreateType ? 'Solicitud de Creación' : 'Solicitud de Membresía'}
                </h2>
                <p className="text-sm opacity-90">
                  {solicitud.cooperativeName}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onCerrar}
              className="text-white hover:bg-white/20 shrink-0"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-6">
          {/* Info del solicitante */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Users className="h-4 w-4" />
              Información del Solicitante
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold">
                  {solicitud.userName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-medium">{solicitud.userName}</div>
                  <div className="text-xs text-muted-foreground">ID: {solicitud.userId}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0" />
                {solicitud.userEmail}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4 shrink-0" />
                {formatDate(solicitud.requestDate)}
              </div>
            </div>
          </div>

          {/* Detalles específicos según tipo */}
          {isCreateType && cooperativeData ? (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Building2 className="h-5 w-5 text-purple-600" />
                Detalles de la Cooperativa a Crear
              </h3>

              {/* Información básica */}
              <Card className="p-4 border-2 border-purple-200">
                <h4 className="font-semibold mb-3">Información Básica</h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-muted-foreground">Nombre:</span>
                    <p className="font-medium">{cooperativeData.name}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Descripción:</span>
                    <p className="text-sm">{cooperativeData.description}</p>
                  </div>
                </div>
              </Card>

              {/* Productos y categorías */}
              <Card className="p-4 border-2 border-blue-200">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Productos y Categorías
                </h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-muted-foreground mb-2 block">Productos:</span>
                    <div className="flex flex-wrap gap-2">
                      {cooperativeData.products?.map((product, index) => (
                        <Badge key={index} variant="secondary">
                          {product}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground mb-2 block">Categorías:</span>
                    <div className="flex flex-wrap gap-2">
                      {cooperativeData.categories?.map((cat, index) => (
                        <Badge key={index} className="bg-purple-100 text-purple-700">
                          {cat}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Capacidad y región */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4 border-2 border-green-200">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Capacidad
                  </h4>
                  <p className="text-2xl font-bold text-green-600">
                    {cooperativeData.productionCapacity}
                  </p>
                </Card>

                <Card className="p-4 border-2 border-orange-200">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Región
                  </h4>
                  <Badge variant="outline" className="bg-orange-50 text-orange-700">
                    {cooperativeData.region}
                  </Badge>
                </Card>
              </div>

              {/* Certificaciones */}
              {cooperativeData.certifications && cooperativeData.certifications.length > 0 && (
                <Card className="p-4 border-2 border-green-200">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Certificaciones
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {cooperativeData.certifications.map((cert, index) => (
                      <Badge key={index} variant="outline" className="bg-green-50 text-green-700 border-green-300">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </Card>
              )}

              {/* Miembros fundadores */}
              {cooperativeData.foundingMembers && cooperativeData.foundingMembers.length > 0 && (
                <Card className="p-4 border-2 border-purple-200">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Miembros Fundadores ({cooperativeData.foundingMembers.length})
                  </h4>
                  <div className="space-y-2">
                    {cooperativeData.foundingMembers.map((member, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-300 to-pink-300 flex items-center justify-center text-white text-xs font-bold">
                          {member.charAt(0).toUpperCase()}
                        </div>
                        <span>{member}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Motivación para Unirse
              </h3>
              <Card className="p-4 border-2 border-blue-200 bg-blue-50">
                <p className="text-sm leading-relaxed">
                  {solicitud.reviewNotes || 'No se proporcionó motivación'}
                </p>
              </Card>
            </div>
          )}

          {/* Estado actual */}
          {solicitud.status !== 'pending' && (
            <Card className={`p-4 border-2 ${
              solicitud.status === 'approved' 
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-start gap-3">
                {solicitud.status === 'approved' ? (
                  <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600 shrink-0" />
                )}
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">
                    {solicitud.status === 'approved' ? 'Solicitud Aprobada' : 'Solicitud Rechazada'}
                  </h4>
                  {solicitud.reviewedBy && (
                    <p className="text-sm text-muted-foreground mb-2">
                      Por {solicitud.reviewedBy} el {solicitud.reviewedAt && formatDate(solicitud.reviewedAt)}
                    </p>
                  )}
                  {solicitud.reviewNotes && solicitud.status === 'rejected' && (
                    <p className="text-sm italic">{solicitud.reviewNotes}</p>
                  )}
                </div>
              </div>
            </Card>
          )}

          {/* Panel de acción (solo para pendientes) */}
          {solicitud.status === 'pending' && (
            <div className="space-y-4 pt-4 border-t">
              {!action ? (
                <div className="flex gap-3">
                  <Button
                    onClick={() => setAction('approve')}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    size="lg"
                  >
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Aprobar Solicitud
                  </Button>
                  <Button
                    onClick={() => setAction('reject')}
                    variant="destructive"
                    className="flex-1"
                    size="lg"
                  >
                    <XCircle className="h-5 w-5 mr-2" />
                    Rechazar Solicitud
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg ${
                    action === 'approve' 
                      ? 'bg-green-50 border-2 border-green-200'
                      : 'bg-red-50 border-2 border-red-200'
                  }`}>
                    <div className="flex items-start gap-2 mb-3">
                      <AlertCircle className={`h-5 w-5 shrink-0 ${
                        action === 'approve' ? 'text-green-600' : 'text-red-600'
                      }`} />
                      <div>
                        <h4 className="font-semibold">
                          {action === 'approve' ? 'Aprobar Solicitud' : 'Rechazar Solicitud'}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {action === 'approve' 
                            ? 'Puedes agregar notas opcionales para el solicitante'
                            : 'Debes proporcionar una razón detallada para el rechazo (mínimo 20 caracteres)'
                          }
                        </p>
                      </div>
                    </div>

                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder={action === 'approve' 
                        ? 'Notas opcionales (ej: Bienvenido a la cooperativa, te contactaremos pronto...)'
                        : 'Razón del rechazo (ej: Los productos ofrecidos no están alineados con las categorías de la cooperativa...)'
                      }
                      className="w-full min-h-[100px] p-3 border border-input rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-600"
                      maxLength={500}
                    />
                    <div className="flex justify-between text-xs mt-1">
                      {action === 'reject' && (
                        <span className={notes.length < 20 ? 'text-red-500' : 'text-green-600'}>
                          {notes.length < 20 
                            ? `Faltan ${20 - notes.length} caracteres`
                            : '✓ Mínimo alcanzado'
                          }
                        </span>
                      )}
                      <span className="text-muted-foreground ml-auto">
                        {notes.length}/500
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      disabled={isProcessing}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleConfirm}
                      disabled={isProcessing || (action === 'reject' && notes.length < 20)}
                      className={`flex-1 ${
                        action === 'approve'
                          ? 'bg-green-600 hover:bg-green-700'
                          : 'bg-red-600 hover:bg-red-700'
                      }`}
                    >
                      {isProcessing ? (
                        'Procesando...'
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Confirmar {action === 'approve' ? 'Aprobación' : 'Rechazo'}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
