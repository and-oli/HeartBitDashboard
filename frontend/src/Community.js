import React, { Component } from 'react';
import {  Icon,Tooltip  } from 'antd';

class Community  extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible:false,
      url:"",
      inputImageValue:"",
      error:"",
      loading:false,
      message:""
    };
  }
  componentDidMount(){
  }
  showInputCard=()=>{
    return(
      <div className = "col-sm-12 " >
        <div className="tweetEntry-tweetHolder ">
          <h2 style= {{background:"#4995eb",margin:"0", padding:"20px"}} id="h2card">Enter an advice or a comment!</h2>
          <div className="tweetEntry tweetEntryBig">
            <strong style ={{marginBottom:"6px"}}>  {this.props.user.username}:</strong>
            <div className="tweetEntry-account-group" >
              <strong className="tweetEntry-fullname">
              </strong>
              <span className="tweetEntry-username">
              </span>
            </div>
            {/* <form onSubmit={this.handleSubmit} id="myform" encType="multipart/form-data"> */}

            <textarea ref = "comment" type = "text" className="form-control" rows="5" id="comment" style ={{resize:"none"}}></textarea>
            <label htmlFor="file-upload">
              <Tooltip title="Add picture">
                <Icon type="paper-clip" className = "reaction" />
              </Tooltip>
            </label>
            {this.state.inputImageValue}
            <input id = "file-upload" type="file" ref = "image" name="myimage"  accept="image/*" onChange={this.handleImageChange}  /><br/>
            {(this.state.loading)?(
              <div className="spinner">
                <div className="double-bounce1"></div>
                <div className="double-bounce2"></div>
              </div>
            ):(
              <div>
                <button style={{margin:"0 auto"}}  className="btn"   type="submit" onClick ={this.handleClick}>Submit</button>
                <div style ={{color: "red"}}>{this.state.error}</div>
                <div style ={{color: "green"}}>{this.state.message}</div>

              </div>
            )}


          </div>
        </div>
      </div>
    )
  }
  handleImageChange= (event) =>{
    if(event.target.files[0])
    this.setState({inputImageValue: event.target.files[0].name});
  }
  handleClick= () =>{
    if(this.refs.comment.value.trim() !== ""){
      this.setState({error:"", loading:true})
      if(this.refs.image.files[0]){
        let formData = new FormData();
        formData.append("image", this.refs.image.files[0]);
        fetch('/api/uploadPicture', {
        //fetch('http://localhost:5000/api/uploadPicture', {
          method: 'POST',
          headers: {
          },
          body:formData
        }).then( response => response.json()).then((json)=>{
          let imagen = json.imageUrl?json.imageUrl:"http://www.med.unc.edu/alumni/images/coming-soon/image";
          let data = {user: this.props.user.username, comment: this.refs.comment.value, image:imagen};
          this.addComment(data)
          this.setState({message:"Comment added!", loading:false})

        }
      ).catch(err => console.log(err));
    }
    else{
      let data = {user: this.props.user.username, comment: this.refs.comment.value, image:""};
      this.addComment(data);
      this.setState({message:"Comment added!", loading:false})

    }
  }
  else {
    this.setState({error:"Type something!"})
  }
}
addComment = (data)=>{
  fetch("https://banqtweet.herokuapp.com/api/hbComment/", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  }).then((resp) => resp.json())
  .then((responseJson) => {
    this.props.updateComments(data);
  }).catch( err => console.error(err));
}


showCards =()=>{
  return this.props.comments.slice(0).reverse().map((e,i)=>{
    return (
      <div key = {i} className = "col-sm-12 " >
        <div className="tweetEntry-tweetHolder ">
            <div className="tweetEntry tweetEntryBig">
              <div >
                <div  >
                  <strong style={{color:"black"}}>
                    {e.user}
                  </strong>
                </div>
                <div >

                  {e.comment}
                </div>
              </div>
              <div className="optionalMedia">
                {
                  (e.image!=="")&&(
                    <img   alt = "media" className="optionalMedia-img" style = {{width:"22vw",height:"15vw"}} src={e.image}/>
                  )
                }
              </div>
            </div>
        </div>

      </div>
    )

  })

}
render() {
  if(!this.props.twitterUses.length !== 0){//!this.state.loading
    return (
      <div className = "community">
        <div className="row cool">
          {this.showInputCard()}
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

export default Community;
