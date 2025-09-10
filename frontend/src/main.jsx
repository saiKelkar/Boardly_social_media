import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { PinProvider } from "./PinContext";

createRoot(document.getElementById('root')).render(
  <PinProvider>
      <App />
  </PinProvider>
)
