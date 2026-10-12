import api from "../../utils/axios"

export const getConversation= async()=>{
    try {
        console.log('get conversaiton')
        const {data} = await api.get('/api/chat/get-conversations')
        console.log(data)
        return data
     } catch (error) {
        console.log(error)
        return []
    }
}