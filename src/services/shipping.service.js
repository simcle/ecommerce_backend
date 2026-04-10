import ShippingService from "../models/ShippingService.js"

export const getServices = async () => {

  return ShippingService.find()
    .sort({ courierName: 1, serviceName: 1 })

}

export const toggleService = async (id, isActive) => {

  const service = await ShippingService.findById(id)

  service.isActive = isActive

  await service.save()

  return service
}


// public

export const getActiveCouriers = async () => {
  
  const couriers = await ShippingService.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: "$courierCode",
        courierCode: { $first: "$courierCode" },
        courierName: { $first: "$courierName" }
      }
    }
  ])
  return couriers
}