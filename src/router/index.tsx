import { createBrowserRouter } from "react-router-dom";

import { Layout } from "../layouts/Layout";
import { AboutUs } from "../pages/AboutUs";
import { HomePage } from "../pages/HomePage";
import { User } from "../pages/User";
import { ViewingPage } from "../pages/ViewingPage";
import { CustomerHomePage } from "../pages/customer/CustomerHomePage";
import { CustomerLogIn } from "../pages/customer/CustomerLogIn";
import { CustomerSignUp } from "../pages/customer/CustomerSignUp";
import { CreateMenu } from "../pages/restaurant/CreateMenu";
import { PublishMenu } from "../pages/restaurant/PublishMenu";
import { RestaurantHomePage } from "../pages/restaurant/RestaurantHomePage";
import { RestaurantLogIn } from "../pages/restaurant/RestaurantLogIn";
import { RestaurantProfile } from "../pages/restaurant/RestaurantProfile";
import { RestaurantSignUp } from "../pages/restaurant/RestaurantSignUp";
import { ReviewsComments } from "../pages/restaurant/ReviewsComments";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
    ],
  },
  {
    path: "/about-us",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <AboutUs />,
      },
    ],
  },
  {
    path: "/user",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <User />,
      },
    ],
  },
  {
    path: "/restaurant-login",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <RestaurantLogIn />,
      },
    ],
  },
  {
    path: "/restaurant-signup",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <RestaurantSignUp />,
      },
    ],
  },
  {
    path: "/restaurant-dashboard",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <RestaurantHomePage />,
      },
    ],
  },
  {
    path: "restaurant-profile",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <RestaurantProfile />,
      },
    ],
  },
  {
    path: "/create-menu",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <CreateMenu />,
      },
    ],
  },
  {
    path: "/publish-menu",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <PublishMenu />,
      },
    ],
  },
  {
    path: "/reviews-comments",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <ReviewsComments />,
      },
    ],
  },
  {
    path: "/customer-login",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <CustomerLogIn />,
      },
    ],
  },
  {
    path: "/customer-signup",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <CustomerSignUp />,
      },
    ],
  },
  {
    path: "/customer-dashboard",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <CustomerHomePage />,
      },
    ],
  },
  {
    path: "/restaurant/:id",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <ViewingPage />,
      },
    ],
  },
]);
