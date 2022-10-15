import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';
import { Provider } from 'react-redux';

import './index.css';
import { store } from './redux/store'
import LazyFallback from "./components/LazyFallback";


const App = React.lazy(() => import(
  /* webpackChunkName: "app" */
  /* webpackPrefetch: true */
  './App')
);
const RouteEdit = React.lazy(() => import(
  /* webpackChunkName: "route-edit" */
  /* webpackPrefetch: true */
  './routes/RouteEdit')
);
const RouteInfo = React.lazy(() => import(
  /* webpackChunkName: "route-info" */
  /* webpackPrefetch: true */
  './routes/RouteInfo')
);


const router = createBrowserRouter([
  {
    path: '/',
    element: <Suspense fallback={LazyFallback}><App /></Suspense>,
    children: [
      {
        path: 'info',
        element: <RouteInfo />
      },
      {
        path: 'edit',
        element: <RouteEdit />
      }
    ],
    errorElement: <div>ERROR</div>
  }
]);


const root = createRoot(
  document.getElementById('root') as HTMLElement
);

document.getElementById('suspense')?.remove();
root.render(
  <Provider store={store}>
    <RouterProvider router={router}/>
  </Provider>
);
