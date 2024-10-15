import Header from '@/components/header';
import HomePage from '@/pages/home';
import NotFound from '@/pages/not-found';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function WrappedApp() {
  const queryClient = new QueryClient();
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex flex-1 p-6">
            <App />
          </main>
        </div>
        <Toaster position="top-center" />
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default WrappedApp;
