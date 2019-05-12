exports['POST api/v1/users/:id/articles : return 404 if the article was created by an unexistent user 1'] = {
  'error': {
    'message': 'The user unexistentUserId was not found.',
    'status': 404,
  },
}
exports['POST api/v1/users/:id/articles : return 400 if the request has no title 1'] = {
  'error': {
    'status': 400,
    'statusText': 'Bad Request',
    'errors': [
      {
        'field': [
          'title',
        ],
        'location': 'body',
        'messages': [
          '"title" is required',
        ],
        'types': [
          'any.required',
        ],
      },
    ],
  },
}
exports['POST api/v1/users/:id/articles : return 400 if the request has no text 1'] = {
  'error': {
    'status': 400,
    'statusText': 'Bad Request',
    'errors': [
      {
        'field': [
          'text',
        ],
        'location': 'body',
        'messages': [
          '"text" is required',
        ],
        'types': [
          'any.required',
        ],
      },
    ],
  },
}
exports['POST api/v1/users/:id/articles : return 400 if the article tag is not an array 1'] = {
  'error': {
    'status': 400,
    'statusText': 'Bad Request',
    'errors': [
      {
        'field': [
          'tags',
        ],
        'location': 'body',
        'messages': [
          '"tags" must be an array',
        ],
        'types': [
          'array.base',
        ],
      },
    ],
  },
}
exports['POST api/v1/users/:id/articles : return 400 if the request has invalid fields 1'] = {
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
