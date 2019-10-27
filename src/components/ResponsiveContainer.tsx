
import React from "react"

class ResponsiveContainer extends React.Component {
  render() {
    return <div>
      {this.props.children}
    </div>;
  }
}

export default ResponsiveContainer;