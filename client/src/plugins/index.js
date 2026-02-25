import pinia from '@/stores'

export function registerPlugins (app) {
  app.use(pinia)
}
