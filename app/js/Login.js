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

class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: '',
                  password: ''};

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
  handleSubmit(event) {
    //send a request to the main app to send a login request to the server
    PubSub.publish('Log-in', { name : this.state.value ,password : this.state.password} );
    event.preventDefault();
  }

  render() {
    return (
    <Jumbotron id="loginPage">
      <form onSubmit={this.handleSubmit}>
        <FormGroup
           controlId="value">
          <p> UserName<FormControl
            type="text"
            value={this.state.value}
            placeholder="Enter text"
            onChange={this.handleChange}
                />
          </p>
        </FormGroup>

        <FormGroup
              controlId="password">
            <p>Password<FormControl
              type="password"
              value={this.state.password}
              placeholder="Enter text"
              onChange={this.handleChange}
            /></p>
        </FormGroup>

         <Button type="submit">
            Log in
         </Button>
      </form>
    </Jumbotron>
    );
  }
};
class Login extends React.Component {
    render() {
        return (
            <div id="log_in_button">
              <h1>Login</h1>
              <NameForm />
            </div>
        )
    }
};

export default Login;
