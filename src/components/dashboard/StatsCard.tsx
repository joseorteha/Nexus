type ColorType = "cyan" | "blue" | "purple" | "green";

interface StatsCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: ColorType;
  trend?: string;
  isText?: boolean;
}

export function StatsCard({ icon, label, value, color, trend, isText = false }: StatsCardProps) {
  const colors: Record<ColorType, string> = {
    cyan: "from-cyan-500 to-cyan-600",
    blue: "from-blue-500 to-blue-600",
    purple: "from-purple-500 to-purple-600",
    green: "from-green-500 to-green-600",
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
      <div className={`w-12 h-12 bg-gradient-to-br ${colors[color]} rounded-xl flex items-center justify-center text-white mb-4 shadow-md`}>
        {icon}
      </div>
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <div className="flex items-end justify-between">
        <p className={`${isText ? 'text-lg' : 'text-3xl'} font-bold text-gray-900`}>
          {value}
        </p>
        {trend && (
          <span className="text-sm text-green-600 font-semibold">{trend}</span>
        )}
      </div>
    </div>
  );
}
