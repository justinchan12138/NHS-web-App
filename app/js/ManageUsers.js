import React from 'react';
import {ButtonToolbar, Button,Jumbotron,
        Grid, Col,Row,
        Media,ButtonGroup,Navbar,
        Nav,NavItem,NavDropdown,
        MenuItem} from 'react-bootstrap';
import ReactDOM from 'react-dom';
import UserList from './UserList.js'
import { LinkContainer } from 'react-router-bootstrap'

//The user management page, only ADMINISTRATORS can access this page
class ManageUsers extends React.Component {

    render() {
        return (
            <div>
              <h1>Users</h1>
              <UserList/>
            </div>

        )
    }

};

export default ManageUsers;
