import { Router, edgioRoutes } from '@edgio/core'

export default new Router()

  // edge function executed on every request except for the 'x-ef-bypass' header is present
  .get({
    headers: {
      'x-ef-bypass': {
        not: 'true',
      }
    }
  }, {
    edge_function: './edge-functions/main.js',
    caching: {
      max_age: '1d', // optionally cache the output of the edge function for 1 day
    }
  })
  .get('/redirected', {
    response: {
      set_response_body: 'This is the redirected page!',
      set_done: true,
    },
  })

  // plugin enabling basic Edgio functionality
  .use(edgioRoutes)
