import React from "react";
import {
  Editor,
  Modifier,
  EditorState,
  convertToRaw,
  convertFromRaw,
} from "draft-js";
import "draft-js/dist/Draft.css";
import Mindmap from "./mindmap";

export default class MyEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      SycGraphMode: true,
    };
    const content = window.localStorage.getItem("content");
    this.onTab = this.onTab.bind(this);
    this.changeSycMode = this.changeSycMode.bind(this);

    if (content) {
      this.state.editorState = EditorState.createWithContent(
        convertFromRaw(JSON.parse(content))
      );
    } else {
      this.state.editorState = EditorState.createEmpty();
    }
  }

  onTab(e) {
    const tabCharacter = "→";
    e.preventDefault();
    let currentState = this.state.editorState;
    let newContentState = Modifier.replaceText(
      currentState.getCurrentContent(),
      currentState.getSelection(),
      tabCharacter
    );

    this.setState({
      editorState: EditorState.push(
        currentState,
        newContentState,
        "insert-characters"
      ),
    });
  }

  onChange = (editorState) => {
    const contentState = editorState.getCurrentContent();
    //  const currentContent = this.state.editorState.getCurrentContent();
    this.saveContent(contentState);
    this.setState({
      editorState,
    });
    // if (currentContent !== contentState) {
    // }
  };

  saveContent = (content) => {
    window.localStorage.setItem(
      "content",
      JSON.stringify(convertToRaw(content))
    );
  };

  twospaceCounter(line) {
    if (line.match(/\\$/)) {
      let backdetect = 0;
      for (let b = line.length; b > 0; b--) {
        if (line.charAt(b) === "\\") {
          backdetect++;
        }
      }
      line = line.substring(0, line.length - 1 - backdetect);
    }

    let countAndLine = { count: 0, filterLine: "" };
    if (line.charAt(0) === "→") {
      for (let i = 0; i < line.length; i++) {
        if (line.charAt(i) === "→") {
          countAndLine.count++;
        } else {
          countAndLine.filterLine = countAndLine.filterLine + line.charAt(i);
        }
      }
    } else {
      countAndLine.filterLine = line;
    }

    return countAndLine;
  }

  changeSycMode() {
    if (this.state.SycGraphMode === true) {
      this.setState({
        SycGraphMode: false,
      });
    } else {
      this.setState({
        SycGraphMode: true,
      });
    }
  }
  render() {
    return (
      <div className="editorContainer">
        <div className="editors">
          <button className="SynchroButton" onClick={this.changeSycMode}>
            {`Map Synchronization: ${this.state.SycGraphMode}`}
          </button>
          <Editor
            editorState={this.state.editorState}
            onChange={this.onChange}
            onTab={this.onTab}
          />
        </div>
        <Mindmap
          SycMode={this.state.SycGraphMode}
          argument={
            convertToRaw(this.state.editorState.getCurrentContent()).blocks
          }
          linespacecounter={this.twospaceCounter}
        />
      </div>
    );
  }
}
