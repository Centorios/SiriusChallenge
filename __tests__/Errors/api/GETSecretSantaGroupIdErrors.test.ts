/**
 * @jest-environment node
 */

import { GET } from '@/app/api/secret_santa/[group_id]/route'
import {
    getGroupPersonCollection,
    getPersonCollection,
    getSecretSantaCollection,
} from '@/app/types/db/getCollections'
import { StatusCodes } from 'http-status-codes'
import { ObjectId } from 'mongodb'
import { NextRequest } from 'next/server'

jest.mock('../../../app/types/db/getCollections')
;(getSecretSantaCollection as jest.Mock).mockImplementation(() => {
    return {
        find: jest.fn().mockReturnThis(),
        toArray: jest.fn().mockResolvedValue([
            {
                _id: new ObjectId('66aa929433cc2205b17919c6'),
                gifterId: new ObjectId('56aa929433cc2205b17919c5'),
                gifteeId: new ObjectId('46aa929433cc2205b17919c5'),
                group_id: new ObjectId('66aa929433cc2205b17919c5'),
                year: 2021,
            },
            {
                _id: new ObjectId('66aa929433cc2205b17919c4'),
                gifterId: new ObjectId('46aa929433cc2205b17919c5'),
                gifteeId: new ObjectId('56aa929433cc2205b17919c5'),
                group_id: new ObjectId('66aa929433cc2205b17919c5'),
                year: 2021,
            },
            {
                _id: new ObjectId('66aa929433cc2205b17919c7'),
                gifterId: new ObjectId('56aa929433cc2205b17919c5'),
                gifteeId: new ObjectId('46aa929433cc2205b17919c5'),
                group_id: new ObjectId('66aa929433cc2205b17919c5'),
                year: 2022,
            },
            {
                _id: new ObjectId('66aa929433cc2205b17919c8'),
                gifterId: new ObjectId('46aa929433cc2205b17919c5'),
                gifteeId: new ObjectId('56aa929433cc2205b17919c5'),
                group_id: new ObjectId('66aa929433cc2205b17919c5'),
                year: 2022,
            },
        ]),
        sort: jest.fn().mockReturnThis(),
    }
})
;(getGroupPersonCollection as jest.Mock).mockImplementation(() => {
    return {
        find: jest.fn().mockReturnThis(),
        toArray: jest.fn().mockResolvedValue([
            {
                _id: new ObjectId('66aa929433cc2205a17919c5'),
                person_id: new ObjectId('56aa929433cc2205b17919c5'),
                group_id: new ObjectId('66aa929433cc2205b17919c5'),
            },
            {
                _id: new ObjectId('66aa929433cc2205a17919c5'),
                person_id: new ObjectId('46aa929433cc2205b17919c5'),
                group_id: new ObjectId('66aa929433cc2205b17919c5'),
            },
        ]),
    }
})
;(getPersonCollection as jest.Mock).mockImplementation(() => {
    return {
        find: jest.fn().mockReturnThis(),
        toArray: jest.fn().mockResolvedValue([
            {
                _id: new ObjectId('46aa929433cc2205b17919c5'),
                name: 'person1',
            },
            {
                _id: new ObjectId('56aa929433cc2205b17919c5'),
                name: 'person2',
            },
        ]),
    }
})

describe('GET secret_santa Endpoint', () => {
    it('fails to get history of secret santas (undefined group_id)', async () => {
        const req = new Request('http://doesntmatter.com', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        console.error = jest.fn()

        const response = await GET(req as NextRequest, {
            params: { group_id: '' },
        })

        expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR)

        expect(console.error).toHaveBeenCalled()
    })
})

describe('GET secret_santa Endpoint', () => {
    it('fails to get history of secret santas (invalid group_id)', async () => {
        const req = new Request('http://doesntmatter.com', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        console.error = jest.fn()

        const response = await GET(req as NextRequest, {
            params: { group_id: '123' },
        })

        expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR)

        expect(console.error).toHaveBeenCalled()
    })
})

describe('GET secret_santa Endpoint', () => {
    it('tries to get the history of a group without persons', async () => {
        const req = new Request('http://doesntmatter.com', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        ;(getGroupPersonCollection as jest.Mock).mockImplementation(() => {
            return {
                find: jest.fn().mockReturnThis(),
                toArray: jest.fn().mockResolvedValue([]),
            }
        })

        const response = await GET(req as NextRequest, {
            params: { group_id: '66aa929433cc2205b17919c5' },
        })

        expect(response.status).toBe(StatusCodes.NO_CONTENT)

        expect(response.body).toBeNull()
    })
})

describe('GET secret_santa Endpoint', () => {
    it('tries to get the history of a group without history', async () => {
        const req = new Request('http://doesntmatter.com', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        ;(getSecretSantaCollection as jest.Mock).mockImplementation(() => {
            return {
                find: jest.fn().mockReturnThis(),
                toArray: jest.fn().mockResolvedValue([]),
                sort: jest.fn().mockReturnThis(),
            }
        })

        const response = await GET(req as NextRequest, {
            params: { group_id: '66aa929433cc2205b17919c5' },
        })

        expect(response.status).toBe(StatusCodes.NO_CONTENT)

        expect(response.body).toBeNull()
    })
})

describe('GET secret_santa Endpoint', () => {
    it('tries to get the name of a person that doesnt exist (this should never happen)', async () => {
        const req = new Request('http://doesntmatter.com', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        ;(getPersonCollection as jest.Mock).mockImplementation(() => {
            return {
                find: jest.fn().mockReturnThis(),
                toArray: jest.fn().mockResolvedValue([]),
            }
        })

        const response = await GET(req as NextRequest, {
            params: { group_id: '66aa929433cc2205b17919c5' },
        })

        expect(response.status).toBe(StatusCodes.NO_CONTENT)

        expect(response.body).toBeNull()
    })
})

afterAll(() => {
    jest.clearAllMocks()
})
