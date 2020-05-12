# Proxy Watched

Proxy Watched is a tool for watching an object for changes, even if they are deep ones.

I explicitly don't want to know what the change was, so that's not tracked.

## Usage

```JavaScript
import proxyWatched from 'proxy-watched'
const obj = { a: 'a' }
const watched = proxyWatched(a, () => changes ++)
watched.a = 'A' // changes => 1
watched.b = 'B' // changes => 2

// supports arrays
watched.names = ['Bob', 'Bill'] // changes => 3
watched.names.push('Bobby') // changes => 4
```
