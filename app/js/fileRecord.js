import React from 'react';
import {ButtonToolbar, Button,Jumbotron,
        Grid, Col,Row,
        Media,ButtonGroup,Table} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap'
import PubSub from 'pubsub-js'

//A representation of a file in the system
class FileRecord extends React.Component {
	render () {
		return (

      <tr>
        <td>{this.props.file.id}</td>
        <td>{this.props.file.name}</td>
        <td>
          <Button onClick={()=>{this.requestRemoval()}}>Remove
          </Button>
        </td>
      </tr>



		)
	}
  //Request the patient case view to remove this file, the file cannot remove itself
  requestRemoval(){
    PubSub.publish("delete",{type:this.props.file.sName,fileId:this.props.file.id});
  }
}

export default FileRecord;
