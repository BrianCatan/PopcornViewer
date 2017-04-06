import React from 'react'
import ReactDOM from 'react-dom'

var PlayerFrame = React.createClass({
  getInitialState: function () {
    return { videoId: "M7lc1UVf-VE" }
  },

  render: function() {
    return (
      <div className="playerFrame">
        {this.state.videoId ?
          <iframe id="player"
            src={"https://www.youtube.com/embed/" + this.state.videoId + "?enablejsapi=1"}
            width="576" height="326" frameBorder="0" allowFullScreen>
          </iframe>
          : ""
        }
        <select className="playlist" id="playlist" size="18" style={{minWidth: "200px", maxWidth: "200px"}}>
        </select>
        <div id="header">
          <h3 style={{display: 'inline'}}><span className="green">&raquo; Add to Queue</span></h3>
          <form action="#">
            <input type="text" id="input" onKeyPress={ this.addToPlaylist }/>
          </form>
        </div>
      </div>
    );
  },

  addToPlaylist: function(e) {
    if (e.charCode === 13) {
      e.preventDefault();
      var ID = this.transformToID(document.getElementById("input").value);
      var response = this.sendAddToPlaylist(ID);
      document.getElementById("input").value = "";
      if (response) { // TODO ** MIGRATE ACTIONS TO SOCKET HANDLER
        var playlist = document.getElementById("playlist");
        var option = document.createElement("option");
        option.addEventListener("dblclick", () => { this.updateNowPlaying() });
        playlist.addEventListener("keyup", (e) => { this.removeFromPlaylist(e) });
        option.text = response;
        playlist.add(option);
      } else {
        alert("Invalid URL or server error!");
      }
    }
  },

  sendAddToPlaylist: function(url) {
    // TODO ** SEND RESPONSE TO SERVER
    return url;
  },

  removeFromPlaylist: function(e) {
    if (e.keyCode === 46) {
      playlist.remove(playlist.selectedIndex);
    }
  },

  updateNowPlaying: function() {
    // TODO ** SEND REPONSE TO SERVER -- MIGRATE RESULTS TO SOCKET HANDLER
    var playlist = document.getElementById("playlist");
    var player = document.getElementById("player");
    this.setState({ videoId: playlist.options[playlist.selectedIndex].text });
  },

  transformToID: function(url) {
    return url.split('=')[1];
  }
});

ReactDOM.render(
  <PlayerFrame/>,
  document.getElementById('content')
);
