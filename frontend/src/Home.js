import React, { Component } from 'react';
import './App.css';
import { Layout, Menu, Icon } from 'antd';
import 'antd/dist/antd.css';
import Map from "./Map"
import Trends from "./Trends"
import Community from "./Community"

const { Header, Content, Sider,Footer } = Layout;

class Home extends Component {
  state = {
    collapsed: false,
    option:"visualize",
    vis:"map",
    comments:[]
  };
  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  }
  componentDidMount(){
    fetch("https://banqtweet.herokuapp.com/api/hbComments/").then((response) => response.json())
    .then((responseJson) => {
      this.setState({comments:responseJson});
    }).catch( err => console.error(err));

  }
  updateComments = (comment)=>{
    let comments = this.state.comments;
    comments.push(comment);
    this.setState({comments})
  }
  visualize = ()=>{
    this.setState({option:"visualize"});
  }
  trends = ()=>{
    this.setState({option:"trends"});
  }
  community = ()=>{
    this.setState({option:"community"});
  }
  render() {
    return (
      <Layout>
        <Header className="header">
          <div className="logo" />
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['1']}
            style={{ lineHeight: '64px' }}
            >
              <Menu.Item key="1" onClick = {this.visualize}>Visualize</Menu.Item>
              <Menu.Item key="2" onClick = {this.trends}>Trends</Menu.Item>
              <Menu.Item key="3" onClick = {this.community}>Community</Menu.Item>
              <Menu.Item key="5" className ="navbar-right" onClick = {this.props.logout}><span>Log out</span></Menu.Item>
              <Menu.Item key="4" className ="navbar-right" id="hi"><span>Hi {this.props.name}</span></Menu.Item>
            </Menu>
          </Header>
          <div style={{ margin: '30px 0' }}>

          </div>
          {(this.state.option==="visualize")?(
            <Content className = "section" style={{ padding: '0 50px'}}>

              <Layout className="greatCard">
                <Sider width={200} style={{ background: '#fff' }}>
                  <Menu
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    style={{ height: '100%' }}
                    >
                      <Menu.Item key="1" onClick ={()=>{this.setState({vis:"map"})}}><span><Icon type="environment-o" />Map</span></Menu.Item>
                      <Menu.Item key="2" onClick ={()=>{this.setState({vis:"graph"})}}><span><Icon type="bar-chart" />Graph 1</span></Menu.Item>
                      <Menu.Item key="3" onClick ={()=>{this.setState({vis:"graph"})}}><span><Icon type="area-chart" />Graph 2</span></Menu.Item>
                      {/* <SubMenu key="sub2" title={<span><Icon type="laptop" />subnav 2</span>}>
                      <Menu.Item key="5">option5</Menu.Item>
                      <Menu.Item key="6">option6</Menu.Item>
                      <Menu.Item key="7">option7</Menu.Item>
                      <Menu.Item key="8">option8</Menu.Item>
                    </SubMenu>
                    <SubMenu key="sub3" title={<span><Icon type="notification" />subnav 3</span>}>
                    <Menu.Item key="9">option9</Menu.Item>
                    <Menu.Item key="10">option10</Menu.Item>
                    <Menu.Item key="11">option11</Menu.Item>
                    <Menu.Item key="12">option12</Menu.Item>
                  </SubMenu> */}
                </Menu>
              </Sider>
              {(this.state.vis==="map")?
              (<Content style={{ padding: ' 24px', minHeight: 700, background:"white" }}>
                <Map mapData = {this.props.mapData} setMapData = {this.props.setMapData}/>
              </Content>):
              (<Content style={{ padding: ' 24px', minHeight: 700, background:"white" }}>
                  <img alt = "Coming soon" src ="http://www.med.unc.edu/alumni/images/coming-soon/image" style ={{margin:"0 auto",display:"block"}}/>
              </Content>)
            }

          </Layout>
        </Content>

      ):(this.state.option==="trends")?(
        <Content className = "section"  style={{ padding: '0 50px'}}>

          <Layout  className="greatCard">
            <Content style={{ padding: '24px', minHeight: 700 , background:"white" }}>
              <Trends instagramEdges = {this.props.instagramEdges} twitterUses ={this.props.twitterUses}/>
            </Content>
          </Layout>
        </Content>

      ):(
        <Content  className = "section" style={{ padding: '0 50px'}}>
          <Layout  className="greatCard">
            <Content style={{ padding: ' 24px', minHeight: 700 , background:"white" }}>
              <Community updateComments={this.updateComments} comments = {this.state.comments} twitterUses ={this.props.twitterUses} user = {this.props.user}/>
            </Content>
          </Layout>
        </Content>
      )

    }
    <Footer style={{ textAlign: 'center' }}>
      HeartBit by CARMA
    </Footer>
  </Layout>
);
}
}

export default Home;
