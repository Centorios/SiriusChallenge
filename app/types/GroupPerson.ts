import { UUID } from 'mongodb'

export interface GroupPerson {
    id: UUID
    group_id: UUID
    person_id: UUID
}
