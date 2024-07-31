import { ObjectId } from 'mongodb'

export interface GroupPerson {
    _id?: ObjectId
    group_id: ObjectId
    person_id: ObjectId
}
