const redirects = {
  '/redirect': '/redirected',
}

export async function handleHttpRequest(request, context) {
  // If the request path is in the redirects object, return a redirect response
  if (redirects[request.path]) {
    return Response.redirect(redirects[request.path], 301)
  }

  // Otherwise, re-issue the request to the origin (self), bypassing the edge function on re-entry
  const resp = await fetch(request, {
    headers: {
      'x-ef-bypass': 'true', // this header tells the Edgio CDN to bypass the edge function
    },
    edgio: {
      origin: 'self',
    },
  });

  // handle the response as needed
  // For example, to inject some html into the body:
  const html = await resp.text()
  const newHtml = html.replace('</body>', '<marquee>Added by edge functions!</marquee></body>')

  // To send the response to the client with the new HTML but the same headers as the origin response:
  return new Response(newHtml, {
    ...resp,
    headers: {
      ...resp.headers,
      'x-edge-function': 'main.js',
    },
  })
}
