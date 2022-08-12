import { ComponentSettings, Manager } from '@managed-components/types'
import { getEcommerceRequestBody } from './ecommerce'
import { getRequestBody } from './track'

const sendEvent = async (payload: any, settings: ComponentSettings) => {
  const endpoint = 'https://business-api.tiktok.com/open_api/v1.2/pixel/track/'
  const { pixelId, accessToken, testEventCode } = settings

  payload.pixel_code = pixelId

  if (testEventCode) {
    payload.test_event_code = testEventCode
  }

  fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Token': accessToken,
    },
    body: JSON.stringify(payload),
  })
}

export default async function (manager: Manager, settings: ComponentSettings) {
  manager.addEventListener('ecommerce', async event => {
    const request = await getEcommerceRequestBody(event)
    sendEvent(request, settings)
  })

  manager.addEventListener('pageview', async event => {
    const request = await getRequestBody(event)
    request.event = 'ViewContent'

    sendEvent(request, settings)
  })
}
