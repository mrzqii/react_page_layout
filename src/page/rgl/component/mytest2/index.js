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
  componentDidMount() {
    this.setState({
      test:[{a:Math.random()}]
    })
     
  }
   
testFn = ()=>{
  console.log('===@@@@@@@>test2',);
  this.setState({
    test:[{a:2}]
  })
}
   
  componentDidUpdate(prevProps, prevState, snapshot) {  
      console.log(':componentDidUpdate:');

      
      let value = this.context;
      let filter  = value.data.filter
      if(JSON.stringify(this.filter) === JSON.stringify(filter)) {
        return
      }else {
        this.filter = filter
        this.testFn()

      }
     
  }
  shouldComponentUpdate(nextProps, nextState ){
      console.log('nextState===>',nextState);
      console.log('this.state===>',this.state);
      // if(JSON.stringify(nextState.test) !== JSON.stringify(this.state.test)) return true
      return false
  }
   
  render() {
    let theme = this.context
    console.log('render2===>' );

    return (
      <div style={{ width: '100%', height: '100%', background: '#666' }} >
        <div onClick={()=>{
        theme.test(90)
      }}>按钮</div>
      <div>{JSON.stringify(theme.data)}</div>
        {
          this.state.test.map(item=><div>{item.a}</div>)
        }
        
      </div>
    )
  }
}
MyTest2.contextType = MyContext
