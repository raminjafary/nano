import { h, strToHash } from '../core'
import { boxShadow, zIndex } from './_config'

export const Button = (props: { outlined?: boolean; text?: boolean; style?: string; [key: string]: any }) => {
  const { children, outlined = false, text = false, style = '', ...rest } = props

  const styles = `
    .nano-jsx-button {
      color: white;
      background-color: #6200EE;
      border-radius: 4px;
      display: inline-block;
      font-size: 14px;
      padding: 10px 16px;
      margin: 0px 0px 1em 0px;
      text-align: center;
      cursor: pointer;

      z-index: ${zIndex.button}

      ${boxShadow}
    }
  `

  const cssHash = strToHash(outlined.toString() + text + style)

  const el = document.querySelector(`[data-css-hash*="${cssHash}"]`)
  if (!el) {
    const styleElement = h('style', { 'data-css-hash': cssHash }, styles)
    document.head.appendChild(styleElement)
  }

  let customStyles = ''
  if (outlined || text) {
    customStyles += 'background: transparent; '
    customStyles += 'color: #6200EE; '
    customStyles += 'padding-top: 9px; padding-bottom: 9px; '
    customStyles += '-webkit-box-shadow: none; -moz-box-shadow: none; box-shadow none; '
    if (outlined) customStyles += 'border: 1px #6200EE solid; '
  }
  customStyles += style

  return h('a', { class: 'nano-jsx-button', style: customStyles, ...rest }, children)
}
