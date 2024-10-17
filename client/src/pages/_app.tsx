import React from "react";
import "./../styles/global.css";
import IndexPage from "./index";
import DashboardPage from "./dashboard";
import DesignPage from "./design.tsx";
import AuthPage from "./auth";
import SettingsPage from "./settings";
import RecentlyUpdatedPage from "./recently-updated.tsx";
import TrendingPage from "./trending.tsx";
import TopPage from "./top.tsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NotFoundPage from "./404";
import Footer from "../components/Footer";
import { inject } from "@vercel/analytics";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
import { AuthProvider } from "../util/auth.jsx";
import { QueryClientProvider } from "../util/db";
import DetailsPage from "./details.tsx";

inject();

/*
App component defines the main router and page structure.

Renders:

- QueryClientProvider for React Query
- AuthProvider for authentication
- Router with Routes for each page component
- Header and Footer components

Routes:

- / ->  //!page loads, but inner components dont show/no data
- /dashboard -> DashboardPage //!redirects to sign in
- /design, /keyboard/add -> DesignPage //!404, redirects to sign in
- /auth/:type -> AuthPage //!redirects to sign in
- /trending -> TrendingPage //!page loads, but inner components dont show/no data
- /recently-updated -> RecentlyUpdatedPage //!page loads, but inner components dont show/no data
- /top -> TopPage //!page loads, but inner components dont show/no data
- /settings/:section -> SettingsPage //!redirects to sign in
- 404 -> NotFoundPage

Props:

- None

Usage:

<App />

Wraps app in providers and contains all routes.
*/

function App() {
  return (
    <QueryClientProvider>
      {/* <AuthProvider> */}
        <Router>
          <div
            id="page-container"
            className="flex flex-col mx-auto w-full min-h-screen min-w-[320px] bg-gray-100 dark:text-gray-100 dark:bg-gray-900"
          >
            <main
              id="page-content"
              className="flex flex-auto flex-col max-w-full"
            >
              <Routes>
                <Route path="/" element={<IndexPage/>} />
                <Route path="/dashboard" element={<DashboardPage/>} />
                <Route path="/keyboard/add" element={<DesignPage/>} />
                <Route
                  path="/keyboard/:action/:theme_id"
                  element={<DesignPage/>}
                />
                <Route
                  path="/keyboard/:theme_id"
                  element={<DetailsPage/>}
                />
                {/*//! any route parameter redircts here and is still shown in url */}
                <Route path="/auth/:type" element={<AuthPage/>} /> 
                <Route path="/trending" element={<TrendingPage/>} />
                <Route
                  path="/recently-updated"
                  element={<RecentlyUpdatedPage/>}
                />
                <Route path="/top" element={<TopPage/>} />
                <Route
                  path="/settings/:section"
                  element={<SettingsPage/>}
                />
                <Route element={<NotFoundPage/>} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      {/* </AuthProvider> */}
    </QueryClientProvider>
  );
}

export default App;
