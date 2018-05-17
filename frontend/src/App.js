import React, { Component } from 'react';
import './App.css';
import Login from './Login';
import Home from "./Home"

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      data: null,
      mapData:null
    }
  }
  componentDidMount(){
    //BORRAR!
    //  localStorage.setItem("HBInfo",JSON.stringify({token:1,user:{username:"mierdo",name:"mierdolo"}}));
    //BORRAR!
    let strng = localStorage.getItem("HBInfo");
    if(strng ){
      let data = JSON.parse(strng);
      this.setState({data});
    }
  }
  setUser=(data)=>{
    this.setState({
      data
    });
    localStorage.setItem("HBInfo",JSON.stringify(data));
  }
  logout = ()=>{
    this.setState({
      data:null
    });
    localStorage.removeItem("HBInfo");
  }
  setMapData = (mapData)=>{
    this.setState({mapData})
  }
  render() {
    if(!this.state.data){
      return (
        <Login setUser = {this.setUser}></Login>
      );
    }
    else return <Home name ={this.state.data.user.name} logout = {this.logout} mapData = {this.state.mapData} setMapData = {this.setMapData}/>
  }
}

export default App;
