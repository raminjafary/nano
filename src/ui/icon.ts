import { Component } from '../component'
import { h, strToHash } from '../core'

interface IconProps {
  src: string
  active?: boolean
  color?: string
  onClick?: (e: MouseEvent) => void
}

export class Icon extends Component<IconProps> {
  cssHash: string

  didUnmount() {
    const el = document.querySelector(`[data-css-hash*="${this.cssHash}"]`)
    if (el) el.remove()
  }

  render() {
    const { src, active = true, color = '#6204EE', ...rest } = this.props

    this.cssHash = strToHash(active + color)

    const colors = {
      active: color,
      inactive: '#00000070',
    }

    const styles = `
    i.icon-${this.cssHash} {
      width: 22px;
      height: 22px;
      display: inline-block;
      content: '';

      /*-webkit-mask: url(YOUR_SVG_URL) no-repeat 50% 50%;
      mask: url(YOUR_SVG_URL) no-repeat 50% 50%;*/

      -webkit-mask-size: cover;
      mask-size: cover; 

      background-color: ${colors.active};
    }

    i.icon-${this.cssHash}.icon_inactive-${this.cssHash} {
      background-color: ${colors.inactive};
    }
    `
    const styleElement = h('style', { 'data-css-hash': this.cssHash }, styles)
    document.head.appendChild(styleElement)

    // const iconStyle = `-webkit-mask: url(/dev/font-awesome/ellipsis-v-solid.svg) no-repeat 50% 50%;mask: url(/dev/font-awesome/ellipsis-v-solid.svg) no-repeat 50% 50%;`
    const iconStyle = `-webkit-mask: url(${src}) no-repeat 50% 50%; mask: url(${src}) no-repeat 50% 50%;`

    const classes = [`icon-${this.cssHash}`]
    if (!active) classes.push(`icon_inactive-${this.cssHash}`)

    const icon = h('i', { class: classes.join(' '), ...rest, style: iconStyle })

    return icon
  }
}
