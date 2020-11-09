Simple Youtube
========

A simple way to access the youtube search API

###Getting Started

####Install

```
npm install simple-youtube --save-dev
```

####Options

```
* key: String (required): Youtube API Key
* term: String (required): Search term
* number: Number (optional, defaults to 5): Max number of results
```

####Example
Search for 'hello world' and return 15 results

```
import SimpleYT from 'simple-youtube'

SimpleYT({
    key: YOUR_API_KEY,
    term: 'hello world',
    number: 15,
  }, (videos) => {
    // Callback body
  })
```

