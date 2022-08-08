export class BDSSignon extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <style>
        .signon {
          display: grid;
          margin: 1rem;
        }
      </style>
      <h2>Sign On</h2>
      <form class="signon">
        <label for="email">Email:</label>
        <input type="email" name="email" placeholder="Your Registered Email" required />
        <br />
        <label for="password">Password:</label>
        <input type="password" name="password" placeholder="Your Password" required />
        <br />
        <button>Submit</button>
      </form>
    `;

    this.addEventListener("submit", (e) => {
      e.preventDefault();
      this.dispatchEvent(new CustomEvent("bds-signon-submit", { detail: { email: e.target.email.value, pwd: e.target.password.value } }));
    });
  }
} // Class End
window.customElements.define("bds-signon", BDSSignon);
