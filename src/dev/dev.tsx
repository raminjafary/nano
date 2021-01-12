import * as Nano from '../core'
import { Component } from '../component'

// mock a data fetch
const fetchComments = (): Promise<string[]> => {
  const comments = ['comment one', 'comment two']

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(comments)
    }, 1000)
  })
}

// the suspense component
class Suspense extends Component<{ fallback: any; cache?: boolean; [key: string]: any }> {
  async didMount() {
    // get props promises in ...rest
    const { children, fallback, cache = false, ...rest } = this.props

    // strinify ...rest
    const str = JSON.stringify(rest, function (_key, val) {
      if (typeof val === 'function') return val + '' // implicitly `toString` it
      return val
    })

    // create unique id based on ...rest
    this.id = Nano.strToHash(JSON.stringify(str))

    console.log('ID', this.id)

    // set initial state to []
    if (cache) this.initState = {}

    // check if we already cached the results in this.state
    if (cache && Object.keys(this.state).length > 0) {
      this.addDataToChildren(this.state)
      return
    }

    // resolve the promises
    const promises = Object.values(rest).map((p: any) => p())
    const resolved = await Promise.all(promises)

    // prepare data
    const data = Object.keys(rest).reduce((obj, item, index) => {
      if (cache) this.state = { ...this.state, [item]: resolved[index] }
      return {
        ...obj,
        [item]: resolved[index],
      }
    }, {})

    this.addDataToChildren(data)
  }

  addDataToChildren(data: any) {
    // add data as props to children
    this.props.children.forEach((child: any) => {
      if (child.props) child.props = { ...child.props, ...data }
    })

    // update the component
    this.update(true)
  }

  render(ready = false) {
    return !ready ? this.props.fallback : this.props.children
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
class App extends Component {
  didMount() {
    setTimeout(() => {
      this.update()
    }, 2000)
  }

  render() {
    return (
      <div>
        <h2>Comments</h2>
        {/* pass a function that resolves a promise */}
        <Suspense cache comments={fetchComments} fallback={<Loading />}>
          <Comments />
        </Suspense>
      </div>
    )
  }
}

// Render to the root element
Nano.render(<App />, document.getElementById('root'))
