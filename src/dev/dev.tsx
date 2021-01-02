import * as Nano from '../core'
import * as Router from '../router'
import { Component } from '../component'
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

        <ul>
          <li>
            <Router.Link to={`${path}/latte`}>Latte</Router.Link>
          </li>
          <li>
            <Router.Link to={`${path}/milk`}>Milk</Router.Link>
          </li>
        </ul>

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
        <h1>Router Example</h1>

        <ul>
          <li>
            <Router.Link to="/dev/dev.html">Home</Router.Link>
          </li>
          <li>
            <Router.Link to="/drinks">Drinks</Router.Link>
          </li>
          <li>
            <Router.Link to="/12345">12345 (normal)</Router.Link>
          </li>
          <li>
            <Router.Link to="/123456">123456 (regex)</Router.Link>
          </li>
          <li>
            <Router.Link to="/12345/detail">12345/detail</Router.Link>
          </li>
          <li>
            <Router.Link to="/no/no">404</Router.Link>
          </li>
        </ul>

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
            <Router.Route exact path="/:id">
              {() => <div>id (:id normal)</div>}
            </Router.Route>
            <Router.Route exact path="/:product">
              {() => <div>id (:product)</div>}
            </Router.Route>
            <Router.Route path="/:product/detail">{() => <div>detail</div>}</Router.Route>
            <Router.Route path="*">{() => <div>404</div>}</Router.Route>
          </Router.Switch>
        </div>
      </Fragment>
    )
  }
}

// client side
Nano.render(<App />, document.getElementById('root'))
