import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';
import { Provider } from 'react-redux';

// @ts-ignore
import inobounce from 'inobounce';

import './index.css';
import App from './App';
import RouteEdit from './routes/RouteEdit';
import RouteInfo from './routes/RouteInfo';
import { store } from './redux/store'


inobounce.enable();


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
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

root.render(
  <Provider store={store}>
    <RouterProvider router={router}/>
  </Provider>
);
