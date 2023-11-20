


export const getItem = ({str}) =>{

    const item  = localStorage.getItem(str)
    if(item){
        return JSON.parse(item)
    }
    return null
}