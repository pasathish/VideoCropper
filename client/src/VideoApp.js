import React, { Component } from 'react';
import './App.css';
import ComponentServices from './ComponentServices';
import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css';

export default class App extends Component {
    componentService = new ComponentServices();
    constructor(props){
        super(props)
        this.state = {
            file1Name: "",
            downloadFileName: '',
            key:0,
            beforeLoad:true,
            value: { min: 0, max: 100 },
            url:"",
            disableSlider:true,
            silderMax:100,
            initialConfig:true
          };
    }
      /**
       * loadvideo method Upload videos to the server
       */
      loadvideo() {
        let file1 = new FileReader();
        if (this.refs.customFile1.files[0]) {
            file1.readAsText(this.refs.customFile1.files[0]);
        }
        let result = this.componentService.uploadFile(this.refs.customFile1.files[0]);
        result.then((data) => {
          let value= { min: 0, max: 100 }
          let key = !this.state.key;
          this.setState({"value":value,
                          "key":key,
                          "beforeLoad":false,
                          "url":"http://localhost:5000/Video",
                          "disableSlider":false,
                          "enableSaveButton" : true
                        });
        });
    }

    /**
     * This will crop the input video and also download it from the server
     */
    cutVideo() {
        this.componentService.save(this.state.value.min,this.state.value.max,this.state.downloadFileName);
    }

    /**
     * This will enable the load button once the file name is specified
     */
    fileNameChanged() {
        let state = this.state;
        state.enableLoadButton = this.refs.customFile1.value != "";
        state.downloadFileName = this.refs.customFile1.files[0] ? this.refs.customFile1.files[0].name :"";
        this.setState(state);
    }

    
    changeDownloadFileName(event) {
        let state = this.state;
        state.downloadFileName = event.currentTarget.value;
        this.setState(state);
      }


    sliderConfiguration=(value)=>{
      this.setState({"value":value})
    }

    render(){
      return (<div className="card ">
      <div className="header" ><img src="/icon.jpg" height="200px"  width="200px" className="rounded" ></img><br/><b>Crop your wonderfull videos here</b></div>
      <video id="videoPlayer" controls key={this.state.key} src={this.state.url} >
      </video>
      <div style={{padding:"8px 36px"}}><InputRange
        maxValue={this.state.silderMax}
        minValue={0}
        title="Cropping bar"
        disabled={this.state.disableSlider}
        value={this.state.value}
        onChange={value => {this.sliderConfiguration(value)}} /><b>Cropping bar</b></div>
      <form className="form-group paddingTop-2 " >
        <div className="custom-file col-md-3" >
          <input type="file" accept="video/*" className="form-control form-control-file border btn-sm" onChange={this.fileNameChanged.bind(this)} ref="customFile1" id="customFile1" />
        </div>
        <input type="button" onClick={this.loadvideo.bind(this)} className="btn btn-primary btn-sm marginLeft-2" disabled={!this.state.enableLoadButton} value="Load" />
          <label className="form-control-label text-weight-bold text-primary" style={{ "paddingRight": "8px", "paddingLeft": "16px" }} htmlFor="save-fila-name">Enter File Name </label>
          <input type="text" ref="saveFileName"  onChange={this.changeDownloadFileName.bind(this)} className="form-control-input" value={this.state.downloadFileName} style={{ "marginRight": "8px" }} id="save-file-name" />
          <input type="button" onClick={this.cutVideo.bind(this)} style={{ "marginBottom": "4px", "marginLeft": "20px" }} disabled={!this.state.enableSaveButton} className="btn btn-primary btn-sm" value=" Cut and Download"></input>
      </form>
      <div className="support">
      <label>It supports chrome browser alone</label>
      </div>
    </div>);
    }
}
