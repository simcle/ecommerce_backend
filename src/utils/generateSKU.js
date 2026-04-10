import Counter from '../models/Counter.js'

export const generateSKU = async (prefix = 'PRD') => {
  const counter = await Counter.findOneAndUpdate(
    { name: prefix },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  )

  const number = counter.seq.toString().padStart(5, '0')

  return `${prefix}-${number}`
}