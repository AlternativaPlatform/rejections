export default class Rejection extends Error {
  constructor(type, payload) {
    super();
    this.type = type;
    this.payload = payload;

    this.toString = () => this.type;

    this.toJSON = () => {
      const json = { type: this.type };
      if (this.payload !== undefined) {
        json.payload = this.payload;
      }
      return json;
    }
  }
}
