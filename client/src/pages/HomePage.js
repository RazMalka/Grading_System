import React, { useState, useEffect } from 'react';
import { Route, Switch, Redirect } from "react-router-dom";
import { Routes } from "../routes";

// pages
import GradingDashboard from "./GradingDashboard";
import Settings from "./Settings";
import About from "./About";
import ViewGrades from "./ViewGrades";
import EditGrades from "./EditGrades";
import Signin from "./Signin";
import NotFoundPage from "./NotFound";
import ServerError from "./ServerError";

// components
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Preloader from "../components/Preloader";

const RouteWithLoader = ({ component: Component, ...rest }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Route {...rest} render={props => (<> <Preloader show={loaded ? false : true} /> <Component {...props} /> </>)} />
  );
};

const RouteWithSidebar = ({ component: Component, ...rest }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Route {...rest} render={props => (
      <>
        <Preloader show={loaded ? false : true} />
        <Sidebar />
        <main className="content">
          <Navbar />
          <Component {...props} />
        </main>
      </>
    )}
    />
  );
};

let Props = () => (
  <Switch>
    <RouteWithSidebar exact path={Routes.GradingDashboard.path} component={GradingDashboard} />
    <RouteWithLoader exact path={Routes.Signin.path} component={Signin} />
    <RouteWithLoader exact path={Routes.NotFound.path} component={NotFoundPage} />
    <RouteWithLoader exact path={Routes.ServerError.path} component={ServerError} />

    {/* pages */}
    <RouteWithSidebar exact path={Routes.Settings.path} component={Settings} />
    <RouteWithSidebar exact path={Routes.About.path} component={About} />
    <RouteWithSidebar exact path={Routes.ViewGrades.path} component={ViewGrades} />
    <RouteWithSidebar exact path={Routes.EditGrades.path} component={EditGrades} />

    <Redirect to={Routes.NotFound.path} />
  </Switch>
);

export default Props