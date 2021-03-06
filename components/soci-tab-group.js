import SociComponent from './soci-component.js'

export default class SociTabGroup extends SociComponent {
  constructor() {
    super()
  }

  css(){
    return `
      tabs {
        --tab-padding: 40px;
        display: flex;
        color: var(--base-text);
        padding-top: 8px;
        margin-bottom: 10px;
        user-select: none;
        background: linear-gradient(0deg, var(--shadow-dark) 0px, var(--shadow-light) 1px, transparent 30px);
        padding-left: var(--tab-padding);
        padding-right: var(--tab-padding);
        margin: 0 calc(-1 * var(--tab-padding));
        position: relative;
      }
      tabs:before,
      tabs:after {
        content: '';
        position: absolute;
        bottom: 0px;
        left: 0px;
        background: linear-gradient(90deg, var(--base-background), transparent);
        display: block;
        width: var(--tab-padding);
        height: 30px;
      }
      tabs:after {
        left: auto;
        right: 0px;
        background: linear-gradient(270deg, var(--base-background), transparent);
      }
      tab {
        display: block;
        margin-right: 32px;
        font-weight: 500;
        position: relative;
        cursor: pointer;
        padding: 8px;
      }
      tab:first-child {
        padding-left: 0;
      }
      tab:hover {
        color: var(--base-text-hover);
      }
      tab[active] {
        color: var(--brand-text);
      }
      tab[active]:hover {
        color: var(--brand-text-hover);
      }
      tab[active]:after{
        content: '';
        height: 3px;
        width: 16px;
        background-color: var(--base-background);
        display: block;
        position: absolute;
        bottom: 0;
        border-radius: 3px 3px 0 0;
        left: calc(50% - 8px);
        box-shadow: 0 -1px 1px rgba(0,0,0,0.1);
      }
      tab[active]:first-child:after {
        left: calc(50% - 12px);
      }
    ` 
  }

  html(){ return `
      <tabs @click=_tabClick>
        ${this._createTabs()}
      </tabs>
      <slot></slot>
    `
  }

  connectedCallback(){
    this.addEventListener('tabactivate', this._tabActivated)
  }

  _createTabs(){
    let tabs = Array.from(this.querySelectorAll('soci-tab'))
    return `
      ${tabs.map((tab, i) => {
        let name = tab.getAttribute('name')
        if(!name) this.log('Tab is missing a name')
        return `<tab name=${name} ${i==0 ? 'active' : ''}>${name}</tab>`
      }).join('')}
    `
  }

  _tabClick(e){
    let tab = e.target
    if(tab.tagName != 'TAB') return 0
    let name = tab.innerText
    let tabs = Array.from(this.querySelectorAll('soci-tab'))
    tabs.forEach(tab=>tab[tab.getAttribute('name') == name ? 'activate' : 'deactivate']())
  }

  _tabActivated(e){
    let prevTab = this.select('[active]')
    if(prevTab) prevTab.removeAttribute('active')

    let name = e.target.getAttribute('name')
    this.select(`tab[name=${name}]`).setAttribute('active', '')
  }
}