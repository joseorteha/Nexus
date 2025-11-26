# 🚀 Nexus - Plataforma de Negocios B2B

## 📂 Estructura del Proyecto

```
src/
├── app/                        # 🌐 RUTAS (Solo layouts y page.tsx)
│   ├── layout.tsx              # Layout Global
│   ├── page.tsx                # (Guille) Landing Page pública
│   │
│   ├── (auth)/                 # 🔐 AUTENTICACIÓN
│   │   ├── layout.tsx          
│   │   ├── login/              # (Jose) /login
│   │   ├── register/           # /register
│   │   └── onboarding/         # /onboarding
│   │
│   └── dashboard/              # 🚀 APLICACIÓN PRINCIPAL
│       ├── layout.tsx          # Sidebar y Navbar
│       ├── page.tsx            # Home del Dashboard
│       │
│       ├── marketplace/        # (David) /dashboard/marketplace
│       │   ├── page.tsx        
│       │   ├── cart/           
│       │   └── [id]/           
│       │
│       ├── profile/            # (Jesus) /dashboard/profile
│       │   ├── page.tsx        
│       │   └── settings/       
│       │
│       ├── match/              # (Jose) /dashboard/match
│       │   ├── page.tsx        
│       │   └── chat/           
│       │
│       └── erp/                # (Pendiente) /dashboard/erp
│           ├── inventory/
│           └── sales/
│
├── components/                 # 🧩 COMPONENTES
│   ├── ui/                     # Botones, Inputs, Cards genéricos
│   │
│   ├── modules/                # ⚠️ SEPARACIÓN POR DESARROLLADOR
│   │   ├── auth/               # (Jose)
│   │   ├── landing/            # (Guille)
│   │   ├── marketplace/        # (David)
│   │   ├── profile/            # (Jesus)
│   │   ├── match/              # (Jose)
│   │   └── erp/                # (Futuro)
│   │
│   └── layout/                 # Sidebar, Header, Footer
│
├── lib/                        # 🧠 LÓGICA
│   ├── db.ts                   # Conexión BD
│   ├── utils.ts                # Utilidades
│   └── actions/                # Server Actions
│       ├── auth-actions.ts
│       ├── market-actions.ts
│       └── match-actions.ts
│
└── types/                      # 📝 TIPOS
    └── index.ts                # Interfaces globales
```

## 👥 Asignación de Tareas

### 🔐 Jose - Autenticación y Match
**Rutas:**
- `/login`
- `/register` 
- `/onboarding`
- `/dashboard/match`
- `/dashboard/match/chat`

**Componentes:** `src/components/modules/auth/` y `src/components/modules/match/`
- LoginForm.tsx
- RegisterForm.tsx
- SwipeCard.tsx
- MatchList.tsx
- ChatWindow.tsx

**Actions:** `src/lib/actions/auth-actions.ts` y `match-actions.ts`

---

### 🏠 Guille - Landing Page
**Rutas:**
- `/` (Landing page pública)

**Componentes:** `src/components/modules/landing/`
- HeroSection.tsx
- Features.tsx
- Footer.tsx
- CTAButton.tsx

---

### 🛒 David - Marketplace
**Rutas:**
- `/dashboard/marketplace`
- `/dashboard/marketplace/cart`
- `/dashboard/marketplace/[id]`

**Componentes:** `src/components/modules/marketplace/`
- ProductCard.tsx
- FilterBar.tsx
- CartDrawer.tsx
- ProductGrid.tsx
- SearchBar.tsx

**Actions:** `src/lib/actions/market-actions.ts`

---

### 👤 Jesus - Perfil de Usuario
**Rutas:**
- `/dashboard/profile`
- `/dashboard/profile/settings`

**Componentes:** `src/components/modules/profile/`
- ProfileHeader.tsx
- EditProfileForm.tsx
- CompanyInfo.tsx
- AvatarUpload.tsx

---

## 🚀 Cómo Empezar

### 1. Clonar el repositorio
```bash
git clone https://github.com/joseorteha/Nexus.git
cd Nexus
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Ejecutar en desarrollo
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

### 4. Crear tu rama de trabajo
```bash
git checkout -b feature/tu-modulo
```

## 📋 Flujo de Trabajo

1. **Clonar** el repositorio
2. **Crear rama** para tu módulo: `feature/marketplace`, `feature/auth`, etc.
3. **Trabajar** en tu carpeta de `components/modules/[tu-modulo]`
4. **Probar** localmente con `npm run dev`
5. **Commit** con mensajes descriptivos
6. **Push** a tu rama
7. **Pull Request** para revisión

## 🎨 Tecnologías

- ⚡ **Next.js 15** - Framework React
- 🎨 **Tailwind CSS** - Estilos
- 📘 **TypeScript** - Tipado estático
- 🔍 **ESLint** - Calidad de código

## 📝 Reglas Importantes

1. **NO toques** carpetas de otros módulos sin coordinar
2. **Usa** los componentes de `components/ui/` para elementos comunes
3. **Define** tipos en `src/types/index.ts`
4. **Crea** Server Actions en `src/lib/actions/`
5. **Sigue** la estructura de carpetas definida

## 🔗 Enlaces Útiles

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs/)

## 📞 Contacto

Si tienes dudas, pregunta en el grupo del equipo.

---

**¡Manos a la obra! 🚀**
