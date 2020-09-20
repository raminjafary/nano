import { Component } from '../component'
import { h, strToHash } from '../core'

interface ListProps {
  small?: boolean
  [key:string]: any
}

export class ListItem extends Component {
  render() {
    return h('li', null, this.props.children)
  }
}

export class List extends Component<ListProps> {
  cssHash :string

 

  render() {
    const {small = false} = this.props

    this.cssHash =  strToHash('List' + small.toString())

    const styles = `
      .list-${this.cssHash} ul {
        margin: 0px;
        padding: 8px 16px;
      }

      .list-${this.cssHash} ul li {
        list-style: none;
        min-height: ${small ? 32 : 46}px;
        display: flex;
        align-items: center;
        margin: 0px -16px;
        padding: 0px 16px;
        cursor: pointer;
      }

      .list-${this.cssHash} ul li:hover  {
        background:#00000010
      }    
    `
    const el = document.querySelector(`[data-css-hash*="${this.cssHash}"]`)
    if (!el) {
      const styleElement = h('style', { 'data-css-hash': this.cssHash }, styles)
      document.head.appendChild(styleElement)
    }

    const ul = h('ul', null, this.props.children)
    return h('div', { class: `list-${this.cssHash}` }, ul)
  }
}
