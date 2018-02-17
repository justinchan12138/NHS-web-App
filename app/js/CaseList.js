import React from 'react';
import {ButtonToolbar, Button,Jumbotron,
        Grid, Col,Row,
        Media,ButtonGroup,Table} from 'react-bootstrap';
import ReactDOM from 'react-dom';
import PatientCase from './PatientCase.js'
import PubSub from 'pubsub-js'
import request from 'superagent'
import { LinkContainer } from 'react-router-bootstrap'


let sources = [];


class CaseList extends React.Component {
  constructor(props) {
		super(props);
    this.state = {sources:[]}
    this.setCases = this.setCases.bind(this);
     PubSub.publish('getCases', {} );
}
componentDidMount() {
    this.token = PubSub.subscribe('returnCases', this.setCases)
}
componentWillUnmount() {
    PubSub.unsubscribe(this.token)
}
setCases(msg,data){
  sources = data.sources;
  console.log(data.sources)
  this.setState({sources:[]});
}

    render() {
        return (
          <div style={{padding: 100}}>
          <div class="text-center">
                    <Table striped bordered condensed>
             <thead>
               <tr>
                 <th>#</th>
                 <th class="col-lg-1">Patient Case Name</th>
                 <th class="col-lg-1"></th>
               </tr>
             </thead>
             <tbody>
             {sources.map(function(sources) {
                          return <PatientCase pCase={sources}/>
                    })}
             </tbody>
           </Table>
          <LinkContainer to={"/add"}>
           <Button>
           Add Patient Case
          </Button>
          </LinkContainer>
          </div>
          </div>
        );
    }

};

export default CaseList;
