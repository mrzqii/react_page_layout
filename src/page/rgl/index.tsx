import React, { Component } from 'react'
import GridLayout, { WidthProvider,Layout } from 'react-grid-layout'
import NavLeft from './navLeft/index'
import Editor from './editor/index'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import './index.scss'
import {  ComlistOne } from './type'
import * as Fn from './funcTool'

import MyContainer from './component/mycontainer'
import MyTest from './component/mytest'
interface NewLayout extends Layout {
  id:number
  value:string
  type:string
  layout:NewLayout[],
  editorData:object,
}
interface State {
  layout:NewLayout[]
  containerId:number 
  isContainer:boolean
  openContainerId:number
  containerType:string
}
interface AllComponent {
  [key: string]: any
  container:typeof MyContainer
  "test":typeof  MyTest
}
const ReactGridLayout = WidthProvider(GridLayout)
const allComponent:AllComponent = {
  "container": MyContainer,
  "test": MyTest
}
/**
 * 初始位置x
 */
const InitX: number = 15
/**
 * 初始位置y
 */
const InitY: number = 15
export default class RGL extends Component<{}, State > {
  editor:[] = []
  id:number = 1 //  每个组件都有一个唯一的id
  height:number = document.body.clientHeight
  state:State  = {
    containerId: 0,
    isContainer:false,
    openContainerId:-1,
    containerType:"",
    layout: [
      
    ]
  }
  componentDidUpdate( ){
    // 实现开启多个容器警示效果功能
    if(this.state.openContainerId){
      this.state.openContainerId = -1
    }
  }
  componentDidMount(){
    this.height = document.body.clientHeight
  }
 
   /**
   * 改变布局（drag和resize）之后需要保存新的布局数据,其他回调函数不行
   */
  onLayoutChange = (e:GridLayout.Layout[]) => {
    let layout = this.state.layout
    e.forEach(item => {
      layout.forEach(item2 => {
        if (item.i === String(item2.id)) {
          item2.x = item.x
          item2.y = item.y
          item2.w = item.w
          item2.h = item.h
        }
        if (item2.layout && item2.layout.length > 0) {
          item2.layout.forEach(item3 => {
            if (item.i ===String(item3.id)) {
              item3.x = item.x
              item3.y = item.y
              item3.w = item.w
              item3.h = item.h
            }
          })
        }
      })
    })
    console.log("layout",layout)
    this.setState({ layout })
  }
   /**
   * 点击模块的时候设置数据
   */
  setData = (item:any) => {
    this.setState({
      // openContainerId:null,
      containerId: item.id,
      containerType: item.type
    })
  }
  /**
   * 点击模块的时候 需要设置更新数据
   */
  componentClick = (e:React.MouseEvent, component:any, item:NewLayout) => {
    e.stopPropagation()
    let containerId = this.state.containerId
    if (containerId == item.id) return // 如果两次点击的是同一个组件 return
    this.editor = component.editorConfig // 保存 更新 编辑器的内容
    this.setData(item)
  }
  getComponent = (item:NewLayout, index:number) => {
    let theType:string = item.type
    if (allComponent.hasOwnProperty(theType)) {
      let Component = allComponent[theType]
      if (theType === 'container') {
        return (
          <div
            data-grid={item}
            key={item.id}
            onClick={(e:React.MouseEvent) => this.componentClick(e, Component, item)}
            className= {`component_wrapper ${this.state.openContainerId==(item.id)?"blink-1":""}`}
          >
            <Component
              data={item.editorData}
              onLayoutChange={this.onLayoutChange}
            >
              {item.layout.map((item2, index) => {
                return this.getComponent(item2, index)
              })}
            </Component>
          </div>
        )
      }
      return (
        <div
          key={item.id}
          onClick={e => this.componentClick(e, Component, item)}
          data-grid={item}
          className="component_wrapper"
        >
          <Component data={item.editorData} />
        </div>
      )
    }
    return null
  }
 
  changeLayout=(newval:ComlistOne):void=>{
    let layout = this.state.layout
    let containerId = this.state.containerId
    let isContainer = this.state.isContainer
    let theType = Fn.findTypeFromId(layout, containerId, '') // 当前点击组件Id对应的type
    if (isContainer) {
      // 当设置了容器的状态为开启的时候
      if (newval.type === 'container' && theType === 'container') {
        // 添加的组件是container 点击的组件是container
        this.setOpenContainerId()
        console.log('不能嵌套添加容器')
        return
      } else if (
        newval.type === 'container' &&
        theType !== 'container' &&
        theType !== ''
      ) {
        // 添加的组件是container 点击的组件不是container 点击的不是空白处
        console.log('请先选中状态为开启的容器1')
        return
      } else if (newval.type === 'container' && theType === '') {
        // 添加的组件是container 点击了空白处
        layout.push({
          i:String(this.id),
          id: this.id,
          x: InitX,
          y: InitY,
          w: 1,
          h: 1,
          type: newval.type,
          static: false,
          value: newval.value,
          layout: [],
          editorData:{}
        })
        this.id++
        this.setState({
          layout: layout
        })
        return
      }
      let flag = false // 实现一个标记 为了显示错误操作的提示
      layout.forEach(item => {
        if (item.id == containerId && item.static == true) {
          flag = true
          item.layout.push({
            i:String(this.id),
            id: this.id,
            x: 0,
            y: item.layout.length * 2,
            w: 1,
            h: 1,
            type: newval.type,
            static: false,
            value: newval.value,
            layout:[],
            editorData:{}
          })
        }
      })
      if (!flag) {
        this.setOpenContainerId()
        console.log('请先选中状态为开启的容器2')
        return
      }
    } else {
      layout.push({
        i:String(this.id),
        id: this.id,
        x: InitX,
        y: InitY,
        w: 1,
        h: 1,
        type: newval.type,
        static: false,
        value: newval.value,
        layout: [],
        editorData:{}
      })
    }
    this.id++

    console.log("object:",layout)
    this.setState({
      layout: layout
    })
  }
  /**
   * 保存配置信息
   */
  saveData = (bool:boolean) => {
    let layout = this.state.layout
    if (bool) {
      layout.forEach(item => {
        item.static = true
        if (item.layout && item.layout.length > 0) {
          item.layout.forEach(item2 => {
            item2.static = true
          })
        }
      })
    }
    let obj = {
      layout: layout,
      id: this.id,
      isContainer: this.state.isContainer
    }
    // Ajax.ajaxPost({
    //   url: Api.saveStyle,
    //   data: {
    //     params: {
    //       id: 'test2',
    //       style: obj
    //     }
    //   }
    // }).then(res => {
    //   if (res.code == 0) {
    //     console.log('保存成功')
    //   }
    // })
  }
  /**
   * 删除组件
   */
  deleteItem = () => {
    let {layout,containerId,isContainer } = this.state
    if (containerId == null) {
      return
    }
    layout.forEach((item, index) => {
      if (item.id == containerId) {
        if (item.static === true && isContainer) {
          // 当删除的这个是容器 是可填充状态的时候需要设置一下避免出错
          this.state.isContainer = false
        }
        layout.splice(index, 1)
        return
      }
      if (item.layout && item.layout.length > 0) {
        item.layout.forEach((item2, index2) => {
          if (item2.id == containerId) {
            item.layout.splice(index2, 1)
            return
          }
        })
      }
    })
    this.editor = []
    this.setState({ layout: layout })
  }
  /**
   * 获取当前点击模块对应的editor的数据 实现回填 初始值
   */
  editorValue = () => {
    let containerId = this.state.containerId
    if (containerId == null) return {}
    let layout = this.state.layout
    let data
    layout.forEach(item => {
      if (item.id === containerId) {
        data = item.editorData || {}
      }
      if (item.id !== containerId && item.layout) {
        item.layout.forEach(item2 => {
          if (item2.id === containerId) {
            data = item2.editorData || {}
          }
        })
      }
    })
    return data
  }
  setOpenContainerId = ():void=>{
    // 找到容器状态为开启的那个容器的Id
    let id:number = Fn.findOpenContainerId(this.state.layout)  || -1
    if(id && typeof id ==="number"){
      this.setState({
        openContainerId:id
      })
    }
  }
  /**
   * 把编辑器的data保存到layout里面
   */
  saveEditorData = (data:any) => {
    let containerId = this.state.containerId
    let layout = this.state.layout
    let newdata = Fn.getNewLayout5(layout, containerId, data)
    this.setState({ layout: newdata })
  }
    /**
   *  是否是容器 切换函数
   */
  isContainer = (isChecked:boolean) => {
    let containerId = this.state.containerId
    if (containerId == null) {
      return
    }
    let layout = JSON.parse(JSON.stringify(this.state.layout))
    let newLayout = Fn.getNewLayout4(layout, containerId, isChecked)
    this.state.layout = newLayout
    this.state.isContainer = isChecked
    // 接着会调用saveEditorData方法
  }
  /**
   * 点击容器的切换容器状态按钮 确保只能存在一个容器状态为开启
   */
  storeData = (isChecked:boolean, data:any) => {
    let isContainer = this.state.isContainer
   
    if (isContainer && isChecked) {
      
      console.log('请确保之前容器状态已关闭')
      return
    }
    this.isContainer(isChecked)
    this.saveEditorData(data)
  }
  

  render() {

    return (
      <div className="wrapper_container">
        {/* 左边导航 */}

        <div className={"navLeft_container"}>
          <NavLeft onClick={this.changeLayout}/>
        </div>

        {/* 中间部分 */}
        <div className="main_container">
          <div className="">
            {/* 背景 */}
            <div
              style={{
                position: 'absolute',
                zIndex: 0,
                width: '100%',
                height: '100%',
                background: '#ccc'
              }}
            ></div>
            <ReactGridLayout
              margin={[0, 0]}
              onLayoutChange={(e:GridLayout.Layout[]) => {
                this.onLayoutChange(e)
              }}
              compactType={null}
              className="layout1"
              preventCollision={true}
              layout={this.state.layout} // 虽然使用了data-grid 这个还是不能删
              cols={24} // 可以把页面分为多少个断点
              rowHeight={ this.height / 62.46 }  // 垂直方向 单位grid的高度   //其实就是15 this.height / 62.46
            >
              {this.state.layout.map((item, index) => {
                return this.getComponent(item, index)
              })}
            </ReactGridLayout>
          </div>
        </div>
        {/* 右边编辑部分 */}
        <div className="editor_container">
          <Editor 
            saveData={this.saveData}
            deleteItem={this.deleteItem}
            value={this.editorValue()} // 当前模块配置的数据
            saveEditorData={this.saveEditorData}
            containerId={this.state.containerId} // 当前点击容器的id
            configData={this.editor} // 初始化配置数据 生成组件
            storeData={this.storeData}
            isContainerState =  {this.state.isContainer}
            isContainer={this.isContainer} //函数
            setOpenContainerId={this.setOpenContainerId} // 设置已经是开启状态的容器 产生闪烁的功能
          />
        </div>
      </div>
    )
  }
}
