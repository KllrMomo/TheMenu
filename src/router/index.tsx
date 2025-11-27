import { createBrowserRouter } from 'react-router-dom'
import { Layout } from '../layouts/Layout'
import { HomePage } from '../pages/HomePage'
import { RestaurantLogIn } from '../pages/restaurant/RestaurantLogIn'
import { RestaurantSignUp } from '../pages/restaurant/RestaurantSignUp'
import { RestaurantHomePage } from '../pages/restaurant/RestaurantHomePage'
import { CustomerLogIn } from '../pages/customer/CustomerLogIn'
import { AboutUs } from '../pages/AboutUs'
import { User } from '../pages/User'
import { CustomerSignUp } from '../pages/customer/CustomerSignUp'
import { CustomerHomePage } from '../pages/customer/CustomerHomePage'
import { ViewingPage } from '../pages/ViewingPage'
import { CreateMenu } from '../pages/restaurant/CreateMenu'
import { PublishMenu } from '../pages/restaurant/PublishMenu'
import { ReviewsComments } from '../pages/restaurant/ReviewsComments'

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
    path: '/create-menu',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <CreateMenu />,
      },
    ],
  },
  {
    path:'/publish-menu',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <PublishMenu />,
      },
    ],
  },
  {
    path: '/reviews-comments',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <ReviewsComments />,
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
  },
  {
    path: '/customer-signup',
    element: <Layout />,
    children: [
      {        
        index: true,
        element: <CustomerSignUp />,
      },
    ],
  },
  {
    path: '/customer-dashboard',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <CustomerHomePage />,
      },
    ],
  },
  {
    path: '/restaurant/:id',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <ViewingPage />,
      },
    ],
  },
])

