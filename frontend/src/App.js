import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mierda:[]
    };
  }
  componentDidMount ()
  {
    fetch('/api/')
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson.data);
      if(responseJson.success){
        this.setState({mierda:responseJson.data});
      }
      else{
        console.log(responseJson);
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }
  mostrarHistorial = () =>{
    return Object.keys(this.state.mierda).map((ref, i) =>{
      let obj = (this.state.mierda[ref].records|| {} );
      return (
        <div>
          <div>{ref}</div>
          <div>
            {
              Object.keys(obj).map(
                (record,j)=>{
                  if(j< 10)
                  return (
                    <div>Record num: {record}</div>
                  )
                }
              )
            }
          </div>
        </div>
      )
    });
  }

  render() {
    return (
      <div>
        <div>culo</div>
        <div className="modal-body">
          {this.mostrarHistorial()}
        </div>
      </div>
    );
  }
}

export default App;
