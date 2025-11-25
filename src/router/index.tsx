import { createBrowserRouter } from 'react-router-dom'
import { Layout } from '../layouts/Layout'
import { HomePage } from '../pages/HomePage'
import { RestaurantLogIn } from '../pages/RestaurantLogIn'
import { RestaurantSignUp } from '../pages/RestaurantSignUp'
import { RestaurantHomePage } from '../pages/RestaurantHomePage'
import { CustomerLogIn } from '../pages/CustomerLogIn'
import { AboutUs } from '../pages/AboutUs'
import { User } from '../pages/User'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
    ],
  },
  {
    path: '/about-us',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <AboutUs />,
      },
    ],
  },
  {
    path: '/user',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <User />,
      },
    ],
  },
  {
    path: '/restaurant-login',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <RestaurantLogIn />,
      },
    ],
  },
  {
    path: '/restaurant-signup',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <RestaurantSignUp />,
      },
    ],
  },
  {
    path: '/restaurant-dashboard',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <RestaurantHomePage />,
      },
    ],
  },
  {
    path: '/customer-login',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <CustomerLogIn />,
      },
    ],
  }
])

