export class BDSSearch extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }
    connectedCallback() {

        let search = "";
        search += `
            <search>
                <input type="search" placeholder="Search My Workqueue">
                <!-- <button>GO</button> -->
            </search>
        `;

        this.shadowRoot.innerHTML = `
            <style>
  
                h2 {
                    margin: 0;
                    text-align: center;
                }
                search {
                    display: flex;
                    justify-content: center;
                    margin-bottom: 1rem;
                }
                search input[type=search]{
                    box-sizing: border-box;
                    background-image: url("../assets/search.png");
                    background-position: 10px 5px;
                    background-repeat: no-repeat;
                    padding: 12px 10px 12px 40px;
                    outline: none;
                    width: 10%;
                    transition: width 0.4s ease-in-out;
                    border: none;
                    /*border-bottom: 1px solid*/
                    height: 2rem;
                    border-radius: 4px;
                }
                search input[type=search]:focus{
                    width: 200px;
                }
                search button {
                    border: none;
                    background: white;
                    cursor: pointer;
                }
            </style>
            ${search}
           `;
    }
}
window.customElements.define("bds-search", BDSSearch);
