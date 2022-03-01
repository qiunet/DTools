/**
 * ipc Main channel name
 */
export type MainChannel =
    'request_msg'
    |'close_client'
    |'host_port_setting'


/**
 * renderer channel name
 */
export type RendererChannel =
    'response_msg'
    |'client_closed'
