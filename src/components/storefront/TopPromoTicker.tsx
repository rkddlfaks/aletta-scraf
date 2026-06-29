import { StoreSetting } from "@prisma/client";
import { Flame } from "lucide-react";

export function TopPromoTicker({ setting }: { setting: StoreSetting | null }) {
  if (!setting || !setting.is_promo_active || !setting.promo_text) {
    return null;
  }

  return (
    <div className="bg-gray-950 text-amber-300 text-xs sm:text-sm py-2 px-4 font-semibold w-full">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-center animate-in fade-in duration-500">
        <Flame size={16} className="text-amber-500 shrink-0 animate-pulse" />
        <span className="truncate">{setting.promo_text}</span>
      </div>
    </div>
  );
}
