
import React, {useState, useEffect} from "react";
import { Card, Table, Button } from '@themesberg/react-bootstrap';
import { POST } from "../utilities/Requests";

let lastUsername = '';
let loc = '';
async function getCourseGrades() {
	try {
		let courseGrades = await POST({ username: lastUsername}, 'viewGrades');
		var obj = JSON.parse(courseGrades);
		var res = [];
			
		for(var i in obj)
			res.push(obj[i]);
		return res;
	}
	catch (error) {
		console.log(error);
		return [];
	}
}

async function updateRow(_id) {
	let grd = document.getElementById('vg-'+_id+'-g');
	let org_grd = grd.getAttribute('name').toString();
	let crs = document.getElementById('vg-'+_id+'-c').innerText;
	let typ = document.getElementById('vg-'+_id+'-t').innerText;
	grd = (grd.value !== '') ? grd.value : grd.placeholder;
	// Send to Database (Courses Collection)
	try {
		await POST({username: lastUsername, course: crs, type: typ, grade: grd, org_grade: org_grd}, 'updateGrade');
	}
	catch (error) {
		console.log(error);
	}
	return 0;
}

async function removeRow(_id) {
	let grd = document.getElementById('vg-'+_id+'-g');
	let crs = document.getElementById('vg-'+_id+'-c').innerText;
	let typ = document.getElementById('vg-'+_id+'-t').innerText;
	grd = (grd.value !== '') ? grd.value : grd.placeholder;
	// Send to Database (Courses Collection)
	try {
		await POST({username: lastUsername, course: crs, type: typ, grade: grd}, 'removeGrade');
	}
	catch (error) {
		console.log(error);
	}

	let tdrow = document.getElementById('vg-' + _id);
	tdrow.style.display = "none";
	return 0;
}

function getHeaders() {
	if (loc === 'view-grades') {
		return <></>
	}
	else if (loc === 'edit-grades') {
		return <>
			<th className="border-0">Update</th>
			<th className="border-0">Remove</th>
		</>
	}
	return <></>
}


function maxLengthCheck(id)
{
	let object = document.getElementById(id);
	if (object.value.length > object.maxLength)
	  object.value = object.value.slice(0, object.maxLength)
	if (object.value > 100)
	  object.value = 100
	if (object.value < 0)
		  object.value = 0
}

function getContent(id, grade) {
	if (loc === 'view-grades') {
		return <>
			<td>{grade}</td>
		</>
	}
	else if (loc === 'edit-grades') {
		return <>
		  <td><input type="number" maxLength="3" onInput={maxLengthCheck.bind(this, 'vg-'+id+'-g')} id={'vg-'+id+'-g'} name={grade} className="userInput mb-4 w-50 text-center" placeholder={grade}/></td>
		  {/* change to textbox with only 0-100 numerical value */}
		  <td onClick={updateRow.bind(this, id)}><Button variant="primary" size="xs" style={{color:'white'}}n>Update</Button></td>
		  <td onClick={removeRow.bind(this, id)}><Button variant="primary" size="xs" style={{color:'white'}}>Remove</Button></td>
		</>
	}
	return <></>
}

export const ViewGradesTable = ({ usn, location }) => {
	const [token, setToken] = useState([]);
	lastUsername = usn;
	loc = location;	

	useEffect(() => {
		async function getToken() {
			const token = await getCourseGrades();
			setToken(token);
		}
		getToken();
	}, []);
	const TableRow = (props) => {
	  const { id, course, type, grade } = props;
	  return <>
		<tr id={'vg-'+id}>
		  <td className="text-primary fw-bold">{id}</td>
		  <td id={'vg-'+id+'-c'} className="text-primary fw-bold">{course}</td>
		  <td id={'vg-'+id+'-t'}>{type}</td>
		  {getContent(id, grade)}
		</tr>
	  </>
	};

	return <>
	  <Card border="light" className="shadow-sm mb-4">
		<Card.Body className="pb-0">
		  <Table id="view-grades-table" responsive className="table-centered table-nowrap rounded mb-0">
			<thead className="thead-light">
			  <tr>
				<th className="border-0">#</th>
				<th className="border-0">Course Number</th>
				<th className="border-0">Assignment Type</th>
				<th className="border-0">Grade</th>
				{getHeaders()}
			  </tr>
			</thead>
			<tbody>
			  {token.map(pt => <TableRow key={`view-grades-${pt.id}`} {...pt} />)}
			</tbody>
		  </Table>
		</Card.Body>
	  </Card>
	  </>;
};