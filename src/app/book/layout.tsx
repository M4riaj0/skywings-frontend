import React from "react";

export default function bookLayout({children,}: Readonly<{children: React.ReactNode;}>) {
  return <main className="px-3 pb-6">{children}</main>;
}
