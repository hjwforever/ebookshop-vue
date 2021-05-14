/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  return validUName(str) || validEmail(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUName(str) {
  return new RegExp('^[a-zA-Z0-9_-]{3,10}$').test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validEmail(str) {
  return new RegExp('^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\\.[a-zA-Z0-9_-]+)+$').test(
    str
  )
}
