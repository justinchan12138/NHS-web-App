// ./src/index.jsx
import React, { Component } from 'react';
import { render } from 'react-dom';
import request from 'superagent';

// Import routing components
import {ButtonToolbar, Button,Jumbotron,
        Grid, Col,Row,
        Media,ButtonGroup,Navbar,
        Nav,NavItem,NavDropdown,
        MenuItem} from 'react-bootstrap';
import PubSub from 'pubsub-js'
import Home from './Home.js'
import Login from './Login.js'
import SignUp from './SignUp.js'
import UserPage from './UserPage.js'
import ModelViewer from './modelViewer.js'
import AddPatientCase from './AddPatientCase'
import { Router, Route, Link, IndexRoute,
         hashHistory, browserHistory } from 'react-router'
import Documentation from './documentation.js'
import { LinkContainer } from 'react-router-bootstrap'
import PatientCaseView from './patientCaseView.js'
import UserSettingsPage from './ChangeSettings.js'
import ManageUsers from './ManageUsers.js'
import FAQ from './FAQ.js'
import cookie from 'react-cookie';


let userName = "";
let log = false;
let webToken = "";
let loginName = "";
let password = "";


function loggedIn() {
  return log;
}
//Checks if the token stored is still valid
function checkLogIn(){
    try{
    webToken = cookie.load("userId");
    loginName = cookie.load("loginName");
    password = cookie.load("pWord")
    var jwtDecode = require('jwt-decode');
    var decoded = jwtDecode(webToken);
    let url = 'http://51.140.51.232:8080/api/user/'+loginName
    request
    .get(url)
    .set('Authorization', 'Bearer ' + webToken)
    .end(function(err, res){
        console.log(res);
        if(res.statusCode==200){
            userName = cookie.load("userName")
            PubSub.publish('updateName', { name : 'someone else' } );
            hashHistory.push('/user')
            log = true;
        }
    }
  )
}catch (e) {
   // statements to handle any exceptions
   console.log(e); // pass exception object to error handler
}
}

//The main React container for the entire app
//Everything is contained in this class using react-router
//TODO decentralize the REST api requests
class App extends React.Component{
  constructor(){
      super();
      checkLogIn();
      //Continuously request a new login token every 30 seconds
      window.setInterval(()=>{
          if(loggedIn()){
            this.regenerateToken();
          }
      }, 3000)


  }



  componentDidMount() {
      checkLogIn();
      this.token = PubSub.subscribe('Log-in', this.logIn)
      this.token = PubSub.subscribe('ChangeName', this.changeName)
      this.token = PubSub.subscribe('changePassword', this.changePassword)
      this.token = PubSub.subscribe('addUser', this.addUser)
      this.token = PubSub.subscribe('getUsers', this.getUsers)
      this.token = PubSub.subscribe('Log-out', this.logOut)
      this.token = PubSub.subscribe('getCases', this.getCases)
      this.token = PubSub.subscribe('getDirectory', this.getDirectory)
  }
  componentWillUnmount() {
      PubSub.unsubscribe(this.token)
  }
  regenerateToken(){
  let name = loginName
  let pass = password
  request
  .post('http://51.140.51.232:8080/api/user/login')
  .send({ username: name, password: pass })
  .set('Content-Type', 'application/x-www-form-urlencoded')
  .set('Accept', 'text/plain')
  .end(function(err, res){
    // Calling the end function will send the request
    if(res.statusCode == 200){
        webToken = res.text;
        cookie.save('userId', webToken, { path: '/' });
    }

  });
  }

  logOut(msg, data){
    log = false;
    userName = "";
    cookie.remove("userId");
    PubSub.publish('updateName', { name : '' } );
    hashHistory.push('/')
  }


  loadModel(){
    request
    .get('http://51.140.51.232:8080/api/user/'+data.name)
    .set('Authorization', 'Bearer ' + webToken)
    .end(function(err, res){
        console.log(res.body.fullName);
        userName = res.body.fullName;
        PubSub.publish('updateName', { name : '' } );
        hashHistory.push('/user')
    }
  )
  }
  getDicomImages(msg,data){
    let url = 'http://51.140.51.232:8080/api/case/'+data.id+'/dicom'
    request
    .get(url)
    .set('Authorization', 'Bearer ' + webToken)
    .end(function(err, res){
        let converted = JSON.parse(res.text);
        console.log(converted);
        PubSub.publish('returnDICOMimages', { sources : converted.dicomList } );
    }
  )

  }
  //Loads Files from the given directory
  //TODO: connect to the Client's REST system
  getDirectory(msg,data){
    var url = "http://localhost/other/list"+data.name+".php"
    var url2 = 'http://51.140.51.232:8080/api/case/'+data.id+"/"+data.name
    var req = request.get(url2);
    req.set('Content-Type', 'application/x-www-form-urlencoded')
    req.set('Authorization', 'Bearer ' + webToken)
    req.set('Accept', 'application/json')
    req.end(function(err, res){
        console.log(err, res);
        console.log(res.text);
        try{
        let converted = JSON.parse(res.text);
        console.log(converted);
        PubSub.publish('returnDirectory', { name: data.name ,list:converted} );
      }catch(e){

      }

    })
  }
  changeName(msg,data){
      let url = 'http://51.140.51.232:8080/api/user'
      request
      .patch(url)
      .set('Authorization', 'Bearer ' + webToken)
      .set('Content-Type','application/json')
      .send({
              "fullName": data.name,
            })
      .end(function(err, res){
          console.log(err);
          userName = data.name
          cookie.save('userName', userName, { path: '/' });
          PubSub.publish('updateName', { name : '' } );
          hashHistory.push('/user')
      }
    );

  }

  changePassword(msg,data){
      let url = 'http://51.140.51.232:8080/api/user'
      request
      .patch(url)
      .set('Authorization', 'Bearer ' + webToken)
      .set('Content-Type','application/json')
      .send({
              "password": data.password,
            })
      .end(function(err, res){
          console.log(err);
          cookie.save('pWord', data.password, { path: '/' });
          hashHistory.push('/user')
      }
    );

  }

  getCases(msg, data){

      request
      .get('http://51.140.51.232:8080/api/case')
      .set('Authorization', 'Bearer '+webToken)
      .end(function(err, res){
          console.log(res.text);
          var converted = JSON.parse(res.text);
          PubSub.publish('returnCases', { sources:converted.caseList} );
      })

  }
  getUsers(msg, data){
        request
        .get('http://51.140.51.232:8080/api/user')
        .set('Authorization', 'Bearer '+webToken)
        .end(function(err, res){
            var converted = JSON.parse(res.text);
            PubSub.publish('returnUsers', { users:converted.userList} );
        })

    }
  addUser(msg,data){
    console.log(data)
    let url = 'http://51.140.51.232:8080/api/user'
    request
    .post(url)
    .set('Authorization', 'Bearer ' + webToken)
    .set('Content-Type','application/json')
    .send({
            "userEmail": data.useremail,
            "password":  data.userpassword,
            "fullName":  data.fullName,
            "organisationName": data.orgName,
            "organisationRole": data.orgRole,
            "accessLevel": data.useraccess
          })
    .end(function(err, res){
        console.log(err);
        if(res.statusCode==200){
        alert("User "+data.fullName+" has been created")
        hashHistory.push('/user')
      }else{
        alert("Something went wrong:"+res.text);
      }
    }
  );
  }

  //Creates the login HTTP request
  logIn(msg, data){
    request
  .post('http://51.140.51.232:8080/api/user/login')
  .send({ username: data.name, password: data.password })
  .set('Content-Type', 'application/x-www-form-urlencoded')
  .set('Accept', 'text/plain')
  .end(function(err, res){
    // Calling the end function will send the request
    console.log(err,res);
    if(res.statusCode == 200){
      loginName = data.name;
      password = data.password;
      webToken = res.text;
      console.log(webToken);
      log = true;
      cookie.save('userId', webToken, { path: '/' });
      cookie.save('pWord', password, { path: '/' });
      cookie.save('loginName', loginName, { path: '/' });
      request
      .get('http://51.140.51.232:8080/api/user/'+data.name)
      .set('Authorization', 'Bearer ' + webToken)
      .end(function(err, res){
          console.log(res.body.fullName);
          userName = res.body.fullName;
          cookie.save('userName', userName, { path: '/' });
          PubSub.publish('updateName', { name : 'someone else' } );
          hashHistory.push('/user')
      }
    )
    }
    else{
        alert("Invalid login");
    }
  });


  }

  //React Router is used to create the multipage app
    render() {
      return(
      <div>
        <TopNav/>
        <Router history={hashHistory}>
             <Route path='/' component={Home} onEnter={isLoggedIn}/>
             <Route path='/add' component={AddPatientCase} onEnter={requireAuth}/>
             <Route path='/signUp' component={SignUp} onEnter={isAdmin}/>
             <Route path='/signIn' component={Login} onEnter={isLoggedIn}/>
             <Route path='/user' component={UserPage} onEnter={requireAuth}/>
             <Route path='/manage' component={ManageUsers} onEnter={isAdmin}/>
             <Route path='/user/settings' component={UserSettingsPage} onEnter={requireAuth}/>
             <Route path='/doc' component={Documentation}/>
             <Route path='/FAQ' component={FAQ}/>
             <Route path='/model/:case/:id' component={ModelViewer}/>
             <Route path='/case/:patient' component={PatientCaseView}
                                  onEnter={requireAuth}
                                  />
        </Router>
      </div>
    )};


}

//The navbar component.
class TopNav extends React.Component {
  constructor(props) {
    super(props);
  this.state = {userName: ""};
  this.getLogedInName = this.getLogedInName.bind(this);
}


  componentDidMount() {
      this.token = PubSub.subscribe('updateName', this.getLogedInName);
  }
  componentWillUnmount() {
      PubSub.unsubscribe(this.token)
  }

  getLogedInName(){
    this.setState(
     {userName : "Hello"}
   );
     console.log(this.state.userName);
  }
  setName(){
    if(userName != ""){
       userName = userName;
    }else{
      userName = "Login"
    }
  }


  render() {
    console.log("Re-Render");
      return (
              <Navbar inverse collapseOnSelect staticTop>
  <Navbar.Header>


  </Navbar.Header>
  <Nav pullLeft>
    <NavItem eventKey={1} onClick = {() =>hashHistory.push('/')}>Home</NavItem>
    <NavItem eventKey={2} onClick = {() =>hashHistory.push('/doc')}>Documentation</NavItem>
    <NavItem eventKey={3} onClick = {() =>hashHistory.push('/FAQ')}>FAQ</NavItem>
    <NavItem eventKey={4} onClick = {() =>hashHistory.push('/')}>Contact</NavItem>
  </Nav>
   <Nav pullRight>
     <NavItem eventKey={2} onClick = {() =>hashHistory.push('/user/settings')}>{userName}</NavItem>
     {loggedIn() ?
       <NavItem eventKey={2} onClick = {() =>PubSub.publish('Log-out', {} )}>{"Log Out"}</NavItem>:
       <NavItem eventKey={2} onClick = {() =>hashHistory.push('/signIn')}>{"Log In"}</NavItem>}
    </Nav>



  </Navbar>
)
};
}




function requireAuth(nextState, replace) {
  if (!loggedIn()) {
    replace({
      pathname: '/signIn'
    })
  }
}

function isLoggedIn(nextState, replace){
  if (loggedIn()) {
    replace({
      pathname: '/user'
    })
  }
}
function isAdmin(nextState, replace){
    var jwtDecode = require('jwt-decode');
    let decoded = jwtDecode(webToken);
    let access = decoded.scopes.access;
    if(!(access == "ADMIN")){
      alert("You must be an admin to access this screen")
      if(loggedIn()){
      replace({
        pathname: '/user'
      })
    }else{
      replace({
        pathname: '/'
      })
    }
    }
}

render(
  <App/>,
    document.getElementById('app')
);
