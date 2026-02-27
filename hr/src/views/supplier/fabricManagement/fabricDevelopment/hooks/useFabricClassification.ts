import {
  getFabricClassSelectlist
} from '@/api/supplier/fabricManagement/center'
import asyncWrapper from '@/utils/asyncWrapper'
export  function useFabricClassification(){
  const fabricClassOptions:any = ref([])
  const initOptions = async () => {
    const [data,error] = await asyncWrapper(getFabricClassSelectlist({ name: '' }))
    if(!error){
        fabricClassOptions.value = data.map(x =>{
           return {
              label:x.name,
              value:x.id
           }
        })
    }  
}
 
  const render=  val =>{
      if(!val)return
    const list = val.split(",")
     return  list.map(cur => 
        fabricClassOptions.value.find(x => x.value === cur)?.label
    ).filter(Boolean).join(',');
  }
  return [initOptions,render,fabricClassOptions]
}

