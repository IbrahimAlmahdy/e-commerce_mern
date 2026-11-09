import type { PropsWithChildren } from "react";

import QueryProvider from "./QueryProvider";
import { ThemeModeProvider } from "../../theme/ThemeModeProvider";
import CartProvider from "../../features/cart/providers/CartProvider";

const AppProviders = ({ children }: PropsWithChildren) => {
  return (
    <QueryProvider>
      <ThemeModeProvider>
        <CartProvider>{children}</CartProvider>
      </ThemeModeProvider>
    </QueryProvider>
  );
};

export default AppProviders;