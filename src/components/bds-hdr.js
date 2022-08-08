import { BDSNav } from "./bds-nav.js";
export class BDSHdr extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <style>
        :root {
          --background: rgba(85, 214, 170, 0.85)
        }
        header{
          display:flex;
          justify-content: space-between;
          background: var(--background);
          padding:0.5rem 0.5rem;
        }
        a {
          color: #000;
          text-decoration:none;
        }
        a:hover {
          color: white;
        }
        .menu {
          display: none;
          padding-right: 0.5rem;
        }
        @media (max-width: 600px) {
          header {
            flex-direction:column;
            justify-content: flex-start;
          }
          .menu {
            display: inline-block;
          }
          bds-nav {
            display:none;
          }
        }
      </style>
      <header>
        <h3><a href="#" class="menu">☰</a>BookDataSolutions</h3>
        <bds-nav></bds-nav>
      </header>
    `;
    this.querySelector(".menu").addEventListener("click", (e) => {
      const bdsnav = document.querySelector("bds-nav");
      const computedstyle = window.getComputedStyle(bdsnav, null);
      bdsnav.style.display =
        computedstyle["display"] === "block" ? "none" : "block";
    });
  }
}
window.customElements.define("bds-hdr", BDSHdr);
