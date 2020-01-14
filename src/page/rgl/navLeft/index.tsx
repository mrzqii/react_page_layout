import React, { Component,  ReactNode } from 'react'
import {ComlistOne} from '../type'
import './index.scss'
type Props = {
  onClick(type:ComlistOne): void
  children?: ReactNode
}
 
type State = {
  comlist: ComlistOne[]
}
export default class NavLeft extends Component<Props, State> {
  state = {
    comlist: [
      { value: '容器', type: 'container', icon: 'iconziyuan11' },
      { value: 'test', type: 'test', icon: 'iconziyuan11' },
    ]
  }
  height: number = document.body.clientHeight
  render() {
    return <div className="nl">
        <div className="nl-title">
          组件栏
        </div>
        <ul className='nl-content'>
            {this.state.comlist.map((item,i)=>{
                return(
                    <li className="nl-li" key={i} onClick={()=>{
                        this.props.onClick(item)
                    }}>
                        {item.value}
                    </li>
                )
            })}
        </ul>
    </div>
  }
}
