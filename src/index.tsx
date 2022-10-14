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
import Edit from './routes/Edit';
import Info from './routes/Info';
import { store } from './redux/store'


inobounce.enable();


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'info',
        element: <Info />
      },
      {
        path: 'edit',
        element: <Edit />
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
