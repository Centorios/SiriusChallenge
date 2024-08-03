import { ObjectId } from 'mongodb'

export interface SecretSanta {
    _id?: ObjectId
    gifterId: ObjectId
    gifteeId: ObjectId
    group_id: ObjectId
    year: number
}
