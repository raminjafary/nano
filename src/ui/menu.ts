import { h, removeAllChildNodes, render } from '../core'
import { boxShadow, zIndex } from './_config'

// interface MenuItem {
//   item: any
// }

interface MenuOptions {
  position: { x: number; y: number }
  list: any
}

export class Menu {
  defaultParentId = 'menu_items_container'
  cssHash = Math.random().toString(36).substr(2, 9)

  didUnmount() {
    const el = document.querySelector(`[data-css-hash*="${this.cssHash}"]`)
    if (el) el.remove()
  }

  private getParentElement(id: string) {
    // delete all other
    const others = document.querySelectorAll(`[id^="${this.defaultParentId}"]`)
    others.forEach((e) => {
      e.remove()
    })

    let el = document.getElementById(`${this.defaultParentId}-${id}`)
    if (!el) {
      el = document.createElement('div')
      el.id = `${this.defaultParentId}-${id}`
    }

    removeAllChildNodes(el)
    document.body.appendChild(el)

    return el
  }

  open(menuOptions: MenuOptions) {
    const { position, list } = menuOptions

    // check in which corner the menu appears and adjust fixed position.
    const left = position.x < window.innerWidth / 2 ? 'left' : 'right'
    const top = position.y < window.innerHeight / 2 ? 'top' : 'bottom'

    const styles = `
      #menu_items_container-${this.cssHash} {
        position: fixed;
        background: white;
        
        border-radius: 4px;
        min-width: 112px;

        ${top}: ${position.y > window.innerHeight / 2 ? window.innerHeight - position.y : position.y}px;
        ${left}: ${position.x > window.innerWidth / 2 ? window.innerWidth - position.x : position.x}px;

        z-index: ${zIndex.menu}

        ${boxShadow}
      }

    `

    // remove old styles
    const el = document.querySelector(`[data-css-hash*="${this.cssHash}"]`)
    if (el) el.remove()

    // add new styles
    const styleElement = h('style', { 'data-css-hash': this.cssHash }, styles)
    document.head.appendChild(styleElement)

    this.getParentElement(this.cssHash).appendChild(render(list))
  }
}
