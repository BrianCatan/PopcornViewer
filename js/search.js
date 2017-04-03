import React from 'react'
import ReactDOM from 'react-dom'

var Search = React.createClass({
  render: function() {
    return (
      <div className="search" id="header">
        <h3 style={{display: 'inline'}}> <span className="green">&raquo; Search</span></h3>
        <form method="get" action="https://www.youtube.com/results?search_query=" target="_blank">
          <input type="text" name="q" />
        </form>
      </div>
    );
  }
});

ReactDOM.render(
  <Search/>,
  document.getElementById('search')
);
