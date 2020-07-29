import React, { Component,PureComponent } from 'react'
import { MyContext } from '../../context'
export default class MyTest2 extends Component {
  constructor(props){
    super(props)
    this.state = {
      test:[{a:1}]
    }
    this.filter = {}
  }
  static editorConfig = [
    {
      text: 'test',
      type: 'show_name' // 组件名称
    }
  ]
  
  render() {
    
    console.log('render2===>' );

    return (
      <div style={{ width: '100%', height: '100%', background: 'red',color:"#fff" }} >
        这是组件test2
      </div>
    )
  }
}
 
