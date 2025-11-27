"use client";

import React, { useEffect, useState } from "react";
import CompanyCard from "@/components/modules/catalogo/CompanyCard";
import CompanyModal from "@/components/modules/catalogo/CompanyModal";
import CatalogFilter from "@/components/modules/catalogo/CatalogFilter";
import AddCompanyModal from "@/components/modules/catalogo/AddCompanyModal";

interface Company {
  id: string;
  name: string;
  description: string;
  category: string;
  rating: number;
  logo?: string;
  imageUrl?: string;
  website?: string;
  phone?: string;
  email?: string;
  address?: string;
}

const CatalogPage: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados de filtro
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minRating, setMinRating] = useState(0);

  // Estados de modales
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Cargar empresas
  useEffect(() => {
    const loadCompanies = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/companies");
        if (!response.ok) throw new Error("Error al cargar empresas");
        const data = await response.json();
        setCompanies(data);
        setError(null);
      } catch (err) {
        setError("No se pudieron cargar las empresas");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadCompanies();
  }, []);

  // Filtrar empresas
  const filtered = companies.filter((company) => {
    const matchesSearch =
      search === "" ||
      company.name.toLowerCase().includes(search.toLowerCase()) ||
      company.description.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = category === "" || company.category === category;
    const matchesRating = company.rating >= minRating;

    return matchesSearch && matchesCategory && matchesRating;
  });

  // Obtener categorías únicas
  const categories = Array.from(
    new Set(companies.map((c) => c.category).filter(Boolean))
  );

  // Manejar selección de empresa
  const handleViewDetails = (id: string) => {
    const company = companies.find((c) => c.id === id);
    if (company) {
      setSelectedCompany(company);
      setShowDetailModal(true);
    }
  };

  // Manejar agregar empresa
  const handleAddCompany = async (formData: any) => {
    setSubmitting(true);
    try {
      const response = await fetch("/api/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        setCompanies((prev) => [...prev, result.company]);
        setShowAddModal(false);
        alert("¡Empresa agregada exitosamente!");
      } else {
        alert("Error al agregar la empresa");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al agregar la empresa");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold">Cargando catálogo...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Catálogo de Empresas</h1>
          <p className="text-blue-100">
            Descubre y conecta con las mejores empresas
          </p>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-6">
          {/* Sidebar - Filtros */}
          <div className="w-80">
            <CatalogFilter
              search={search}
              onSearchChange={setSearch}
              category={category}
              onCategoryChange={setCategory}
              categories={categories}
              minRating={minRating}
              onMinRatingChange={setMinRating}
            />
          </div>

          {/* Main - Grid de empresas */}
          <div className="flex-1">
            {/* Botón agregar empresa */}
            <button
              onClick={() => setShowAddModal(true)}
              className="mb-6 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700"
            >
              ➕ Agregar Empresa
            </button>

            {/* Información de resultados */}
            <div className="mb-6">
              <p className="text-gray-600">
                Mostrando <span className="font-bold">{filtered.length}</span> de{" "}
                <span className="font-bold">{companies.length}</span> empresas
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}

            {/* Grid de empresas */}
            {filtered.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  No se encontraron empresas que coincidan con tus filtros.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((company) => (
                  <CompanyCard
                    key={company.id}
                    company={company}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modales */}
      <CompanyModal
        company={selectedCompany}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
      />

      <AddCompanyModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddCompany}
        isLoading={submitting}
      />

      {/* Botón flotante para agregar empresa (alternativo) */}
      <button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-green-700 flex items-center gap-2"
      >
        ➕
      </button>
    </div>
  );
};

export default CatalogPage;
