import * as React from "react";
import * as ReactDOM from "react-dom";
import "./index.css";
import "./components/myEditor";
import MyEditor from "./components/myEditor";

class App extends React.Component {
  render() {
    return (
      <React.Fragment>
        <MyEditor />
      </React.Fragment>
    );
  }
}

ReactDOM.render(
  <App />,

  document.getElementById("app")
);
