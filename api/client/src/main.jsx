import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { SearchContextProvider } from './context/SearchContext.jsx'
import { AuthContextProvider } from './context/AuthContext.jsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthContextProvider>
      <SearchContextProvider>
        <BrowserRouter basename="/client">
          <App />
        </BrowserRouter>
      </SearchContextProvider>
    </AuthContextProvider>
  </StrictMode>,
)
