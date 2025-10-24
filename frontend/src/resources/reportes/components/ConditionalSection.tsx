import React from "react";

// Conditional rendering helper
export const ConditionalSection = ({
  condition,
  children,
}: {
  condition: boolean;
  children: React.ReactNode;
}) => {
  return condition ? <>{children}</> : null;
};
