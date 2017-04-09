import React from 'react'
import ReactDOM from 'react-dom'

var socket;
var PlayerFrame = React.createClass({
  getInitialState: function () {
    return {
      socketAddress: "24.107.206.144",
      socketPort: "25565",
      videoId: "M7lc1UVf-VE" }
  },

  render: function() {
    return (
      <div className="playerFrame">
        {this.state.videoId ?
          <iframe id="player"
            src={"https://www.youtube.com/embed/" + this.state.videoId + "?enablejsapi=1"}
            width="576" height="326" allowFullScreen frameBorder="0">
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

  componentDidMount() {
    var self = this;

    socket = new WebSocket("ws:" + this.state.socketAddress + ":" + this.state.socketPort);
    socket.onopen = function () {
    };
    socket.onmessage = function (e) {
      var msg = e.data;
      switch (msg.split("&")[0]) {

        case "addToPlaylist":
        if (msg.split("&")[1]) {
            var playlist = document.getElementById("playlist");
            var option = document.createElement("option");

            option.addEventListener("dblclick", () => {
              this.send("updateNowPlaying&" + playlist.selectedIndex);
            });

            playlist.addEventListener("keyup", (e2) => {
              if (e2.keyCode === 46) {
                this.send("removeFromPlaylist&" + playlist.selectedIndex);
              }
            });

            option.text = msg.split("&")[1];
            playlist.add(option);
          } else {
            alert("Invalid URL or server error!");
          }
          break;

        case "removeFromPlaylist":
          document.getElementById("playlist").remove(msg.split("&")[1]);
          break;

        case "updateNowPlaying":
          self.setState({ videoId: msg.split("&")[1] });
          var player = new YT.Player('player', {
            events: {
              'onStateChange': onPlayerStateChange
            }
          });
          break;

        case "callPlayer":
          self.callPlayer(msg.split("&")[1]);
          break;

        default:
      }
    };
    socket.onclose = function () {
      alert("Connection lost to host!");
    };
  },

  callPlayer: function(func, args) {
    var player = document.getElementById("player");
    player.contentWindow.postMessage(JSON.stringify({
      'event': 'command',
      'func': func,
      'args': args || []
    }), "*");
  },

  addToPlaylist: function(e) {
    if (e.charCode === 13) {
      e.preventDefault();
      var ID = this.transformToID(document.getElementById("input").value);
      document.getElementById("input").value = "";
      socket.send("addToPlaylist&" + ID);
    }
  },

  transformToID: function(url) {
    return url.split('=')[1];
  }
});

window.onYouTubeIframeAPIReady = function() {
  var player = new YT.Player('player', {
    events: {
      'onStateChange': onPlayerStateChange
    }
  });
}

window.onPlayerStateChange = function(event) {
  socket.send("playerStateChange&" + event.data);
}

ReactDOM.render(
  <PlayerFrame/>,
  document.getElementById('content')
);
