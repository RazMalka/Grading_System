import React from "react";
import { Col, Row } from '@themesberg/react-bootstrap';
import { Image } from '@themesberg/react-bootstrap';

import Dima_Pic from "../assets/img/Dima_Pic.png";
import Raz_Pic from "../assets/img/Raz_Pic.png";

function aboutMessage() {
	return <>
	<h4>About Us</h4>
	<Row className="justify-content-center">
                      <Col xs={12} sm={6} xl={4} className="mb-4">
					  <div className="bg-white shadow-soft border rounded border-light p-4 w-100 fmxw-500">
                          <h5>Dima Yevstigneyev</h5>
						  <Image src={Dima_Pic} className="md-avatar rounded-circle" />
						  <br/><br/>
						  <h6>Software Engineer at Intel<br/>B.Sc. - Braude College of Engineering</h6>
						  </div>
                      </Col>
                      <Col xs={12} sm={6} xl={4} className="mb-4">
					  <div className="bg-white shadow-soft border rounded border-light p-4 w-100 fmxw-500">
                          <h5>Raz Malka</h5>
						  <Image src={Raz_Pic} className="md-avatar rounded-circle" />
						  <br/><br/>
						  <h6>Software Engineer at IAF<br/>B.Sc. - Braude College of Engineering</h6>
					</div>
                      </Col>
                  </Row>
	</>
}

let Props = () => {
		return (
			<>
				<div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
				</div>

				<center><div className="flex-wrap flex-md-nowrap align-items-center py-4">
					{aboutMessage()}
				</div></center>
			</>
		);
	};

export default Props