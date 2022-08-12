import { MCEvent } from '@managed-components/types'
import crypto from 'crypto'

const getClickId = (event: MCEvent) => {
  const { client } = event
  let ttclid = client.get('tk-click') || ''

  if (client.url.searchParams?.has('ttclid')) {
    ttclid = String(client.url.searchParams.get('ttclid'))
    client.set('tk-click', ttclid)
  }
  return ttclid
}

const getTtp = (event: MCEvent): string => {
  const { client } = event
  const ttp = client.get('_ttp')
  if (!ttp) {
    const uid = crypto.randomUUID()
    client.set('_ttp', uid, { scope: 'infinite' })
    return uid
  }

  return ttp
}

const getRequestBody = async (event: MCEvent) => {
  const { client } = event

  const body: { [k: string]: any } = {
    context: {
      ad: {
        callback: undefined,
      },
      ip: client.ip,
      user_agent: client.userAgent,
      page: {
        url: client.url.toString(),
        referrer: client.referer,
      },
      user: {
        external_id: client.get('external_id'),
        phone_number: client.get('ph'),
        email: client.get('em'),
        ttp: getTtp(event),
      },
    },
    properties: {
      contents: [],
    },
    event_id: String(Math.round(Math.random() * 100000000000000000)),
    timestamp: new Date().toISOString(),
  }

  const ttkclid = getClickId(event)
  if (ttkclid) {
    body.context.ad.callback = ttkclid
  } else {
    body.context.ad = undefined
  }

  const encoder = new TextEncoder()
  if (body.context.user.phone_number) {
    const data = encoder.encode(
      body.context.user.phone_number.trim().toLowerCase()
    )
    body.context.user.phone_number = await crypto
      .createHash('sha256')
      .update(data)
      .digest('hex')
  }

  if (body.context.user.email) {
    const data = encoder.encode(body.context.user.email.trim().toLowerCase())
    body.context.user.email = await crypto
      .createHash('sha256')
      .update(data)
      .digest('hex')
  }

  return body
}

export { getRequestBody }
