/**
 * @jest-environment node
 */

import { POST } from '@/app/api/person/route'
import { getPersonCollection } from '@/app/types/db/getCollections'
import { StatusCodes } from 'http-status-codes'
import { NextRequest } from 'next/server'

const ack = {
    acknowledged: true,
}

jest.mock('../../../app/types/db/getCollections')
;(getPersonCollection as jest.Mock).mockImplementation(() => {
    return {
        insertOne: (obj: { name: string }) => ack,
    }
})

describe('POST Person Endpoint', () => {
    it('fails to create a new person (invalid name)', async () => {
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

        const response = await POST(req as NextRequest)

        expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
        expect(console.error).toHaveBeenCalled()
    })
})

describe('POST Person Endpoint', () => {
    it('fails to create a new person (empty name)', async () => {
        const req = new Request('http://doesntmatter.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: '',
            }),
        })
        console.error = jest.fn()

        const response = await POST(req as NextRequest)

        expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
        expect(console.error).toHaveBeenCalled()
    })
})

afterAll(() => {
    jest.clearAllMocks()
})
