import { Component } from '../component'
import { h, tick } from '../core'

export class Tabs extends Component {
  line: HTMLElement
  items: HTMLElement[]

  didMount() {
    let active = 2

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

    tick(() => {
      adjustLine(this.items[active])
    })

    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i]

      item.addEventListener('click', () => {
        active = i

        // looks hacky, but works well :)
        setTimeout(() => adjustLine(item), 50)
        setTimeout(() => adjustLine(item), 100)
        setTimeout(() => adjustLine(item), 150)

        // does not work in safari
        item.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center',
        })
      })
    }
  }

  render() {
    console.log('render()')

    const styles = `
      .tabs_container {
        background: #6204ee;

        width: 100%;
        height: 48px;

        overflow-x: scroll;
        overflow-y: hidden;
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
        display: flex;
        list-style-type: none;
        margin: 0;
        padding: 0;
        cursor: pointer;
      }

      .tabs_item {
        padding: 16px 32px;
        font-size: 14px;
        text-transform: uppercase;
        color: rgba(255, 255, 255, 0.75);
        transition: color 0.2s;
      }

      .tabs_item.active {
        color: rgba(255, 255, 255, 1);
      }

      .tabs_item:hover {
        background: #5902db;
      }

      .tabs_line {
        border-bottom: 2px solid white;
        position: relative;
        top: -2px;

        left: 1px;
        width: 50px;

        transition: left 0.5s, width 0.5s;
      }`

    const styleElement = h('style', {}, styles)
    document.head.appendChild(styleElement)

    const item0 = h('li', { class: 'tabs_item' }, 'first')
    const item1 = h('li', { class: 'tabs_item' }, 'seconds')
    const item2 = h('li', { class: 'tabs_item' }, 'third')
    const item3 = h('li', { class: 'tabs_item' }, 'fourth')
    const item4 = h('li', { class: 'tabs_item' }, 'fifth')
    this.items = [item0, item1, item2, item3, item4]

    const list = h('ul', { class: 'tabs_list' }, this.items)
    this.line = h('div', { class: 'tabs_line' })
    const container = h('div', { class: 'tabs_container' }, list, this.line)

    return container
  }
}
