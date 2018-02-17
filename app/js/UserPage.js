import React from 'react';
import {ButtonToolbar, Button,Jumbotron,
        Grid, Col,Row,
        Media,ButtonGroup,Navbar,
        Nav,NavItem,NavDropdown,
        MenuItem} from 'react-bootstrap';
import ReactDOM from 'react-dom';
import CaseList from './CaseList.js'
import { LinkContainer } from 'react-router-bootstrap'

//The User's Homepage, they can view patient cases from here.
class UserPage extends React.Component {

    render() {
        return (
            <div>
              <h1>Patient Cases</h1>
              <div style={{textAlign: "right"}}>
                 <ButtonGroup style ={{display: "inlineBlock"}}>
                 <LinkContainer to="/manage">
                  <Button bsStyle="primary">Manage Users
                    </Button>
                  </LinkContainer>
                 </ButtonGroup>
              </div>
              <CaseList/>
            </div>

        )
    }

};

export default UserPage;
