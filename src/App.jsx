import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import EditorPage from './pages/EditorPage/EditorPage';
import { Toaster } from 'react-hot-toast';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: 'editor/:id',
    element: <EditorPage />,
  },
]);

function App() {
  return (
    <>
      <div>
        <Toaster
          position="top-right"
          toastOptions={{
            success: {
              theme: {
                colors: {
                  primary: '#4aee88',
                },
              },
            },
          }}
        />
      </div>
      <RouterProvider router={router} future={{ v7_partialHydration: true }} />
    </>
  );
}

export default App;
