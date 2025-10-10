class HenkQuantityStepper extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._value = parseInt(this.getAttribute("value")) || 1;
    this._name = this.getAttribute("name") || "quantity";
  }

  connectedCallback() {
    this.render();
    this.updateButtonState();
  }

  render() {
    const minusIcon = `
      <i class="henk-icon icon--large">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd"
            d="M21.3023 11.3022C21.6876 11.3022 22 11.6146 22 11.9999C22 12.3852 21.6876 12.6976 21.3023 12.6976C5.03713 12.6976 18.9629 12.6976 2.69767 12.6976C2.31236 12.6976 2 12.3852 2 11.9999C2 11.6146 2.31236 11.3022 2.69767 11.3022C18.6105 11.3022 -4.73861 11.3022 21.3023 11.3022Z"
            fill="currentcolor"/>
        </svg>
      </i>`;

    const plusIcon = `
      <i class="henk-icon icon--large">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd"
            d="M12 2C12.3853 2 12.6977 2.31236 12.6977 2.69768V11.3023H21.3023C21.6876 11.3023 22 11.6147 22 12C22 12.3853 21.6876 12.6977 21.3023 12.6977H12.6977V21.3023C12.6977 21.6876 12.3853 22 12 22C11.6147 22 11.3023 21.6876 11.3023 21.3023V12.6977H2.69767C2.31236 12.6977 2 12.3853 2 12C2 11.6147 2.31236 11.3023 2.69767 11.3023H11.3023V2.69768C11.3023 2.31236 11.6147 2 12 2Z"
            fill="currentcolor"/>
        </svg>
      </i>`;

    this.shadowRoot.innerHTML = `
      <style>
        .wc-stepper-quantity {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
        }
        .wc-stepper-quantity__button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: inherit;
        }
        .wc-stepper-quantity__button[disabled] {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .wc-stepper-quantity__input {
          width: 3rem;
          text-align: center;
          font: inherit;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
      </style>

      <div class="wc-stepper-quantity">
        <button
          type="button"
          aria-label="Decrease quantity"
          class="wc-stepper-quantity__button wc-stepper-quantity__button-min"
        >${minusIcon}</button>

        <input
          type="number"
          name="${this._name}"
          aria-label="Item quantity"
          class="wc-stepper-quantity__input"
          inputmode="numeric"
          min="1"
          step="1"
          readonly
          value="${this._value}"
        />

        <button
          type="button"
          aria-label="Increase quantity"
          class="wc-stepper-quantity__button wc-stepper-quantity__button-plus"
        >${plusIcon}</button>
      </div>
    `;

    this.btnMinus = this.shadowRoot.querySelector(
      ".wc-stepper-quantity__button-min",
    );
    this.btnPlus = this.shadowRoot.querySelector(
      ".wc-stepper-quantity__button-plus",
    );
    this.input = this.shadowRoot.querySelector(".wc-stepper-quantity__input");

    this.btnMinus.addEventListener("click", () => this.change(-1));
    this.btnPlus.addEventListener("click", () => this.change(1));
  }

  change(delta) {
    const newValue = Math.max(1, this._value + delta);
    this._value = newValue;
    this.input.value = newValue;
    this.updateButtonState();

    // Dispatch event so parent can listen for updates
    this.dispatchEvent(
      new CustomEvent("quantity-change", {
        detail: { value: newValue },
        bubbles: true,
        composed: true,
      }),
    );
  }

  updateButtonState() {
    this.btnMinus.disabled = this._value <= 1;
  }
}

customElements.define("henk-quantity-stepper", HenkQuantityStepper);
// class HenkQuantityStepper extends HTMLElement {
//   connectedCallback() {
//     this.innerHTML = `
//       <div class="wc-stepper-quantity">
//         <button type="button" class="wc-stepper-quantity__button wc-stepper-quantity__button-min" aria-label="Decrease quantity">−</button>
//         <input type="number" min="1" step="1" value="1" aria-label="Quantity" />
//         <button type="button" class="wc-stepper-quantity__button wc-stepper-quantity__button-plus" aria-label="Increase quantity">+</button>
//       </div>
//     `;
//   }
// }
//
// customElements.define("henk-quantity-stepper", HenkQuantityStepper);
