import React from "react";
import { BrowserRouter as Router, useRoutes } from "react-router-dom";
import routes from "./routes";

const AppRoutes = () => {
  const element = useRoutes(routes);
  return element;
};

const App = () => {
  return(
    <Router>
      <React.Suspense>
        <AppRoutes />
      </React.Suspense>
    </Router>
  )
};

export default App;