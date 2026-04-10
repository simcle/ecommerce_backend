import axios from "axios"
import ShippingService from "../models/ShippingService.js"

export const syncServices = async () => {

  const response = await axios.get(
    "https://api.biteship.com/v1/couriers",
    {
      headers: {
        Authorization: `Bearer ${process.env.BITESHIP_API_KEY}`
      }
    }
  )
  const services = response.data.couriers

  for (const item of services) {

    const exist = await ShippingService.findOne({
      courierCode: item.courier_code,
      serviceCode: item.courier_service_code
    })

    if (!exist) {

      await ShippingService.create({

        courierCode: item.courier_code,
        courierName: item.courier_name,

        serviceCode: item.courier_service_code,
        serviceName: item.courier_service_name,

        description: item.description,
        serviceType: item.service_type,

        shippingType: item.shipping_type,

        shipmentDurationRange: item.shipment_duration_range,
        shipmentDurationUnit: item.shipment_duration_unit,

        isActive: false

      })

    }

  }

}