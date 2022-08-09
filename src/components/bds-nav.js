export class BDSNav extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.bdsnav = JSON.parse(this.getAttribute("nav-items"));
    this.logo = this.getAttribute("logo");
    this.loggedin = this.getAttribute("loggedin");
  }

  render() {
    const showsearch = this.loggedin === 'true' ? `visible` : 'hidden';
  
    let navlist = ``;
    this.bdsnav.forEach((list) => {
      if (list.display === "all" || (list.display === "signedin" && this.loggedin === "true") || (list.display === "signedoff" && this.loggedin !== "true")) { 
        const labels = `<span>${list.item}</span>`;
        const icons = `<img src="${list.icon}">`;
        const menudisplay = this.display === "labels" ? labels : this.display === "icons" ? icons : `${icons}${labels}`;
        navlist += `<li><a href="#" id=${list.item} title="${list.item}">${menudisplay}</a></li>`;
      }
    });
    
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          --background: #288;
        }
        header {
          box-sizing: border-box;
          background: var(--background);
          text-align: center;
          position:relative;
          width: 100%;
          padding: 0.1rem 1rem 0.1rem 1rem;
          z-index: 999;
          display:grid;
          grid-template-columns: 1fr 1fr 1fr;
          align-items: center;
          gap: 4px;
        }
        .logo {
          color: whitesmoke;
          font-wight: bold;
          font-size: 2rem;
        }
        search {
          display: flex;
          visibility:${showsearch};
          justify-content: right;
          margin: 1rem 0;
        }
        search input[type=search]{
          background-image: url("./assets/search.png");
          background-position: 10px 4px;
          background-repeat: no-repeat;
          padding-left: 40px;
          outline: none;
          width: 5%;
          transition: width 0.4s ease-in-out;
          border: none;
          height: 1.75rem;
          border-radius: 4px 0 0 4px;
        }
        search input[type=search]:focus{
          width: 75%;
        }
        button {
          background: rgb(50 50 50);
          border: none;
          color: white;
          border-radius: 0 4px 4px 0;
          height: 1.75rem;
        }    
        nav {
          position: absolute;
          text-align: left;
          left: 0;
          top: 4rem;
          background: var(--background);
          transform: scale(1,0);
          transform: translateX(-100%);
          transition: transform 400ms ease-in-out;
          text-align: center;
          height:100vh;
        }
        nav ul {
          margin: 0;
          padding: 0;
          list-style:none;
        }
        nav li {
          display:flex;
          margin-bottom:0.75rem;
          padding-right:1rem;
          padding-top:1rem;
          padding-left:1rem;
          border-top: 1px solid white;
        }
        nav li:last-child {
          padding-bottom:1rem;
          border-bottom: 1px solid white;
        }
        nav a {
          color: white;
          text-decoration:none;
          opacity: 0;
          text-transform: uppercase;
          font-size: 0.8rem;
          transition: opacity 150ms ease-in-out;
          border-shadow: 5px 5px 18px #555;
        }
        nav a:hover {
          color: #000;
        }
        nav a span {
          display: inline-block;
          margin-left: 0.5rem;
        }
        nav img {
          filter: invert(100%);
          margin-bottom:-0.5rem;
        }
        .menu {
          display: none;
        }
        .menu:checked ~ nav {
          transform: scale(1,1);
        }
        .menu:checked ~ nav a {
          opacity: 1;
          transition: opacity 250ms ease-in-out 250ms;
        }
        .menu-label {
          display: flex;
          position: relative;
          top: 0;
          left: 0;
          margin-left: 1rem;
          height: 100%;
          align-items: center;
        }
        .menu-label span,
        .menu-label span::before,
        .menu-label span::after {
          display: block;
          background: white;
          height: 2px;
          width: 1.25rem;
          border-radius: 2px;
          position: relative;
        }
        .menu-label span::before,
        .menu-label span::after {
          content: '';
          position:absolute;
        }
        .menu-label span::before {
          bottom: 0.3rem;
        }
        .menu-label span::after {
          top: 0.3rem;
        }


        
      @media screen and (min-width: 900px) {
          .menu-label {
            display: none;
          }
          header {
            box-sizing: border-box;
            display: grid;
            grid-template-columns: 1fr 1fr 1fr; 
            gap: 4px;
          }
          .logo {
            display: flex;
            align-items: center;
            color:whitesmoke;
            font-wight: bold;
            font-size: 2rem;
            margin-left 0;
            margin-right:1.5rem;
          }
          search {
            display: flex;
            visibility:${showsearch};
            justify-content: center;
            margin: 1rem 0;
          }
          search input[type=search]{
            background-image: url("./assets/search.png");
            background-position: 10px 4px;
            background-repeat: no-repeat;
            padding-left: 40px;
            outline: none;
            width: 5%;
            transition: width 0.4s ease-in-out;
            border: none;
            height: 1.75rem;
            border-radius: 4px 0 0 4px;
          }
          search input[type=search]:focus{
            width: 100%;
          }
          button {
            background: rgb(50 50 50);
            border: none;
            color: white;
            border-radius: 0 4px 4px 0;
            height: 1.75rem;
          }  
          nav {
            all: unset;
            display: flex;
            justify-content: right;
          }
          nav a {
            opacity: 1;
            position: relative;
            text-transform: uppercase;
            font-size: 0.8rem;
            margin:-0.25rem;
          }
          nav ul {
            display: flex;
            margin:0 1rem;
          }
          nav li {
            margin:-0.25rem;;
          }
          nav li:last-child {
            border-bottom: none;
          }
          nav a::before {
            content: '';
            display: block;
            height: 4px;
            background: black;
            position: absolute;
            top: -0.5rem;
            right: 0;
            left: 0;
            transform: scale(0,1);
            transition: transform ease-in-out 250ms;
          }
          nav a:hover::before {
            transform: scale(1,1);
          }
          nav a span {
            display: block;
            margin-top: 0.5rem;
          }
      }
      </style>
        <header>
        <input type="checkbox" class="menu" id="menu">
        <label for="menu" class="menu-label"><span/><span/></label>      
        <span class="logo">${this.logo}</span>
        <search><input id="bds-searchkey" type="search" placeholder="Search My Workqueue"><button id="bds-search-submit">GO</button></search>
        <nav>
          <ul>
            ${navlist}
          </ul>
        </nav>
        </header>
      `;
      //<label for="menu" class="menu-label">☰</label>
  }

  connectedCallback() {
    if (!this.rendered) {
      this.render();
      this.rendered = true;
    }
    
    this.shadowRoot.addEventListener("click", (e) => {
    
      if (e.composedPath()[1].id) {
        // tag <a> has the id
        this.shadowRoot.getElementById("menu").checked = false; // close sidebar when the menu item is selected
      }
      if (e.target.id === 'bds-search-submit') {
        this.dispatchEvent(new CustomEvent("bds-search-submit", { detail: { searchkey: this.shadowRoot.getElementById("bds-searchkey").value} }));
      }
    });
  }

  static get observedAttributes() {
    return ["nav-items", "logo", "loggedin"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.loggedin = newValue;
    this.render();
  }
}
window.customElements.define("bds-nav", BDSNav);
