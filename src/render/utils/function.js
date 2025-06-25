


export const getItem = ({str, defaultValue=null}, ) =>{

    const item  = localStorage.getItem(str)
    if(item){
        return JSON.parse(item)
    }
    return defaultValue
}