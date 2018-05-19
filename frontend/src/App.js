import React, { Component } from 'react';
import './App.css';
import Login from './Login';
import Home from "./Home"

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      data: null,
      mapData:null,
      instagramEdges:[],
      twitterUses : []
    }
  }
  componentDidMount(){
    fetch("https://www.instagram.com/explore/tags/hypertension/?__a=1").then((response) => response.json())
    .then((responseJson) => {
      this.setState({instagramEdges:responseJson.graphql.hashtag.edge_hashtag_to_top_posts.edges});
    }).catch( err => console.error(err));
    fetch("https://banqtweet.herokuapp.com/api/tweets/").then((response) => response.json())
    .then((responseJson) => {
       this.setState({twitterUses:responseJson.statuses});
    }).catch( err => console.error(err));


    //let params = {screen_name: 'nodejs'};



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
    else return <Home user = {this.state.data.user} name ={this.state.data.user.name} logout = {this.logout} mapData = {this.state.mapData} setMapData = {this.setMapData} instagramEdges = {this.state.instagramEdges} twitterUses ={this.state.twitterUses}/>
  }
}

export default App;
