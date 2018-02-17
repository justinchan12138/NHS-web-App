import React from 'react';
import {ButtonToolbar, Button,Jumbotron,
        Grid, Col,Row,
        FieldGroup,FormGroup,Checkbox,
        Radio,FormControl,ControlLabel,
        Media,HelpBlock} from 'react-bootstrap';
import ReactDOM from 'react-dom';
import PubSub from 'pubsub-js'
import { LinkContainer,hashHistory } from 'react-router-bootstrap'


class SignUpForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {name: '',
                  password: '',
                  email: '',
                  organisationName:'',
                  role:'',
                  access:''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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

   getValidationState() {
   const length = this.state.password.length;
   console.log(length)
   if (length > 8){ console.log("yes")
                    return 'success';}
   else if (length > 0){ return 'error';}
   else{ return null};
 }
  handleSubmit(event) {
    PubSub.publish("addUser",{
                              useremail:this.state.email,
                              userpassword:this.state.password,
                              fullName:this.state.name,
                              orgName:this.state.organisationName,
                              orgRole:this.state.role,
                              useraccess:"USER"
                              })
    event.preventDefault();
  }

  render() {
    return (
    <Jumbotron id="jumbotron_signup">
      <form onSubmit={this.handleSubmit}>
        <FormGroup
           controlId="name">
            <p>Name<FormControl
            type="text"
            value={this.state.name}
            placeholder="Enter text"
            onChange={this.handleChange}/>
            </p>
        </FormGroup>
          <FormGroup
           controlId="email">
             <p>Email
               <FormControl
                 type="text"
                 value={this.state.rePassword}
                 placeholder="Enter text"
                 onChange={this.handleChange}/>
            </p>
          </FormGroup>
        <FormGroup
                validationState = {this.getValidationState()}
                controlId="password">
          <p>Password
            <FormControl
            type="password"
            value={this.state.password}
            placeholder="Enter text"
            onChange={this.handleChange}/>
            <FormControl.Feedback />
          </p>
          </FormGroup>
          <FormGroup
             controlId="organisationName">
            <p>Organisation Name<FormControl
            type="text"
            value={this.state.userName}
            placeholder="Enter text"
            onChange={this.handleChange}/>
            </p>
          </FormGroup>
          <FormGroup
             controlId="role">
            <p>Role<FormControl
            type="text"
            value={this.state.userName}
            placeholder="Enter text"
            onChange={this.handleChange}/>
            </p>
          </FormGroup>
          <Button id="create_account_button" type="submit">
            Create account
          </Button>
     </form>
    </Jumbotron>
    );
  }
};


class SignUp extends React.Component {

    render() {
        return (
            <div>
              <h1 >Create an Acconut</h1>
              <SignUpForm />
            </div>
        )
    }

};

export default SignUp;
