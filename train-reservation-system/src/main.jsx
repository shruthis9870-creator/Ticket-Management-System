import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.jsx";
import { isSupabaseConfigured } from "./services/supabase";

import "./index.css";


createRoot(document.getElementById("root")).render(

    <StrictMode>
        {isSupabaseConfigured ? (
            <App />
        ) : (
            <div className="setup-required" role="alert">
                <h1>Supabase setup required</h1>
                <p>
                    Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your
                    deployment environment variables, then rebuild and redeploy.
                </p>
            </div>
        )}
    </StrictMode>

);