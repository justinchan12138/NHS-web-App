import React from 'react';
import {ButtonToolbar, Button,Jumbotron,
        Grid, Col,Row,
        Media,ButtonGroup} from 'react-bootstrap';
import ReactDOM from 'react-dom';
import { LinkContainer } from 'react-router-bootstrap'


//This is the home page for the web app
class Home extends React.Component {

    render() {
        return (
            <div id= "homeIntro" style={{padding: 10}}>
              <Jumbotron>
              <div id="home_picture">
              <img width={1200} height={670} src={'./images/Hololens.jpg'}/>
              <div id= "big_paragraph">
                <div id="small_paragraph1">
                  <h2 id="small_heading"> What is this site for? </h2>
                  This is a website for you to upload your CT scan images for your doctor. Only you and your doctor have access to the images that you upload. Your doctor will also be able to look at those images from their HoloLens, which enables them to analyse your MRI scan images in 3D. </div>
                     <img id="float_right" width={600} height={400} src={'./images/Screen-Shot-2012-01-06-at-2.20.02-PM.png'} />
                </div>
              <div id= "big_paragraph">
                <img id="float_left" width={600} height={400} src={'./images/traitement-medical-.jpg'} />
                  <div id="small_paragraph2">
                    <h2 id="small_heading"> About us </h2>
                    <p> We provide medical service to our cleints. </p>
                  </div>
                </div>
                    <div id= "big_paragraph">
                    <p id="contact">
                    <h2> Contact us </h2>
                    <p> Telephone: +49 ..... </p>
                    <p> Email: xxxxx@gmail.com </p>
                    <p> Fax: xxxxxxxxxxx (xx) </p>
                    </p>
                    </div>
                </div>
              </Jumbotron>
            </div>
        )
    }

};

export default Home;
