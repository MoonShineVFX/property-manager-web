import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';
import './index.css';

// @ts-ignore
import inobounce from 'inobounce';

import App from './App';
import Edit from './routes/Edit';
import Info from './routes/Info';


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

root.render(<RouterProvider router={router}/>);
