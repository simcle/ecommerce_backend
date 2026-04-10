import * as ShippingService from "../services/shipping.service.js"
import * as BiteshipService from "../services/biteship.service.js"

export const getServices = async (req, res, next) => {
  try {

    const services = await ShippingService.getServices()

    res.json(services)

  } catch (err) {
    next(err)
  }
}

export const toggleService = async (req, res, next) => {
  try {

    const result = await ShippingService.toggleService(
      req.params.id,
      req.body.isActive
    )

    res.json(result)

  } catch (err) {
    next(err)
  }
}


// public
export const getActiveCouriers = async (req, res, next) => {
  try {
    
    const services = await ShippingService.getActiveCouriers()


    res.json(services)

  } catch (err) {
    next(err)
  }
}
