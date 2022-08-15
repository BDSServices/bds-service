import {BDSSearch} from './bds-search.js';
export class BDSList extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.bdslisthdr = this.getAttribute("list-hdr");
        this.bdslist = JSON.parse(this.getAttribute("list-items"));
        // console.log(this.bdslist);
        this.totalrecs = this.bdslist.length;
        this.batchstart = 0;
        this.pagenum = 1;
    }

    connectedCallback() {
        // const addContent = () => {
        //     //if (this.batchstart >= this.totalrecs)
        //     //    return;

        //     for (let i=this.batchstart; i<this.batchstart+10; i++){
        //         const details = document.createElement('details');
        //         const summary = document.createElement('summary');
        //         // summary.textContent = this.bdslist[i].filename;
        //         summary.textContent = this.bdslist[i].title;
        //         const div = document.createElement('div');
        //         div.innerHTML = `Author: ${this.bdslist[i].author}<br/>Record Reference: ${this.bdslist[i].recref}<br/>Loaded: 2022-06-20;`
        //         // div.innerHTML = `File Type: ${this.bdslist[i].filetype}<br/>File Size: ${this.bdslist[i].filesize}<br/>Loaded: 2022-06-20;`
        //         details.appendChild(summary);
        //         details.appendChild(div);
        //         this.shadowRoot.appendChild(details);
        //     }
        //     this.batchstart += 10;
        //     this.pagenum++;
        // }        

        this.shadowRoot.innerHTML = `
            <style>
  
                h2,h3,h4 {
                    margin: 0;
                    text-align: center;
                }
                section {
                    width:90vw;
                }              
                details {   
                    margin:0;           
                    border-bottom: 1px solid #78909c;
                    position: relative;
                    transition: background-color 0.25s;
                }
                details > :last-child {
                    margin-bottom: 0rem;
                }                
                details::before {
                    width: 100%;
                    height: 100%;
                    content: "";
                    position: absolute;
                    top: 0;
                    left: 0;
                    opacity: 0.15;
                    pointer-events: none;
                    transition: opacity 0.2s;
                    z-index: -1;
                }
                details[open]::before {
                    opacity: 0.6;
                }            
                summary {
                    padding: 1rem 3rem;
                    display: block;
                    position: relative;
                    font-size: 1.25rem;
                    font-weight: bold;
                    cursor: pointer;
                }  
                [open] summary {
                    background-color: #eee;
                }          
                summary::before, summary::after {
                    margin: 0 1rem 0 1rem;
                    width: 0.75rem;
                    height: 2px;
                    position: absolute;
                    top: 50%;
                    left: 0;
                    content: "";
                    background-color: currentColor;
                    text-align: right;
                    transform: translateY(-50%);
                    transition: transform 0.2s ease-in-out;
                }           
                summary::after {
                    transform: translateY(-50%) rotate(90deg);
                }            
                [open] summary::after {
                    transform: translateY(-50%) rotate(180deg);
                }          
                summary::-webkit-details-marker {
                    display: none;
                }
                details > :not(summary) {
                    padding: 1rem 3rem;
                    background-color: #fff;
                    transform: scaleY(0);
                    transform-origin: top;
                    transition: transform 300ms;
                    border: 0.1px solid lightgray;
                    /*box-shadow: 0 0.25em 0.5em #263238;*/
                }
                details[open] > :not(summary) {
                    transform: scaleY(1);
                }
            </style>
            <section>
                <h3>${this.bdslisthdr}</h3>
            </section>
        `;

        let options = {
            root: document.querySelector('main'),
            rootMargin: '0px',
            threshold: 0.8
          }
        // let handleIntersect = (entries, observer) => {
        //     //console.log(entries[0].intersectionRatio);
        //     if (entries[0].intersectionRatio>0) {
        //         this.dispatchEvent(new CustomEvent("bds-paging", { detail: {pagenum: this.pagenum} }));   
        //         setTimeout(() => {addContent();}, 2000);
        //     }
        // }
        let observer = new IntersectionObserver((entries, observer) => {
            //console.log(entries[0].intersectionRatio);
            if (entries[0].intersectionRatio>0) {
                this.dispatchEvent(new CustomEvent("bds-paging", { detail: {pagenum: this.pagenum} }));   
                // setTimeout(() => {addContent();}, 2000);
            }
        }, options);
        observer.observe(document.querySelector('#loading'));        
        //content:"🡒 "; 
        //content:"🡑 ";        
    }

    static get observedAttributes() {
        return ["list-items"];
      }
    
      attributeChangedCallback(name, oldValue, newValue) {
        this.bdslist = oldValue !== newValue && newValue !== '[]' ? [...this.bdslist, ...JSON.parse(`[${newValue}]`)] : this.bdslist;
        if(this.bdslist.length > 0 && newValue){
            this.addContent();
        }
      }    

      addContent = () => {
        //if (this.batchstart >= this.totalrecs)
        //    return;
        for (let i=this.batchstart; i<this.batchstart+10; i++){
            const details = document.createElement('details');
            const summary = document.createElement('summary');
            // summary.textContent = this.bdslist[i].filename;
            summary.textContent = this.bdslist[i].title;
            const div = document.createElement('div');
            div.innerHTML = `Author: ${this.bdslist[i].author}<br/>Record Reference: ${this.bdslist[i].recref}<br/>Loaded: 2022-06-20;`
            // div.innerHTML = `File Type: ${this.bdslist[i].filetype}<br/>File Size: ${this.bdslist[i].filesize}<br/>Loaded: 2022-06-20;`
            details.appendChild(summary);
            details.appendChild(div);
            this.shadowRoot.appendChild(details);
        }
        this.batchstart += 10;
        this.pagenum++;
    }        

}
window.customElements.define("bds-list", BDSList);