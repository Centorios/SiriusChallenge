/**
 * @jest-environment node
 */

import { POST } from '@/app/api/group/add/[person_id]/route'
import {
    getGroupCollection,
    getGroupPersonCollection,
    getPersonCollection,
} from '@/app/types/db/getCollections'
import { StatusCodes } from 'http-status-codes'
import { NextRequest } from 'next/server'

jest.mock('../../../app/types/db/getCollections')
;(getGroupCollection as jest.Mock).mockImplementation(() => {
    return {
        findOne: (obj: { name: string }) => '123',
    }
})
;(getPersonCollection as jest.Mock).mockImplementation(() => {
    return {
        findOne: (obj: { name: string }) => 123,
    }
})
;(getGroupPersonCollection as jest.Mock).mockImplementation(() => {
    return {
        findOne: (obj: { group_id: string; person_id: string }) => null,
        insertOne: (obj: { group_id: string; person_id: string }) => '123',
    }
})

describe('POST Group Add person endpoint', () => {
    it('adds a person to a group using his id and the name of the group', async () => {
        const req = new Request('http://doesntmatter.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: '1',
            }),
        })

        const response = await POST(req as NextRequest, {
            params: { person_id: '66aa929433cc2205b17919c5' },
        })

        expect(response.status).toBe(StatusCodes.OK)
    })
})

afterAll(() => {
    jest.clearAllMocks()
})
