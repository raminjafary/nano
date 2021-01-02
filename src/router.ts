// inspired by https://codesandbox.io/s/build-own-react-router-v4-mpslz

import { Component } from './component'
import { FC, h, _render } from './core'

let instances: any[] = []

const register = (comp: any) => instances.push(comp)
const unregister = (comp: any) => instances.splice(instances.indexOf(comp), 1)

const historyPush = (path: string) => {
  window.history.pushState({}, '', path)
  instances.forEach((instance) => instance.handlePop())
}

const historyReplace = (path: string) => {
  window.history.replaceState({}, '', path)
  instances.forEach((instance) => instance.handlePop())
}

const matchPath = (pathname: string, options: { exact?: boolean; path: string }) => {
  let { exact = false, path } = options

  if (!path) {
    return {
      path: null,
      url: pathname,
      isExact: true,
    }
  }

  let match
  let params = {}

  // path with params
  if (path.includes('/:')) {
    let pathArr = path.split('/')
    let pathnameArr = pathname.split('/')
    pathArr.forEach((p, i) => {
      if (/^:/.test(p)) {
        params = { ...params, [p.slice(1)]: pathnameArr[i] }
        pathArr[i] = pathnameArr[i]
      }
    })
    path = pathArr.join('/')
  }

  // catch all
  if (path === '*') match = [pathname]

  // regular path
  if (!match) match = new RegExp(`^${path}`).exec(pathname)

  if (!match) return null

  const url = match[0]
  const isExact = pathname === url

  console.log('params', params)
  console.log('path', path)
  console.log('isExact', pathname === url)
  console.log('exact', exact)

  if (exact && !isExact) return null

  return {
    path,
    url,
    isExact,
    params,
  }
}

export class Switch extends Component {
  path: string = ''
  match = { index: -1, path: '' }

  didMount() {
    register(this)
  }

  didUnmount() {
    unregister(this)
  }

  handlePop() {
    this.findChild()
    if (this.shouldUpdate()) this.update()
  }

  findChild() {
    this.match = { index: -1, path: '' }

    for (let i = 0; i < this.props.children.length; i++) {
      const child = this.props.children[i]
      const { path, exact } = child.props
      const match = matchPath(window.location.pathname, { path, exact })
      if (match) {
        this.match.index = i
        this.match.path = path
        return
      }
    }
  }

  shouldUpdate() {
    return this.path !== this.match.path
  }

  render() {
    this.findChild()

    const child = this.props.children[this.match.index]

    if (child) {
      const { path } = child.props
      this.path = path
      let el = _render(child)
      return _render(el)
    } else return h('div', { class: 'route' }, 'not found')
  }
}

export const Route: FC<{ path: string; exact?: boolean; children?: any }> = ({ path, children }) => {
  // pass the path as props to the children
  children.forEach((child: any) => {
    if (child.props) child.props = { ...child.props, route: { path } }
  })
  return children
}

export const to = (to: string, replace: boolean = false) => {
  replace ? historyReplace(to) : historyPush(to)
}

export const Link: FC<{ to: string; replace?: boolean; children?: any }> = ({ to, replace, children }) => {
  const handleClick = (event: Event) => {
    event.preventDefault()
    replace ? historyReplace(to) : historyPush(to)
  }

  return h('a', { href: to, onClick: (e: Event) => handleClick(e) }, children)
}
