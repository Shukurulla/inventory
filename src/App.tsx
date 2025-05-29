import './App.css'
import { ToastContainer } from 'react-toastify';
import LocationTracker from './components/LocationTracker';
import AppRoutes from './Routes/AppRoutes';

function App() {

  return (
    <>
      <AppRoutes/>
      <LocationTracker/>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  )
}

export default App
