import { Badge, type BadgeProps } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StatusTone = "success" | "warning" | "info" | "danger" | "neutral";

interface StatusBadgeProps extends Omit<BadgeProps, "variant"> {
  tone: StatusTone;
}

export function StatusBadge({
  tone,
  className,
  children,
  ...props
}: StatusBadgeProps) {
  return (
    <Badge
      variant={tone}
      className={cn("rounded-md px-2 py-1 text-[10px] font-medium", className)}
      {...props}
    >
      <span className="h-[5px] w-[5px] shrink-0 rounded-full bg-current" />
      {children}
    </Badge>
  );
}
