import React, { useState } from 'react'
import axios from 'axios'
function Regist() {
    const [tel, setTel] = useState("")
    const [psd, setPsd] = useState("")
    function submit() {
console.log(tel, psd);
        axios({
            url: '/api/user/regist',
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
            <div><label>电话</label><input type="text" value={tel} onChange={telChage}/></div>
            <div><label>密码</label><input type="text" value={psd} onChange={psdChage} /></div>
            <div onClick={submit}>提交</div>
        </div>
    )
}
export default  Regist