/**
 * @jest-environment node
 */

import { POST } from '@/app/api/V2/secret_santa/[group_id]/route'
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
        sort: jest.fn().mockReturnThis(),
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
            {
                _id: new ObjectId('66aa929433cc2205b17919c6'),
                gifterId: new ObjectId('66ba929433cc2205b17919c6'),
                gifteeId: new ObjectId('66bd929433cc2205b17919c6'),
                group_id: new ObjectId('66aa929433cc2205b17919c5'),
                year: 2022,
            },
            {
                _id: new ObjectId('66aa929433cc2205b17919c4'),
                gifterId: new ObjectId('66bd929433cc2205b17919c6'),
                gifteeId: new ObjectId('66bc929433cc2205b17919c6'),
                group_id: new ObjectId('66aa929433cc2205b17919c5'),
                year: 2022,
            },
            {
                _id: new ObjectId('66aa929433cc2205b17919c7'),
                gifterId: new ObjectId('66bc929433cc2205b17919c6'),
                gifteeId: new ObjectId('66bb929433cc2205b17919c6'),
                group_id: new ObjectId('66aa929433cc2205b17919c5'),
                year: 2022,
            },
            {
                _id: new ObjectId('66aa929433cc2205b17919c8'),
                gifterId: new ObjectId('66bb929433cc2205b17919c6'),
                gifteeId: new ObjectId('66ba929433cc2205b17919c6'),
                group_id: new ObjectId('66aa929433cc2205b17919c5'),
                year: 2022,
            },
            {
                _id: new ObjectId('66aa929433cc2205b17919c6'),
                gifterId: new ObjectId('66ba929433cc2205b17919c6'),
                gifteeId: new ObjectId('66bc929433cc2205b17919c6'),
                group_id: new ObjectId('66aa929433cc2205b17919c5'),
                year: 2023,
            },
            {
                _id: new ObjectId('66aa929433cc2205b17919c4'),
                gifterId: new ObjectId('66bc929433cc2205b17919c6'),
                gifteeId: new ObjectId('66ba929433cc2205b17919c6'),
                group_id: new ObjectId('66aa929433cc2205b17919c5'),
                year: 2023,
            },
            {
                _id: new ObjectId('66aa929433cc2205b17919c7'),
                gifterId: new ObjectId('66bd929433cc2205b17919c6'),
                gifteeId: new ObjectId('66bb929433cc2205b17919c6'),
                group_id: new ObjectId('66aa929433cc2205b17919c5'),
                year: 2023,
            },
            {
                _id: new ObjectId('66aa929433cc2205b17919c8'),
                gifterId: new ObjectId('66bb929433cc2205b17919c6'),
                gifteeId: new ObjectId('66bd929433cc2205b17919c6'),
                group_id: new ObjectId('66aa929433cc2205b17919c5'),
                year: 2023,
            },
        ]),
        insertMany: jest.fn().mockResolvedValue({ acknowledged: true }),
    }
})
;(getGroupPersonCollection as jest.Mock).mockImplementation(() => {
    return {
        find: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
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
                name: 'A',
            },
            {
                _id: new ObjectId('66bb929433cc2205b17919c6'),
                name: 'B',
            },
            {
                _id: new ObjectId('66bc929433cc2205b17919c6'),
                name: 'C',
            },
            {
                _id: new ObjectId('66bd929433cc2205b17919c6'),
                name: 'D',
            },
        ]),
        sort: jest.fn().mockReturnThis(),
    }
})

describe('POST V2/secret_santa Endpoint', () => {
    it('rolls a new set of secret santas for the given group_id (without anyone being their own secret santa and also not repeating after the third year)', async () => {
        const req = new Request('http://doesntmatter.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        const response = await POST(req as NextRequest, {
            params: { group_id: '66aa929433cc2205b17919c5' },
        })

        expect(response.status).toBe(StatusCodes.OK)

        const data = await response.json()

        expect(data).toEqual({
            A: 'D',
            B: 'A',
            C: 'B',
            D: 'C',
        })
    })
})

afterAll(() => {
    jest.clearAllMocks()
})
