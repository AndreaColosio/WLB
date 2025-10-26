import { Outlet } from 'react-router-dom';
import Header from './Header';
import NavBar from './NavBar';

const Layout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      <NavBar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-[calc(100vh-200px)]">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
