import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ActionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  gradient: string;
}

export function ActionCard({ icon, title, description, href, gradient }: ActionCardProps) {
  return (
    <Link href={href}>
      <div className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-all hover:scale-105 cursor-pointer">
        <div className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center text-white mb-4 shadow-md group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4">{description}</p>
        <div className="flex items-center text-cyan-600 font-semibold text-sm group-hover:gap-2 transition-all">
          Ver más
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}



