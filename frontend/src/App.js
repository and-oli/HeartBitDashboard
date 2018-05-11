import React, { Component } from 'react';
import './App.css';
import * as d3 from "d3";
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mierda:{}
    };
  }
  componentDidMount ()
  {
    fetch('/api/')
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.success){
        this.setState({mierda:responseJson.data});
      }
      else{
      }
    })
    .catch((error) => {
      console.error(error);
    });
    var width = 500;
    var height = 500;

    var projection = d3.geoMercator()
    .translate([1700, 300])
    .scale([1200]);

    var path = d3.geoPath()
    .projection(projection);
    var culo = d3.select("culo").text("culito");
    var mapa = d3.select("div#mapa")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g");

    var div = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

    d3.select("div.tooltip")
    .append("h3");

    d3.json("./static/dptos.json").then( function(json){
      mapa.selectAll("path")
      .data(json.features)
      .enter()
      .append("path")
      .attr("d", path)
      .style("stroke", "#fff")
      .style("fill", "#ccc")
      .style("stroke-width", "1.5")

      .on("mouseover", function(d){
        div.transition()
        .duration(200)
        .style("opacity", 0.9);
        div.select("h3")
        .text(d.properties["NOMBRE_DPT"]);
        div.style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY - 30) + "px");
      })
    });
  }
  mostrarHistorial = () =>{
    if(this.state.mierda["3iolqhPzn2aDtzxtZ7hLo2KeIIw2"]){
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
    else return(
      <div class="spinner">
        <div class="double-bounce1"></div>
        <div class="double-bounce2"></div>
      </div>
    )
  }

  render() {
    return (
      <div>
        <div id="mapa"></div>
        <h1 id="culo"></h1>

        <div className="modal-body">
          {this.mostrarHistorial()}
        </div>
      </div>
    );
  }
}

export default App;
