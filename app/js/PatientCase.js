import React from 'react';
import {ButtonToolbar, Button,Jumbotron,
        Grid, Col,Row,
        Media,ButtonGroup,Table} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap'

//A representation of a Patient in the system
class PatientCase extends React.Component {
	render () {
		return (
      <tr>
        <td>{this.props.pCase.id}</td>
        <td>{this.props.pCase.caseName}</td>
        <td>
          <LinkContainer to={"/case/"+this.props.pCase.id}>
          <Button>View
          </Button>
          </LinkContainer>
        </td>
      </tr>
		)
	}
}

export default PatientCase;
