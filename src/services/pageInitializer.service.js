import Page from '../models/Page.js'

const systemPages = [
  {
    title: 'Tentang Kami',
    slug: 'tentang-kami',
    type: 'about'
  },
  {
    title: 'Kontak',
    slug: 'kontak',
    type: 'contact'
  },
  {
    title: 'Kebijakan Privasi',
    slug: 'kebijakan-privasi',
    type: 'privacy'
  },
  {
    title: 'Syarat & Ketentuan',
    slug: 'syarat-ketentuan',
    type: 'terms'
  },
  {
    title: 'FAQ',
    slug: 'faq',
    type: 'faq'
  }
]

export const initializeSystemPages = async () => {
  for (const page of systemPages) {

    const exists = await Page.findOne({ type: page.type })

    if (!exists) {
      await Page.create({
        ...page,
        description: `<p>Isi halaman ${page.title} di sini...</p>`,
        isSystem: true,
        isPublished: false
      })
    }
  }
}