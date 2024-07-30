import { Person } from '../Person'
import { getDb } from './getDb'
import { collectionNames } from './collectionNames'
import { Group } from '../Group'
import { SecretSanta } from '../SecretSanta'
import { GroupPerson } from '../GroupPerson'

export async function getPersonCollection() {
    const db = await getDb()
    return db.collection<Person>(collectionNames.person)
}

export async function getGroupCollection() {
    const db = await getDb()
    return db.collection<Group>(collectionNames.group)
}

export async function getSecretSantaCollection() {
    const db = await getDb()
    return db.collection<SecretSanta>(collectionNames.secretsanta)
}

export async function getGroupPersonCollection() {
    const db = await getDb()
    return db.collection<GroupPerson>(collectionNames.groupperson)
}
