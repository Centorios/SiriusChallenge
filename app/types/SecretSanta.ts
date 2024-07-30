import { UUID } from 'mongodb'

export interface SecretSanta {
    id: UUID
    gifterId: UUID
    gifteeId: UUID
    year: number
}
