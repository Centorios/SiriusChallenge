import { ObjectId } from 'mongodb'

export interface Person {
    id?: ObjectId
    name: string
}
