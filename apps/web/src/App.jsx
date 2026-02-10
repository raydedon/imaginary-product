import React from "react";
import Routes from "./Routes";
import { CartProvider } from "./contexts/CartProvider";
import { ReactQueryProvider } from "./contexts/ReactQueryProvider";

function App() {
  return (
    <ReactQueryProvider>
      <CartProvider>
        <Routes />
      </CartProvider>
    </ReactQueryProvider>
  );
}

export default App;
