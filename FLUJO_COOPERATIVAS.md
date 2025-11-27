# 🏢 Flujo Completo del Sistema de Cooperativas

## 📊 **Resumen del Sistema**

Este documento explica cómo funciona la conversión de usuarios y los dashboards según el tipo de cuenta.

---

## 🔄 **1. FLUJO: Normal → Cooperativa (Crear)**

### **Paso 1: Usuario Normal crea solicitud**
- **Ubicación:** `/dashboard/cooperativas/crear`
- **Acción:** Llena formulario con datos de la cooperativa
- **Resultado:** Se crea registro en `solicitudes_cooperativas` con estado `"pendiente"`

### **Paso 2: Admin revisa solicitud**
- **Ubicación:** `/dashboard/solicitudes-cooperativas`
- **Acción:** Admin ve solicitud y click en "Aprobar"
- **Proceso automático:**
  1. ✅ Crea la cooperativa en tabla `cooperativas`
  2. ✅ Agrega al usuario como miembro con rol `"fundador"` en `cooperativa_miembros`
  3. ✅ Actualiza `usuarios.tipo_usuario` de `"normal"` → `"cooperativa"`
  4. ✅ Incrementa `cooperativas.total_miembros` a 1
  5. ✅ Marca solicitud como `"aprobada"`

### **Paso 3: Usuario cierra sesión y vuelve a entrar**
- **Resultado:** Ahora ve el dashboard de cooperativa con opciones de:
  - ✅ Dashboard cooperativa
  - ✅ Solicitudes (para aprobar miembros)
  - ✅ Miembros (gestionar equipo)
  - ✅ Productos
  - ✅ Marketplace

---

## 🤝 **2. FLUJO: Normal → Cooperativa (Unirse)**

### **Paso 1: Usuario encuentra cooperativa en Match**
- **Ubicación:** `/dashboard/match`
- **Acción:** Ve cooperativas ordenadas por compatibilidad
- **Opciones:**
  - 🚫 **Pasar** - siguiente cooperativa
  - 💬 **Chat** - hablar con la cooperativa
  - 📝 **Unirme** - solicitar membresía

### **Paso 2: Usuario solicita unirse**
- **Acción:** Click en "Unirme"
- **Resultado:** Se crea solicitud en `solicitudes_cooperativas` tipo `"unirse"`

### **Paso 3: Fundador de cooperativa aprueba**
- **Ubicación:** `/dashboard/solicitudes` (vista cooperativa)
- **Acción:** Fundador ve solicitud y click en "Aprobar"
- **Proceso automático:**
  1. ✅ Agrega usuario a `cooperativa_miembros` con rol `"miembro"`
  2. ✅ Actualiza `usuarios.tipo_usuario` de `"normal"` → `"cooperativa"`
  3. ✅ Incrementa `cooperativas.total_miembros`
  4. ✅ Marca solicitud como `"aprobada"`

### **Paso 4: Usuario cierra sesión y vuelve a entrar**
- **Resultado:** Ahora es miembro de la cooperativa
- **Dashboard:** Vista de cooperativa (compartida con fundador)

---

## 📱 **3. TIPOS DE DASHBOARD**

### **🧑 Usuario Normal** (`tipo_usuario: "normal"`)
```
├─ Dashboard (estadísticas personales)
├─ Mis Productos
├─ Mis Ventas
├─ Marketplace
├─ Match (encontrar cooperativas)
└─ Perfil
```

### **🏢 Usuario Cooperativa** (`tipo_usuario: "cooperativa"`)
```
├─ Dashboard (estadísticas de cooperativa)
├─ Solicitudes (aprobar nuevos miembros) 🆕
├─ Miembros (gestionar equipo) 🆕
├─ Productos
├─ Marketplace
└─ Perfil
```

### **🏭 Usuario Empresa** (`tipo_usuario: "empresa"`)
```
├─ Dashboard
├─ Mis Compras
├─ Mis Pedidos
├─ Buscar Productos
├─ Proveedores
├─ Contratos
├─ Reportes
└─ Perfil
```

### **👨‍💼 Usuario Admin** (`tipo_usuario: "admin"`)
```
├─ Dashboard
├─ Usuarios
├─ Solicitudes (aprobar cooperativas) 🔐
├─ Polos Económicos
├─ Estadísticas
├─ Configuración
└─ Perfil

⭐ Tiene acceso a TODAS las rutas del sistema
```

---

## 🗄️ **4. ESTRUCTURA DE BASE DE DATOS**

### **Tabla: usuarios**
```sql
- id (UUID)
- nombre
- apellidos
- telefono
- rol: "normal_user" | "admin"
- tipo_usuario: "normal" | "cooperativa" | "empresa" | "admin"
- onboarding_completed
```

### **Tabla: cooperativas**
```sql
- id (UUID)
- nombre
- descripcion
- creada_por (user_id del fundador)
- categoria (array)
- region
- total_miembros
- buscando_miembros (boolean)
- estado: "active" | "inactive"
```

### **Tabla: cooperativa_miembros**
```sql
- id (UUID)
- cooperativa_id
- user_id
- rol: "fundador" | "admin" | "miembro"
- created_at
```

### **Tabla: solicitudes_cooperativas**
```sql
- id (UUID)
- tipo: "crear" | "unirse"
- user_id
- cooperativa_id (si es tipo "unirse")
- datos_cooperativa (JSON con info de la cooperativa)
- estado: "pendiente" | "aprobada" | "rechazada"
- fecha_solicitud
- revisada_por (user_id del que aprobó/rechazó)
- fecha_revision
```

---

## 🔐 **5. SISTEMA DE PERMISOS**

El archivo `src/lib/permissions.ts` controla el acceso:

### **Admin**
```typescript
if (userType === "admin") return true; // ✅ Acceso a TODO
```

### **Otros usuarios**
- Rutas **compartidas**: accesibles por todos
- Rutas **específicas**: solo su tipo de usuario
- Se verifica en `ProtectedRoute` component

---

## ⚙️ **6. COMPONENTES CLAVE**

### **AppSidebar** (`src/components/app-sidebar.tsx`)
- **Líneas 307-311:** Selecciona menú según `tipo_usuario`
- **Línea 313-314:** Console logs para debugging
- Cambia automáticamente al cambiar tipo de usuario

### **ProtectedRoute** (`src/components/auth/ProtectedRoute.tsx`)
- Verifica sesión de Supabase
- Obtiene `tipo_usuario` de tabla `usuarios`
- Redirige si no tiene permiso

### **Páginas Cooperativa**
- **Dashboard:** `/dashboard/(cooperativa)/page.tsx`
- **Solicitudes:** `/dashboard/(cooperativa)/solicitudes/page.tsx`
- **Miembros:** `/dashboard/(cooperativa)/miembros/page.tsx`

---

## 🎯 **7. DIFERENCIAS CLAVE: rol vs tipo_usuario**

### **`rol`** (auth/permisos)
- `"normal_user"` - Usuario regular
- `"admin"` - Administrador del sistema

### **`tipo_usuario`** (funcionalidad/UI)
- `"normal"` - Productor individual
- `"cooperativa"` - Miembro de cooperativa
- `"empresa"` - Empresa compradora
- `"admin"` - Administrador

### **Ejemplo:**
```javascript
Usuario fundador de cooperativa:
  rol: "normal_user"          // No es admin del sistema
  tipo_usuario: "cooperativa"  // Ve dashboard de cooperativa
```

---

## ✅ **8. CHECKLIST DE IMPLEMENTACIÓN**

- [x] Sistema de match con algoritmo de compatibilidad
- [x] Chat en tiempo real (Supabase Realtime)
- [x] Solicitudes de membresía (unirse)
- [x] Aprobación de cooperativas (admin)
- [x] Aprobación de miembros (fundador)
- [x] Dashboard cooperativa
- [x] Página de solicitudes cooperativa
- [x] Página de miembros cooperativa
- [x] Conversión automática de tipo_usuario
- [x] Sidebar dinámico según tipo
- [x] Sistema de permisos
- [x] RLS policies en Supabase

---

## 🚀 **9. PRÓXIMOS PASOS (Opcionales)**

- [ ] Notificaciones en tiempo real
- [ ] Roles avanzados en cooperativas (tesorero, secretario, etc.)
- [ ] Sistema de votación para decisiones
- [ ] Estadísticas de cooperativa
- [ ] Exportar reportes
- [ ] Integración con ERP

---

## 📝 **10. NOTAS IMPORTANTES**

⚠️ **Al aprobar cooperativa:**
- El usuario DEBE cerrar sesión y volver a entrar para ver el nuevo dashboard
- El sidebar se actualiza automáticamente al recargar

⚠️ **Al eliminar miembro:**
- Su `tipo_usuario` vuelve a `"normal"`
- Pierde acceso al dashboard de cooperativa

⚠️ **Seguridad:**
- Solo el fundador puede aprobar/rechazar solicitudes de membresía
- Solo admin puede aprobar creación de cooperativas
- RLS policies protegen los datos en Supabase

---

¡Sistema completo y funcional! 🎉
