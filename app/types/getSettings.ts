export type Settings = {
    mongodbname: string
    mongourl: string
}

export function getSettings() {
    return {
        mongodbname: process.env.MONGO_DB_NAME || 'localhost',
        mongourl: process.env.MONGO_URL || 'mongodb://localhost:27017',
        secret_santa_years: process.env.YEARS_TO_REPEAT_SECRET_SANTA || 3,
    }
}
