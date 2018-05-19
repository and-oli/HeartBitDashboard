import { Menu, Icon, } from 'antd';
import React, { Component } from 'react';
import TrendsInstagram from "./TrendsInstagram";
import TrendsTwitter from "./TrendsTwitter";

class Trends extends Component {
  state = {
    current: 'instagram',
  }
  handleClick = (e) => {
    this.setState({
      current: e.key,
    });
  }
  render() {
    return (
      <div>

        <Menu
          onClick={this.handleClick}
          selectedKeys={[this.state.current]}
          mode="horizontal"
          style={{margin:"auto",display:"block",width:"20%"}}
          >
            <Menu.Item key="instagram" style ={{width:"50%"}}>
              <div style ={{textAlign:"center"}}>
                <Icon type="instagram" />Instagram
              </div>
            </Menu.Item>
            <Menu.Item key="twitter"  style ={{width:"50%"}}>
              <div style ={{textAlign:"center"}}>
                <Icon type="twitter" />Twitter
              </div>
            </Menu.Item>
          </Menu>
          {this.state.current==="instagram"?(<TrendsInstagram instagramEdges ={this.props.instagramEdges} />):<TrendsTwitter twitterUses ={this.props.twitterUses} />}
        </div>
      );
    }
  }
  export default Trends;
