//function handleChange is from https://facebook.github.io/react/docs/forms.html
import React from 'react';
import {ButtonToolbar, Button,Jumbotron,
        Grid, Col,Row,
        FieldGroup,FormGroup,Checkbox,
        Radio,FormControl,ControlLabel,
        Media} from 'react-bootstrap';
import ReactDOM from 'react-dom';
import { LinkContainer } from 'react-router-bootstrap'
import PubSub from 'pubsub-js'
import cookie from 'react-cookie'


let userName = "";

class NameForm extends React.Component {
  constructor(props) {
    super(props);
    userName = cookie.load("userName");
    this.state = {value: userName,
                  old: '',
                  new: '',
                  repeat:''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }

  handleChange(event) {
    const target = event.target;
     const value = target.type === 'checkbox' ? target.checked : target.value;
     const name = target.id;

     this.setState({
      [name]: value
    });
}
  handleSubmit(event) {
    if(this.state.value == userName){
      alert("The new name is the same as your current one");
    }else{
    PubSub.publish('ChangeName', { name : this.state.value} );
    }
        event.preventDefault();
  }
  //check if new password is valid
  handlePasswordChange(event){
    if(this.state.new != '' || this.state.old != ''){
      let password = cookie.load("pWord")
      if(password==this.state.old){
        if(this.state.old==this.state.new){
          alert("Old and new Passwords are the same");
        }
        if(this.state.new.length<8){
          alert("The new password is too short, minmum 8 characters")
        }
        if(this.state.new == this.state.repeat){
          PubSub.publish('changePassword', { password : this.state.new} );
        }else{
          alert("Passwords do not match");
        }
      }
    }else{
      alert("Enter old and new password");
    }
    event.preventDefault();
  }

  render() {
    return (
    <Jumbotron id="loginPage">
      <form  onSubmit={this.handleSubmit}>
      <FormGroup
         controlId="value">
      <p>New Name<FormControl
        type="text"
        value={this.state.value}
        placeholder="Enter New Name"
        onChange={this.handleChange}/>
      </p>
      </FormGroup>
       <Button id="log_in_button" type="submit">
          Change Name
       </Button>
      </form>
      <form onSubmit={this.handlePasswordChange}>
      <FormGroup
         controlId="old">
      <p>Old Password<FormControl
        type="password"
        value={this.state.old}
        placeholder="Enter New Name"
        onChange={this.handleChange}/>
      </p>
      </FormGroup>
      <FormGroup
         controlId="new">
      <p>New Password<FormControl
        type="password"
        value={this.state.new}
        placeholder="Enter New Password"
        onChange={this.handleChange}/>
      </p>
      </FormGroup>
      <FormGroup
         controlId="repeat">
      <p>Repeat<FormControl
        type="password"
        value={this.state.repeat}
        placeholder="Enter New Password"
        onChange={this.handleChange}/>
      </p>
      </FormGroup>
      <Button id="log_in_button" type="submit">
         Change password
      </Button>
      </form>
      </Jumbotron>
    );
  }
};





class UserSettingsPage extends React.Component {
    render() {
        return (
            <div>
              <h1>Change information</h1>

              <NameForm />

            </div>
        )
    }
};
export default UserSettingsPage;
