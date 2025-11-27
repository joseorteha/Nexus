# 📁 Scripts de Utilidad

Esta carpeta contiene scripts útiles para administrar tu aplicación Nexus.

---

## 🔐 crear-admin.js

**Propósito:** Crear un usuario administrador en el sistema.

**Uso:**
```bash
npm run create:admin
```

**Configuración:**
Edita el archivo `crear-admin.js` y cambia estas líneas:
```javascript
const CONFIG = {
  email: 'admin@nexus.com',      // 👈 Tu email
  password: 'Admin123!',          // 👈 Tu password
  nombre: 'Admin',
  apellidos: 'Nexus',
  telefono: '5551234567'
};
```

**Requisitos:**
- Tener `.env.local` configurado con `SUPABASE_SERVICE_ROLE_KEY`
- La base de datos debe estar inicializada

**Resultado:**
Crea un usuario en:
- ✅ `auth.users` (sistema de autenticación)
- ✅ `usuarios` (tabla de perfiles)
- ✅ Con rol `admin` y tipo `admin`

---

## 📚 Otros Scripts (Futuros)

Aquí se agregarán más scripts de utilidad:
- Seed de datos de prueba
- Limpieza de base de datos
- Generación de reportes
- Etc.

---

## ⚠️ Nota de Seguridad

**NUNCA** subas a Git archivos que contengan:
- `SUPABASE_SERVICE_ROLE_KEY`
- Passwords en texto plano
- Tokens de acceso

Los scripts están configurados para leer estas credenciales de `.env.local` que debe estar en `.gitignore`.
