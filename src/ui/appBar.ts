import { Component } from '../component'
import { h, render } from '../core'
import { boxShadow, zIndex } from './_config'

const classes = {
  container: 'app_bar_container',
  bar: 'app_bar',
  left: 'app_bar_left',
  right: 'app_bar_right',
  scrollingDown: 'app_bar_scrolling_down',
  icon: 'app_bar_icon',
}

interface AppBarProps {
  menu?: boolean
  title?: string
  maxWidth?: number
  icons?: any
}

export class AppBar extends Component<AppBarProps> {
  curr_scrollY: number = 0
  last_scrollY: number = 0
  curr_scrollingState = 'none'
  last_scrollingState = 'none'
  container: HTMLElement

  scroll() {
    this.curr_scrollY = window.scrollY

    if (this.curr_scrollY > this.last_scrollY) {
      this.curr_scrollingState = 'down'
    } else if (this.curr_scrollY < this.last_scrollY) {
      this.curr_scrollingState = 'up'
    }

    this.last_scrollY = this.curr_scrollY

    if (this.curr_scrollY < 1) {
      this.container.classList.remove('app_bar_scrolling_down')
    } else if (this.last_scrollingState !== this.curr_scrollingState) {
      this.last_scrollingState = this.curr_scrollingState

      if (this.curr_scrollingState === 'down') this.container.classList.add('app_bar_scrolling_down')
      else this.container.classList.remove('app_bar_scrolling_down')
    }
  }

  didMount() {
    this.curr_scrollY = this.last_scrollY = window.scrollY
    window.addEventListener('scroll', () => this.scroll())
  }

  didUnmount() {
    window.removeEventListener('scroll', this.scroll)
  }

  render() {
    const styles = `
    .app_bar_container {
      background-color: #6200EE;
      color: white;
      font-weight: 500;

      z-index: ${zIndex.bar}

      position: fixed;
      top: 0;
      left: 0;
      min-height: 24px;
      padding: 16px;
      width: calc(100vw - 32px);


      ${boxShadow}

      transition: top 0.2s;
    }

    .app_bar_container.app_bar_scrolling_down {
      top: -56px;
    }

    .app_bar_container .app_bar {
      display: flex;
      justify-content: space-between;
      margin: 0 auto;

      ${this.props.maxWidth ? `max-width: ${this.props.maxWidth}px;` : ''}
    }

    .app_bar_container .app_bar .app_bar_left,
    .app_bar_container .app_bar .app_bar_right {
      display: flex;
      align-items: center;      
    }

    .app_bar i.app_bar_icon {
      width: 22px;
      height: 22px;
      display: inline-block;
      content: '';

      /*-webkit-mask: url(YOUR_SVG_URL) no-repeat 50% 50%;
      mask: url(YOUR_SVG_URL) no-repeat 50% 50%;*/

      -webkit-mask-size: cover;
      mask-size: cover; 

      background-color: white;
    }

    .app_bar_container .bar_title {
      font-size: 20px;
    }

    .bar_navigation_box {
      padding: 4px;
      width: 20px;
      height: 16px;
      margin-right: 32px;
      cursor: pointer;
    }

    .bar_hamburger_button,
    .bar_hamburger_button::before,
    .bar_hamburger_button::after {
      position: absolute;
      width: 20px;
      height: 2px;
      border-radius: 2px;
      background: white;
      content: '';
    }
    .bar_hamburger_button::before {
      top: 6px;
    }
    .bar_hamburger_button::after {
      top: 12px;
    }

    .bar_back_button,
    .bar_back_button::before,
    .bar_back_button::after {
      position: relative;
      top: 7px;
      width: 20px;
      height: 2px;
      border-radius: 2px;
      background: white;
      content: '';
    }
    .bar_back_button::before {
      position: absolute;
      top: -5px;
      transform: translate3d(-4px,0,0) rotate(-45deg) scaleX(.7);
    }
    .bar_back_button::after {
      position: absolute;
      top: 5px;
      transform: translate3d(-4px,0,0) rotate(45deg) scaleX(.7);
    }
    `

    const styleElement = h('style', {}, styles)
    document.head.appendChild(styleElement)

    // const hamburger = h('div', { class: 'bar_hamburger_button' })
    const back = h('div', { class: 'bar_back_button' })

    const navigation = this.props.menu ? h('div', { class: 'bar_navigation_box' }, back) : null

    const title = this.props.title ? h('div', { class: 'bar_title' }, this.props.title) : null

    const icons = Object.keys(this.props.icons).map((key) => {
      const icon = this.props.icons[key]
      return render(icon)
    })

    const left = h('div', { class: classes.left }, navigation, title)
    const right = h('div', { class: classes.right }, ...icons)

    const bar = h('div', { class: classes.bar }, left, right)
    this.container = h('div', { class: classes.container }, bar)

    return this.container
  }
}
