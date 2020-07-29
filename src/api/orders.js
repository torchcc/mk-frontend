import myRequest from "@/utils/request";
export const ordersList = (params) => {
    return myRequest({
        url: '/orders/',
        params,
        method: 'GET'
    })
}

export const getOrderById = (id) => {
    return myRequest({
        url: `/orders/${id}`,
        method: 'GET'
    })
}

export const deleteOrder = (id) => {
    return myRequest({
        url: `/orders/${id}`,
        method: 'DELETE'
    })
}

export const createOrder = (data) => {
    return myRequest({
        url: '/orders/',
        data,
        method: 'POST'
    })
}

export const order_items = (data) => {
    return myRequest({
        url: '/order_items/',
        data,
        method: 'PUT'
    })
}
