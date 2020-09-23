import { Component } from '../component'
import { h, tick, render } from '../core'
import { userSelect } from './_config'

interface TabsProps {
  active?: number
  children?: any[]
}

export const Tab = (props: any) => {
  const classes = ['tabs_item']
  if (props.active) classes.push('active')

  const link = props.href ? { href: props.href } : {}

  const a = h('a', { ...link }, props.children)
  return h('li', { class: classes.join(' ') }, a)
}

export class Tabs extends Component<TabsProps> {
  line: HTMLElement
  items: HTMLElement[]
  active = this.props.active || 0

  didMount() {
    const adjustLine = (item: HTMLElement) => {
      if (!item) return
      const first = this.items[0].getBoundingClientRect()
      const active = item.getBoundingClientRect()

      this.line.style.left = `${active.x - first.x}px`
      this.line.style.width = `${active.width}px`

      // disable old
      document.querySelector('.tabs_item.active')?.classList.remove('active')

      // enable new
      item.classList.add('active')
    }

    const scrollIntoView = (item: HTMLElement) => {
      item.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      })
    }

    tick(() => {
      adjustLine(this.items[this.active])
      scrollIntoView(this.items[this.active])
    })

    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i]

      item.addEventListener('click', () => {
        this.active = i

        // looks hacky, but works well :)
        setTimeout(() => adjustLine(item), 50)
        setTimeout(() => adjustLine(item), 100)
        setTimeout(() => adjustLine(item), 150)

        // does not work in safari
        scrollIntoView(item)
      })
    }
  }

  render() {
    let offset = this.active * 102

    console.log('render()')

    const styles = `
      .tabs_container {
        background: #6204ee;

        width: 100%;
        height: 48px;

        overflow-x: scroll;
        overflow-y: hidden;

        ${userSelect}
      }

      /* Hide scrollbar for Chrome, Safari and Opera */
      .tabs_container::-webkit-scrollbar {
        display: none;
      }

      /* Hide scrollbar for IE, Edge and Firefox */
      .tabs_container {
        -ms-overflow-style: none; /* IE and Edge */
        scrollbar-width: none; /* Firefox */
      }

      .tabs_list {
        height: 100%;
        display: flex;
        list-style-type: none;
        margin: 0;
        padding: 0;
        cursor: pointer;
      }

      .tabs_item {
        padding-top: 16px;
        font-size: 14px;
        text-transform: uppercase;
        color: rgba(255, 255, 255, 0.75);
        transition: color 0.2s;
      }
      
      
      .tabs_item a {
        font-size: 14px;
        padding: 16px 32px;
        text-decoration: none;
        text-transform: uppercase;
        color: rgba(255, 255, 255, 0.75);
        transition: color 0.2s;
      }

      .tabs_item.active a {
        color: rgba(255, 255, 255, 1);
      }

      .tabs_item:active {
        background: #5902db;
      }

      /* if the primary input mechanism system of the device can hover over elements with ease, we use hover */
      @media (hover: hover) {
        .tabs_item:hover {
          background: #5902db;
        }
      }

      .tabs_line {
        border-bottom: 2px solid white;
        position: relative;
        top: -2px;

        opacity: 0;
        
        left: 50%;
        width: 0px;

        transition: left 0.5s, width 0.5s;

        animation-name: tabs_line_fadein;
        animation-duration: 0.25s;
        animation-delay: 0.25s;
        animation-fill-mode: forwards;
      }
      
      @keyframes tabs_line_fadein {
        from {opacity: 0;}
        to {opacity: 1;}
      }
      `

    const styleElement = h('style', {}, styles)
    document.head.appendChild(styleElement)

    // set the active tab
    this.props.children?.forEach((c, i) => {
      if (i === this.active) c.props = { ...c.props, active: true }
    })

    this.items = render(this.props.children)

    const list = h('ul', { class: 'tabs_list' }, this.items)
    this.line = h('div', { class: 'tabs_line' })
    const container = h('div', { class: 'tabs_container' }, list, this.line)

    return container
  }
}
