import React from 'react';
import {ButtonToolbar, Button,Jumbotron,
        Grid, Col,Row,
        Media,ButtonGroup,Table} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap'

//A representation of an OBJ file in the system
class ModelFileRecord extends React.Component {
	render () {
		return (

      <tr>
        <td>{this.props.file.id}</td>
        <td>{this.props.file.fName}</td>
        <td>
          <LinkContainer to={"/model/"+this.props.case+"/"+this.props.file.id}>
          <Button>View
          </Button>
          </LinkContainer >
          <Button onClick={()=>{this.requestRemoval()}}>remove
          </Button>
        </td>
      </tr>



		)
	}
  //sends a request to the patientCase viewer to delete the patient case
  requestRemoval(){
    PubSub.publish("delete",{type:this.props.file.sName,fileId:this.props.file.id});
  }
}

export default ModelFileRecord;
