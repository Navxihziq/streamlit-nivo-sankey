import {
  Streamlit,
  StreamlitComponentBase,
  withStreamlitConnection,
} from "streamlit-component-lib"
import React, { ReactNode } from "react"
import { ResponsiveSankey } from "@nivo/sankey"

interface Props {
  data: Record<string, any>
  useContainerWidth: boolean
}

class NivoSankey extends StreamlitComponentBase<Props> {
  public render(): React.ReactNode {
    const width = this.props.args["useContainerWidth"] ? "100%" : "600px"
    return (
      <div style={{ height: "400px", width: width }}>
        <ResponsiveSankey
          data={this.props.args["data"]}
          margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
          align="justify"
          onClick={this.onClick}
        />
      </div>
    )
  }

  public onClick = (data: Object, event: any) => {
    let ret: { type: string; [key: string]: any }

    if ("source" in data && "target" in data && "value" in data) {
      // link
      ret = {
        type: "link",
        source: (data as { source: { id: string } }).source.id,
        target: (data as { target: { id: string } }).target.id,
        value: (data as { value: number }).value,
      }
    } else if ("id" in data) {
      // node
      ret = {
        type: "node",
        id: data.id,
      }
    } else {
      ret = {
        type: "unknown",
        data: data,
      }
    }

    Streamlit.setComponentValue(ret)
  }
}

// "withStreamlitConnection" is a wrapper function. It bootstraps the
// connection between your component and the Streamlit app, and handles
// passing arguments from Python -> Component.
//
// You don't need to edit withStreamlitConnection (but you're welcome to!).
export default withStreamlitConnection(NivoSankey)
