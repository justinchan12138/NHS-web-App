import React from 'react';
import {ButtonToolbar, Button,Jumbotron,
        Grid, Col,Row,
        Media,ButtonGroup,Table} from 'react-bootstrap';
import ReactDOM from 'react-dom';
import UserRecord from './UserRecord.js'
import PubSub from 'pubsub-js'
import request from 'superagent'
import { LinkContainer } from 'react-router-bootstrap'
import cookie from 'react-cookie'


let users = [];


class UserList extends React.Component {
  constructor(props) {
		super(props);
    this.state = {users:[]}
    this.setUsers = this.setUsers.bind(this);
    //Make a request to the main app class to get the users on the system
    // via publish subscribe
     PubSub.publish('getUsers', null);
}
componentDidMount() {
    //check if the main app is returning a list of users or if a user is to be deleted
    this.token = PubSub.subscribe('returnUsers', this.setUsers)
    this.token = PubSub.subscribe('deleteUser', this.deleteUser)

}
componentWillUnmount() {
    PubSub.unsubscribe(this.token)
}
deleteUser(msg,data){
  let webToken = cookie.load("userId");
  request
  .delete('http://51.140.51.232:8080/api/user/'+data.name)
  .set('Authorization', 'Bearer ' + webToken)
  .end((err, res)=>{
      if(res.statusCode==200){
        alert("Succes")
        PubSub.publish('getUsers', {} );
      }else{
        alert(res.text)
      }
  }
)
}

setUsers(msg,data){
  users = data.users;
  let loginName = cookie.load("loginName");
  for (var i = 0; i <users.length; i++) {
    //check if the user yourself, if so then remove it from the list
    if(users[i].email == loginName){
        users.splice(i, 1)
    }
  }
  this.setState({users:[]});
}
    render() {
        return (
          <div style={{padding: 100}}>
          <div class="text-center">
            <Table striped bordered condensed>
             <thead>
               <tr>
                 <th>User email</th>
                 <th class="col-lg-1">Patient Case Name</th>
                 <th class="col-lg-1"></th>
               </tr>
             </thead>
             <tbody>
             {users.map(function(user) {
                          return <UserRecord pCase={user}/>
                    })}
             </tbody>
           </Table>
          <LinkContainer to={"/signUp"}>
           <Button>
           Add User
          </Button>
          </LinkContainer>
          </div>
          </div>
        );
    }

};

export default UserList;
