import { ObjectId } from 'mongodb'

export interface SecretSanta {
    _id?: ObjectId
    gifterId: ObjectId
    gifteeId: ObjectId
    groupId: ObjectId
    year: number
}
