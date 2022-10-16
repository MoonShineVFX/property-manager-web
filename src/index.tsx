import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';
import { Provider } from 'react-redux';

import './index.css';
import { store } from './redux/store'
import { LoadingIndicator } from "./icons";


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
      element: <Suspense
                fallback={
                  <div className='grid place-content-center h-full text-xl text-gray-500'>
                    <div className='flex items-center gap-2'>
                      <LoadingIndicator className='w-[1.5rem] h-[1.5rem] text-gray-700 fill-teal-600' />
                      讀取中...
                    </div>
                  </div>
                }>
                <App />
              </Suspense>,
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
  ],
  {
    basename: process.env.PUBLIC_URL ? `/${process.env.PUBLIC_URL}` : ''
  }
);


const root = createRoot(
  document.getElementById('root') as HTMLElement
);

document.getElementById('suspense')?.remove();
root.render(
  <Provider store={store}>
    <RouterProvider router={router}/>
  </Provider>
);
