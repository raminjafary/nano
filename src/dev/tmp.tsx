import * as Nano from '../core'
import { Component } from '../component'
import { Suspense } from '../components/suspense'

export const fetchComments = (): Promise<string[]> => {
  const comments = ['comment one', 'comment two']

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(comments)
    }, 200)
  })
}

const Comments: Nano.FC<{ comments?: string[] }> = ({ comments }) => {
  return (
    <ul>
      {comments?.map((c) => (
        <li>{c}</li>
      ))}
    </ul>
  )
}

const Loading = () => <div>loading...</div>

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
        <Suspense cache comments={App.fetchComments() || fetchComments} fallback={<Loading />}>
          <Comments />
        </Suspense>
      </div>
    )
  }
}
