import React from "react";
import ReactDOM from 'react-dom'
import { Col, Row, Button } from '@themesberg/react-bootstrap';

import { getCookie, statuses } from "../utilities/Cookies";
import { ViewGradesTable } from "../components/Tables";

let status = getCookie('status');
let courses = getCookie('courses');
let lastCourseNumber = "00000";

function filterTable(courseNumber, option) {
	let rows = document.getElementById("view-grades-table").rows.length;
	let i = 1
	
	while (i < rows) {
		let row = document.getElementById("vg-"+i);
		let rowCourse = document.getElementById("vg-"+i+"-c").innerText;
		let rowType = document.getElementById("vg-"+i+"-t").innerText;
		if (rowCourse !== courseNumber) {
			row.style.display = 'none';
		}
		else {
			if (option === 0 || (option === 1 && rowType === "Homework") || (option === 2 && rowType === "Lab")) {
				row.style.display = 'table-row';
			}
			else {
				row.style.display = 'none';
			}
		}

		i = i + 1;
	}
}

function toogleSelection(option) {
	if (lastCourseNumber === "00000")
		return;
	filterTable(lastCourseNumber, option);
}

function viewCourseGrades(courseNumber) {
	lastCourseNumber = courseNumber;
	let courseListRow = document.getElementById("courseList");
	let backButton = document.getElementById("backButton");
	let selectionButtons = document.getElementById("selectionButtons");
	let courseGrades = document.getElementById("courseGrades");

	if (courseListRow.style.display !== "none") {
		ReactDOM.render(<ViewGradesTable usn={getCookie('username')} location='view-grades'/>, courseGrades);
	}
	
	setTimeout(function(){ 
		filterTable(courseNumber, 0);

		if (courseListRow.style.display === "none") {
			courseListRow.style.display = "block";
		} else {
			courseListRow.style.display = "none";
		}
		if (backButton.style.display === "none") {
			backButton.style.display = "block";
			selectionButtons.style.display = "block";
			courseGrades.style.display = "block";
			
		} else {
			backButton.style.display = "none";
			selectionButtons.style.display = "none";
			courseGrades.style.display = "none";
		}
	}, 200);
}

function viewCourses() {
	if (courses === '') {
		return <>
		<h5>You are not related to any course!</h5>
		</>
	}

	let courseList = courses.split(',');

	let res;
	for (const course in courseList) {
		res = <>
			{res}
			<Col xs={12} sm={6} xl={2} className="mb-4">
			<div className="shadow-soft rounded border-light p-2 w-75 fmxw-500">
			<Button variant="secondary" size="xs" className="text-dark" style={{color:'white'}} onClick={viewCourseGrades.bind(this, courseList[course])}><h5>Course #{courseList[course]}</h5></Button>
			</div>
			</Col>
		</>
	}
	return res;
}

function content() {
	if (status === statuses[1]) {
		return <>
		<h4>View Grades Panel</h4>
		<div id="backButton" className="shadow-soft rounded border-light p-2 w-75 fmxw-500" style={{display:'none'}}>
			<Button variant="secondary" size="xs" className="text-dark" style={{color:'white'}} onClick={viewCourseGrades.bind(this)}><h5>Back to Course List</h5></Button>
		</div>
		<div id="selectionButtons" className="shadow-soft rounded border-light p-2 w-75 fmxw-500" style={{display:'none'}}>
			<Button variant="secondary" size="xs" className="text-dark" style={{color:'white'}} onClick={toogleSelection.bind(this, 0)}><h6>All</h6></Button>
			<Button variant="secondary" size="xs" className="text-dark" style={{color:'white'}} onClick={toogleSelection.bind(this, 1)}><h6>Homework</h6></Button>
			<Button variant="secondary" size="xs" className="text-dark" style={{color:'white'}} onClick={toogleSelection.bind(this, 2)}><h6>Labs</h6></Button>
		</div>
		<div id="courseList">
		<Row className="justify-content-md-center">
		{viewCourses()}
		</Row>
		</div>
		<div id="courseGrades" style={{display:'none'}}>
		</div>
		</>
	}
	else {
		window.location.href = "/";
	}
}

let Props = () => {
		return (
			<>
				<center><div className="flex-wrap flex-md-nowrap align-items-center py-4">
					{content()}
				</div></center>
			</>
		);
	};

export default Props