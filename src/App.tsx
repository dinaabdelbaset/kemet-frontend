import { RouterProvider } from "react-router-dom";
import router from "./router";
import { CartProvider } from "./context/CartContext";
import "flowbite";


function App() {
  // App starts without background triggers


  return (
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  );
}

export default App;

