// 👤 PERFIL DE USUARIO
// Responsable: Jesus
// URL: /dashboard/profile

import ProfileHeader from "../../../components/modules/profile/ProfileHeader";

export default function ProfilePage() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-6 text-primary">Bienvenido de vuelta, Jesus</h1>
      

      {/* Aqui va ir el ProfileHeader */}

       <section className="max-w-5xl mx-auto mt-8 px-4">
          <ProfileHeader />


      <div className="pt-20 md:pt-16">
        <div className="mx-auto bg-white/70 dark:bg-emerald-900/60 backdrop-blur-md rounded-2xl shadow-xl p-2 md:p-3 max-w-3xl">
          <div className="grid grid-cols-3 gap-2">
            <button className="py-2 rounded-xl bg-emerald-600 text-white font-medium">Posts</button>
            <button className="py-2 rounded-xl text-emerald-700 dark:text-emerald-200 hover:bg-emerald-50/60 dark:hover:bg-white/5">Destinos</button>
            <button className="py-2 rounded-xl text-emerald-700 dark:text-emerald-200 hover:bg-emerald-50/60 dark:hover:bg-white/5">Insignias</button>
          </div>
        </div>
      </div>
    </section>

      <div className="mt-6 bg-white p-6 rounded-lg shadow">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 bg-gray-300 rounded-full"></div>
          <div>
            <h3 className="text-2xl font-bold">Usuario</h3>
            <p className="text-gray-600">email@ejemplo.com</p>
          </div>
        </div>
        <button className="text-blue-600">Editar perfil</button>
      </div>
    </div>
  );
}
