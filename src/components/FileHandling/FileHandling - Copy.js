import React, { PureComponent } from 'react';
import '../src/FileHandling.css';
import cloneDeep from 'lodash/cloneDeep';
//import App from '../src/App.js';

class FileHandling extends PureComponent {

  constructor(props) {

    super(props)
    this.uploadFile = this.uploadFile.bind(this);
    this.state = {file: '', fundsGlobal: []};

  }
    
  uploadFile (event) {
  
    this.state.file = event.target.files[0];
    //var file = event.target.files[0];
    //this.setState({file: file})

    var reader = new FileReader();

    reader.onload = function(){
        
      var result = reader.result;
      var index = result.indexOf(";");
      var chunk;
      var fields;
      var item;
      var createNew;
      var fundsGlobal = [];

      var iterate = function(element) {
        if (element.fundName === item.fundName && element.fundId === item.fundId) {
          element.cost = Number(element.cost) + Number(item.cost);
          element.quantity = Number(element.quantity) + Number(item.quantity);
          element.tax = Number(element.tax) + Number(item.tax);

          createNew = false;
          
          element.entries.push(item);
        }
        else {
          createNew = true;
        }
      }
  
      while (index !== -1) {
        chunk = result.substring(0, index);
        fields = chunk.split(',');
  
        item = {};
        item.fundName = fields[0];
        item.fundId = fields[1].substring(1);
        item.date = fields[2].substring(1);
        item.cost = fields[3].substring(1);
        item.quantity = fields[4].substring(1);
        item.tax = fields[5].substring(1);
        item.entries = [cloneDeep(item)];
  
        //
  
        if (fundsGlobal.length > 0) {
          fundsGlobal.forEach(element => {
            iterate(element);
          });
          if (createNew) {
            fundsGlobal.push(item);
          }
        }
        else {
          fundsGlobal.push(item);
        }
  
        result = result.substring(index + 1);
        index = result.indexOf(';');
      }
  
      //console.log('aaa');
      this.props.callbackFromParent(fundsGlobal);
      this.setState({fundsGlobal: fundsGlobal});

    }.bind(this);
  
    reader.readAsText(this.state.file);
  
  }
  
  onSaveList () {
    
    if (this.state.file) {
      
      var data = '';
      var entry;
      var item;

      for (let i = 0; i < this.state.fundsGlobal.length; i++) {

        entry = this.state.fundsGlobal[i];

        for (let j = 0; j < entry.entries.length; j++) {

          item = entry.entries[j];

          data += item.fundName + ', ' + item.fundId + ', ' + item.date + ', '
          + item.cost + ', ' + item.quantity + ', ' + item.tax + ';\n ';

        }
        
      }

    }

    require("downloadjs")(data, this.state.file.name, 'text/plain');
    
  }

  render() {
    return (
      <div className="flex">
        <input type="file" className="open-button" name="myFile" onChange={this.uploadFile} />
        <input type="button" value="save list" onClick={()=>this.onSaveList()} className="add-button"/>
      </div>
    );
  }
  
}

/*
        fetch('http://luminor-funds.metasite.lt/funds/funds/getJson/2019-07-25/2019-08-25/fund_22384', {mode: 'no-cors'})
        .then(response => response.json())
        .then((jsonData) => {
          // jsonData is parsed json object received from url
          console.log(jsonData)
        })
        .catch((error) => {
          // handle your errors here
          console.error(error)
        })
        */

export default FileHandling;