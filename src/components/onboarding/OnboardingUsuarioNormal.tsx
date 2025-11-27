"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  ShoppingBag,
  MapPin,
  Target,
  Package,
  ArrowRight,
  ArrowLeft,
  Check,
  Users,
  Store,
} from "lucide-react";

interface OnboardingProps {
  onComplete: (data: any) => void;
}

export function OnboardingUsuarioNormal({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    products: [] as string[],
    categories: [] as string[],
    productionCapacity: "",
    region: "",
    goal: "" as "create_cooperative" | "join_cooperative" | "sell_individual" | "",
  });

  const totalSteps = 5;

  const categories = [
    "Café", "Artesanías", "Textiles", "Miel", "Productos Orgánicos",
    "Alimentos Procesados", "Bebidas", "Cosméticos Naturales", "Otros"
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

  const toggleCategory = (cat: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter(c => c !== cat)
        : [...prev.categories, cat]
    }));
  };

  const addProduct = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && e.currentTarget.value.trim()) {
      setFormData(prev => ({
        ...prev,
        products: [...prev.products, e.currentTarget.value.trim()]
      }));
      e.currentTarget.value = "";
    }
  };

  const removeProduct = (index: number) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-primary to-secondary text-white">
          <div className="flex items-center justify-between mb-2">
            <CardTitle className="text-2xl flex items-center gap-2">
              <ShoppingBag className="w-7 h-7" />
              Bienvenido a Nexus
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
          {/* PASO 1: Productos */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  ¿Qué productos ofreces?
                </h2>
                <p className="text-gray-600">
                  Cuéntanos qué produces o vendes para hacer mejores matches
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Agrega tus productos (presiona Enter después de cada uno)
                </label>
                <Input
                  type="text"
                  placeholder="Ej: Café orgánico tostado"
                  onKeyDown={addProduct}
                  className="w-full"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.products.map((product, index) => (
                  <Badge
                    key={index}
                    variant="default"
                    className="flex items-center gap-2 px-3 py-2 text-sm"
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

              {formData.products.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-8">
                  No has agregado productos aún
                </p>
              )}
            </div>
          )}

          {/* PASO 2: Categorías */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  ¿En qué categorías trabajas?
                </h2>
                <p className="text-gray-600">
                  Selecciona todas las que apliquen
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.categories.includes(cat)
                        ? "border-primary bg-primary/10 text-primary font-semibold"
                        : "border-gray-200 hover:border-primary/50"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* PASO 3: Capacidad de Producción */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  ¿Cuál es tu capacidad de producción?
                </h2>
                <p className="text-gray-600">
                  Aproximadamente, ¿cuánto puedes producir al mes?
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {["1-50 kg/unidades", "51-200 kg/unidades", "201-500 kg/unidades", "500+ kg/unidades"].map((cap) => (
                  <button
                    key={cap}
                    onClick={() => setFormData(prev => ({ ...prev, productionCapacity: cap }))}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      formData.productionCapacity === cap
                        ? "border-primary bg-primary/10 text-primary font-semibold"
                        : "border-gray-200 hover:border-primary/50"
                    }`}
                  >
                    {cap}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* PASO 4: Región */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  ¿Dónde te ubicas?
                </h2>
                <p className="text-gray-600">
                  Esto nos ayuda a conectarte con cooperativas cercanas
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {["Zongolica", "Orizaba", "Córdoba", "Fortín", "Otra región"].map((region) => (
                  <button
                    key={region}
                    onClick={() => setFormData(prev => ({ ...prev, region }))}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      formData.region === region
                        ? "border-primary bg-primary/10 text-primary font-semibold"
                        : "border-gray-200 hover:border-primary/50"
                    }`}
                  >
                    {region}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* PASO 5: Objetivo */}
          {step === 5 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  ¿Cuál es tu objetivo?
                </h2>
                <p className="text-gray-600">
                  ¿Qué te gustaría hacer en Nexus?
                </p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => setFormData(prev => ({ ...prev, goal: "create_cooperative" }))}
                  className={`w-full p-6 rounded-xl border-2 transition-all text-left ${
                    formData.goal === "create_cooperative"
                      ? "border-primary bg-primary/10"
                      : "border-gray-200 hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <Users className="w-8 h-8 text-primary shrink-0" />
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 mb-1">
                        Crear una Cooperativa nueva
                      </h3>
                      <p className="text-sm text-gray-600">
                        Forma un grupo con otros productores y vendan juntos
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setFormData(prev => ({ ...prev, goal: "join_cooperative" }))}
                  className={`w-full p-6 rounded-xl border-2 transition-all text-left ${
                    formData.goal === "join_cooperative"
                      ? "border-primary bg-primary/10"
                      : "border-gray-200 hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <Users className="w-8 h-8 text-secondary shrink-0" />
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 mb-1">
                        Unirme a una Cooperativa existente
                      </h3>
                      <p className="text-sm text-gray-600">
                        Únete a un grupo establecido en tu región
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setFormData(prev => ({ ...prev, goal: "sell_individual" }))}
                  className={`w-full p-6 rounded-xl border-2 transition-all text-left ${
                    formData.goal === "sell_individual"
                      ? "border-primary bg-primary/10"
                      : "border-gray-200 hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <Store className="w-8 h-8 text-purple-600 shrink-0" />
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 mb-1">
                        Vender individualmente
                      </h3>
                      <p className="text-sm text-gray-600">
                        Vende tus productos por tu cuenta en el marketplace
                      </p>
                    </div>
                  </div>
                </button>
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
                  (step === 1 && formData.products.length === 0) ||
                  (step === 2 && formData.categories.length === 0) ||
                  (step === 3 && !formData.productionCapacity) ||
                  (step === 4 && !formData.region)
                }
                className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary"
              >
                Siguiente
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={!formData.goal}
                className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700"
              >
                <Check className="w-4 h-4" />
                Completar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
