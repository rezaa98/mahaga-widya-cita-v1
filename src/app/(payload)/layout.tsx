import configPromise from "@payload-config";
import "@payloadcms/next/css";
import "./admin.css";
import { RootLayout } from "@payloadcms/next/layouts";
import React from "react";
import type { Metadata } from "next";
import { SITE_URL } from "@/utils/seo";

export const metadata: Metadata = { metadataBase: new URL(SITE_URL) };

import { importMap } from "./admin/importMap";
import { serverFunction } from "./admin/serverFunction";

type Args = {
  children: React.ReactNode;
};

// Trigger Next.js hot reload
const Layout = ({ children }: Args) => (
  <RootLayout config={configPromise} importMap={importMap} serverFunction={serverFunction}>
    {children}
  </RootLayout>
);

export default Layout;
