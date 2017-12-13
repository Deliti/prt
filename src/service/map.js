export const MP =  ak => {
    return new Promise((resolve, reject) => {
        window.init = () => {
              resolve(BMap)
         }
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "http://api.map.baidu.com/api?v=2.0&ak="+ak+"&callback=init";
        script.onerror = reject;
        document.body.appendChild(script);
      })
}
