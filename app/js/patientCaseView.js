import React from 'react';
import {ButtonToolbar, Button,Jumbotron,
        Grid, Col,Row,
        Media,ButtonGroup,Table,
        Modal} from 'react-bootstrap';
import PubSub from 'pubsub-js'
import { LinkContainer } from 'react-router-bootstrap'
import Dropzone from 'react-dropzone';
import FileRecord from './fileRecord.js'
import ModelFileRecord from './ModelfileRecord.js'
import ModelViewer from './modelViewer.js'
import * as THREE from 'three';
import request from 'superagent';
import cookie from 'react-cookie';
import {hashHistory} from 'react-router'

var mock = require('superagent-mocker')(request)

let sources = [];
let pdf = [];
let mdl = [];



class PatientCaseView extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
			sources: [],
      files:[],
      name:"",
      description:"",
      uploadingDICOM:false,
      uploadingModel:false,
      uploadingFile:false,
      showDeleteModal:false,
	   }
     this.getCase = this.getCase.bind(this);
     this.getCase();
     this.returnDICOMimages = this.returnDICOMimages.bind(this);
     this.returnList = this.returnList.bind(this);
     this.onDrop = this.onDrop.bind(this);
     this.onDropModel = this.onDropModel.bind(this);
     this.onDropFile = this.onDropFile.bind(this);
     this.deleteFile = this.deleteFile.bind(this);
  }
  getCase(){
      //request the peach reality server for the information about the current patient case
      let url = 'http://51.140.51.232:8080/api/case/' + this.props.params.patient
      let req = request.get(url)
      let webToken = cookie.load("userId")
      req.set('Authorization', 'Bearer ' + webToken)
      req.end((err, res) => {
            let converted = JSON.parse(res.text)
            console.log(converted);

            this.setState({name:converted.caseName,
            description:converted.caseDescription})
      })
  }
  componentDidMount() {
    //Making use of the Publish subscribe design pattern to fetch the files.
      this.token = PubSub.subscribe('returnDirectory', this.returnList)
      this.token = PubSub.subscribe('delete', this.deleteFile)
      sources = [];
      pdf = [];
      mdl = [];
      this.getCase();
      PubSub.publish('getDirectory',{name:"model",id:this.props.params.patient});
      PubSub.publish('getDirectory',{name:"file",id:this.props.params.patient});
      PubSub.publish('getDirectory',{name:"dicom",id:this.props.params.patient});
  }
  componentWillUnmount() {
      PubSub.unsubscribe(this.token)
  }
  returnDICOMimages(msg,data){
    console.log(data.sources)
    sources = data.sources
    this.setState({sources : data.case});
  }
  deleteFile(msg,data){
      let url = "http://51.140.51.232:8080/api/case/"+this.props.params.patient+"/"+data.type+"/"+data.fileId
      let req = request.delete(url);
      console.log(data)
      let webToken = cookie.load("userId");
      req.set('Authorization', 'Bearer ' + webToken)
      req.end((res,err)=>{
        console.log(res,"null")
        PubSub.publish('getDirectory',{name:data.type,id:this.props.params.patient});
      })

  }
  onDrop(acceptedFiles) {
    this.setState({
      files: acceptedFiles
    });
    let url = "http://51.140.51.232:8080/api/case/"+this.props.params.patient+"/dicom"
    let req = request.post(url);
    let webToken = cookie.load("userId");
    this.setState({
      uploadingDICOM: true
    })
    let FormData = require('form-data');
    let form = new FormData();
    req.set('Authorization', 'Bearer ' + webToken)
    acceptedFiles.forEach((file)=> {
      form.append("file", file);
      form.append("body",file.metadata)
     });
    req.send(form)
    req.end((err, res)=>{
        console.log(err, res);
        if(res.statusCode==200){
          this.setState({
            uploadingDICOM: false
          })
          PubSub.publish('getDirectory',{name:"dicom",id:this.props.params.patient});
      }else{
        alert(err);
      }
    })
  }
  onDropModel(acceptedFiles) {
    this.setState({
      files: acceptedFiles
    });
    let url = "http://51.140.51.232:8080/api/case/"+this.props.params.patient+"/model"
    let req = request.post(url);
    let webToken = cookie.load("userId");
    this.setState({
      uploadingModel: true
    })
    let FormData = require('form-data');
    let form = new FormData();
    req.set('Authorization', 'Bearer ' + webToken)
    acceptedFiles.forEach((file)=> {
      form.append("file", file);
      form.append("body",file.metadata)
     });

    req.send(form)
    req.end((err, res)=>{
        console.log(err, res);
        if(res.statusCode==200){
          this.setState({
            uploadingModel: false
          })
          PubSub.publish('getDirectory',{name:"model",id:this.props.params.patient});

      }else{
        alert(err);
      }
    })
  }
  onDropFile(acceptedFiles) {
    this.setState({
      files: acceptedFiles
    });
    let url = "http://51.140.51.232:8080/api/case/"+this.props.params.patient+"/file"
    let req = request.post(url);
    let webToken = cookie.load("userId");
    this.setState({
      uploadingFile: true
    })
    let FormData = require('form-data');
    let form = new FormData();
    req.set('Authorization', 'Bearer ' + webToken)
    acceptedFiles.forEach((file)=> {
         form.append("file", file);
         form.append("body",file.metadata)
     });
     console.log(form)
    req.send(form)
    req.end((err, res)=>{
        console.log(err, res);
        if(res.statusCode==200){
          this.setState({
            uploadingFile: false
          })

          PubSub.publish('getDirectory',{name:"file",id:this.props.params.patient});
      }else{
        alert(err);
      }
    })
  }
  returnList(msg,data){
          console.log(data,"Pinch pinch")
          switch (data.name) {
            case "model":{
            let mdlTemp = data.list.modelList;
            console.log(mdlTemp[0],"Pinch")
            mdl = []
            for (var i = 0; i < mdlTemp.length; i++) {
                  mdl.push({id:mdlTemp[i].id,fName:mdlTemp[i].name,sName:"model"});
            }
              break;
            }
            case "dicom":{
            let mdlTemp = data.list.dicomList;
            sources = []
            console.log(mdlTemp)
            for (var i = 0; i < mdlTemp.length; i++) {
                  sources.push({id:mdlTemp[i].id,name:mdlTemp[i].name,sName:"dicom"});
            }
              break;
            }
            case "file":{
            let mdlTemp = data.list.fileList;
            pdf = []
            for (var i = 0; i < mdlTemp.length; i++) {
                  pdf.push({id:mdlTemp[i].id,name:mdlTemp[i].name,sName:"file"});
            }
              break;
          }
      }
      this.setState({sources : ""});
  }
	render () {
		return (
      <div id="loginPage">
        <h1>{"Patient case #"+this.props.params.patient}&nbsp;</h1>
          <Media id="case">
              <Media.Body>
              <Media.Heading>{this.state.name}</Media.Heading>
               <p>{this.state.description}</p>
              </Media.Body>
          </Media>
        <Button id="delete_case_button" onClick={() => { this.deleteCase()}}> Delete Case</Button>
        <Row fluid>
          <Col xs = {4}>
            <Dropzone
            disableClick
            style={{}}
            ref={(node) => { this.dropzoneDicom = node; }}
            onDrop = {this.onDrop}
            >
            <Table striped bordered condensed>
             <thead>
               <tr>
                 <th class="col-xs-1">#</th>
                 <th class="col-md-1">Image Name</th>
               </tr>
             </thead>
             <tbody>
             {sources.map(function(sources) {
                          return <FileRecord file={sources}/>
                    })}
             </tbody>

           </Table>
           <p>This is where you upload a DICOM CT scan file.
              DICOM files uploaded will be converted into 3D models</p>

            <Button id="delete_case_button" onClick={() => { this.dropzoneDicom.open(); }}
            disabled={this.state.uploadingDICOM}>
            Upload DICOM file
            </Button>
           </Dropzone>
          </Col>
            <Col xs = {4}>
            <Dropzone
            disableClick
            style={{}}
            ref={(node) => { this.dropzoneFile = node; }}
            onDrop = {this.onDropFile}
            >
            <Table striped bordered condensed>
                <thead>
                  <tr>
                  <th class="col-xs-1">#</th>
                  <th class="col-md-1">Image Name</th>
                  </tr>
                </thead>
                <tbody>
                  {pdf.map(function(pdf) {
                               return <FileRecord file={pdf}/>
                         })}
                </tbody>
            </Table>
            <p>This is where you upload generic files,
                These files will not be converted</p>
           <Button onClick={() => { this.dropzoneFile.open(); }}
                   disabled = {this.state.uploadingFile}>Upload file
           </Button>

           </Dropzone>
        </Col>
        <Dropzone
        disableClick
        style={{}}
        ref={(node) => { this.dropzone = node; }}
        onDrop = {this.onDropModel}
        >
          <Col xs = {4}>

          <Table striped bordered condensed>
           <thead>
             <tr>
             <th class="col-xs-1">#</th>
             <th class="col-md-1">Image Name</th>
             </tr>
           </thead>
           <tbody>
           {mdl.map((mdl)=> {
                        return <ModelFileRecord file={mdl} case={this.props.params.patient}/>
                  })}
           </tbody>
         </Table>
         <p>This is where you upload 3D OBJ files
            These files can be viewed in the model viewer</p>
         <Button onClick={() => { this.dropzone.open(); }}
                 disabled = {this.state.uploadingModel}>Upload OBJ 3D Model
         </Button>

        </Col>
      </Dropzone>
    </Row>

   </div>
		)
	}
  deleteCase(){
    let url = 'http://51.140.51.232:8080/api/case/' + this.props.params.patient
    let req = request.delete(url)
    let webToken = cookie.load("userId")
    req.set('Authorization', 'Bearer ' + webToken)
    req.end((err, res) => {
          if(res.statusCode==200){
          hashHistory.push('/user');
        }
    })
  }
}

export default PatientCaseView;
