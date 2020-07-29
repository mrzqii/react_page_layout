import React, { Component } from 'react'
import GridLayout, { WidthProvider, Layout } from 'react-grid-layout'
import { CSSTransition } from 'react-transition-group'
import NavLeft from './navLeft/index'
import Editor from './editor/index'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import './index.scss'
import { ComlistOne } from './type'
import * as Fn from './funcTool'
import axios from 'axios'
import { MyContext } from './context.js'
import MyContainer from './component/mycontainer'
import MyTest from './component/mytest'
import MyTest2 from './component/mytest2'
interface NewLayout extends Layout {
  id: number
  value: string
  type: string
  layout: NewLayout[]
  editorData: object
}
interface State {
  layout: NewLayout[]
  containerId: number
  isContainer: boolean
  openContainerId: number
  containerType: string
  editorVisible: boolean
  navVisible: boolean
  filter: object
}
interface AllComponent {
  [key: string]: any
  container: typeof MyContainer
  test: typeof MyTest
  test2: typeof MyTest2
}
const ReactGridLayout = WidthProvider(GridLayout)
const allComponent: AllComponent = {
  container: MyContainer,
  test: MyTest,
  test2: MyTest2
}
/**
 * 初始位置x
 */
const InitX: number = 15
/**
 * 初始位置y
 */
const InitY: number = 15
export default class RGL extends Component<{ isDisplay: boolean }, State> {
  editor: [] = []
  id: number = 1 //  每个组件都有一个唯一的id
  height: number = document.body.clientHeight
  state: State = {
    containerId: 0,
    isContainer: false,
    openContainerId: -1,
    containerType: '',
    layout: [],
    editorVisible: true,
    navVisible: true,
    filter: {}
  }
  componentDidUpdate() {
    // 实现开启多个容器警示效果功能
    if (this.state.openContainerId === this.state.containerId) {
      this.setState({
        openContainerId: -1
      })
    }
  }
  componentDidMount() {
    this.height = document.body.clientHeight
    if (this.props.isDisplay) {
      // 如果是演示页面的时候执行这个方法
      this.displayInit()
      return
    }
    this.needEditInit() // 如果是编辑状态的时候执行这个方法
  }
  /**
   * 编辑状态 获取初始数据
   */
  needEditInit = () => {
    axios({
      url:'/api/style/getstyle',
      method: 'POST',
      baseURL:'http://localhost:3005',
      withCredentials:true,
      timeout: 30000,
      data: {
        id: 'test2'
      }
    })
      .then(response => {
        let res = response.data
        console.log(res);
        // 返回的数据格式
        // {
        //   id: "test2"
        //   style: "{"id":10,"isContainer":true,"layout":[{"id":8,"x
        // }
        let styleData = res.data.style
        styleData = JSON.parse(styleData)
        if (styleData) {
          this.id = styleData.id // 当前的id 避免编辑的时候新增组件和之前组件id重合
          this.setState({
            // showNavAndEditor: true,
            layout: styleData.layout,
            isContainer: styleData.isContainer
          })
        }
      })
      .catch(() => {
        this.setState({
          // showNavAndEditor: true
        })
      })
  }
  /**
   * 编辑好了 作为页面组件时 获取初始数据
   */
  displayInit = () => {
    axios({
      url:'/api/style/getstyle',
      method: 'POST',
      baseURL:'http://localhost:3005',
      withCredentials:true,
      timeout: 30000,
      data: {
        id: 'test2'
      }
    }).then(res => {
      let styleData = res.data.style
      styleData = JSON.parse(styleData)
      if (styleData) {
        this.setState({ layout: styleData.layout })
      }
    })
  }

  /**
   * 改变布局（drag和resize）之后需要保存新的布局数据,其他回调函数不行
   */
  onLayoutChange = (e: GridLayout.Layout[]) => {
    let layout: NewLayout[] = Fn.clone(this.state.layout)
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
            if (item.i === String(item3.id)) {
              item3.x = item.x
              item3.y = item.y
              item3.w = item.w
              item3.h = item.h
            }
          })
        }
      })
    })
    this.setState({ layout })
  }
  /**
   * 点击模块的时候设置数据
   */
  setData = (item: any) => {
    this.setState({
      containerId: item.id,
      containerType: item.type
    })
  }
  /**
   * 点击模块的时候 需要设置更新数据
   */
  componentClick = (e: React.MouseEvent, component: any, item: NewLayout) => {
    e.stopPropagation()
    let containerId = this.state.containerId
    if (containerId === item.id) return // 如果两次点击的是同一个组件 return
    this.editor = component.editorConfig // 保存 更新 编辑器的内容
    this.setData(item)
  }
  getComponent = (item: NewLayout, index: number) => {
    let theType: string = item.type
    if (allComponent.hasOwnProperty(theType)) {
      let Component = allComponent[theType]
      if (theType === 'container') {
        return (
          <div
            data-grid={item}
            key={item.id}
            onClick={(e: React.MouseEvent) =>
              this.componentClick(e, Component, item)
            }
            className={`component_wrapper ${
              this.state.openContainerId === item.id ? 'blink-1' : ''
            }`}
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
          onClick={(e: React.MouseEvent) =>
            this.componentClick(e, Component, item)
          }
          data-grid={item}
          className="component_wrapper"
        >
          <Component data={item.editorData} />
        </div>
      )
    }
    return null
  }

  changeLayout = (newval: ComlistOne): void => {
    let layout: NewLayout[] = Fn.clone(this.state.layout)
    let containerId = this.state.containerId
    let isContainer = this.state.isContainer
    let theType = Fn.findTypeFromId(layout, containerId, '') // 当前点击组件Id对应的type
    if (isContainer) {
      // 当设置了容器的状态为开启的时候
      if (newval.type === 'container' && theType === 'container') {
        // 添加的组件是container 点击的组件是container
        this.setOpenContainerId()
        Fn.showTips('不能嵌套添加容器', 200, 2)
        return
      } else if (
        newval.type === 'container' &&
        theType !== 'container' &&
        theType !== ''
      ) {
        // 添加的组件是container 点击的组件不是container 点击的不是空白处
        Fn.showTips('请先选中状态为开启的容器1', 200, 2)
        return
      } else if (newval.type === 'container' && theType === '') {
        // 添加的组件是container 点击了空白处
        layout.push({
          i: String(this.id),
          id: this.id,
          x: InitX,
          y: InitY,
          w: 1,
          h: 1,
          type: newval.type,
          static: false,
          value: newval.value,
          layout: [],
          editorData: {}
        })
        this.id++
        this.setState({
          layout: layout
        })
        return
      }
      let flag = false // 实现一个标记 为了显示错误操作的提示
      layout.forEach(item => {
        if (item.id === containerId && item.static === true) {
          flag = true
          item.layout.push({
            i: String(this.id),
            id: this.id,
            x: 0,
            y: item.layout.length * 2,
            w: 1,
            h: 1,
            type: newval.type,
            static: false,
            value: newval.value,
            layout: [],
            editorData: {}
          })
        }
      })
      if (!flag) {
        this.setOpenContainerId()
        Fn.showTips('请先选中状态为开启的容器2', 200, 2)
        return
      }
    } else {
      layout.push({
        i: String(this.id),
        id: this.id,
        x: InitX,
        y: InitY,
        w: 1,
        h: 1,
        type: newval.type,
        static: false,
        value: newval.value,
        layout: [],
        editorData: {}
      })
    }
    this.id++

    this.setState({
      layout: layout
    })
  }
  /**
   * 保存配置信息
   */
  saveData = (bool: boolean) => {
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
    axios({
      url:'/api/style/save',
      method: 'POST',
      withCredentials:true,
      baseURL:'http://localhost:3005',
      timeout: 6000,
      data: {
        id: 'test2',
        style: obj
      }
    }).then((res: any) => {
      let data = res.data
      console.log(data);
      if (data.code == 0) {
        Fn.showTips('保存成功', 200, 2)
      }
    })
  }
  /**
   * 删除组件
   */
  deleteItem = (): void => {
    let { containerId, isContainer } = this.state
    let layout: NewLayout[] = Fn.clone(this.state.layout)
    if (containerId === 0) return // 初始化 未点击组件的时候  就return
    layout.forEach((item, index) => {
      if (item.id === containerId) {
        if (item.static === true && isContainer) {
          // 当删除的这个是容器 是可填充状态的时候需要设置一下避免出错
          // this.state.isContainer = false
          this.setState({
            isContainer: false
          })
        }
        layout.splice(index, 1)
        return
      }
      if (item.layout && item.layout.length > 0) {
        item.layout.forEach((item2, index2) => {
          if (item2.id === containerId) {
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
  editorValue = (): object => {
    let containerId = this.state.containerId
    let layout: NewLayout[] = Fn.clone(this.state.layout)
    let data: object = {}
    layout.forEach(item => {
      if (item.id === containerId) {
        data = item.editorData
      }
      if (item.id !== containerId && item.layout) {
        item.layout.forEach(item2 => {
          if (item2.id === containerId) {
            data = item2.editorData
          }
        })
      }
    })
    return data
  }
  setOpenContainerId = (): void => {
    // 找到容器状态为开启的那个容器的Id
    let id: number = Fn.findOpenContainerId(this.state.layout) || -1
    if (id && typeof id === 'number') {
      this.setState({
        openContainerId: id
      })
    }
  }
  /**
   * 把编辑器的data保存到layout里面
   */
  saveEditorData = (data: any): void => {
    let containerId = this.state.containerId
    let layout = this.state.layout
    let newdata = Fn.getNewLayout5(layout, containerId, data)
    this.setState({ layout: newdata })
  }
  /**
   *  是否是容器 切换函数 并保存editorData
   */
  isContainer = (isChecked: boolean, data: any) => {
    let containerId = this.state.containerId
    if (containerId == null) {
      return
    }
    let layout: NewLayout[] = Fn.clone(this.state.layout)

    let newLayout = Fn.getNewLayout4(layout, containerId, isChecked)

    this.setState(
      {
        isContainer: isChecked,
        layout: newLayout
      },
      () => {
        let newdata = Fn.getNewLayout5(newLayout, containerId, data)
        this.setState({ layout: newdata })
      }
    )
  }
  /**
   * 点击容器的切换容器状态按钮 确保只能存在一个容器状态为开启
   */
  storeData = (isChecked: boolean, data: any) => {
    let isContainer = this.state.isContainer

    if (isContainer && isChecked) {
      Fn.showTips('请确保之前容器状态已关闭', 200, 2)
      return
    }
    this.isContainer(isChecked, data)
  }
  isShowNav = () => {
    this.setState({
      navVisible: !this.state.navVisible
    })
  }
  isShowEditor = () => {
    this.setState({
      editorVisible: !this.state.editorVisible
    })
  }
  test = (data: any) => {
    this.setState({
      filter: data
    })
  }
  render() {
    return (
      <MyContext.Provider
        value={{
          data: {
            filter: this.state.filter
          },
          test: this.test
        }}
      >
        <div className="wrapper_container">
          <div className="tool">
            <span className="tool_btn" onClick={this.isShowNav}>
              导航
            </span>
            <span className="tool_btn" onClick={this.isShowEditor}>
              编辑栏
            </span>
            <span className="tool_btn" onClick={() => this.saveData(true)}>
              保存
            </span>
            <span className="tool_btn" onClick={() => this.saveData(false)}>
              存草稿
            </span>
          </div>
          {/* 左边导航 */}

          <CSSTransition
            in={this.state.navVisible}
            timeout={1000}
            // <!-- classNames是钩子名，为后面的class名前缀 -->
            classNames="nav_visible"
            // <!-- unmountOnExit表示元素隐藏则相应的DOM被移除 -->
            unmountOnExit
            // <!-- appear设为true表示进场动画,CSS中有对应类名 -->
            appear={true}
            // <!--以下为动画钩子函数, 与CSS中相对应-->
          >
            <div className={'navLeft_container'}>
              <NavLeft onClick={this.changeLayout} />
            </div>
          </CSSTransition>

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
                onLayoutChange={(e: GridLayout.Layout[]) => {
                  this.onLayoutChange(e)
                }}
                compactType={null}
                className="layout1"
                preventCollision={true}
                layout={this.state.layout} // 虽然使用了data-grid 这个还是不能删
                cols={96} // 可以把页面分为多少个断点 水平方向
                rowHeight={this.height / 62.46} // 垂直方向 单位grid的高度   //其实就是15 this.height / 62.46
              >
                {this.state.layout.map((item, index) => {
                  return this.getComponent(item, index)
                })}
              </ReactGridLayout>
            </div>
          </div>
          {/* 右边编辑部分 */}
          <CSSTransition
            in={this.state.editorVisible}
            timeout={1000}
            // <!-- classNames是钩子名，为后面的class名前缀 -->
            classNames="editor_visible"
            // <!-- unmountOnExit表示元素隐藏则相应的DOM被移除 -->
            unmountOnExit
            // <!-- appear设为true表示进场动画,CSS中有对应类名 -->
            appear={true}
            // <!--以下为动画钩子函数, 与CSS中相对应-->
          >
            <div className="editor_container">
              <Editor
                deleteItem={this.deleteItem}
                value={this.editorValue()} // 当前模块配置的数据
                saveEditorData={this.saveEditorData}
                containerId={this.state.containerId} // 当前点击容器的id
                configData={this.editor} // 初始化配置数据 生成组件
                storeData={this.storeData}
                isContainerState={this.state.isContainer}
                isContainer={this.isContainer} //函数
                setOpenContainerId={this.setOpenContainerId} // 设置已经是开启状态的容器 产生闪烁的功能
              />
            </div>
          </CSSTransition>
        </div>
      </MyContext.Provider>
    )
  }
}
