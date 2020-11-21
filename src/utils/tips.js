import {
    Message
} from 'element-ui'

export const errTips = (msg) => {
    Message.error({
        message: msg,
        duration: 1500
    })
}
export const uploadError = () => {
    Message.error({
        message: "页面已过期",
        duration: 1000
    })
}
export const message = (msg) => {
    Message({
        message: msg,
        duration: 1000
    })
}
export const successTips = (msg) => {
    Message({
        message: msg,
        type: 'success',
        duration: 1500
    });
}
