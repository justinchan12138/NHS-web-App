//code within functions componentWillUnmount and componentDidMount is from: https://github.com/toxicFork/react-three-renderer/issues/57

import React from 'react';
import {ButtonToolbar, Button,Jumbotron,
        Grid, Col,Row,
        Media,ButtonGroup,Table} from 'react-bootstrap';
import React3 from 'react-three-renderer';
import * as THREE from 'three';
import Dat, { DatString, DatNumber, DatBoolean, DatButton } from 'react-dat-gui'


class ModelView extends React.Component{


  constructor(props) {

    super(props);

    this.cameraPosition = new THREE.Vector3(0, 0, 5);


    // construct the position vector here, because if we use 'new' within render,
    // React will think that things have changed when they have not.

    this.state = {
      cubeRotation: new THREE.Euler(),
      data: {
        x:0,
        y:0,
        z:0,
        scale:1
      }
    };
    console.log(this.props.geometry.children[0].geometry.attributes.position);

    this._onAnimate = () => {
      // we will get this callback every frame
      // pretend cubeRotation is immutable.
      // this helps with updates and pure rendering.
      // React will be sure that the rotation has now updated.
      this.setState({
        cubeRotation: new THREE.Euler(
          this.state.data.x * 0.01,
          this.state.data.y * 0.01 ,
          this.state.data.z * 0.01
        ),
      });
    };
     this.handleUpdate = this.handleUpdate.bind(this);
     this.handleClick = this.handleClick.bind(this);
}
componentDidMount() {

    this.refs.group.add(this.props.geometry);
}

componentWillUnmount() {

    this.refs.group.remove(this.props.geometry);
}
//When the user drags a slider, update the values of rotation
handleUpdate(data) {
     this.setState({ data });
}
//reset the rotation and scale
handleClick() {
     this.setState({ data:{
       x:0,
       y:0,
       z:0,
       scale:1
     } });
}
//The GUI that controls the model rotation
//TODO add support for drag and mouse wheel Zoom
  render () {
    return (
  <div>

      <div style = {{position: "absolute", top: 345}}>
        <Dat data={this.state.data} onUpdate={this.handleUpdate} autoPlace = {false}>
        <DatNumber label="X rotation" path="x" min={-360} max={360} step={0.1} />
        <DatNumber label="Y rotation" path="y" min={-360} max={360} step={0.1} />
        <DatNumber label="Z Rotation" path="z" min={-360} max={360} step={0.1} />
        <DatNumber label="Zoom" path="scale" min={1} max={5} step={0.1} />
       <DatButton label="Reset Rotation" onClick={this.handleClick} />
       </Dat>
      </div>

      <React3
      mainCamera="camera" // this points to the perspectiveCamera below
      width={window.innerWidth}
      height={window.innerHeight}
      onAnimate={this._onAnimate}
    >
    <resources>
                <texture
                    resourceId="robotImage"
                    url={ 'assets/Void3.png' }
                    anisotropy={ 16 }
                />
                <meshPhongMaterial
                    resourceId="robotTexture"
                    side={ THREE.DoubleSide }
                >
                    <textureResource
                        resourceId="robotImage"
                    />
                </meshPhongMaterial>
    </resources>

          <scene>
        <perspectiveCamera
          name="camera"
          fov={75}
          aspect={window.innerWidth / window.innerHeight}
          near={0.1}
          far={1000}
          position={this.cameraPosition}
        />
        <directionalLight
        lookAt={new THREE.Vector3(0,0,0)}
        position = {this.cameraPosition}
        />
        <ambientLight
                  color={ 0x444444 }
        />

        <group ref='group' //The model itself
                rotation = {this.state.cubeRotation}
                />
      </scene>

    </React3>
  </div>

    )
  }
  }



export default ModelView;
