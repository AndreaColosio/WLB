import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Chat from '../pages/Chat';
import Today from '../pages/Today';
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
        path: 'today',
        element: <Today selectedDate={new Date()} onStreakUpdate={() => {}} />,
      },
      {
        path: 'journal',
        element: <Journal selectedDate={new Date()} />,
      },
      {
        path: 'gratitude',
        element: <Gratitude selectedDate={new Date()} />,
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
