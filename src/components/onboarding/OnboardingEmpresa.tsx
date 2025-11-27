"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  Building2,
  ShoppingCart,
  MapPin,
  DollarSign,
  ArrowRight,
  ArrowLeft,
  Check,
  TrendingUp,
  Calendar,
} from "lucide-react";

interface OnboardingProps {
  onComplete: (data: any) => void;
}

export function OnboardingEmpresa({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: "",
    rfc: "",
    productsNeeded: [] as string[],
    categories: [] as string[],
    purchaseVolume: "",
    purchaseFrequency: "",
    budget: "",
    requirements: [] as string[],
    region: "",
  });

  const totalSteps = 5;

  const categories = [
    "Café", "Artesanías", "Textiles", "Miel", "Productos Orgánicos",
    "Alimentos Procesados", "Bebidas", "Cosméticos Naturales", "Otros"
  ];

  const availableRequirements = [
    "Productos Orgánicos Certificados",
    "Comercio Justo",
    "Producción Sustentable",
    "Trazabilidad Completa",
    "Empaque Personalizado",
    "Entregas Programadas",
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

  const toggleItem = (list: string[], item: string) => {
    return list.includes(item)
      ? list.filter(i => i !== item)
      : [...list, item];
  };

  const addProduct = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && e.currentTarget.value.trim()) {
      setFormData(prev => ({
        ...prev,
        productsNeeded: [...prev.productsNeeded, e.currentTarget.value.trim()]
      }));
      e.currentTarget.value = "";
    }
  };

  const removeProduct = (index: number) => {
    setFormData(prev => ({
      ...prev,
      productsNeeded: prev.productsNeeded.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="flex items-center justify-between mb-2">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Building2 className="w-7 h-7" />
              Bienvenido a Nexus B2B
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
          {/* PASO 1: Información de la Empresa */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Información de tu Empresa
                </h2>
                <p className="text-gray-600">
                  Datos básicos para crear tu perfil
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de la Empresa / Razón Social *
                  </label>
                  <Input
                    type="text"
                    placeholder="Ej: Café Internacional S.A. de C.V."
                    value={formData.companyName}
                    onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    RFC *
                  </label>
                  <Input
                    type="text"
                    placeholder="Ej: CIN850123ABC"
                    value={formData.rfc}
                    onChange={(e) => setFormData(prev => ({ ...prev, rfc: e.target.value.toUpperCase() }))}
                    className="w-full font-mono"
                    maxLength={13}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Registro Federal de Contribuyentes
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* PASO 2: Productos que Necesita */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  ¿Qué productos necesitas comprar?
                </h2>
                <p className="text-gray-600">
                  Esto nos ayuda a conectarte con los proveedores adecuados
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Productos (presiona Enter después de cada uno)
                  </label>
                  <Input
                    type="text"
                    placeholder="Ej: Café orgánico en grano"
                    onKeyDown={addProduct}
                    className="w-full"
                  />
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.productsNeeded.map((product, index) => (
                      <Badge
                        key={index}
                        variant="default"
                        className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-100 text-blue-700"
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
                    Categorías de interés
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
                            ? "border-blue-600 bg-blue-100 text-blue-700 font-semibold"
                            : "border-gray-200 hover:border-blue-300"
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

          {/* PASO 3: Volumen y Frecuencia */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Volumen y Frecuencia de Compra
                </h2>
                <p className="text-gray-600">
                  Información operativa de tu empresa
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Volumen de compra mensual aproximado
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {["100-500 kg", "501-1000 kg", "1001-5000 kg", "5000+ kg"].map((vol) => (
                      <button
                        key={vol}
                        onClick={() => setFormData(prev => ({ ...prev, purchaseVolume: vol }))}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          formData.purchaseVolume === vol
                            ? "border-blue-600 bg-blue-100 text-blue-700 font-semibold"
                            : "border-gray-200 hover:border-blue-300"
                        }`}
                      >
                        {vol}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Frecuencia de pedidos
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {["Semanal", "Quincenal", "Mensual", "Trimestral"].map((freq) => (
                      <button
                        key={freq}
                        onClick={() => setFormData(prev => ({ ...prev, purchaseFrequency: freq }))}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          formData.purchaseFrequency === freq
                            ? "border-blue-600 bg-blue-100 text-blue-700 font-semibold"
                            : "border-gray-200 hover:border-blue-300"
                        }`}
                      >
                        <Calendar className="w-5 h-5 mx-auto mb-1" />
                        {freq}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PASO 4: Presupuesto y Requisitos */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Presupuesto y Requisitos
                </h2>
                <p className="text-gray-600">
                  Especificaciones para tus compras
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Presupuesto mensual aproximado
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {["$10,000 - $50,000", "$50,000 - $100,000", "$100,000 - $500,000", "$500,000+"].map((budget) => (
                      <button
                        key={budget}
                        onClick={() => setFormData(prev => ({ ...prev, budget }))}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          formData.budget === budget
                            ? "border-blue-600 bg-blue-100 text-blue-700 font-semibold"
                            : "border-gray-200 hover:border-blue-300"
                        }`}
                      >
                        {budget}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Requisitos especiales (opcional)
                  </label>
                  <div className="space-y-2">
                    {availableRequirements.map((req) => (
                      <button
                        key={req}
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          requirements: toggleItem(prev.requirements, req)
                        }))}
                        className={`w-full p-3 rounded-lg border-2 transition-all text-left flex items-center gap-3 ${
                          formData.requirements.includes(req)
                            ? "border-blue-600 bg-blue-100"
                            : "border-gray-200 hover:border-blue-300"
                        }`}
                      >
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          formData.requirements.includes(req)
                            ? "border-blue-600 bg-blue-600"
                            : "border-gray-300"
                        }`}>
                          {formData.requirements.includes(req) && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <span className={formData.requirements.includes(req) ? "font-semibold text-blue-700" : ""}>
                          {req}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PASO 5: Región y Resumen */}
          {step === 5 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Región y Confirmación
                </h2>
                <p className="text-gray-600">
                  Último paso para activar tu perfil
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    ¿En qué región te interesa comprar?
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {["Zongolica", "Orizaba", "Córdoba", "Región PODECOBI", "Veracruz", "Nacional"].map((region) => (
                      <button
                        key={region}
                        onClick={() => setFormData(prev => ({ ...prev, region }))}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          formData.region === region
                            ? "border-blue-600 bg-blue-100 text-blue-700 font-semibold"
                            : "border-gray-200 hover:border-blue-300"
                        }`}
                      >
                        <MapPin className="w-5 h-5 mx-auto mb-1" />
                        {region}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl space-y-3">
                  <h3 className="font-semibold text-gray-900 text-lg">{formData.companyName}</h3>
                  <p className="text-sm text-gray-600">RFC: {formData.rfc}</p>
                  
                  <div className="grid md:grid-cols-2 gap-3 pt-3 border-t border-blue-200">
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-1">Volumen:</p>
                      <p className="text-sm text-gray-900">{formData.purchaseVolume}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-1">Frecuencia:</p>
                      <p className="text-sm text-gray-900">{formData.purchaseFrequency}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-1">Presupuesto:</p>
                      <p className="text-sm text-gray-900">{formData.budget}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-1">Región:</p>
                      <p className="text-sm text-gray-900">{formData.region}</p>
                    </div>
                  </div>

                  {formData.productsNeeded.length > 0 && (
                    <div className="pt-3 border-t border-blue-200">
                      <p className="text-xs font-medium text-gray-700 mb-2">Productos de interés:</p>
                      <div className="flex flex-wrap gap-1">
                        {formData.productsNeeded.map((p, i) => (
                          <Badge key={i} variant="default" size="sm">{p}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Botones de Navegación */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <Button
              onClick={handleBack}
              disabled={step === 1}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Anterior
            </Button>

            {step < totalSteps ? (
              <Button
                onClick={handleNext}
                disabled={
                  (step === 1 && (!formData.companyName || !formData.rfc)) ||
                  (step === 2 && (formData.productsNeeded.length === 0 || formData.categories.length === 0)) ||
                  (step === 3 && (!formData.purchaseVolume || !formData.purchaseFrequency)) ||
                  (step === 4 && !formData.budget)
                }
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600"
              >
                Siguiente
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={!formData.region}
                className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700"
              >
                <Check className="w-4 h-4" />
                Completar Perfil
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
