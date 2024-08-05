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
    it('gets the history of secret santas of a group by the id of the group', async () => {
        const req = new Request('http://doesntmatter.com', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        const response = await GET(req as NextRequest, {
            params: { group_id: '66aa929433cc2205b17919c5' },
        })

        expect(response.status).toBe(StatusCodes.OK)

        const data = await response.json()

        expect(data).toEqual({
            '2021': { person1: 'person2', person2: 'person1' },
            '2022': { person1: 'person2', person2: 'person1' },
        })
    })
})

afterAll(() => {
    jest.clearAllMocks()
})
