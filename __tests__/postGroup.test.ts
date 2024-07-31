/**
 * @jest-environment node
 */

import { POST } from '@/app/api/group/route'
import { getGroupCollection } from '@/app/types/db/getCollections'
import { NextRequest } from 'next/server'

//const insert = await (await getGroupCollection()).insertOne(parsedGroup)

const ack = {
    acknowledged: true,
}

jest.mock('../app/types/db/getCollections')
;(getGroupCollection as jest.Mock).mockImplementation(() => {
    return {
        insertOne: (obj: { name: string }) => ack,
    }
})

describe('POST Group Endpoint', () => {
    it('inserts a new group', async () => {
        const req = new Request('http://doesntmatter.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: '1',
            }),
        })

        const response = await POST(req as NextRequest)

        expect(response.status).toBe(200)
    })
})
