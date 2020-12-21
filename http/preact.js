/*
 * Copyright (c) 2020-present Umut İnan Erdoğan and other contributors
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 * 
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 * 3. Neither the name of the copyright holder nor the names of its contributors
 *    may be used to endorse or promote products derived from this software without
 *    specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

const { existsSync, createReadStream } = require('fs')
const mime = require('mime-types')

const { h } = require('preact')
const renderToString = require('preact-render-to-string')

const { Router } = require('wouter-preact/cjs')
const staticLocationHook = require('wouter-preact/cjs/static-location')

const manifest = require('./dist/manifest.json')

module.exports = (request, reply) => {
  // Just return empty html while developing
  if (process.argv.includes('-d')) return reply.type('text/html').send(renderHtml())

  if (request.raw.url.startsWith('/dist/')) {
    const target = request.raw.url.split('/')[2]
    const file = require("path").join(__dirname, '..', 'dist', target)
    if (existsSync(file) && target && target !== '.' && target !== '..') {
      reply.header('content-type', mime.lookup(file) || 'application/octet-stream')
      return reply.send(createReadStream(file))
    }
  }

  // SSR
  const App = require('./dist/App').default
  const hook = staticLocationHook(request.raw.url, { record: true })

  const html = renderToString(
    h(Router, {
      hook
    }, h(App, { server: true }))
  )

  const finalPage = hook.history.slice(-1)[0];

  if (finalPage != request.raw.url) {
    // Redirect
    reply.raw.writeHead(302, { location: finalPage })
    reply.raw.end()
  } else {
    // Send
    reply.header('content-type', 'text/html')
    reply.raw.end(renderHtml(html))
  }
}

const renderHtml = (html) => `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charSet='utf8'>
      <meta httpEquiv='Content-Type' content='text/html; charset=UTF-8'>
      <meta name='viewport' content='width=device-width, initial-scale=1, viewport-fit=cover'>

      <title>Preact Hybrid Boilerplate</title>
      ${manifest['styles.css'] ? `<link rel='stylesheet' href='${manifest['styles.css']}'/>` : ''}
    </head>
    <body>
      <div id='root'>${html || ''}</div>
      <div id='tooltip-container'></div>
      <script>window.GLOBAL_ENV = { PRODUCTION: ${process.argv.includes('-p')} }</script>
      <script src='${manifest['main.js']}'></script>
      ${manifest['styles.js'] ? `<script src='${manifest['styles.js']}'></script>` : ''}
    </body>
  </html>
`