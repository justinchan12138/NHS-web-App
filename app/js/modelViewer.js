//function _onAnimate is from https://github.com/toxicFork/react-three-renderer
import React from 'react';
import {ButtonToolbar, Button,Jumbotron,
        Grid, Col,Row,
        Media,ButtonGroup,Table} from 'react-bootstrap';
import React3 from 'react-three-renderer';
import * as THREE from 'three';
import ModelView from './modelView.js'
import cookie from 'react-cookie';
import request from 'superagent';


let geom = null;

class ModelViewer extends React.Component {

  constructor() {
    super();
    this.cameraPosition = new THREE.Vector3(0, 0, 5);
    // construct the position vector here, because if we use 'new' within render,
    // React will think that things have changed when they have not.
    this.state = {
      cubeRotation: new THREE.Euler(),
      geometry: null
    };
    this._onAnimate = () => {
      // we will get this callback every frame
      // pretend cubeRotation is immutable.
      // this helps with updates and pure rendering.
      // React will be sure that the rotation has now updated.
      this.setState({
        cubeRotation: new THREE.Euler(
          this.state.cubeRotation.x + 0.00,
          this.state.cubeRotation.y + 0.01,
          0
        ),
      });
    };
    this.loadModelFromUrl = this.loadModelFromUrl.bind(this);
}

componentDidMount() {
  {this.loadModelFromUrl()}
}

//If the viewer is being unloaded, unload the model
componentWillUnmount() {
    geom = null;
}
//Makes a request to the server for an OBJ model and then uses the
//three-obj-loader to parse the raw data
//the resulting model is then passed to the webgl canvas
loadModelFromUrl(){
  var url2 = 'http://51.140.51.232:8080/api/case/'+this.props.params.case+'/model/'+this.props.params.id
  var req = request.get(url2);
  let webToken = cookie.load("userId");
  console.log(webToken, "Littered");
  req.set('Content-Type', 'application/x-www-form-urlencoded')
  req.set('Authorization', 'Bearer ' + webToken)
  req.end((err, res) =>{
      console.log(err, res);
      var OBJLoader = require('three-obj-loader');
      OBJLoader(THREE);
      var test = THREE.OBJLoader.prototype;
      geom = test.parse(res.text);
      console.log(geom);
      this.setState({ geometry:geom })
  })
}


//if the model is loaded, display it, otherwise keep trying to load it
	render () {

		return (
      <div>
      { geom ? <ModelView geometry = {geom}/>
                  : this.loadModelFromUrl()}

      </div>

		)
	}
}

export default ModelViewer;
