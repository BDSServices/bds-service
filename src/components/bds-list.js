import {BDSSearch} from './bds-search.js';
export class BDSList extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.bdslisthdr = this.getAttribute("list-hdr");
        this.bdslist = this.getAttribute("list-items");//JSON.parse(this.getAttribute("list-items"));
        this.batchsize = parseInt(this.getAttribute("list-size"));
        this.totalrecs = this.bdslist.length;
        this.batchstart = 0;
        this.pagenum = 1;
        // this.dispatchEvent(new CustomEvent("bds-paging", { detail: {pagenum: this.pagenum} })); 
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = `
            <style>
  
                h2,h3,h4 {
                    margin: 0;
                    text-align: center;
                }
                .pageinfo {
                    text-align: center;
                    font-weight: 700;
                }
                .bdslist {
                    width:90vw;
                    height:70vh;
                    position:relative;
                    top: 0px;
                    overflow:scroll;
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
                    display: flex;
                    flex-direction: row;
                    gap:1rem;
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
                    top: 27.5%;
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
                    box-shadow: 0 0.25em 0.5em #263238;
                }
                details[open] > :not(summary) {
                    transform: scaleY(1);
                }
                #loading {
                    display:block;
                    text-align: center;
                }
                #loading:after {
                    display: inline-block;
                    font-size: 2rem;
                    font-weight: bold;
                    animation: dotty steps(1,end) 1s infinite;
                    content: '';
                }
                @keyframes dotty {
                    0% {content:'....';}
                    20% {content:'.....';}
                    40% {content:'......';}
                    60% {content:'.......';}
                    80% {content:'........';}
                    100% {content:'....';}
                }
              
            </style>
            <h2>${this.bdslisthdr}</h2>
            <div class="pageinfo"></div>            
            <div class="bdslist">
                <section></section>
                <br/>
                <div id="loading"></div>
            </div>
        `;

        let options = {
            root: document.querySelector('section'),
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
            }
        }, options);
        observer.observe(this.shadowRoot.querySelector('#loading'));        
        //content:"🡒 "; 
        //content:"🡑 ";        
    }

    static get observedAttributes() {
        return ["list-items"];
      }
    
      attributeChangedCallback(name, oldValue, newValue) {
        //this.bdslist = oldValue !== newValue && newValue !== '[]' ? [...this.bdslist, ...JSON.parse(`[${newValue}]`)] : this.bdslist;
        this.bdslist += oldValue !== newValue && newValue !== '' ? newValue : this.bdslist;
        if(this.bdslist.length > 0 && newValue){
           this.addContent();
        }
      }    

      addContent = () => {
        const section1 = this.shadowRoot.querySelector('section').innerHTML = this.bdslist;
        this.pagenum++;
        return;
        //if (this.batchstart >= this.totalrecs)
        //    return;
        const pageend = this.batchstart+this.batchsize;
        const section = this.shadowRoot.querySelector('section');
        for (let i=this.batchstart; i<pageend && this.bdslist[i]; i++){
            const details = document.createElement('details');
            const summary = document.createElement('summary');
            // summary.textContent = this.bdslist[i].filename;
            //summary.textContent = this.bdslist[i].title;
            summary.innerHTML = `
                <div>${i+1}.</div> 
                <div>
                    <div>${this.bdslist[i].title}</div>
                    <div style="font-size:0.8rem;font-weight:400;">Author: <em>${this.bdslist[i].author}</em><br/>Record Reference: <em>${this.bdslist[i].recref}</em><br/>Loaded: <em>2022-06-20</em></div>
                </div>
                `;               
            const div = document.createElement('div');
            div.innerHTML = `Author: ${this.bdslist[i].author}<br/>Record Reference: ${this.bdslist[i].recref}<br/>Loaded: 2022-06-20;`
            // div.innerHTML = `File Type: ${this.bdslist[i].filetype}<br/>File Size: ${this.bdslist[i].filesize}<br/>Loaded: 2022-06-20;`
            details.appendChild(summary);
            details.appendChild(div);
            section.appendChild(details);
        }
        const pageinfo = this.shadowRoot.querySelector('.pageinfo')
        pageinfo.innerHTML = `
            <h4>(file1.xml.json)</h4>
            <div>1 - ${pageend < this.bdslist[0].file ? pageend : this.bdslist[0].file} of ${this.bdslist[0].file} Titles</div>
        `;
        this.batchstart += this.batchsize;
        this.pagenum++;
    }        

}
window.customElements.define("bds-list", BDSList);