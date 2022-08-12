import { MCEvent } from '@managed-components/types'
import { getRequestBody } from './track'

const EVENT_NAMES_MAP: { [k: string]: string } = {
  'Order Completed': 'PlaceAnOrder',
  'Product Added': 'AddToCart',
  'Products Searched': 'Search',
  'Checkout Started': 'InitiateCheckout',
  'Payment Info Entered': 'AddPaymentInfo',
  'Product Added to Wishlist': 'AddToWishlist',
  'Product Viewed': 'ViewContent',
  'Product List Viewed': 'ViewContent',
}

const getContentIdsWithQuantityAndPrice = (payload: any) => {
  return [
    ...(payload.products?.map((p: any) => {
      return { quantity: p.quantity, id: p.id, price: p.price }
    }) || []),
    ...(({
      quantity: payload.quantity,
      id: payload.id,
      price: payload.price,
    } && [
      { quantity: payload.quantity, id: payload.id, price: payload.price },
    ]) ||
      []),
  ]
}

const getContentIds = (payload: any) => {
  return [
    ...(payload.products?.map((p: any) => p.sku || p.product_id) || []),
    ...(((payload.sku || payload.product_id) && [
      payload.sku || payload.product_id,
    ]) ||
      []),
  ]
}

const getValue = (payload: any) =>
  payload.value || payload.price || payload.total || payload.revenue

const mapEcommerceData = (event: MCEvent) => {
  const payload = event.payload?.ecommerce || event.payload
  const properties: { [k: string]: any } = {}

  properties.currency = payload.currency?.toUpperCase()

  if (event.name === 'Products Searched') {
    properties.query = payload.query
  }

  if (event.name === 'Product List Viewed') {
    properties.content_type = 'product_group'
  }

  if (event.name && ['Order Completed', 'Product Added'].includes(event.name)) {
    properties.contents = getContentIdsWithQuantityAndPrice(payload).map(
      item => {
        return {
          content_type: 'product',
          content_id: item.id,
          quantity: item.quantity,
          price: item.price,
        }
      }
    )
  }

  if (
    event.name &&
    [
      'Product Viewed',
      'Product Added to Wishlist',
      'Product List Viewed',
    ].includes(event.name)
  ) {
    properties.contents = getContentIds(payload).map(id => {
      return {
        content_type: 'product',
        content_id: id,
      }
    })
  }

  const value = getValue(payload)
  if (value) {
    properties.value = value
  }

  return properties
}

export const getEcommerceRequestBody = async (event: MCEvent) => {
  const ecommerceData = mapEcommerceData(event)
  const request = await getRequestBody(event)

  return {
    ...request,
    event: EVENT_NAMES_MAP[event.name || ''] || event.name,
    properties: ecommerceData,
  }
}
