import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import ProductDetails from "./pages/ProductDetails";
import ProductList from "./pages/ProductList";
import Page404 from "./pages/404";
import UserProfile from "./pages/user/UserProfile";
import UserCartDetails from "./pages/user/UserCartDetails";
import UserOrders from "./pages/user/UserOrders";
import UserOrderDetails from "./pages/user/UserOrderDetails";
import RoutesWithUserChat from "./components/RoutesWithUserChat";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminChatPanel from "./pages/admin/AdminChatPanel";
import AdminCreateProducts from "./pages/admin/AdminCreateProduct";
import AdminEditProduct from "./pages/admin/AdminEditProduct";
import AdminEditUser from "./pages/admin/AdminEditUser";
import AdminOrderDetails from "./pages/admin/AdminOrderDetails";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminUsers from "./pages/admin/AdminUsers";
import RouteProtector from "./components/RouteProtector";
import ScrollToTop from "./utils/ScrollToTop";

const App = () => {
  return (
    <BrowserRouter>
      {/* Apply scrolling to top to all routes */}
      <ScrollToTop />
      <Header />
      <Routes>
        {/* Apply chat component to public routes */}
        <Route element={<RoutesWithUserChat />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/product-details/:id" element={<ProductDetails />} />
          <Route path="/product-details" element={<ProductDetails />} />
          <Route path="/product-list" element={<ProductList />} />
          <Route path="*" element={<Page404 />} />
        </Route>

        {/* User protected routes */}
        <Route element={<RouteProtector admin={false} />}>
          <Route path="/user/profile" element={<UserProfile />} />
          <Route path="/user/my-orders" element={<UserOrders />} />
          <Route path="/user/order-details" element={<UserOrderDetails />} />
          <Route path="/user/cart" element={<UserCartDetails />} />
        </Route>

        {/* Admin protected routes */}
        <Route element={<RouteProtector admin={true} />}>
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/chats" element={<AdminChatPanel />} />
          <Route
            path="/admin/create-product"
            element={<AdminCreateProducts />}
          />
          <Route path="/admin/edit-product" element={<AdminEditProduct />} />
          <Route path="/admin/edit-user/:id" element={<AdminEditUser />} />
          <Route
            path="/admin/order-details/:id"
            element={<AdminOrderDetails />}
          />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/users" element={<AdminUsers />} />
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
