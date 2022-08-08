export class BDSIdlewatch extends HTMLElement {
  constructor() {
    super();
    this.idletimeout = this.getAttribute("bds-idletimeout");
    this.timeout;

    this.onIdle = () => {
      this.IdleTimer("stop");
      clearTimeout(this.timeout);
      console.log("Idle detected: Removing idle timer!!!")
      this.dispatchEvent(new CustomEvent("bds-timedoff", {}));
    }
    this.onActivity = () => {
      console.log(`Activity detected: Resetting idle timer!!!", ${this.idletimeout/1000} secs`);
      clearTimeout(this.timeout);
      this.timeout = setTimeout(this.onIdle, this.idletimeout);
    }  
    this.IdleTimer = (startstop) => {
      clearTimeout(this.timeout);
      console.log(`${startstop} - Idle Timer!`);
      ["click", "mousemove" , "keypress", "scroll"].forEach((event) => {
        startstop === 'start' 
          ? document.addEventListener(event, this.onActivity) 
          : document.removeEventListener(event, this.onActivity); 
      });
    }
}    
  static get observedAttributes() {
    return ["startstop"]; // array of attr to observe for changes
  }
  attributeChangedCallback(attrName, oldValue, newValue) {
      attrName === "startstop" && newValue !== "" ? this.IdleTimer(`${newValue}`) : null;
  }

} // class end
window.customElements.define("bds-idlewatch", BDSIdlewatch);
