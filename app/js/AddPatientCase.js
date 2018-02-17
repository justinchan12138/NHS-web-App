//function handleChange is from https://facebook.github.io/react/docs/forms.html

import React from 'react';
import {
    ButtonToolbar,
    Button,
    Jumbotron,
    Grid,
    Col,
    Row,
    FieldGroup,
    FormGroup,
    Checkbox,
    Radio,
    FormControl,
    ControlLabel,
    Media
} from 'react-bootstrap';
import ReactDOM from 'react-dom';
import {
    LinkContainer
} from 'react-router-bootstrap'
import PubSub from 'pubsub-js'
import cookie from 'react-cookie';
import request from 'superagent';
import { Router,
         hashHistory } from 'react-router'

class CaseForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            description: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.AddCase = this.AddCase.bind(this);
    }
    //update the field that was changed
    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.id;

        this.setState({
            [name]: value
        });
    }
    handleSubmit(event) {
        this.AddCase();
        event.preventDefault();
    }
    //Make a post request to the server with the details of the new patient case info
    AddCase() {
        let owner = cookie.load("loginName");
        let webToken = cookie.load("userId");
        request
            .post('http://51.140.51.232:8080/api/case')
            .send({
                caseName: this.state.name,
                caseDescription: this.state.description,
                caseOwner:this.state.owner
            })
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + webToken)
            .end(function(err, res) {
                // Calling the end function will send the request
                console.log(err, res);
                if (res.statusCode == 200) {
                    alert("Success");
                    hashHistory.push('/user')
                }
            });
    }
    render() {
        return ( <Jumbotron id = "loginPage" >
            <form onSubmit = {this.handleSubmit} >
              <FormGroup controlId = "name" >
                  <p>Patient Name<FormControl type = "text"
                  value = {
                      this.state.name
                  }
                  placeholder = "Enter text"
                  onChange = {
                      this.handleChange
                  }
                  />
                  </p>
                </FormGroup>
                <FormGroup controlId="description">
                  <p>Description
                  <FormControl componentClass="textarea" placeholder="textarea"
                  value = {
                      this.state.description
                  }
                  onChange = {
                      this.handleChange
                  }/>
                  </p>
                </FormGroup>
                <Button type = "submit" >
                Add Case
                </Button>
              </form>
            </Jumbotron>
        );
    }
};


class AddPatientCase extends React.Component {

    render() {
        return ( <div>
            <h1>Add new Patient case</h1>
            <CaseForm / >
            </div>
        )
    }

};

export default AddPatientCase;
