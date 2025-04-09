import React, { ReactNode, Suspense } from "react";

const Template = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <Suspense>{children}</Suspense>
    </div>
  );
};

export default Template;
