import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"
import { AuthProvider } from "@/context/authContext"
import {SocketProvider} from "@/context/socketContext"
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
    <SocketProvider>
      <App />
     </SocketProvider>
    </AuthProvider>
  </React.StrictMode>
)
