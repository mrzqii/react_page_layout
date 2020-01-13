import React, { Component } from 'react'

export default class MyTest extends Component {
  static editorConfig = [
    {
      text: 'test',
      type: 'show_name' // 组件名称
    }
  ]
  render() {
    return (
      <div style={{ width: '100%', height: '100%', background: '#666' }}>
        MyTest
      </div>
    )
  }
}
