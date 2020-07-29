import myRequest from "@/utils/request";

export const enter = (params)=>{
    return myRequest({
        url:'/wx/enter',
        params,
        method:'get'
    })
}

export const enterUrl = (params)=>{
    return myRequest({
        url:'/wx/enter_url',
        params,
        method:'get'
    })
}



export const location = (data) => {
    return myRequest({
        url: '/location/',
        data,
        method: 'POST'
    })
}