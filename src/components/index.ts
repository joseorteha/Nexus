// Componentes de Onboarding
export { OnboardingUsuarioNormal } from './onboarding/OnboardingUsuarioNormal';
export { OnboardingCooperativa } from './onboarding/OnboardingCooperativa';
export { OnboardingEmpresa } from './onboarding/OnboardingEmpresa';

// Componentes de Cooperativas
export { CooperativaCard } from './cooperativas/CooperativaCard';
export { CooperativasList } from './cooperativas/CooperativasList';
export { SolicitudMembresiaForm } from './cooperativas/SolicitudMembresiaForm';
export { MiembrosGrid } from './cooperativas/MiembrosGrid';
export { CooperativaStats } from './cooperativas/CooperativaStats';

// Componentes de Solicitudes (Admin)
export { SolicitudesPendientes } from './solicitudes/SolicitudesPendientes';
export { AprobacionCard } from './solicitudes/AprobacionCard';

// Componentes de Badges
export { RoleBadge, RoleBadgeShowcase } from './badges/RoleBadge';

// Re-exportar tipos comunes
export type {
  UserRole,
  Cooperative,
  CooperativeMember,
  CooperativeRequest,
  OnboardingUsuarioNormal as OnboardingUsuarioNormalData,
  OnboardingCooperativa as OnboardingCooperativaData,
  OnboardingEmpresa as OnboardingEmpresaData
} from '@/types/nexus';



