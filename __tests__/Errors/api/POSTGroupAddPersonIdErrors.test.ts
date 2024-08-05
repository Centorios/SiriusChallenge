/**
 * @jest-environment node
 */

import { POST } from '@/app/api/group/add/[person_id]/route'
import {
    getGroupCollection,
    getGroupPersonCollection,
    getPersonCollection,
} from '@/app/types/db/getCollections'
import { NextRequest } from 'next/server'

const ack = {
    acknowledged: true,
}

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
        findOne: (obj: { group_id: string; person_id: string }) => 123,
        insertOne: (obj: { group_id: string; person_id: string }) => '123',
    }
})

describe('POST Group Endpoint', () => {
    it('fails to add a person to a group (invalid group name)', async () => {
        const req = new Request('http://doesntmatter.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                lll: '',
            }),
        })
        console.error = jest.fn()

        const response = await POST(req as NextRequest, {
            params: { person_id: '66aa929433cc2205b17919c5' },
        })

        expect(response.status).toBe(400)
        expect(console.error).toHaveBeenCalled()
    })
})

describe('POST Group Endpoint', () => {
    it('fails to add a person to a group (invalid person_id)', async () => {
        const req = new Request('http://doesntmatter.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: '1',
            }),
        })
        console.error = jest.fn()

        const response = await POST(req as NextRequest, {
            params: { person_id: '123' },
        })

        expect(response.status).toBe(400)
        expect(console.error).toHaveBeenCalled()
    })
})

describe('POST Group Endpoint', () => {
    it('fails to add a person to a group (person already in group)', async () => {
        const req = new Request('http://doesntmatter.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: '1',
            }),
        })
        console.error = jest.fn()

        const response = await POST(req as NextRequest, {
            params: { person_id: '123' },
        })

        expect(response.status).toBe(400)
        expect(console.error).toHaveBeenCalled()
    })
})

afterAll(() => {
    jest.clearAllMocks()
})
