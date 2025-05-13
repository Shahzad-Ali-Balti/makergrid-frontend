export interface Message {
    id: number,
    sender_username: string,
    content: string,
    timestamp: number | string  // <- allow both number and string
    seen?:boolean
  }
  