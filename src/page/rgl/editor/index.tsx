import React, { Component } from 'react'
import './index.scss'
import * as Fn from '../funcTool'
type Props = {
    saveData(bool:boolean):void,
    deleteItem():void,
    value:any,
    saveEditorData(data:any):void,
    containerId:number,
    configData:any[],
    storeData(isChecked:boolean, data:any):void,
    isContainerState:boolean,
    isContainer(isChecked:boolean,data:any):void,
    setOpenContainerId():void
    
} 
const initialState = {
     
}
interface IState {
    [id: number]: any;
    containerId:number
   
}
type State =  typeof initialState  
class EditorTab extends Component<Props,   IState> {
  state:IState  = {
    containerId:0
  }
  static getDerivedStateFromProps (nextProps:Props, preState:IState){
    if(preState["containerId"] !==nextProps.containerId){
      return {
        [nextProps.containerId]: nextProps.value,
        containerId:nextProps.containerId
      }
    }else {
      return null
    }
  }
  // UNSAFE_componentWillReceiveProps(props:Props) {
  //   if (this.props.containerId !== props.containerId) {
  //       this.setState({
  //         [props.containerId]: props.value,
  //       });
  //   }
  // }
  itemEditor = (item:any, index:number) => {
    let id = this.props.containerId
    if (typeof item === 'string') {
      return (
        <div key={index} className="editor_box text">
          {item}
        </div>
      )
    } else {
      if (item.type === 'input') {
        return (
          <div key={index} className="editor_box">
            <label>{item.text}</label>
            <input
              onChange={e => {
                let val = e.target.value
                let editorData = Fn.clone(this.state[id])
                editorData = { ...editorData, [item.field]: val }
                this.setState({ [id]: editorData })
                this.props.saveEditorData(editorData)
              }}
              value={this.state[id][item.field] || ""}
              placeholder={item.text}
            />
          </div>
        )
      } else if (item.type === 'show_name') {
        return (
          <div key={index} className="editor_box">
            <label>组件名</label>
            <input
              className="editor_show_name"
              readOnly={true}
              value={item.text}
              placeholder={item.text}
            />
          </div>
        )
      } else if (item.type === 'select') {
        return (
          <div key={index} className="editor_box">
            <label>{item.text}</label>
            <select
              style={{ width: '100%' }}
              value={this.state[id][item.field] || undefined}
              placeholder={item.text}
              onChange={(e:React.ChangeEvent<HTMLSelectElement>):void => {
                let val = e.target.value
                let editorData = Fn.clone(this.state[id])
                editorData = { ...editorData, [item.field]: val }
                this.setState({ [id]: editorData })
                this.props.saveEditorData(editorData)
              }}
            >
              {item.data.map((item:any) => {
                return (
                  <option key={item.key} value={item.key}>
                    {item.value}
                  </option>
                )
              })}
            </select>
          </div>
        )
      } else if (item.type === 'selectIcon') {
        return (
          <div key={index} className="editor_box">
            <label>{item.text}</label>
            <select
              style={{ width: '100%' }}
              value={this.state[id][item.field]|| undefined}
              placeholder={item.text}
              onChange={(e:React.ChangeEvent<HTMLSelectElement>) => {
                let val = e.target.value
                let editorData = Fn.clone(this.state[id])
                editorData = { ...editorData, [item.field]: val }
                this.setState({ [id]: editorData })
                this.props.saveEditorData(editorData)
              }}
            >
              {item.data.map((item:any) => {
                let src = `res/icon/${item.key}.png`
                return (
                  <option key={item.key} value={item.key}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <img
                        style={{
                          width: '20px',
                          height: '20px',
                          marginRight: '2px'
                        }}
                        src={src}
                        alt=""
                      />
                      {item.value}
                    </div>
                  </option>
                )
              })}
            </select>
          </div>
        )
      } else if (item.type === 'switch') {
        let checked
        if (this.state[id]) {
      
          if (this.state[id][item.field]) {
            checked = true
          } else {
            checked = false
          }
        } else {
          checked = false
        }

        return (
          <div key={index} className="editor_box">
            <span style={{ fontSize: '16px', color: '#999' }}>
              {item.text}：
            </span>
            <input
              type="checkbox"
              checked={checked}
              onChange={e => {
                let isContainerState = this.props.isContainerState
                let checked = e.target.checked
                // 当前容器是开启状态 && 点击checkbox又是开启 就是代表想开启同时开启两个容器 这个是不允许的
                if(isContainerState ===true && checked===true)  {
                  console.log(1);
                  this.props.setOpenContainerId()
                  return
                }
                let editorData = Fn.clone(this.state[id])
                this.setState({
                  [id]:{ ...editorData, [item.field]: checked }
                },()=>{
                  this.props.storeData(checked, this.state[id])
                })
              }}
            ></input>
          </div>
        )
      } else {
        return <div key={index} className="editor_box"></div>
      }
    }
  }
  render() {
    let Save = (
      <div>
        <button
          style={{ marginRight: '5px' }}
          onClick={() => {
            this.props.saveData(true)
          }}
        >
          最终保存
        </button>
        <button
          onClick={() => {
            this.props.saveData(false)
          }}
        >
          保存草稿
        </button>
      </div>
    )
    return (
      <div>
        <div className="editor_wrapper">
          <div className="editor_name">编辑栏</div>
          {Save}
        </div>
        <div className="editor_content">
          <div className="editor_box">
            <button
              title="请先选中需要删除的组件"
              onClick={this.props.deleteItem}
            >
              删除组件
            </button>
          </div>
          {this.props.configData.map((item, index) => {
            return this.itemEditor(item, index)
          })}
        </div>
      </div>
    )
  }
}
export default EditorTab
