import { Db, MongoClient } from 'mongodb'
import { getSettings } from '../getSettings'

let client: MongoClient | undefined = undefined

export const getDb = async (): Promise<Db> => {
    const { mongodbname, mongourl } = getSettings()

    if (!client) {
        client = new MongoClient(mongourl)
        await client.connect()
    }
    return client.db(mongodbname)
}
