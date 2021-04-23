import defaultSettings from '@/settings'

const title = defaultSettings.title || 'E-Book Shop'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} | ${title}`
  }
  return `${title}`
}
