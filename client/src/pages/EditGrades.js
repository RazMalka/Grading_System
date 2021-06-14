import React, {useEffect, useState} from "react";
import ReactDOM from 'react-dom'
import { Col, Row, Button } from '@themesberg/react-bootstrap';

import { getCookie, statuses } from "../utilities/Cookies";
import { ViewGradesTable } from "../components/Tables";
import { POST } from "../utilities/Requests";

let status = getCookie('status');
let courses = getCookie('courses');
let allStudentList = [];
let lastCourseNumber = "00000";
let lastStudent = "";

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

const FilterStudentList = async () => {
	try {
		let courseStudents = await POST({course: lastCourseNumber}, 'studentsInCourse');
		let studentsInCourse = JSON.parse(courseStudents.result).students;
		for (const student in allStudentList) {
			let elem = document.getElementById(allStudentList[student]);
			if (studentsInCourse.includes(allStudentList[student])) {
				elem.style.display = 'block';
			}
			else {
				elem.style.display = 'none';
			}
		}
		return ;
	}
	catch (error) {
		console.log(error);
		return [];
	}
}

function toogleSelection(option) {
	if (lastCourseNumber === "00000")
		return;
	filterTable(lastCourseNumber, option);
}

function revertSelection() {
	/*
	let courseListRow = document.getElementById("courseList");
	let backButton = document.getElementById("backButton");
	let studentList = document.getElementById("studentList");
	let selectionButtons = document.getElementById("selectionButtons");
	let courseGrades = document.getElementById("courseGrades");

	courseListRow.style.display = "block";
	backButton.style.display = "none";
	studentList.style.display = "none";
	selectionButtons.style.display = "none";
	courseGrades.style.display = "none";
	*/
	document.location.reload();
}

function viewCourseGrades(student) {
	lastStudent = student;
	
	let studentList = document.getElementById("studentList");
	let selectionButtons = document.getElementById("selectionButtons");
	let courseGrades = document.getElementById("courseGrades");

	ReactDOM.render(<ViewGradesTable usn={student} location="edit-grades" />, courseGrades);

	setTimeout(function(){ 
		filterTable(lastCourseNumber, 0);
		studentList.style.display = "none";
		selectionButtons.style.display = "block";
		courseGrades.style.display = "block";
	}, 200);
}

function viewCourseStudents(courseNumber) {
	lastCourseNumber = courseNumber;
	let courseListRow = document.getElementById("courseList");
	let backButton = document.getElementById("backButton");
	let studentList = document.getElementById("studentList");

	FilterStudentList();
	setTimeout(function(){ 
		courseListRow.style.display = "none";
		backButton.style.display = "block";
		studentList.style.display = "block";
	}, 200);

}

function studentListContent(token) {
	if (token === []) {
		return <>
		<h5>This course has no students!</h5>
		</>
	}

	let res;
	for (const student in token) {
		res = <>
			{res}
			<Col xs={12} sm={6} xl={2} className="mb-4" id={token[student]}>
			<div className="shadow-soft rounded border-light p-2 w-75 fmxw-500">
			<Button variant="secondary" size="xs" className="text-dark" style={{color:'white'}} onClick={viewCourseGrades.bind(this, token[student])}><h5>{token[student]}</h5></Button>
			</div>
			</Col>
		</>
	}
	return res;
}

async function getStudentList() {
	try {
		let courseStudents = await POST({}, 'studentList');
		return JSON.parse(courseStudents.result).students;
	}
	catch (error) {
		console.log(error);
		return [];
	}
}

const ViewStudents = () => {
	const [token, setToken] = useState([]);
	useEffect(() => {
		async function getToken() {
			const token = await getStudentList();
			setToken(token);
		}
		getToken();
	}, []);
	
	if (token !== undefined) {
		allStudentList.push(...token);
		allStudentList = [...new Set(allStudentList)];
	}

	return <>
		{studentListContent(token)}
	</>
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
			<Button variant="secondary" size="xs" className="text-dark" style={{color:'white'}} onClick={viewCourseStudents.bind(this, courseList[course])}><h5>Course #{courseList[course]}</h5></Button>
			</div>
			</Col>
		</>
	}
	return res;
}

async function addGrade(grd, typ) {
	let usn = lastStudent;
	let crs = lastCourseNumber;

	// Send to Database (Courses Collection)
	try {
		await POST({username: usn, course: crs, type: typ, grade: grd}, 'addGrade');
	}
	catch (error) {
		console.log(error);
	}
	// Add Row Dynamically to Table
	let tbl = document.getElementById('view-grades-table');
	let rows = tbl.rows.length;
	let row = tbl.insertRow(rows);
	let cell1 = row.insertCell(0);
	let cell2 = row.insertCell(1);
	let cell3 = row.insertCell(2);
	let cell4 = row.insertCell(3);
	row.insertCell(4);
	row.insertCell(5);
	cell1.innerHTML = '<span class="text-primary fw-bold">'+rows+'</span>';
	cell2.innerHTML = '<span class="text-primary fw-bold">'+crs+'</span>';
	cell3.innerHTML = '<span>'+typ+'</span>';
	cell4.innerHTML = '<input class="userInput mb-4 w-50 text-center" value="' + grd +'"/>';
}

function sendGrade() {
	let g = document.getElementById('newGrade');
	let t = document.getElementById('type');
	let grade = g.value;
	let type = t.value;
	
	// Call Add Function
	addGrade(grade, type);

	// Reset to Default
	g.value = '';
	t.value = 'Homework';
}

function addGradeToggle() {
	let gt = document.getElementById('addGradeToggle');
	
	if (gt.style.display === 'none') {
		gt.style.display = 'block';
	}
	else {
		gt.style.display = 'none';
	}
}

function maxLengthCheck()
{
	let object = document.getElementById('newGrade');
	if (object.value.length > object.maxLength)
	  object.value = object.value.slice(0, object.maxLength)
	if (object.value > 100)
	  object.value = 100
	if (object.value < 0)
		  object.value = 0
}
  
function content() {
	if (status === statuses[2]) {
		return <>
		<h4>Edit Grades Panel</h4>
		{/* Back Button to Course List */}
		<div id="backButton" className="shadow-soft rounded border-light p-2 w-75 fmxw-500" style={{display:'none'}}>
			<Button variant="secondary" size="xs" className="text-dark" style={{color:'white'}} onClick={revertSelection.bind(this)}><h5>Back to Course List</h5></Button>
		</div>
		{/* Selection Buttons inside of Grades Table View */}
		<div id="selectionButtons" className="shadow-soft rounded border-light p-2 w-75 fmxw-500" style={{display:'none'}}>
			<Row className="justify-content-md-center">
				<Col xs={12} sm={6} xl={6} className="mb-4">
			<Button variant="secondary" size="xs" className="text-dark" style={{color:'white'}} onClick={toogleSelection.bind(this, 0)}><h6>All</h6></Button>
			<Button variant="secondary" size="xs" className="text-dark" style={{color:'white'}} onClick={toogleSelection.bind(this, 1)}><h6>Homework</h6></Button>
			<Button variant="secondary" size="xs" className="text-dark" style={{color:'white'}} onClick={toogleSelection.bind(this, 2)}><h6>Labs</h6></Button>
				</Col>
				<Col xs={12} sm={6} xl={6} className="mb-4">
			<Button variant="secondary" size="xs" className="text-dark" style={{color:'white'}} onClick={addGradeToggle.bind(this)}><h6>Add New Grade</h6></Button>
				</Col>
			</Row>
			<div id="addGradeToggle" style={{display:'none'}}>
				<br/>
			<Row className="justify-content-md-center">
				<Col xs={12} sm={6} xl={6} className="mb-4">
					<input type="number" maxLength="3" onInput={maxLengthCheck.bind(this)} id={'newGrade'} className="userInput text-center" style={{height:"35px", width:"120px"}} placeholder='0 - 100'/>
				</Col>
				<Col xs={12} sm={6} xl={6} className="mb-4">
					<select name="type" id="type" style={{height:"35px", width:"120px"}}>
						<option value="Homework">Homework</option>
						<option value="Lab">Lab</option>
					</select>
				</Col>
			</Row>
			<Row className="justify-content-md-center">
				<Col xs={12} sm={6} xl={6} className="mb-4">
					<Button variant="secondary" size="xs" className="text-dark" style={{color:'white'}} onClick={sendGrade.bind(this)}><h6>Send</h6></Button>
				</Col>
			</Row>
			</div>
		</div>
		{/* Assigned Course List */}
		<div id="courseList">
		<Row className="justify-content-md-center">
			{viewCourses()}
		</Row>
		</div>
		{/* Assigned Students by Course */}
		<div id="studentList" style={{display:'none'}}>
		<Row className="justify-content-md-center">
			{ViewStudents()}
		</Row>
		</div>
		<div id="courseGrades" style={{display:'none'}}>
			{ViewGradesTable(lastStudent, 'edit-grades')}
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