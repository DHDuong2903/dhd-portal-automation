import { ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="flex justify-between pt-[26px] text-[11px] text-muted-foreground">
      <span>© 2026 Portalflow. Vận hành đơn giản, dữ liệu kiểm soát.</span>
      <span className="flex items-center gap-1.5 text-muted-foreground">
        <ShieldCheck className="w-3.5 h-3.5 text-primary" />
        Không gian thử nghiệm · MVP 1.0
      </span>
    </footer>
  );
}
