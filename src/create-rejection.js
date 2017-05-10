import invariant from 'invariant';
import Rejection from './rejection';

export default type => {
  invariant(type, 'Rejection type should be provided');
  const creator = payload => new Rejection(type, payload);
  creator.toString = () => type.toString();
  return creator;
};
