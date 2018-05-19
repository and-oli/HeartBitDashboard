import React, { Component } from 'react';
import {  Icon, Card, Modal} from 'antd';
const { Meta } = Card;
const ref = require('instagram-id-to-url-segment')
const instagramIdToUrlSegment = ref.instagramIdToUrlSegment;

class TrendsInstagram  extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible:false,
      url:""
    };
  }
  componentDidMount(){
  }
  showCards =()=>{
    return this.props.instagramEdges.map((e,i)=>{
      let url ="https://www.instagram.com/p/"+instagramIdToUrlSegment(e.node.id);
      return (
        <div key = {i} className = "col-sm-4 " style={{paddingBottom:"20px"}}>
          <Card
            className = "card"
            cover={<img alt="Post" src={e.node.display_url} style={{ width: "15vw", height: "22vh", marginTop:"20px",marginBottom:"5px",marginLeft:"auto",marginRight:"auto",display:"block"}} />}
            actions={[<Icon  key = "2" type="search"  onClick = {()=>{this.showModal(e.node.display_url)}} style ={{width:"100%",height:"100%"}}/>,  <a  key = "2s" target="_blank" href = {url}  style ={{width:"100%",height:"100%"}}><Icon type="instagram"/></a>]}
            >
              <Meta
                title=  {  [<Icon key = "2"type="heart" />,<span key = "w">{" "+e.node.edge_liked_by.count}</span>]}
                description={ e.node.edge_media_to_caption.edges[0].node.text.length<= 200?e.node.edge_media_to_caption.edges[0].node.text:(e.node.edge_media_to_caption.edges[0].node.text.substring(0,197) + "...")} />
              </Card>
            </div>
          )

        })

      }
      showModal = (url) => {
        this.setState({
          visible: true,
          url
        });
      }
      handleOk = (e) => {
        console.log(e);
        this.setState({
          visible: false,
        });
      }
      render() {
        if(!this.props.instagramEdges.length !== 0){//!this.state.loading
          return (
            <div className = "instagram">
              <div className="row cool">
                {this.showCards()}
              </div>
              <Modal
                title="Picture"
                visible={this.state.visible}
                onCancel={this.handleOk}

                footer={null}
                >
                  <img alt = "Detalied" src = {this.state.url}/>
                </Modal>
              </div>
            )
          }
          else return(
            <div className="spinner-big-container2">
              <div className="spinner-big">
                <div className="double-bounce1"></div>
                <div className="double-bounce2"></div>
              </div>
            </div>
          )
        }
      }

      export default TrendsInstagram;
