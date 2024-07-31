import { Long, ObjectId } from 'mongodb'

export interface Group {
    _id?: ObjectId
    name: Long
}
