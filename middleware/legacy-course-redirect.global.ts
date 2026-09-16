import { courseSlug } from '~/utils/course-route'

export default defineNuxtRouteMiddleware((to) => {
  if (to.path !== '/course/javascript_dasar') return
  const id = typeof to.query.id === 'string' ? to.query.id : '1'
  return navigateTo(`/course/${courseSlug('Dasar Pemrograman JavaScript')}?id=${id}`, { redirectCode: 301 })
})
