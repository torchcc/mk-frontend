import myRequest from "@/utils/request";

export const getExaminees = (params) => {
    return myRequest({
        url: '/users/examinees',
        params,
        method: 'get'
    })
}

export const addExaminess = (data) => {
    return myRequest({
        url: '/users/examinees',
        data,
        method: 'post'
    })
}


export const editExaminess = (data,id) => {
    return myRequest({
        url: '/users/examinees/'+id,
        data,
        method: 'put'
    })
}




export const deleteExaminess = (id) => {
    return myRequest({
        url: '/users/examinees/'+id,
        method: 'delete'
    })
}



export const getAddrs = () => {
    return myRequest({
        url: '/users/addrs',
        method: 'get'
    })
}

export const getAddrsById = (id) => {
    return myRequest({
        url: '/users/addrs/'+id,
        method: 'get'
    })
}

export const addAddrs = (data) => {
    return myRequest({
        url: '/users/addrs',
        data,
        method: 'post'
    })
}

export const editAddrs = (data,id) => {
    return myRequest({
        url: '/users/addrs/'+ id,
        data,
        method: 'put'
    })
}


export const deleteAddrs = (id) => {
    return myRequest({
        url: '/users/addrs/'+ id,
        method: 'delete'
    })
}


export const regions = (params) => {
    return myRequest({
        url: '/regions/',
        method: 'get',
        params
    })
}

