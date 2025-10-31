import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/modern/Layout';
import NewChat from '../pages/NewChat';
import NewJournal from '../pages/NewJournal';
import NewGratitude from '../pages/NewGratitude';
import NewProgress from '../pages/NewProgress';
import NotFound from '../pages/not-found';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <NewChat />,
      },
      {
        path: 'chat',
        element: <NewChat />,
      },
      {
        path: 'journal',
        element: <NewJournal />,
      },
      {
        path: 'gratitude',
        element: <NewGratitude />,
      },
      {
        path: 'progress',
        element: <NewProgress />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);
