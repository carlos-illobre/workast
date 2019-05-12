const OpentracingExtension = require('apollo-opentracing').default
const { BatchRecorder } = require('zipkin')
const ZipkinJavascriptOpentracing = require('zipkin-javascript-opentracing')
const { HttpLogger } = require('zipkin-transport-http')

const tracer = new ZipkinJavascriptOpentracing({
  serviceName: 'My Service',
  recorder: new BatchRecorder({
    logger: new HttpLogger({
      endpoint: process.env.ZIPKIN_ENDPOINT,
    }),
  }),
  kind: 'client',
})

module.exports = () => new OpentracingExtension({ server: tracer, local: tracer })
