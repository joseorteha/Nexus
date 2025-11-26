import SettingsIcon from "@/src/assets/SettingsIcon";

export default function ProfileHeader() {
  return (
          <div className="relative">
        
        <div className=" -bottom-16 md:-bottom-12 left-0 right-0 px-4 md:px-8">
          <div className="mx-auto grid grid-cols-[auto,1fr] gap-4 items-start rounded-2xl md:rounded-3xl  bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-600 dark:from-cyan-700 dark:via-blue-700 dark:to-cyan-700 backdrop-blur-xl shadow-2xl p-4 md:p-6">
            <img id="avatar-preview" src='' alt="Avatar" className="h-20 w-20 md:h-24 md:w-24 rounded-2xl ring-4 ring-white/70 object-cover" />

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3">
                <h1 className="text-lg md:text-2xl font-bold tracking-tight text-emerald-900 dark:text-white">
                  {/* {profile?.nombre} {profile?.apellidos} */} Nombre empresa aqui
                </h1>

                <div className="flex items-center gap-2">
                  <a href="profile/editar" className="px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white text-secondary hover:bg-foreground">Editar</a>
                  <button className="px-3 py-1.5 rounded-full border border-[#611232]/50 bg-[#611232] text-white ">
                    <SettingsIcon />
                  </button>
                </div>
                
              </div>

              <div>
                <p className="text-sm md:text-base text-slate-700 dark:text-slate-200">
                    {/* {profile?.bio || "Sin biografía por el momento."} */} Biografia de la empresa aqui
                </p>
              </div>
              

              <div className="grid grid-cols-3 gap-2 md:gap-4">
                <div className="rounded-full bg-white text-secondary hover:text-secondary-hover  py-2 text-center">
                  <p className="text-base font-bold">0</p>
                  <span className="text-xs">Siguiendo</span>
                </div>
                <div className="rounded-full bg-white text-secondary hover:text-secondary-hover  py-2 text-center">
                  <p className="text-base font-bold">0</p>
                  <span className="text-xs">Seguidores</span>
                </div>
                <div className="rounded-full bg-white text-secondary hover:text-secondary-hover py-2 text-center">
                  <p className="text-base font-bold">0</p>
                  <span className="text-xs">Destinos</span>
                </div>
              </div>

              <p className="text-sm md:text-base text-slate-700 dark:text-slate-200">
              </p>
            </div>
          </div>
        </div>
      </div>


)
}
