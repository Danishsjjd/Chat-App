import React from "react"
import ReactDOM from "react-dom/client"
import { Toaster } from "react-hot-toast"
import { BrowserRouter } from "react-router-dom"
import App from "./App"
import "./assets/tailwind.css"
import UserContextProvider from "./context/user"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <UserContextProvider>
      <BrowserRouter>
        <App />
        <Toaster />
      </BrowserRouter>
    </UserContextProvider>
  </React.StrictMode>
)
