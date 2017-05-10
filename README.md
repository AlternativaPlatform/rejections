Rejections
============

## Installation

```
npm install --save rejections
```

## Motivation

I do love `Promises` and use them everywhere. I promise. =) It is recommended practice to use instances of `Error` as a rejection reason of `Promises`. Some libs (e.g. [bluebird](http://bluebirdjs.com/)) will even show you a warning in case you reject `Promise` with non-error. Straightforward solution is to use subclasses of `Errors`. But it leads to some complications.

### Complication 1

In case you want serialize/deserialize rejection to pass it from server to client, or to save it in `Redux` store, you'll have to write custom serialization/deserialization code, which I feel lazy to do every time.

### Complication 2

If you want to take action based on rejection class (which is the whole point behind using `Error` subclasses as rejections), and you are using `Babel` to make your code ES5-browsers compatible, then you'll have to deal with wierd issue:

```javascript
class UserNotFound extends Error {
  contstructor(username) {
    super();
    this.username = username;
  }
}

new UserNotFound('Fedor') instanceof UserNotFound // will be false
```

To deal with both compilcatins you'll have to introduce some kind of `type` filed in your `Error` subclasses.

## Solution

So why use subclasses at all? With some inspiration from [redux-actions](https://github.com/acdlite/redux-actions) this lib provides two main functions `createRejection`, `handleRejections` and one utility function `parseRejection`. 


### createRejection(type)

Returns rejection creator for given rejection type. Creator will return `Error` subclass with provided `payload`.

```javascript
const userNotFound = createRejection('user-not-found');
const networkProblem = createRejection('network-problem');

const r1 = userNotFound('Fedor');
const r2 = networkProblem({ host: 'google.com', status: 404 });

r1 instanceof Error; // true
r2 instanceof Error; // true

JSON.stringify(r1); // {"type":"user-not-found","payload":"Fedor"}
JSON.stringify(r2); // {"type":"network-problem","payload":{"host":"google.com","status":404}}
```

### handleRejections(rejectionsMap, defaultHandler = IdentityRejector)

Creates rejections handler for given rejection types. In case no matching handler found in `rejectionsMap` provided rejection will be passed to `defaultHandler`. In case `defaultHandler` is not provided function re-rejecting input will be used (i.e. `r => Promise.reject(r)`). The result of matching handler will be returned for convinience.

```javascript
const knownIssue = createRejection('known-issue');
const otherKnownIssue = createRejection('other-known-issue');

...

API.getCriticalData()
    .then(
        parseIt, // make data usable for your app
        handleRejections({
          [knownIssue]: rej => tryToRecover(rej),
          [otherKnownIssue]: rej => tryToRecoverFromAnotherIssue(rej)
        }) // unknown problem, pass reject further
    )
    .then(useIt)
    .catch(rej => {
      // was not able to recover
    });
    
...

API.getNotCriticalData()
    .then(
        parseIt, // make data usable for your app
        handleRejections({
          [knownIssue]: rej => tryToRecover(rej),
          [otherKnownIssue]: rej => tryToRecoverFromAnotherIssue(rej)
        }, rej => replaceWithDummyData()) 
    )
    .then(useIt);
    
```

### parseRejection(raw)

Creates rejection instance from the given raw rejection data, which should be of following shape:

```javascript
{
  type: String,
  payload: Anything | undefined,
}
```

In case raw rejection does not match that shape, rejection with type 'unknown' will be created. `raw` argument will be passed as its payload:

```javascript
const r1 = parseRejection({ type: 'known', payload: { field: 'value' } });
// r1.type is 'known'
// r1.payload is { field: 'value' }

const r2 = parseRejection('We have failed badly');
// r2.type is 'unknown'
// r2.payload is 'We have failed badly'

const r3 = parseRejection({ type: 'not-so-well-formatted', data: 'I will dissapear!' });
// r3.type is 'not-so-well-formatted'
// r3.payload is undefined
```

## License

Apache-2.0
