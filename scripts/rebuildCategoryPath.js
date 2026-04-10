import 'dotenv/config'
import mongoose from "mongoose"
import Category from "../src/models/Category.js"


await mongoose.connect(process.env.MONGO_URI)


const rebuild = async () => {
  console.log( process.env.MONGO_URI)

  const categories = await Category.find().lean()

  const map = {}

  // buat map id → category
  categories.forEach(c => {
    map[c._id] = c
  })

  const updates = []

  for (const category of categories) {

    let path = []
    let current = category

    while (current.parentId) {

      const parent = map[current.parentId]

      if (!parent) break

      path.unshift({
        name: parent.name,
        slug: parent.slug
      })

      current = parent
    }

    updates.push({
      updateOne: {
        filter: { _id: category._id },
        update: { path }
      }
    })

  }

  await Category.bulkWrite(updates)

  console.log("✅ Category path rebuilt")

}

await rebuild()

process.exit()