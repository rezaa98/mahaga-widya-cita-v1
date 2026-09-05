import {
  Building2,
  Calculator,
  CheckCircle2,
  ClipboardList,
  MonitorSmartphone,
  TrendingUp,
  UserPlus,
  type LucideIcon,
} from "lucide-react";

const serviceIcons: Record<string, LucideIcon> = {
  "research-strategic-studies": ClipboardList,
  "technology-digital-solutions": MonitorSmartphone,
  "tax-financial-advisory": Calculator,
  "workforce-solutions": UserPlus,
  "business-investment-advisory": TrendingUp,
  "property-management-investment": Building2,
};

export function getServiceIcon(slug: unknown): LucideIcon {
  return typeof slug === "string" ? serviceIcons[slug] || CheckCircle2 : CheckCircle2;
}
