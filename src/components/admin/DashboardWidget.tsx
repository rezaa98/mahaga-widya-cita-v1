import React from "react";
import { DashboardClient } from "./DashboardClient";

export const DashboardWidget: React.FC = () => {
  // We explicitly do NOT pass props down to the client component.
  // Payload passes props like `locale` which contains functions (e.g. `toString`)
  // that cannot be serialized by Next.js Server Components.
  return <DashboardClient />;
};
