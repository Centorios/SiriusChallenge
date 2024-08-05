/**
 * @jest-environment node
 */

import { POST } from '@/app/api/V1/secret_santa/[group_id]/route'
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
                gifterId: new ObjectId('66ba929433cc2205b17919c6'),
                gifteeId: new ObjectId('66bb929433cc2205b17919c6'),
                group_id: new ObjectId('66aa929433cc2205b17919c5'),
                year: 2021,
            },
            {
                _id: new ObjectId('66aa929433cc2205b17919c4'),
                gifterId: new ObjectId('66bb929433cc2205b17919c6'),
                gifteeId: new ObjectId('66bc929433cc2205b17919c6'),
                group_id: new ObjectId('66aa929433cc2205b17919c5'),
                year: 2021,
            },
            {
                _id: new ObjectId('66aa929433cc2205b17919c7'),
                gifterId: new ObjectId('66bc929433cc2205b17919c6'),
                gifteeId: new ObjectId('66bd929433cc2205b17919c6'),
                group_id: new ObjectId('66aa929433cc2205b17919c5'),
                year: 2021,
            },
            {
                _id: new ObjectId('66aa929433cc2205b17919c8'),
                gifterId: new ObjectId('66bd929433cc2205b17919c6'),
                gifteeId: new ObjectId('66ba929433cc2205b17919c6'),
                group_id: new ObjectId('66aa929433cc2205b17919c5'),
                year: 2021,
            },
        ]),
        sort: jest.fn().mockReturnThis(),
        insertMany: jest.fn().mockResolvedValue({ acknowledged: true }),
    }
})
;(getGroupPersonCollection as jest.Mock).mockImplementation(() => {
    return {
        find: jest.fn().mockReturnThis(),
        toArray: jest.fn().mockResolvedValue([
            {
                _id: new ObjectId('66aa929433cc2205a17919c5'),
                person_id: new ObjectId('66ba929433cc2205b17919c6'),
                group_id: new ObjectId('66aa929433cc2205b17919c5'),
            },
            {
                _id: new ObjectId('66aa929433cc2205a17919c5'),
                person_id: new ObjectId('66bb929433cc2205b17919c6'),
                group_id: new ObjectId('66aa929433cc2205b17919c5'),
            },
            {
                _id: new ObjectId('66aa929433cc2205a17919c5'),
                person_id: new ObjectId('66bc929433cc2205b17919c6'),
                group_id: new ObjectId('66aa929433cc2205b17919c5'),
            },
            {
                _id: new ObjectId('66aa929433cc2205a17919c5'),
                person_id: new ObjectId('66bd929433cc2205b17919c6'),
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
                _id: new ObjectId('66ba929433cc2205b17919c6'),
                name: 'person1',
            },
            {
                _id: new ObjectId('66bb929433cc2205b17919c6'),
                name: 'person2',
            },
            {
                _id: new ObjectId('66bc929433cc2205b17919c6'),
                name: 'person3',
            },
            {
                _id: new ObjectId('66bd929433cc2205b17919c6'),
                name: 'person4',
            },
        ]),
    }
})

describe('POST V1/secret_santa Endpoint', () => {
    it('fails to roll a new set of secret santas (invalid group id)', async () => {
        const req = new Request('http://doesntmatter.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        console.error = jest.fn()

        const response = await POST(req as NextRequest, {
            params: { group_id: '123' },
        })

        expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR)

        expect(console.error).toHaveBeenCalled()
    })
})

describe('POST V1/secret_santa Endpoint', () => {
    it('fails to roll a new set of secret santas (no group id)', async () => {
        const req = new Request('http://doesntmatter.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        console.error = jest.fn()

        const response = await POST(req as NextRequest, {
            params: { group_id: '' },
        })

        expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR)

        expect(console.error).toHaveBeenCalled()
    })
})

describe('POST V1/secret_santa Endpoint', () => {
    it('fails to roll a new set of secret santas (no people in group)', async () => {
        const req = new Request('http://doesntmatter.com', {
            method: 'POST',
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

        console.error = jest.fn()

        const response = await POST(req as NextRequest, {
            params: { group_id: '66aa929433cc2205b17919c5' },
        })

        expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR)

        expect(console.error).toHaveBeenCalled()
    })
})

describe('POST V1/secret_santa Endpoint', () => {
    it('fails to roll a new set of secret santas (people in the group do not exist) (this should not happen)', async () => {
        const req = new Request('http://doesntmatter.com', {
            method: 'POST',
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

        console.error = jest.fn()

        const response = await POST(req as NextRequest, {
            params: { group_id: '66aa929433cc2205b17919c5' },
        })

        expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR)

        expect(console.error).toHaveBeenCalled()
    })
})

afterAll(() => {
    jest.clearAllMocks()
})
