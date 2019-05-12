exports['POST api/v1/users : return 400 if the request has no name 1'] = {
  'error': {
    'status': 400,
    'statusText': 'Bad Request',
    'errors': [
      {
        'field': [
          'name',
        ],
        'location': 'body',
        'messages': [
          '"name" is required',
        ],
        'types': [
          'any.required',
        ],
      },
    ],
  },
}
exports['POST api/v1/users : return 400 if the avatar is not a url 1'] = {
  'error': {
    'status': 400,
    'statusText': 'Bad Request',
    'errors': [
      {
        'field': [
          'avatar',
        ],
        'location': 'body',
        'messages': [
          '"avatar" must be a valid uri',
        ],
        'types': [
          'string.uri',
        ],
      },
    ],
  },
}
exports['POST api/v1/users : return 400 if the request has invalid fields 1'] = {
  'error': {
    'status': 400,
    'statusText': 'Bad Request',
    'errors': [
      {
        'field': [
          'extraField',
        ],
        'location': 'body',
        'messages': [
          '"extraField" is not allowed',
        ],
        'types': [
          'object.allowUnknown',
        ],
      },
    ],
  },
}
exports['POST api/v1/users : return 401 if the user was not authenticated 1'] = {}
