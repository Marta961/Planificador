/** Error HTTP controlado (lanzado hacia `errorHandler`). */
export class HttpError extends Error {
  /**
   * @param {number} status
   * @param {string} message
   * @param {string} [code]
   * @param {unknown} [details]
   */
  constructor(status, message, code = 'ERROR', details = undefined) {
    super(message)
    this.name = 'HttpError'
    this.status = status
    this.code = code
    this.details = details
  }
}
