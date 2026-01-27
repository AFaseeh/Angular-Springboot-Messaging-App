import { ChatUser } from "./ChatUser"

export interface Message {
    id?: number
    user: ChatUser
    text: string
    //time: Date
}