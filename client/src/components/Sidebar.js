
import React, { useState } from "react";
import SimpleBar from 'simplebar-react';
import { useLocation } from "react-router-dom";
import { CSSTransition } from 'react-transition-group';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faChartPie, faCog, faSignInAlt, faSignOutAlt, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Nav, Badge, Image, Button, Dropdown, Accordion, Navbar } from '@themesberg/react-bootstrap';
import { Link } from 'react-router-dom';
import braude_icon from '../assets/img/braude_icon.png';
import { Routes } from "../routes";
import GradingSystemIcon from "../assets/img/grading_system.png";
import Profile3 from "../assets/img/Student.png";
import { deleteAllCookies, getCookie, statuses } from "../utilities/Cookies";

let status = getCookie('status');

let Props = () => {
  const location = useLocation();
  const { pathname } = location;
  const [show, setShow] = useState(false);
  const showClass = show ? "show" : "";

  const onCollapse = () => setShow(!show);

  // eslint-disable-next-line no-unused-vars
  const CollapsableNavItem = (props) => {
    const { eventKey, title, icon, children = null } = props;
    const defaultKey = pathname.indexOf(eventKey) !== -1 ? eventKey : "";

    return (
      <Accordion as={Nav.Item} defaultActiveKey={defaultKey}>
        <Accordion.Item eventKey={eventKey}>
          <Accordion.Button as={Nav.Link} className="d-flex justify-content-between align-items-center">
            <span>
              <span className="sidebar-icon"><FontAwesomeIcon icon={icon} /> </span>
              <span className="sidebar-text">{title}</span>
            </span>
          </Accordion.Button>
          <Accordion.Body className="multi-level">
            <Nav className="flex-column">
              {children}
            </Nav>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    );
  };

  const NavItem = (props) => {
    const { title, link, external, target, icon, image, badgeText, badgeBg = "secondary", badgeColor = "primary" } = props;
    const classNames = badgeText ? "d-flex justify-content-start align-items-center justify-content-between" : "";
    const navItemClassName = link === pathname ? "active" : "";
    const linkProps = external ? { href: link } : { as: Link, to: link };

    return (
      <Nav.Item className={navItemClassName} onClick={() => setShow(false)}>
        <Nav.Link {...linkProps} target={target} className={classNames}>
          <span>
            {icon ? <span className="sidebar-icon"><FontAwesomeIcon icon={icon} /> </span> : null}
            {image ? <Image src={image} width={20} height={20} className="sidebar-icon svg-icon" /> : null}

            <span className="sidebar-text">{title}</span>
          </span>
          {badgeText ? (
            <Badge pill bg={badgeBg} text={badgeColor} className="badge-md notification-count ms-2">{badgeText}</Badge>
          ) : null}
        </Nav.Link>
      </Nav.Item >
    );
  };

  function userUI() {
    if (status === statuses[1]) {
      return <>
        <NavItem title="View Grades" icon={faChartPie} link={Routes.ViewGrades.path} />
        <NavItem title="Settings" icon={faCog} link={Routes.Settings.path} />
      </>
    }
    else if (status === statuses[2]) {
      return <>
        <NavItem title="Edit Grades" icon={faChartPie} link={Routes.EditGrades.path} />
        <NavItem title="Settings" icon={faCog} link={Routes.Settings.path} />
      </>
    };
    return ''
  }

  function login_logout_button() {
    if (status !== statuses[1] && status !== statuses[2]) {
      return <>
        <Button as={Link} variant="secondary" size="xs" to={Routes.Signin.path} className="text-dark">
          <FontAwesomeIcon icon={faSignInAlt} className="me-2" /> Log-In
        </Button>
      </>
    };
    return <>
      <Button variant="secondary" size="xs" onClick={deleteAllCookies.bind(this)} className="text-dark">
        <FontAwesomeIcon icon={faSignOutAlt} className="me-2" /> Log-Out
      </Button>
    </>
  };

    return (
      <>
        <Navbar expand={false} collapseOnSelect variant="dark" className="navbar-theme-primary px-4 d-md-none">
          <Navbar.Brand className="me-lg-5" as={Link} to={Routes.GradingDashboard.path}>
            <Image src={GradingSystemIcon} className="navbar-brand-light" />
          </Navbar.Brand>
          <Navbar.Toggle as={Button} aria-controls="main-navbar" onClick={onCollapse}>
            <span className="navbar-toggler-icon" />
          </Navbar.Toggle>
        </Navbar>
        <CSSTransition timeout={300} in={show} classNames="sidebar-transition">
          <SimpleBar className={`collapse ${showClass} sidebar d-md-block bg-primary text-white`}>
            <div className="sidebar-inner px-4 pt-3">
              <div className="user-card d-flex d-md-none align-items-center justify-content-between justify-content-md-center pb-4">
                <div className="d-flex align-items-center">
                  <div className="user-avatar lg-avatar me-4">
                    <Image src={Profile3} className="card-img-top rounded-circle border-white" />
                  </div>
                  <div className="d-block">
                    <h6>Welcome!</h6>
                    {login_logout_button()}
                  </div>
                </div>
                <Nav.Link className="collapse-close d-md-none" onClick={onCollapse}>
                  <FontAwesomeIcon icon={faTimes} />
                </Nav.Link>
              </div>
              <Nav className="flex-column pt-3 pt-md-0">
                <NavItem title="Grading Dashboard" link="/#" image={GradingSystemIcon} />

                <NavItem title="Overview" link={Routes.GradingDashboard.path} icon={faChartPie} />
                {userUI()}

                <Dropdown.Divider className="my-3 border-indigo" />

                <NavItem external title="Braude" link="https://w3.braude.ac.il/" target="_blank" badgeText="61977" image={braude_icon} />
                <NavItem title="About Us" link={Routes.About.path} icon={faHeart} />

              </Nav>
            </div>
          </SimpleBar>
        </CSSTransition>
      </>
    );
};


export default Props