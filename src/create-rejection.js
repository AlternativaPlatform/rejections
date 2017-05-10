import invariant from 'invariant';
import Rejection from './rejection';

export default type => {
  invariant(type, 'Rejection type should be provided');
  const creator = payload => new Rejection(type, payload);
  creator.toString = () => type.toString();
  return creator;
};

//const handleRejection = rejectionsMap => rejection => {
//  if (rejection && rejection.type) {
//  }
//
//  if (rejectionsMap.else) return rejectionsMap.else(rejection);
//};
//
//const unknown = createRejection('unknown');
//const networkProblem = createRejection('network-problem');
//
//doAsyncStuff().catch(handleRejection(
//  {
//    [unknown]: r => r,
//    [networkProblem]: r => r,
//  },
//  r => r
//);


