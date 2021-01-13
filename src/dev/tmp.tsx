import * as Nano from '../core'
import { Component } from '../component'

// mock a data fetch
export const fetchComments = (): Promise<string[]> => {
  const comments = ['comment one', 'comment two']

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(comments)
    }, 1000)
  })
}

// the suspense component
class Suspense extends Component<{ fallback: any; cache?: boolean; [key: string]: any }> {
  ready = false

  constructor(props: any) {
    super(props)

    // get props promises in ...rest
    const { children, fallback, cache = false, ...rest } = this.props

    // strinify ...rest
    const str = JSON.stringify(rest, function (_key, val) {
      if (typeof val === 'function') return val + '' // implicitly `toString` it
      return val
    })

    // create unique id based on ...rest
    this.id = Nano.strToHash(JSON.stringify(str))
  }

  async didMount() {
    // get props promises in ...rest
    const { children, fallback, cache = false, ...rest } = this.props

    // set initial state to []
    if (cache) this.initState = {}

    // check if we already cached the results in this.state
    if (this.loadFromCache(cache)) return

    // resolve the promises
    const promises = Object.values(rest).map((p: any) => p())
    const resolved = await Promise.all(promises)

    // prepare data
    const data = this.prepareData(rest, resolved, cache)

    // add data to children
    this.addDataToChildren(data)

    // update the component
    this.ready = true
    this.update()
  }

  ssr() {
    // get props promises in ...rest
    const { children, fallback, cache = false, ...rest } = this.props

    // execute the functions
    const functions = Object.values(rest).map((p: any) => p())

    // prepeare data
    const data = this.prepareData(rest, functions, false)

    // add data to children
    this.addDataToChildren(data)
  }

  loadFromCache(cache: boolean) {
    const hasCachedProps = this.state && cache && Object.keys(this.state).length > 0

    if (hasCachedProps) {
      this.addDataToChildren(this.state)
      this.ready = true
    }

    return hasCachedProps
  }

  prepareData(rest: any, fnc: any, cache: boolean) {
    const data = Object.keys(rest).reduce((obj, item, index) => {
      if (cache) this.state = { ...this.state, [item]: fnc[index] }
      return {
        ...obj,
        [item]: fnc[index],
      }
    }, {})
    return data
  }

  addDataToChildren(data: any) {
    // add data as props to children
    this.props.children.forEach((child: any) => {
      if (child.props) child.props = { ...child.props, ...data }
    })
  }

  render() {
    // @ts-ignore
    if (typeof isSSR === 'undefined') {
      const { cache = false } = this.props
      this.loadFromCache(cache)
      return !this.ready ? this.props.fallback : this.props.children
    } else {
      this.ssr()
      return this.props.children
    }
  }
}

// Comments component
interface CommentsProps {
  comments?: string[]
}
const Comments: Nano.FC<CommentsProps> = ({ comments }) => {
  const tmp = comments?.map((c) => <li>{c}</li>)
  return <ul>{tmp}</ul>
}

// Loading component
const Loading = () => <div>loading...</div>

// App component
export class App extends Component {
  didMount() {
    setTimeout(() => {
      this.update()
    }, 2000)
  }

  static fetchComments(): any {}

  render() {
    return (
      <div>
        <h2>Comments</h2>
        {/* pass a function that resolves a promise */}
        <Suspense cache comments={App.fetchComments() || fetchComments} fallback={<Loading />}>
          <Comments />
        </Suspense>
      </div>
    )
  }
}
