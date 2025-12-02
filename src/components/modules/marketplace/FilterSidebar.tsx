// AJUSTES DENTRO DE FilterSidebar.tsx

// ... (inicio del componente)

      {/* Sección 1: Categorías de Producto */}
      <div className="mb-6">
        <h3 className="font-bold text-lg text-gray-800 mb-3">Categoría de Producto</h3>
        <ul>
          {/* Cambiar categorías a giros comunes de cooperativas */}
          {['Alimentos Orgánicos', 'Textiles y Ropa', 'Artesanía en Cerámica', 'Joyería Tradicional'].map((category) => (
            <li key={category} className="mb-2">
              <a 
                href="#" 
                className="text-gray-600 hover:text-cyan-hover transition-colors duration-200 block"
              >
                {category}
              </a>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Sección 2: Origen / Estado */}
      <div className="mb-6 border-t pt-4">
        <h3 className="font-bold text-lg text-gray-800 mb-3">Origen (Estado)</h3>
        <div>
          {/* Ejemplos de estados */}
          {['Oaxaca', 'Chiapas', 'Michoacán', 'Yucatán'].map((state) => (
            <div key={state} className="flex items-center mb-2">
              <input 
                type="checkbox" 
                id={`state-${state}`} 
                // ... clases de Tailwind (usando tus colores)
                className="form-checkbox h-4 w-4 text-cyan-primary border-gray-300 rounded focus:ring-accent"
              />
              <label htmlFor={`state-${state}`} className="ml-2 text-gray-700">
                {state}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Sección 3: Certificación / Comercio Justo */}
      <div className="mb-6 border-t pt-4">
        <h3 className="font-bold text-lg text-gray-800 mb-3">Compromiso</h3>
        <div>
          {['Comercio Justo', 'Orgánico Certificado', 'Mano Indígena'].map((cert) => (
            <div key={cert} className="flex items-center mb-2">
              <input 
                type="checkbox" 
                id={`cert-${cert}`} 
                // ... clases de Tailwind (usando tus colores)
                className="form-checkbox h-4 w-4 text-cyan-primary border-gray-300 rounded focus:ring-accent"
              />
              <label htmlFor={`cert-${cert}`} className="ml-2 text-gray-700 font-semibold">
                {cert}
              </label>
            </div>
          ))}
        </div>
      </div>
      
// ... (final del componente)

/* editado para subir */
