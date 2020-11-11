import {
  LitElement,
  customElement,
  property,
  TemplateResult,
  CSSResultArray,
  html,
} from 'lit-element'
import { connect } from '@oswee/lib/connect'
import { store } from '@oswee/pkg/store'
import { WebsocketActions, IConnectPayload } from '@oswee/pkg/websocket'
import template from './template'
import style from './style'
import { Layout } from '@oswee/lib/shared/style'
import { WebsocketModule } from '@oswee/pkg/websocket'

@customElement('main-shell')
export class MainShellElement extends connect(store, LitElement) {
  // export class MainShellElement extends LitElement {
  @property({ type: Object }) state: {
    hackerNews: boolean
    weather: boolean
    modules: boolean
  }

  constructor() {
    super()

    // define the initial state where none of the widgets are visible
    this.state = {
      hackerNews: false,
      weather: false,
      modules: false,
    }
  }

  connectedCallback() {
    super.connectedCallback()
    store.addModules([WebsocketModule])
  }

  firstUpdated() {
    import(/*webpackChunkName: "weather" */ '../../../../widgets/weather')
    // import(/*webpackChunkName: "websocket" */ '@oswee/pkg/websocket')
    const payload: IConnectPayload = {
      url: 'wss://api.oswee.com',
    }
    store.dispatch(WebsocketActions.websocketConnect(payload))
  }

  onHackerNewsToggled = () => {
    this.state.hackerNews = !this.state.hackerNews
    this.requestUpdate()
  }

  onWeatherToggled = () => {
    this.state.weather = !this.state.weather
    this.requestUpdate()
  }

  renderContent = () => {
    return html`
      ${this.state.hackerNews ? this.getHackerNews() : ''}
      ${this.state.weather ? this.getWeather() : ''}
    `
  }

  _hackerNews = null
  getHackerNews() {
    // console.log('test', this.state.hackerNews)
    if (!this.state.hackerNews) {
      return null
    }
    if (this._hackerNews) {
      return this._hackerNews
    }
    this._hackerNews = this.state.hackerNews
      ? html`<div>Hacker News</div>`
      : html`<div>Loading Scripts...</div>`
    return this._hackerNews
  }

  _weather = null
  getWeather() {
    if (!this.state.weather) {
      return null
    }
    if (this._weather) {
      return this._weather
    }

    // import('../../../../widgets/weather')
    // const LoadableWeather = Loadable({
    //   loader: () => import('./widgets/weather'),
    //   loading: () => <div>Loading Scripts...</div>,
    // })

    // this._weather = <LoadableWeather />
    // import('../../../../widgets/weather')
    // this._weather = html`<div>Loading Weather...</div>`
    this._weather = this.state.weather
      ? html`<weather-com></weather-com>`
      : html`<div>Loading Scripts...</div>`
    return this._weather
  }

  protected render(): TemplateResult {
    return template.call(this)
  }

  public static get styles(): CSSResultArray {
    return [Layout, style]
  }
  createRenderRoot(): Element | ShadowRoot {
    return this.hasAttribute('noshadow') ? this : super.createRenderRoot()
  }
}