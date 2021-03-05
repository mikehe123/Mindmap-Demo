import React from "react";
import { Graphviz } from "graphviz-react";

export default class Mindmap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      argument: this.props,
    };
  }

  componentDidMount() {
    const { argument } = this.props;
    let nestingArgsArr = [];
    let graphString = "";
    let firstline = argument[0].text;
    if (firstline.match(/\\$/)) {
      let backdetect = 0;
      for (let b = firstline.length; b > 0; b--) {
        if (firstline.charAt(b) === "\\") {
          backdetect++;
        }
      }
      firstline = firstline.substring(0, firstline.length - 1 - backdetect);
    }
    if (argument.length === 1) {
      //-----------------------if there is only one node-----------//
      this.setState({
        argsStruct: `0 ;0[label="${firstline}" color="dodgerblue3"];`,
      });
    } else {
      graphString = `0;0[label="${firstline}"  color="dodgerblue3"];`;
      for (var i = 1; i < argument.length; i++) {
        const line = argument[i].text;
        const countAndLine = this.props.linespacecounter(line);
        nestingArgsArr.push(countAndLine.count);

        if (countAndLine.count >= 1) {
          //---------Breaking from a sub argument, continue with upper level premises------//
          if (nestingArgsArr[i - 1] < nestingArgsArr[i - 2]) {
            const level = nestingArgsArr[i - 2] - nestingArgsArr[i - 1];
            graphString =
              graphString +
              `${i - 1 - level - 1}->${i};${i}[label="${
                countAndLine.filterLine
              }"];`;
          } else if (nestingArgsArr[i - 1] === nestingArgsArr[i - 2]) {
            //--------------------Inside a sub argument, adding more premises

            let prevlevel = 0;
            for (let j = i - 1; j > 0; j--) {
              prevlevel++;
              if (nestingArgsArr[j] > nestingArgsArr[j - 1]) {
                break;
              }
            }

            graphString =
              graphString +
              `${i - prevlevel}->${i};${i}[label="${countAndLine.filterLine}"]`;
          } else {
            //------------------adding a subargument----------------//
            graphString =
              graphString +
              `${i - 1}->${i};${i}[label="${countAndLine.filterLine}"];${
                i - 1
              }[color="deepskyblue"];`;
          }
        } else if (countAndLine.filterLine !== "") {
          graphString =
            graphString + `0->${i};${i}[label="${countAndLine.filterLine}"];`;
        }
      }

      this.setState({
        argsStruct: graphString,
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.argument !== prevProps.argument) {
      const { argument } = this.props;
      let nestingArgsArr = [];
      let graphString = "";
      let firstline = argument[0].text;
      if (firstline.match(/\\$/)) {
        let backdetect = 0;
        for (let b = firstline.length; b > 0; b--) {
          if (firstline.charAt(b) === "\\") {
            backdetect++;
          }
        }
        firstline = firstline.substring(0, firstline.length - 1 - backdetect);
      }

      if (argument.length === 1) {
        this.setState({
          argsStruct: `0;0[label="${firstline}" color="dodgerblue3"];`,
        });
      } else {
        graphString = `0;0[label="${firstline}"  color="dodgerblue3"];`;
        for (var i = 1; i < argument.length; i++) {
          const line = argument[i].text;
          const countAndLine = this.props.linespacecounter(line);
          nestingArgsArr.push(countAndLine.count);

          if (countAndLine.count >= 1) {
            //---------Breaking from a sub argument, continue with upper level premises------//
            if (nestingArgsArr[i - 1] < nestingArgsArr[i - 2]) {
              const level = nestingArgsArr[i - 2] - nestingArgsArr[i - 1];
              graphString =
                graphString +
                `${i - 1 - level - 1}->${i};${i}[label="${
                  countAndLine.filterLine
                }"];`;
            } else if (nestingArgsArr[i - 1] === nestingArgsArr[i - 2]) {
              //--------------------Inside a sub argument, adding more premises

              let prevlevel = 0;
              for (let j = i - 1; j > 0; j--) {
                prevlevel++;
                if (nestingArgsArr[j] > nestingArgsArr[j - 1]) {
                  break;
                }
              }

              graphString =
                graphString +
                `${i - prevlevel}->${i};${i}[label="${
                  countAndLine.filterLine
                }"]`;
            } else {
              //------------------adding a subargument----------------//
              graphString =
                graphString +
                `${i - 1}->${i};${i}[label="${countAndLine.filterLine}"];${
                  i - 1
                }[color="deepskyblue"];`;
            }
          } else if (countAndLine.filterLine !== "") {
            graphString =
              graphString + `0->${i};${i}[label="${countAndLine.filterLine}"];`;
          }
        }
        this.setState({
          argsStruct: graphString,
        });
      }
    }
  }
  render() {
    const { argsStruct } = this.state;

    return (
      <React.Fragment>
        {this.props.SycMode && (
          <Graphviz
            className="graphStyling"
            dot={`digraph { ${argsStruct} rankdir="LR" }`}
            options={{ zoom: true, width: 850 }}
          />
        )}
      </React.Fragment>
    );
  }
}
