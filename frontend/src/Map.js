import React, { Component } from 'react';
import './App.css';
import * as d3 from "d3";
import MapInfo from "./MapInfo"

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading:false,
      currentDepartment:{name:"Click on a department",data:{}}
    };
  }
  selectDepartment = (dep)=>{
    this.setState({currentDepartment:{name:dep,data:this.props.mapData[dep]}});
  }
  componentDidMount ()
  {
    if(!this.props.mapData){
      this.setState({loading:true});
      fetch('/api/mapInfo')
      //fetch('http://localhost:5000/api/mapInfo')
      .then((response) => response.json())
      .then((responseJson) => {
        if(responseJson.success){
          this.props.setMapData(responseJson.data);
          this.setState({loading:false});
          this.paintMap();
        }
        else{
          console.log(responseJson);
        }
      })
      .catch((error) => {
        console.error(error);
      });
    }else{
      this.paintMap();
    }
  }
  paintMap = ()=>{
    var width = 400;
    var height = 500;
    var projection = d3.geoMercator()
    .translate([2100, 350])
    .scale([1500]);
    var path = d3.geoPath()
    .projection(projection);
    var mapa = d3.select("div#mapa")
    .append("svg")
    .attr("class","map")
    .attr("width", width)
    .attr("height", height)
    .append("g");




    d3.json("./dptos.json").then( function(json){
      mapa.selectAll("path")
      .data(json.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("class", "state-borders")
      .style("fill", function(d){
        return d3.interpolateBlues(this.props.mapData[d.properties["NOMBRE_DPT"]].pressure.color/255)
        // let col = 255 - this.props.mapData[d.properties["NOMBRE_DPT"]].pressure.color;
        // return "rgb(255,"+col+","+col+")";
      }.bind(this)
    )
    .style("cursor","pointer")
    .on("click", function(d){
      this.selectDepartment(d.properties["NOMBRE_DPT"]);
      //d3.select(this).attr("r", 10).style("fill", "red");
    }.bind(this))
    .on("mouseover", function(d){
      d3.select("#tooltipyT")
      .text(d.properties["NOMBRE_DPT"]+": "+Math.floor(this.props.mapData[d.properties["NOMBRE_DPT"]].pressure.avgSysto));
    }.bind(this))
  }.bind(this));

}
render() {
  if(!this.state.loading){//!this.state.loading
    return (
      <div style = {{height:"100%"}}>
        <div className= "map-vis">
          <h2 className= "map-title">Systolic pressure (in mmHg) average by department</h2>
          <div className ="innerbox" style ={{minHeight:"575px"}}>
            <div  className="tooltipy"><h3 id="tooltipyT">Hover over a department</h3></div>
            <div id="mapa"></div>
            <img className ="scaleBar" src="./scalebar.png" alt="Scale bar" />
          </div>
        </div>
          <MapInfo currentDepartment={this.state.currentDepartment}/>
      </div>)
    }
    else return(
      <div className="spinner-big-container">
        <div className="spinner-big">
          <div className="double-bounce1"></div>
          <div className="double-bounce2"></div>
        </div>
      </div>
    )
  }
}

export default Map;
