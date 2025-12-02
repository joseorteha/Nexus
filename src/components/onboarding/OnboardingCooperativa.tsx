"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  Users,
  MapPin,
  Package,
  ArrowRight,
  ArrowLeft,
  Check,
  Award,
  FileText,
} from "lucide-react";

interface OnboardingProps {
  onComplete: (data: any) => void;
}

export function OnboardingCooperativa({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    products: [] as string[],
    categories: [] as string[],
    productionCapacity: "",
    region: "",
    certifications: [] as string[],
  });

  const totalSteps = 5;

  const categories = [
    "Café", "Artesanías", "Textiles", "Miel", "Productos Orgánicos",
    "Alimentos Procesados", "Bebidas", "Cosméticos Naturales", "Otros"
  ];

  const availableCertifications = [
    "Orgánico", "Comercio Justo", "Denominación de Origen",
    "Certificación de Calidad", "Amigable con el Medio Ambiente"
  ];

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleComplete = () => {
    onComplete({
      ...formData,
      completedAt: new Date().toISOString(),
    });
  };

  const handleSkipStep = () => {
    if (step === 3) {
      // Omitir capacidad y región
      setFormData(prev => ({ 
        ...prev, 
        productionCapacity: "",
        region: "" 
      }));
    } else if (step === 4) {
      // Omitir certificaciones
      setFormData(prev => ({ ...prev, certifications: [] }));
    }
    handleNext();
  };

  const toggleItem = (list: string[], item: string) => {
    return list.includes(item)
      ? list.filter(i => i !== item)
      : [...list, item];
  };

  const addProduct = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const value = e.currentTarget.value.trim();
      if (value) {
        setFormData(prev => ({
          ...prev,
          products: [...prev.products, value]
        }));
        e.currentTarget.value = "";
      }
    }
  };

  const removeProduct = (index: number) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <div className="flex items-center justify-between mb-2">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Users className="w-7 h-7" />
              Crear Nueva Cooperativa
            </CardTitle>
            <Badge variant="default" className="bg-white/20">
              Paso {step} de {totalSteps}
            </Badge>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full transition-all duration-500"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </CardHeader>

        <CardContent className="p-8">
          {/* PASO 1: Información Básica */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Información de la Cooperativa
                </h2>
                <p className="text-gray-600">
                  Dale identidad a tu cooperativa
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de la Cooperativa *
                  </label>
                  <Input
                    type="text"
                    placeholder="Ej: Cooperativa Cafetalera Sierra Zongolica"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción *
                  </label>
                  <textarea
                    placeholder="Describe brevemente qué hace tu cooperativa, su misión y visión..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    rows={5}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {formData.description.length} / 500 caracteres
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* PASO 2: Productos y Categorías */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  ¿Qué ofrecerán como grupo?
                </h2>
                <p className="text-gray-600">
                  Productos y categorías de la cooperativa
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Productos principales (presiona Enter después de cada uno)
                  </label>
                  <Input
                    type="text"
                    placeholder="Ej: Café orgánico de altura"
                    onKeyDown={addProduct}
                    className="w-full"
                  />
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.products.map((product, index) => (
                      <Badge
                        key={index}
                        variant="default"
                        className="flex items-center gap-2 px-3 py-2 text-sm bg-purple-100 text-purple-700"
                      >
                        {product}
                        <button
                          onClick={() => removeProduct(index)}
                          className="hover:text-red-600"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Categorías (selecciona todas las que apliquen)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          categories: toggleItem(prev.categories, cat)
                        }))}
                        className={`p-3 rounded-lg border-2 transition-all text-sm ${
                          formData.categories.includes(cat)
                            ? "border-purple-600 bg-purple-100 text-purple-700 font-semibold"
                            : "border-gray-200 hover:border-purple-300"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PASO 3: Capacidad y Región */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Capacidad y Ubicación
                </h2>
                <p className="text-gray-600">
                  Información operativa de la cooperativa
                </p>
                <Badge variant="info" className="mt-3">
                  Opcional - Puedes omitir este paso
                </Badge>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Capacidad de producción conjunta mensual
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {["100-500 kg", "501-1000 kg", "1001-5000 kg", "5000+ kg"].map((cap) => (
                      <button
                        key={cap}
                        onClick={() => setFormData(prev => ({ ...prev, productionCapacity: cap }))}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          formData.productionCapacity === cap
                            ? "border-purple-600 bg-purple-100 text-purple-700 font-semibold"
                            : "border-gray-200 hover:border-purple-300"
                        }`}
                      >
                        {cap}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Región principal
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {["Zongolica", "Orizaba", "Córdoba", "Fortín", "Región PODECOBI", "Otra"].map((region) => (
                      <button
                        key={region}
                        onClick={() => setFormData(prev => ({ ...prev, region }))}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          formData.region === region
                            ? "border-purple-600 bg-purple-100 text-purple-700 font-semibold"
                            : "border-gray-200 hover:border-purple-300"
                        }`}
                      >
                        {region}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PASO 4: Certificaciones */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Certificaciones
                </h2>
                <p className="text-gray-600">
                  ¿Cuentan con alguna certificación? (Opcional)
                </p>
                <Badge variant="info" className="mt-3">
                  Opcional - Puedes omitir este paso
                </Badge>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {availableCertifications.map((cert) => (
                  <button
                    key={cert}
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      certifications: toggleItem(prev.certifications, cert)
                    }))}
                    className={`p-4 rounded-xl border-2 transition-all text-left flex items-center gap-3 ${
                      formData.certifications.includes(cert)
                        ? "border-purple-600 bg-purple-100"
                        : "border-gray-200 hover:border-purple-300"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      formData.certifications.includes(cert)
                        ? "border-purple-600 bg-purple-600"
                        : "border-gray-300"
                    }`}>
                      {formData.certifications.includes(cert) && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <span className={formData.certifications.includes(cert) ? "font-semibold text-purple-700" : ""}>
                      {cert}
                    </span>
                  </button>
                ))}
              </div>

              <p className="text-sm text-gray-500 text-center mt-4">
                Las certificaciones aumentan la confianza de empresas compradoras
              </p>
            </div>
          )}

          {/* PASO 5: Resumen */}
          {step === 5 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  ¡Todo listo!
                </h2>
                <p className="text-gray-600">
                  Revisa la información de tu cooperativa
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">{formData.name}</h3>
                  <p className="text-gray-600 text-sm">{formData.description}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-purple-200">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Productos:</p>
                    <div className="flex flex-wrap gap-1">
                      {formData.products.map((p, i) => (
                        <Badge key={i} variant="default" size="sm">{p}</Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Categorías:</p>
                    <div className="flex flex-wrap gap-1">
                      {formData.categories.map((c, i) => (
                        <Badge key={i} variant="default" size="sm">{c}</Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700">Capacidad:</p>
                    <p className="text-gray-900">{formData.productionCapacity}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700">Región:</p>
                    <p className="text-gray-900">{formData.region}</p>
                  </div>

                  {formData.certifications.length > 0 && (
                    <div className="md:col-span-2">
                      <p className="text-sm font-medium text-gray-700 mb-2">Certificaciones:</p>
                      <div className="flex flex-wrap gap-1">
                        {formData.certifications.map((cert, i) => (
                          <Badge key={i} variant="success" size="sm" className="flex items-center gap-1">
                            <Award className="w-3 h-3" />
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>📋 Nota:</strong> Tu solicitud será revisada por un administrador antes de ser aprobada.
                  Recibirás una notificación cuando tu cooperativa esté activa.
                </p>
              </div>
            </div>
          )}

          {/* Botones de Navegación */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <Button
              onClick={handleBack}
              disabled={step === 1}
              variant="default"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Anterior
            </Button>

            <div className="flex gap-2">
              {(step === 3 || step === 4) && (
                <Button
                  onClick={handleSkipStep}
                  variant="ghost"
                  className="flex items-center gap-2"
                >
                  Omitir este paso
                </Button>
              )}

              {step < totalSteps ? (
                <Button
                  onClick={handleNext}
                  disabled={
                    (step === 1 && (!formData.name || !formData.description)) ||
                    (step === 2 && (formData.products.length === 0 || formData.categories.length === 0))
                  }
                  className="flex items-center gap-2 bg-linear-to-r from-purple-600 to-pink-600"
                >
                  Siguiente
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleComplete}
                  className="flex items-center gap-2 bg-linear-to-r from-green-600 to-green-700"
                >
                  <Check className="w-4 h-4" />
                  Enviar Solicitud
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}



