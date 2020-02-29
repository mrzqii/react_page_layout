const throttle = function (fn, delay) {
    var timer = null;
    return function () {
        var args = arguments; //参数集合
        clearTimeout(timer);
        timer = setTimeout(function () {
            fn.apply(this, args);
        }, delay);
    }
}


/**
   * 获取新的layout
   */
  const getNewLayout5 = (data, key,newd)=>{
    return data.map(item=>{
        if(item.id ===key){
              return {...item, editorData: newd}
        }else if(item.id !==key && item.layout){
            let temp = getNewLayout5(item.layout, key,newd)
            return {...item, layout: temp}
        }else {
            return item
        }
    })
}

/**
   * 获取新的layout
   */
  const getNewLayout4 = (data, key,isChecked)=>{
    return data.map(item=>{
        if(item.id ===key){
            if (isChecked) {
                return {...item, static: true}
            } else {
                return {...item, static: false}
            }
        }else if(item.id !==key && item.layout){
            let temp = getNewLayout4(item.layout, key,isChecked)
            return {...item, layout: temp}
        }else {
            return item
        }
    })
}
/**
   * 通过id找到id对应的组件type
   */
const findTypeFromId = (data,id,type)=>{
     
    data.forEach(item=>{
      if(item.id===id){
        type = item.type
      }
      if(item.id!==id && item.layout){
        type = findTypeFromId(item.layout, id, type)
      }
    })
    return type
}

/**
 * 找到当前容器状态为开启的容器的id
 * @param {*} data 
 */
const findOpenContainerId = (data)=>{
    let id 
    data.forEach(item=>{
      if(item.type==="container"){
          let editorData = item.editorData || {}
          if(editorData.switch) id=item.id
      }
    })
    return id
}
/**
 * 深拷贝
 * @param {*} target 
 * @param {*} map 
 */
const clone = (target, map = new WeakMap()) => {
    if (typeof target === 'object') {
      const isArray = Array.isArray(target)
      let cloneTarget = isArray ? [] : {}
      if (map.get(target)) {
        return map.get(target)
      }
      map.set(target, cloneTarget)
      const keys = isArray ? undefined : Object.keys(target)
  
      ;(keys || target).forEach((value, key) => {
        if (keys) key = value
        cloneTarget[key] = clone(target[key], map)
      })
      return cloneTarget
    }
    return target
  }
/**
 * 轻提示 showTips("请输入手机号和验证码", 200, 2)
 * @param {*} content 
 * @param {*} height 
 * @param {*} time 
 */
  const showTips=(content, height, time) =>{
      
    //窗口的宽度  
    const windowWidth = document.body.clientWidth
    const container = document.createElement('div');
    container.setAttribute('class', 'tipsClass');
    container.innerHTML = content
    const body  =document.querySelector("body")

    body.appendChild(container);
    const node  =document.querySelector('div.tipsClass')
     
    node.style.top = height + 'px'
    node.style.left = (windowWidth / 2) - 350 / 2 + 'px'
    node.style.position = 'absolute'
    node.style.padding = '10px 16px'
    node.style.background ='#fff'
    node.style.boxShadow ='0 4px 12px rgba(0, 0, 0, 0.15)'
    node.style.margin = '0 auto'
    node.style.fontSize = '12px'
    node.style.height = 'auto'
    node.style.color = 'rgba(0, 0, 0, 0.65)'
    node.style.borderRadius = '5px'
    node.style.textAlign = 'center'
    node.style.pointerEvents = 'all'
    node.setAttribute('class', 'component-message-wrap-fadein');
    node.style.display = 'inline-block'
	setTimeout(function () { 
		node.setAttribute('class', 'component-message-wrap-fadeout');
		setTimeout(function(){
			body.removeChild(node);
		},2000)
	}, (time * 1000));
}
export {throttle,getNewLayout5,getNewLayout4,findTypeFromId,findOpenContainerId,clone,showTips}

 