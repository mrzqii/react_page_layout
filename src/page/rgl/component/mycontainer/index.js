import React, { Component } from "react";
import GridLayout, { WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "./index.scss";
import { clickTypeConfig,dialogFnConfig } from '../../editor/config';

const ReactGridLayout = WidthProvider(GridLayout);
class MyContainer extends Component {
  constructor(props){
    super(props)
    this.height = document.body.clientHeight
  }
  static editorConfig = [
    {
      text:"容器",    
      type:"show_name" // 组件名称
    },
    {
      field: "switch",
      text: "是否开启容器状态",
      type: "switch"
    },
    {
      field: "title",
      text: "输入标题",
      type: "input"
    },
    {
      field: "bacc",
      text: "容器背景色",
      type: "input"
    },
    {
      field: "bdcolor",
      text: "边框色",
      type: "input"
    },
    "设置点击响应类型",
        {
            field: "click_type",
            text: "响应类型",
            type:"select",
            data: clickTypeConfig
        },
        {
            field: "dialog_type",
            text: "弹框数据接口",
            type:"select",
            data: dialogFnConfig
        },
        {
            field:"chartfn",
            text:"地图交互方法",    
            type:"selectChartFn"
        },
  ];
  click = ()=>{
 
    let data = this.props.data || {};
    let click_type = data.click_type
    if(click_type==="dialog"){  // 判断点击类型来区分 弹出dialog还是和地图交互
        this.props.changeDialogVisible("90%","90%")
        return
    }else if(click_type==="map"){
        this.props.clickCesium(data["chartfn"])
    }
  }
  render() {
    let border = this.props.data && (this.props.data["bdcolor"] ||"rgba(0,0,0,.3)")
    // let isPreview = this.props.isPreview
    return (
      <div className="container_wrapper" style={{border:'1px solid '+ border,background:this.props.data && (this.props.data["bacc"] ||"transparent")}}>
        {this.props.data && this.props.data["title"] ? (
          <div className="container_title" onClick={this.click}>{this.props.data["title"]}</div>
        ) : null}
        <ReactGridLayout
          className="layout"
          compactType={null}
          preventCollision={true}
          onLayoutChange={e => {
            this.props.onLayoutChange(e);
          }}
          rowHeight={this.height / 62.46 }
          cols={24}
        >
          {this.props.children}
        </ReactGridLayout>
      </div>
    );
  }
}

export default MyContainer;
