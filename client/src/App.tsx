import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import VehicleList from './pages/VehicleList';
import VehicleDetails from './pages/VehicleDetails';
import Logo from './components/Icons/Logo';
import Button from './components/Button';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const AppContent = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`min-h-screen flex flex-col font-sans ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <header
        className={`border-b shadow-sm ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
      >
        <div className="max-w-7xl mx-auto px-8 lg:px-0">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 hover:scale-105 transition-transform duration-200">
                <Logo />
              </Link>
            </div>
            <nav className="flex items-center space-x-2 sm:space-x-4">
              <Button
                variant="primary"
                size="md"
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className={`flex-1 p-8 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
        <div className="max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/vehicles" replace />} />
            <Route path="/vehicles" element={<VehicleList />} />
            <Route path="/vehicles/:id" element={<VehicleDetails />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </ThemeProvider>
  );
}

export default App;
