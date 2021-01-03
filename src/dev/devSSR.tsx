import * as Nano from '../core'
import { renderSSR } from '../ssr'
import { Component } from '../component'
import { Helmet } from '../components/helmet'

// @ts-ignore
import fs from 'fs'
// @ts-ignore
import { join } from 'path'
// @ts-ignore
import http from 'http'

import * as Router from '../router'
import { Fragment } from '../fragment'

const Nothing = () => <div></div>

const Home = (props: any) => {
  return (
    <Fragment>
      <h2>Home Page</h2>
      <p>Nothing on route "{props.route.path}"</p>
    </Fragment>
  )
}

const Latte = () => {
  return <span>Latte</span>
}

class Drinks extends Component {
  render() {
    const { path } = this.props.route
    return (
      <Fragment>
        <h2>Drinks</h2>

        <div class="router">
          <Router.Switch>
            <Router.Route exact path={`${path}`}>
              <Nothing />
            </Router.Route>
            <Router.Route path={`${path}/latte`}>
              <Latte />
            </Router.Route>
            <Router.Route path={`${path}/milk`}>{() => <span>Milk</span>}</Router.Route>
          </Router.Switch>
        </div>
      </Fragment>
    )
  }
}

class App extends Component {
  render() {
    return (
      <Fragment>
        <div class="router">
          <Router.Switch>
            <Router.Route path="/dev/dev.html">
              <Home />
            </Router.Route>
            <Router.Route path="/drinks">
              <Drinks />
            </Router.Route>
            <Router.Route exact path="/:id" regex={{ id: /[a-z0-9]{6}/ }}>
              {() => <div>id (:id regex)</div>}
            </Router.Route>
            <Router.Route exact path="/:id/details" regex={{ id: /[a-z0-9]{6}/ }}>
              {() => <div>id (:id regex) + details</div>}
            </Router.Route>
            <Router.Route exact path="/:id">
              {() => <div>id (:id normal)</div>}
            </Router.Route>
            <Router.Route exact path="/:id/details">
              {() => <div>id (:id normal)+ details</div>}
            </Router.Route>
            <Router.Route path="*">{() => <div>404</div>}</Router.Route>
          </Router.Switch>
        </div>
      </Fragment>
    )
  }
}

const app = renderSSR(<App />, { pathname: '/12345/detail' })
const { body, head, footer } = Helmet.SSR(app)
console.log('body', body)

let html = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      body { 
        font-family: BlinkMacSystemFont, -apple-system, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
      }
     </style>
    ${head.join('\n')}
  </head>
  <body>
    <div id="root">
      ${body}
    </div>
  </body>
  ${footer.join('\n')}
</html>
`

// minify
// html = html.replace(/[\s]+/gm, ' ')

http
  .createServer((req: any, res: any) => {
    const { url } = req

    if (/\.html$/.test(url)) return res.end(html)

    // @ts-ignore
    const path = join(__dirname, '../../', url)

    fs.readFile(path, (err: any, data: any) => {
      if (err) {
        res.writeHead(404)
        return res.end(data)
      }
      const type = /\.png$/.test(url) ? 'image/png' : 'image/svg+xml'
      res.setHeader('Content-Type', type)
      return res.end(data)
    })
  })
  .listen(8080, () => console.log('open http://localhost:8080/index.html in your browser'))
