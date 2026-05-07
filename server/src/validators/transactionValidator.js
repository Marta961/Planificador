import { HttpError } from '../utils/httpError.js'

const EXPENSE_CATEGORIES = new Set(['OCIO', 'RESTAURANTE', 'HOGAR', 'SALUD', 'EDUCACION', 'OTROS_GASTO'])
const INCOME_CATEGORIES = new Set(['TRABAJO', 'INVERSION', 'OTROS_INGRESO'])

const isPlainObject = (value) => Boolean(value) && typeof value === 'object' && !Array.isArray(value)

const buildConcept = ({ description, category, type }) => {
  const desc = typeof description === 'string' ? description.trim() : ''
  if (desc) return desc.length > 120 ? `${desc.slice(0, 120)}…` : desc
  if (typeof category === 'string' && category) return category
  return 'Sin descripción'
}

const validateType = (type, issues) => {
  if (type === undefined || type === null) {
    issues.push({ field: 'type', message: 'El tipo es obligatorio (INGRESO o GASTO).' })
    return null
  }
  if (type !== 'INGRESO' && type !== 'GASTO') {
    issues.push({ field: 'type', message: 'El tipo debe ser INGRESO o GASTO.' })
    return null
  }
  return type
}

const validateAmount = (amount, issues, required) => {
  if (amount === undefined || amount === null) {
    if (required) issues.push({ field: 'amount', message: 'El importe es obligatorio.' })
    return undefined
  }
  if (typeof amount !== 'number' || Number.isNaN(amount) || amount <= 0) {
    issues.push({ field: 'amount', message: 'El importe debe ser un número mayor que cero.' })
    return undefined
  }
  return amount
}

const validateDate = (date, issues, required) => {
  if (date === undefined || date === null || date === '') {
    if (required) issues.push({ field: 'date', message: 'La fecha es obligatoria (ISO 8601).' })
    return undefined
  }
  if (typeof date !== 'string') {
    issues.push({ field: 'date', message: 'La fecha debe ser una cadena ISO 8601.' })
    return undefined
  }
  const parsed = new Date(date.includes('T') ? date : `${date.slice(0, 10)}T12:00:00`)
  if (Number.isNaN(parsed.getTime())) {
    issues.push({ field: 'date', message: 'La fecha no es válida.' })
    return undefined
  }
  return parsed.toISOString()
}

const validateCategory = (type, category, issues) => {
  if (category === null || category === '') return null
  if (category === undefined) return undefined
  if (typeof category !== 'string') {
    issues.push({ field: 'category', message: 'La categoría debe ser texto.' })
    return undefined
  }
  if (type === 'GASTO' && !EXPENSE_CATEGORIES.has(category)) {
    issues.push({ field: 'category', message: 'Categoría de gasto no válida.' })
    return undefined
  }
  if (type === 'INGRESO' && !INCOME_CATEGORIES.has(category)) {
    issues.push({ field: 'category', message: 'Categoría de ingreso no válida.' })
    return undefined
  }
  return category
}

const validateDescription = (description, issues) => {
  if (description === null) return null
  if (description === undefined) return undefined
  if (typeof description !== 'string') {
    issues.push({ field: 'description', message: 'La descripción debe ser texto.' })
    return undefined
  }
  if (description.length > 500) {
    issues.push({ field: 'description', message: 'La descripción no puede superar 500 caracteres.' })
    return undefined
  }
  return description.trim() || undefined
}

/**
 * Valida el cuerpo de creación (POST). Lanza HttpError 400 si falla.
 * @param {unknown} body
 */
export const assertValidCreateBody = (body) => {
  if (!isPlainObject(body)) {
    throw new HttpError(400, 'El cuerpo debe ser un objeto JSON.', 'BAD_REQUEST', [
      { field: '_body', message: 'JSON inválido o no es un objeto.' },
    ])
  }

  const issues = []
  const type = validateType(body.type, issues)
  const amount = validateAmount(body.amount, issues, true)
  const date = validateDate(body.date, issues, true)
  const description = validateDescription(body.description, issues)
  const category = type ? validateCategory(type, body.category, issues) : undefined

  if (issues.length) {
    throw new HttpError(400, 'Validación incorrecta.', 'VALIDATION_ERROR', issues)
  }

  return {
    amount,
    date,
    type,
    description,
    category,
    concept: buildConcept({ description, category, type }),
  }
}

/**
 * Valida cuerpo de actualización parcial (PATCH).
 * @param {unknown} body
 * @param {{ type: string }} existing — entidad actual (necesaria si solo se envía `category`).
 */
export const assertValidPatchBody = (body, existing) => {
  if (!isPlainObject(body)) {
    throw new HttpError(400, 'El cuerpo debe ser un objeto JSON.', 'BAD_REQUEST', [
      { field: '_body', message: 'JSON inválido o no es un objeto.' },
    ])
  }

  const keys = Object.keys(body)
  const allowed = new Set(['amount', 'date', 'type', 'description', 'category'])
  const unknown = keys.filter((k) => !allowed.has(k))
  if (unknown.length) {
    throw new HttpError(400, 'Campos no permitidos en el cuerpo.', 'BAD_REQUEST', [
      { field: '_body', message: `Campos desconocidos: ${unknown.join(', ')}` },
    ])
  }

  if (keys.length === 0) {
    throw new HttpError(400, 'No hay campos para actualizar.', 'BAD_REQUEST', [
      { field: '_body', message: 'Envía al menos un campo permitido.' },
    ])
  }

  const issues = []
  const type = body.type !== undefined ? validateType(body.type, issues) : undefined
  const amount = body.amount !== undefined ? validateAmount(body.amount, issues, true) : undefined
  const date = body.date !== undefined ? validateDate(body.date, issues, true) : undefined
  const description =
    body.description !== undefined ? validateDescription(body.description, issues) : undefined

  const effectiveType = type ?? existing.type
  let category
  if (body.category !== undefined) {
    if (!effectiveType) {
      issues.push({
        field: 'category',
        message:
          'No se puede validar la categoría sin tipo. Incluye `type` en la petición o asegúrate de que el recurso ya tenga tipo.',
      })
    } else {
      category = validateCategory(effectiveType, body.category, issues)
    }
  }

  if (issues.length) {
    throw new HttpError(400, 'Validación incorrecta.', 'VALIDATION_ERROR', issues)
  }

  const patch = {}
  if (amount !== undefined) patch.amount = amount
  if (date !== undefined) patch.date = date
  if (type !== undefined) patch.type = type
  if (body.description !== undefined) patch.description = description
  if (body.category !== undefined) patch.category = category
  return patch
}
