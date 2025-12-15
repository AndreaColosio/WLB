import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/modern/Layout';
import Chat from '../pages/Chat';
import Journal from '../pages/Journal';
import Gratitude from '../pages/Gratitude';
import Progress from '../pages/Progress';
import NotFound from '../pages/not-found';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Chat />,
      },
      {
        path: 'chat',
        element: <Chat />,
      },
      {
        path: 'journal',
        element: <Journal />,
      },
      {
        path: 'gratitude',
        element: <Gratitude />,
      },
      {
        path: 'progress',
        element: <Progress />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);
