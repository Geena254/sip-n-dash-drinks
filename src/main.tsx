import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './polyfills/crypto'

createRoot(document.getElementById("root")!).render(<App />);
