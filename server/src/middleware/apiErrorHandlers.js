export const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
    },
  })
}

export const errorHandler = (err, _req, res, _next) => {
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({
      error: {
        code: 'BAD_JSON',
        message: 'El cuerpo no es JSON válido.',
      },
    })
  }

  const status = typeof err.status === 'number' ? err.status : 500
  const body = {
    error: {
      code: err.code || 'INTERNAL',
      message: err.message || 'Error interno del servidor',
    },
  }
  if (err.details !== undefined) {
    body.error.details = err.details
  }
  res.status(status).json(body)
}
