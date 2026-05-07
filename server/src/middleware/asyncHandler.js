/**
 * Envuelve controladores async para que los rechazos lleguen a `errorHandler`.
 * @param {(req: import('express').Request, res: import('express').Response) => Promise<void>} fn
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}
