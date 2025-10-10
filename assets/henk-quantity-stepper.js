class HenkQuantityStepper extends HTMLElement {
  static formAssociated = true; // enables form association

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this._internals = this.attachInternals(); // FACE API
    this._value = parseInt(this.getAttribute("value")) || 1;
    this._name = this.getAttribute("name") || "quantity";
    this._min = parseInt(this.getAttribute("min")) || 1;
    this._max = this.hasAttribute("max")
      ? parseInt(this.getAttribute("max"))
      : Infinity;

    this.render();
    this.updateButtonState();
    this._internals.setFormValue(String(this._value)); // initial form value
  }

  connectedCallback() {
    this.btnMinus.addEventListener("click", () => this.change(-1));
    this.btnPlus.addEventListener("click", () => this.change(1));
  }

  render() {
    const minusIcon = `<i class="henk-icon icon--large">
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M21.3023 11.3022C21.6876 11.3022 22 11.6146 22 11.9999C22 12.3852 21.6876 12.6976 21.3023 12.6976C5.03713 12.6976 18.9629 12.6976 2.69767 12.6976C2.31236 12.6976 2 12.3852 2 11.9999C2 11.6146 2.31236 11.3022 2.69767 11.3022C18.6105 11.3022 -4.73861 11.3022 21.3023 11.3022Z" fill="currentcolor"></path></svg>
</i>`;
    const plusIcon = `<i class="henk-icon icon--large">
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C12.3853 2 12.6977 2.31236 12.6977 2.69768V11.3023H21.3023C21.6876 11.3023 22 11.6147 22 12C22 12.3853 21.6876 12.6977 21.3023 12.6977H12.6977V21.3023C12.6977 21.6876 12.3853 22 12 22C11.6147 22 11.3023 21.6876 11.3023 21.3023V12.6977H2.69767C2.31236 12.6977 2 12.3853 2 12C2 11.6147 2.31236 11.3023 2.69767 11.3023H11.3023V2.69768C11.3023 2.31236 11.6147 2 12 2Z" fill="currentcolor"></path></svg>
</i>`;

    this.shadowRoot.innerHTML = `
      <style>

  .henk-icon,
  ::part(henk-icon) {
    align-items: flex-start;
    display: inline-flex;
    place-content: center;
    pointer-events: none;
    transition: transform 0.3s ease;
  }


        .wc-stepper-quantity {
align-items: center;
    border: 1px solid var(--color-border-muted);
    border-radius: 8px;
    display: flex;
    justify-content: space-between;
  }
        .wc-stepper-quantity__button {
align-items: center;
    background-color: initial;
    border: 0;
    border-radius: 0;
    cursor: pointer;
    display: flex;
    font-size: 18px;
    justify-content: center;
    line-height: 24px;
    padding: 10px;
        }
        .wc-stepper-quantity__button[disabled] {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .wc-stepper-quantity__input {

-webkit-appearance: textfield !important;
    appearance: textfield !important;
    background-color: var(--color-alias-base-transparent);
    border: 0;
    cursor: default;
    font-family: var(--font-body, sans-serif);
    font-feature-settings: "pnum" on, "lnum" on;
    padding: 0;
    pointer-events: none;
    text-align: center;
    -webkit-user-select: none;
    user-select: none;
        }
      </style>

      <div class="wc-stepper-quantity">
        <button type="button" aria-label="Decrease quantity" class="wc-stepper-quantity__button wc-stepper-quantity__button-min">
          ${minusIcon}
        </button>

        <input type="text"
          inputmode="numeric"
               class="wc-stepper-quantity__input"
               min="${this._min}"
               max="${this._max === Infinity ? "" : this._max}"
               step="1"
               value="${this._value}"
               readonly
        />

        <button type="button" aria-label="Increase quantity" class="wc-stepper-quantity__button wc-stepper-quantity__button-plus">
          ${plusIcon}
        </button>
      </div>
    `;

    this.btnMinus = this.shadowRoot.querySelector(
      ".wc-stepper-quantity__button-min",
    );
    this.btnPlus = this.shadowRoot.querySelector(
      ".wc-stepper-quantity__button-plus",
    );
    this.input = this.shadowRoot.querySelector(".wc-stepper-quantity__input");
  }

  change(delta) {
    let newValue = this._value + delta;
    newValue = Math.max(this._min, Math.min(newValue, this._max));
    this._value = newValue;
    this.input.value = newValue;
    this.updateButtonState();

    // Update form value
    this._internals.setFormValue(String(this._value));

    // Dispatch a custom event
    this.dispatchEvent(
      new CustomEvent("quantity-change", {
        detail: { value: newValue },
        bubbles: true,
        composed: true,
      }),
    );
  }

  updateButtonState() {
    this.btnMinus.disabled = this._value <= this._min;
    this.btnPlus.disabled = this._value >= this._max;
  }

  // Expose value as property
  get value() {
    return this._value;
  }

  set value(val) {
    const num = parseInt(val);
    if (!isNaN(num)) {
      this._value = Math.max(this._min, Math.min(num, this._max));
      this.input.value = this._value;
      this.updateButtonState();
      this._internals.setFormValue(String(this._value));
    }
  }

  // Optional: support required validation
  checkValidity() {
    return this._value >= this._min && this._value <= this._max;
  }

  reportValidity() {
    if (!this.checkValidity()) {
      this.input.setCustomValidity("Invalid quantity");
      return this.input.reportValidity();
    }
    this.input.setCustomValidity("");
    return true;
  }
}

customElements.define("henk-quantity-stepper", HenkQuantityStepper);
