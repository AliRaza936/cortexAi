import redis from "../../../shared/redis/redis.js"

const Limits={
    chat:20,
    coding:5,
    pdf:2,
    ppt:2,
    image:2,
    search:2
}
export const checkAgentLimit = async(userId,agent)=>{
    const max = Limits[agent] || Limits['chat']
    const key = `rate:${userId}:${agent}`
    const count = await redis.incr(key)

    if(count == 1){
        await redis.expire(key,60 * 5)
    }
    const ttl = await redis.ttl(key)

    if(count > max){
        const minutes = Math.floor(ttl/60)
        const seconds = (ttl % 60) 
        const time = minutes > 0 ? `${minutes}m : ${seconds}s`:`${seconds}s`
        const error = new Error(`Rate limit exceeded for ${agent}`)
        error.status = 429
        error.data = {
            success:false,
            agent,
            limit:max,
            remainingTime:ttl,
            retryAfter:time,
            message:`You have reached the ${agent} agent limit (${max} requests / 5 minutes). Try again in ${time}`
        }
        throw error
    }
    return{
        remaining:max-count,
        limit:max
    }
    
}