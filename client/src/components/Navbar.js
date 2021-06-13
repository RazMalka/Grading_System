
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faSignOutAlt, faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import { faUserCircle } from "@fortawesome/free-regular-svg-icons";
import { Nav, Image, Navbar, Button, Dropdown, Container } from '@themesberg/react-bootstrap';
import { Link } from 'react-router-dom';
import { Routes } from "../routes";

import { deleteAllCookies, getCookie, statuses } from "../utilities/Cookies";

import Profile3 from "../assets/img/Student.png";

let username = getCookie('username');
let status = getCookie('status');
if (username === '') {
	username = 'Guest';
}

function login_button() {
	if (status !== statuses[1] && status !== statuses[2]) {
		return <>
			<Button as={Link} variant="secondary" size="xs" to={Routes.Signin.path} className="text-dark">
				<FontAwesomeIcon icon={faSignInAlt} className="me-2" /> Log-In
			</Button>
		</>
	};
	return username
}

function dropdown_menu() {
	if ((status === statuses[1] || status === statuses[2]) && window.innerWidth > 720) {
		let dynamic_to = (status === statuses[1]) ? Routes.ViewGrades.path : Routes.EditGrades.path;
		let dynamic_title = (status === statuses[1]) ? "View Grades" : "Edit Grades";
		return <>
			<Dropdown.Menu className="user-dropdown dropdown-menu-right mt-2">
				<Dropdown.Item className="fw-bold" as={Link} to={dynamic_to}>
					<FontAwesomeIcon icon={faUserCircle} className="me-2" /> {dynamic_title}
				</Dropdown.Item>
				<Dropdown.Item className="fw-bold" as={Link} to={Routes.Settings.path} >
					<FontAwesomeIcon icon={faCog} className="me-2" /> Settings
				</Dropdown.Item>

				<Dropdown.Divider />

				<Dropdown.Item className="fw-bold" onClick={deleteAllCookies.bind(this)}>
					<FontAwesomeIcon icon={faSignOutAlt} className="text-danger me-2" /> Logout
				</Dropdown.Item>
			</Dropdown.Menu>
		</>
	}
	return ''
}

let props = () => {

	return (
		<Navbar variant="dark" expanded className="ps-0 pe-2 pb-0">
			<Container fluid className="px-0">
				<div className="d-flex justify-content-between w-100">
					<Nav className="d-flex align-items-center">
						<Dropdown as={Nav.Item}>
							<Dropdown.Toggle as={Nav.Item} className="pt-1 px-0">
								<div className="media d-flex align-items-center">
									<Image src={Profile3} className="user-avatar md-avatar rounded-circle" />
									<div className="media-body ms-2 text-dark align-items-center d-lg-block">
										<span className="mb-0 font-small fw-bold">&nbsp;&nbsp;&nbsp;&nbsp;{login_button()}</span>
									</div>
								</div>
							</Dropdown.Toggle>
							
							{dropdown_menu()}
						</Dropdown>
					</Nav>
					<div className="d-flex align-items-center">
						<center><h4><b>Grading System</b></h4>
						<h5>Homework and Labs</h5></center>
					</div>
				</div>
			</Container>
		</Navbar>
	);
};

export default props