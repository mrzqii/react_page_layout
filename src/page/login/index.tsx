import React, { useState } from 'react'
import axios from 'axios'
function Login() {
    const [tel, setTel] = useState("")
    const [psd, setPsd] = useState("")
    function submit() {
 
        axios({
            url: '/api/user/login',
            method: 'POST',
            baseURL: 'http://localhost:3005/',
            timeout: 30000,
            data: {
              tel: tel,
              psd:psd
            }
          })
            .then(response => {
              let res = response.data
              
            })
             
        
    }
    function telChage(event:React.ChangeEvent) {
        let val = (event.target as HTMLInputElement).value
        setTel(val)
    }
    function psdChage(event:React.ChangeEvent) {
        let val = (event.target as HTMLInputElement).value
        setPsd(val)
    }
    return (
        <div>
            <div><label>电话test</label><input type="text" value={tel} onChange={telChage}/></div>
            <div><label>密码test</label><input type="text" value={psd} onChange={psdChage} /></div>
            <div onClick={submit}>提交</div>
        </div>
    )
}
export default  Login