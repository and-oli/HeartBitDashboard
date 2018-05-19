import React, { Component } from 'react';
import {  Icon} from 'antd';

class TrendsTwitter  extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url:""
    };
  }
  showCards =()=>{
    return this.props.twitterUses.map((e,i)=>{
      let url = "https://twitter.com/"+e.user.screen_name+"/status/"+e.id_str;
      let img = e.entities.media&&e.entities.media.length>0?e.entities.media[0].media_url_https:null;
      return (
        <div className = "col-sm-12 " >
          <div className="tweetEntry-tweetHolder ">
            <a href={url} target="_blank" className = "sa">
              <div className="tweetEntry tweetEntryBig">

                <div className="tweetEntry-content">

                  <div className="tweetEntry-account-group" >
                    <img  alt = "avatar" className="tweetEntry-avatar" src={"https://twitter.com/"+e.user.screen_name+"/profile_image?size=bigger"}/>
                    <strong className="tweetEntry-fullname">
                      {e.user.name}
                    </strong>

                    <span className="tweetEntry-username">
                      @<b>{e.user.screen_name}</b>
                    </span>

                    <span className="tweetEntry-timestamp">- {e.created_at.substring(0,16)}</span>

                  </div>

                  <div className="tweetEntry-text-container">
                    <div >
                      <Icon type="retweet" /> {" "+e.retweet_count+" - "}<Icon type="heart" /> {" "+e.favorite_count+" "}
                    </div>

                    {e.text}
                  </div>

                </div>

                <div className="optionalMedia">

                  {
                    (img)&&(
                      <img   alt = "media" className="optionalMedia-img" style = {{width:"22vw",height:"15vw"}} src={img}/>
                    )
                  }

                </div>


              </div>
            </a>
          </div>

        </div>
      )

    })

  }
  render() {
    if(!this.props.twitterUses.length !== 0){//!this.state.loading
      return (
        <div className = "twitter">
          <div className="row cool cheb">
            {this.showCards()}
          </div>
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

  export default TrendsTwitter;
