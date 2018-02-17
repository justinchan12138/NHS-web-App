import React from 'react';
import {ButtonToolbar, Button,Jumbotron,
        Grid, Col,Row,
        Media,ButtonGroup,Table} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap'
import PubSub from 'pubsub-js'
//A representation of a user in the system
class UserRecord extends React.Component {

	render () {
		return (
      <tr>
        <td>{this.props.pCase.email}</td>
        <td>{this.props.pCase.fullName}</td>
        <td>
          <Button onClick={() => {this.requestRemoval()}}>remove
          </Button>
        </td>
      </tr>
		)
	}
  requestRemoval(){
    PubSub.publish("deleteUser",{name:this.props.pCase.email});
  }
}

export default UserRecord;
