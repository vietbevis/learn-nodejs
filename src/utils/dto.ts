import _ from 'lodash'

const selectFields = (data: any, fields: string[]) => {
  return _.pick(data, fields)
}

const omitFields = (data: any, fields: string[]) => {
  return _.omit(data, fields)
}

const userResponse = (user: any) => {
  return omitFields(user, ['roles', 'password'])
}

export { selectFields, omitFields, userResponse }
