import { RouterProvider } from "react-router-dom";
import router from "./routes";
import 'react-toastify/dist/ReactToastify.css';
import "quill/dist/quill.snow.css";
import { ToastContainer } from 'react-toastify';

const App = () => {
  return (
    <>
      <div className="absolute top-2 right-2">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          rtl={true}
          theme="colored"
        />
      </div>
      <RouterProvider router={router} />
    </>
  );
}

export const isActive = (path: string) => {
  return location.pathname === path;
};

export default App;