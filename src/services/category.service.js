// src/services/category.service.js
import Category from '../models/Category.js'
import { generateCategorySlug } from '../utils/categorySlug.js'



const rebuildChildrenPath = async (parent) => {

  const children = await Category.find({ parentId: parent._id })

  for (const child of children) {

    const newPath = [
      ...parent.path,
      {
        name: parent.name,
        slug: parent.slug
      }
    ]

    child.path = newPath
    child.level = parent.level + 1

    await child.save()

    // recursive update
    await rebuildChildrenPath(child)

  }

}

export const createCategory = async ({ name, description, parentId, logo }) => {
  let level = 0
  let path = []

  if (parentId) {
    const parent = await Category.findById(parentId)
    if (!parent) throw new Error('Parent category tidak valid')

    level = parent.level + 1
    
    path = [
      ...parent.path,
      {
        name: parent.name,
        slug: parent.slug
      }
    ]
  }
  const slug = await generateCategorySlug(name)

  return Category.create({
    name,
    slug,
    description,
    parentId: parentId || null,
    level,
    path,
    logo: parentId ? null : logo
  })
}

export const updateCategory = async (id, payload) => {
  const category = await Category.findById(id)
  if (!category) throw new Error('Category tidak ditemukan')

  // ❌ parentId tidak boleh diubah
  if (payload.parentId && payload.parentId.toString() !== category.parentId?.toString()) {
    throw new Error('Parent category tidak boleh diubah')
  }


  // slug tidak boleh diupdate manual
  delete payload.slug
  delete payload.parentId

  const updated = await Category.findByIdAndUpdate(id, payload, { new: true })
  await rebuildChildrenPath(updated)

  return updated

}


export const getCategoryTree = async () => {
  const categories = await Category.find({ isActive: true }).lean()

  const map = {}
  categories.forEach(c => (map[c._id] = { ...c, children: [] }))

  const tree = []
  categories.forEach(c => {
    if (c.parentId) {
      map[c.parentId]?.children.push(map[c._id])
    } else {
      tree.push(map[c._id])
    }
  })

  return tree
}

export const getChildrenIds = async (rootId) => {
  
  const categories = await Category.find().select('_id parentId').lean()

  const map = {}
  categories.forEach(c => {
    if (!map[c.parentId]) map[c.parentId] = []
    map[c.parentId].push(c._id)
  })

  const ids = [rootId]

  const stack = [rootId]

  while (stack.length) {
    const current = stack.pop()

    const children = map[current] || []

    children.forEach(id => {
      ids.push(id)
      stack.push(id)
    })
  }
  return ids
}

// public

export const getRootCategories = async () => {
  return Category.find({
    isActive: true,
    parentId: null
  })
  .sort({name: 1})
  .lean()
}

export const getCategoryBreadcrumb = async (categoryId) => {
  const category = await Category.findById(categoryId).lean()

  if (!category) return []

  return [
    ...category.path,
    {
      name: category.name,
      slug: category.slug
    }
  ]
}

export const getCategoryFlat = async () => {

  const categories = await Category.find().lean()

  const childrenMap = {}

  // group by parentId
  categories.forEach(cat => {

    const parent = cat.parentId?.toString() || 'root'

    if (!childrenMap[parent]) {
      childrenMap[parent] = []
    }

    childrenMap[parent].push(cat)

  })

  const buildFlat = (parentId) => {

    let result = []

    const children = childrenMap[parentId] || []

    children.forEach(child => {
      result.push(child)
      result = result.concat(buildFlat(child._id.toString()))
    })

    return result
  }

  const roots = childrenMap['root'] || []

  return roots.map(root => ({
    ...root,
    children: buildFlat(root._id.toString())
  }))
}