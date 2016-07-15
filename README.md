#Wheelbarrow JS -- A React Request Library

### Installation

`npm install --save wheelbarrow`

### Usage

Currently, Wheelbarrow supports Restful API requests right out of the box.  All you need to do is instantiate the Restful Action Creator, and you're good to go!

```javascript
var Dispatcher = require('flux').Dispatcher; // Or, any app architecture that has a `Dispatcher.dispatch` function.
import {RestfulActionCreator} from 'Wheelbarrow';

// Inside your React Component

userRequest: new Wheelbarrow('users', <api.url>, Dispatcher),

getAllUsers: function() {
  userRequest.getCollection(); // Will request to `<api.url>/users` and dispatch `USERS_GOTTEN` upon success.
  userRequest.getResourceById('1'); // Will request to `<api.url>/users/1` and dispatch `USER_GOTTEN_BY_ID` upon success.
}
```

Now, in your `Store` you can listen for the one of the above actions and handle the response accordingly.  This makes it very easy to request data from an external API and feed it directly into your app's event-based architecture without worrying about constructing the request each time.

### Actions
```json
actions = {
  "get": [ "<COLLECTION>_GOTTEN", "<COLLECTION>_GOTTEN_BY_ID" ],

  "post": [ "<COLLECTION>_POSTED", "<COLLECTION>_POSTED_BY_ID" ],

  "put": [ "<COLLECTION>_PUT", "<COLLECTION>_PUT_BY_ID" ],

  "patch": ["<COLLECTION>_PATCHED_BY_ID" ],

  "delete": [ "<COLLECTION>_DELETED", "<COLLECTION>_DELETED_BY_ID" ],
}
```

### Customizing
Wheelbarrow is made to be an extensible and pluggable request library.  In that way, you can make your own `Handlers` and `ActionCreators`, or mix-and-match between the ones we've included, 3rd party plugins, or your own!  Right now, we only have a RESTful example `Handler` and `ActionCreator` made, but there will be more in the near future.

