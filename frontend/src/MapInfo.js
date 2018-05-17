import React, { Component } from 'react';
import * as d3 from "d3";

class MapInfo  extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  paintGraph = ()=>{

    if(this.props.currentDepartment.name !== "Click on a department"){


      // load the data
      let data = this.props.currentDepartment.data.medication;

      // set the dimensions of the canvas
      var margin = {top: 20, right: 20, bottom: 70, left: 70},
      width = 500 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;


      // set the ranges
      var x = d3.scaleBand();

      var y = d3.scaleLinear().range([height, 0]);

      // define the axis
      var xAxis = d3.axisBottom(x)


      var yAxis = d3.axisLeft(y)
      .tickArguments(10);

      d3.selectAll("#svg2 > *").remove();

      // add the SVG element
      var svg = d3.select("#svg2")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom +100)
      .append("g")
      .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");




      data.forEach(function(d) {
        d.name = d.name;
        d.count = +d.count;
      });
      // scale the range of the data
      x.domain(data.map(function(d) { return d.name; })).range([0, width]);
      y.domain([0, d3.max(data, function(d) { return d.count; })]);

      // add axis
      svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-90)" );


      svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 5)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("countuency");

      // Add bar chart
      svg.selectAll("bar")
      .data(data)
      .enter().append("rect")
      .style("fill","#88cbd1")
      .attr("x", function(d, i) { return x(d.name) +5 ;  })
      .attr("width", x.bandwidth() -9)
      .attr("y", function(d) { return y(d.count); })
      .attr("height", function(d) { return height - y(d.count); });
      //Labels
      svg.append("text")
      .attr("transform",
      "translate(" + (width/2) + " ," +
      (height + margin.top + 80) + ")")
      .style("text-anchor", "middle")
      .text("Medicine");

      svg.append("text")
      .attr("class", "y label")
      .attr("text-anchor", "end")
      .attr("y", -50)
      .attr("x", -1*height/2 + 50)
      .attr("dy", ".75em")
      .attr("transform", "rotate(-90)")
      .text("Reported intakes");

    }
  }
  componentDidMount ()
  {
    this.paintGraph()
  }
  componentDidUpdate ()
  {
    this.paintGraph()
  }
  render() {
    return (
      <div className="map-vis">
        <h2 id="map-info">Medicine intake frequency in {this.props.currentDepartment.name}</h2>
        <svg id = "svg2" style ={{marginLeft:"30px"}}></svg>
      </div>
    );
  }
}

export default MapInfo;
