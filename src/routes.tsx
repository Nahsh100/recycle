import {
    createBrowserRouter,
  } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import DashboardLayout from "./pages/DashboardLayout";
import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";
import Approved from "./pages/Approved";
import CounterOffers from "./pages/CounterOffers";


  export const router = createBrowserRouter([
    {
      path: "/",
      element: <DashboardLayout Component={Products} />,
    },
    {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/add-product",
        element: <DashboardLayout Component={AddProduct} />,
      },
      {
        path: "/approved",
        element: <DashboardLayout Component={Approved} />,
      },
      {
        path: "/counter-offers",
        element: <DashboardLayout Component={CounterOffers} />,
      },
    
])