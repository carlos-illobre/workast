exports['PATCH api/v1/users/:userId/articles/:articleId : return 404 if the article does not exist 1'] = {
  'error': {
    'message': 'The article xxx was not found.',
    'status': 404,
  },
}
exports['PATCH api/v1/users/:userId/articles/:articleId : return 400 if the request has no values 1'] = {
  'error': {
    'status': 400,
    'statusText': 'Bad Request',
    'errors': [
      {
        'field': [],
        'location': 'body',
        'messages': [
          '"The request" must have at least 1 children',
        ],
        'types': [
          'object.min',
        ],
      },
    ],
  },
}
exports['PATCH api/v1/users/:userId/articles/:articleId : return 400 if the article tag is not an array 1'] = {
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
exports['PATCH api/v1/users/:userId/articles/:articleId : return 400 if the request has invalid fields 1'] = {
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
