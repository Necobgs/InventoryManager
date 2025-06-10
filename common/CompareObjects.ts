export default function compareObjects(obj1:any,obj2:any,exclude:string | undefined=undefined){
    const keys = Object.keys(obj1)
    return keys.every((key)=> obj1[key] === obj2[key] || key === exclude)
}