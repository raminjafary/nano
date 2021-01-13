import * as Nano from '../core'
import { renderSSR } from '../ssr'
import { App, fetchComments } from './tmp'

const server = async () => {
  // prefetch comments
  const comments = await fetchComments()

  // add to static method
  App.fetchComments = () => () => comments

  // Render to the root element
  const app = renderSSR(<App />)
  console.log(app)
}

server()
