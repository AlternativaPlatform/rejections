import Rejection from './rejection';

export default raw => {
  if (!raw || !raw.type) return new Rejection('unknown', raw);
  return new Rejection(raw.type, raw.payload);
}
