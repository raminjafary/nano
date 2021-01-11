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
class Suspense extends Component<{ fallback: any; [key: string]: any }> {
  async didMount() {
    // get promises
    const { children, fallback, ...rest } = this.props

    // resolve the promises
    const promises = Object.values(rest)
    const resolved = await Promise.all(promises)

    // prepare data
    const data = Object.keys(rest).reduce((obj, item, index) => {
      return {
        ...obj,
        [item]: resolved[index],
      }
    }, {})

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
  render() {
    return (
      <div>
        <h2>Comments</h2>
        <Suspense comments={fetchComments()} fallback={<Loading />}>
          <Comments />
        </Suspense>
      </div>
    )
  }
}

// Render to the root element
Nano.render(<App />, document.getElementById('root'))
