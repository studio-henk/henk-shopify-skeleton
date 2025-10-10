
class HenkQuantityStepper extends HTMLElement {
  private _value: number;
  private _name: string;
  private btnMinus!: HTMLButtonElement;
  private btnPlus!: HTMLButtonElement;
  private input!: HTMLInputElement;

  static get observedAttributes() {
    return ["value"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._value = parseInt(this.getAttribute("value") || "1", 10);
    this._name = this.getAttribute("name") || "quantity";
  }

  connectedCallback() {
    this.render();
    this.updateButtonState();
  }

  attributeChangedCallback(name: string, oldVal: string, newVal: string) {
    if (name === "value" && oldVal !== newVal) {
      this._value = parseInt(newVal || "1", 10);
      if (this.input) this.input.value = String(this._value);
      this.updateButtonState();
    }
  }

  render() {
    const minusIcon = `<i class="henk-icon icon--large">…svg…</i>`;
    const plusIcon = `<i class="henk-icon icon--large">…svg…</i>`;

    this.shadowRoot!.innerHTML = `
      <style>
        .wc-stepper-quantity { display: inline-flex; align-items: center; gap: 0.25rem; }
        .wc-stepper-quantity__button { background: none; border: none; cursor: pointer; padding: 0.25rem; display: flex; align-items: center; justify-content: center; color: inherit; }
        .wc-stepper-quantity__button[disabled] { opacity: 0.4; cursor: not-allowed; }
        .wc-stepper-quantity__input { width: 3rem; text-align: center; font: inherit; border: 1px solid #ccc; border-radius: 4px; }
      </style>

      <div class="wc-stepper-quantity">
        <button type="button" aria-label="Decrease quantity" class="wc-stepper-quantity__button wc-stepper-quantity__button-min">${minusIcon}</button>
        <input type="number" name="${this._name}" aria-label="Item quantity" class="wc-stepper-quantity__input" min="1" step="1" value="${this._value}">
        <button type="button" aria-label="Increase quantity" class="wc-stepper-quantity__button wc-stepper-quantity__button-plus">${plusIcon}</button>
      </div>
    `;

    this.btnMinus = this.shadowRoot!.querySelector(".wc-stepper-quantity__button-min")!;
    this.btnPlus = this.shadowRoot!.querySelector(".wc-stepper-quantity__button-plus")!;
    this.input = this.shadowRoot!.querySelector(".wc-stepper-quantity__input")!;

    this.btnMinus.addEventListener("click", () => this.change(-1));
    this.btnPlus.addEventListener("click", () => this.change(1));
    this.input.addEventListener("input", () => this.onInputChange());
  }

  private change(delta: number) {
    this.value = Math.max(1, this._value + delta);
  }

  private onInputChange() {
    const val = Math.max(1, parseInt(this.input.value) || 1);
    this.value = val;
  }

  get value() {
    return this._value;
  }

  set value(val: number) {
    this._value = val;
    this.input.value = String(val);
    this.setAttribute("value", String(val));
    this.updateButtonState();

    this.dispatchEvent(
      new CustomEvent("quantity-change", {
        detail: { value: val },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private updateButtonState() {
    this.btnMinus.disabled = this._value <= 1;
  }
}

customElements.define("henk-quantity-stepper", HenkQuantityStepper);

