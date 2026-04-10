import StoreSetting from '../models/StoreSetting.js'

export const getStoreSetting = async () => {
  let store = await StoreSetting.findOne()

  return store
}

export const updateStoreSetting = async (payload) => {
  let store = await StoreSetting.findOne()

  if (!store) {
    store = await StoreSetting.create(payload)
  } else {
    Object.assign(store, payload)
    await store.save()
  }

  return store
}