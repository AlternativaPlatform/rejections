export default class Rejection extends Error {
  constructor(type, payload) {
    super();
    this.type = type;
    this.payload = payload;

    Object.defineProperty(this, 'toString', { value: () => this.type });
    
    Object.defineProperty(this, 'toJSON', { value: () => {
      const json = { type: this.type };
      if (this.payload !== undefined) {
        json.payload = this.payload;
      }
      return json;
    }});
  }
}
