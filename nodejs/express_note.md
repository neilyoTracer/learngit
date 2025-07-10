# 1. Basic routing

**Routing** refers to determining how an application responds to a client request to a particular endpoint, which is a URI (or path) and a specific HTTP request method (GET, POST, and so on).

Each route can have one or more handler functions, which are executed when the route is matched.

Route definition takes the following structure:

```javascript
app.METHOD(PATH, HANDLER)
```

-- app is an instance of express.
-- METHOD is an HTTP request method, in **lowercase**.
-- PATH is a path on the server.
-- HANDLER is the function executed when the route is matched.

# 2. 利用Express托管静态文件

为了提供诸如图像、CSS 文件和 JavaScript 文件之类的静态文件，请使用 Express 中的 express.static 内置中间件函数。

此函数特征如下：

```javascript
express.static(root, [options])
```

例如，通过如下代码就可以将 public 目录下的图片、CSS 文件、JavaScript 文件对外开放访问了：

```javascript
app.use(express.static('public'))
```

# 3. Route parameters

Route path: /users/:userId/books/:bookId
Request URL: http://localhost:3000/users/34/books/8989
req.params: { "userId": "34", "bookId": "8989" }

Route path: /flights/:from-:to
Request URL: http://localhost:3000/flights/LAX-SFO
req.params: { "from": "LAX", "to": "SFO" }

Route path: /plantae/:genus.:species
Request URL: http://localhost:3000/plantae/Prunus.persica
req.params: { "genus": "Prunus", "species": "persica" }

# 4. Route handlers

## A single callback function can handle a route. For example:

```javascript
app.get('/example/a', function(req, res) {
    res.send('Hello from A!')
})
```

## An array of callback functions can handle a route. For example:

```javascript
app.get('/example/b', function(req, res, next) {
    console.log('the response will be sent by the next function ...')
    next()
}, function(req, res) {
    res.send('Hello from B!')
})
```

## An array of callback functions can handle a route. For example:

```javascript
var cb0 = function(req, res, next) {
    console.log('CB0')
    next()
}

var cb1 = function(req, res, next) {
    console.log('CB1')
    next()
}

var cb2 = function(req, res) {
    res.send('Hello from C!')
}

app.get('/example/c', [cb0, cb1, cb2])
```

## A combination of independent functions and arrays of functions can handle a route. For example:

```javascript
var cb0 = function(req, res, next) {
    console.log('CB0')
    next()
}

var cb1 = function(req, res, next) {
    console.log('CB1')
    next()
}

app.get('/example/d', [cb0, cb1], function(req, res, next) {
    console.log('the response will be sent by the next function ...')
    next()
}, function(req, res) {
    res.send('Hello from D!')
})
```

## Response methods

Method	                Description
res.download()	        Prompt a file to be downloaded.
res.end()	            End the response process.
res.json()	            Send a JSON response.
res.jsonp()	            Send a JSON response with JSONP support.
res.redirect()	        Redirect a request.
res.render()	        Render a view template.
res.send()	            Send a response of various types.
res.sendFile()	        Send a file as an octet stream.
res.sendStatus()	    Set the response status code and send its string representation as the response body.

# app.route()

You can create chainable route handlers for a route path by using app.route(). Because the path is specified at a single location, creating modular routes is helpful, as is reducing redundancy and typos. For more information about routes, see: Router() documentation.

```javascript
app.route('/book')
    .get(function(req, res) {
        res.send('Get a random book')
    })
    .post(function(req, res) {
        res.send('Add a book')
    })
    .put(function(req, res) {
        res.send('Update the book')
    })
```

# express. Router

Use the express. Router class to create modular, mountable route handlers. A Router instance is a complete middleware and routing system; for this reason, it is often referred to as a “mini-app”.

```javascript
var express = require('express')
var router = express.Router()

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now())
    next()
})
// define the home page route
router.get('/', function(req, res) {
    res.send('Birds home page')
})
// define the about route
router.get('/about', function(req, res) {
    res.send('About birds')
})

module.exports = router

//index.js
var birds = require('./birds')

// ...

app.use('/birds', birds)
```

# Middleware

## Overview 

Middleware functions are functions that have access to the request object (req), the response object (res), and the next function in the application’s request-response cycle. The next function is a function in the Express router which, when invoked, executes the middleware succeeding the current middleware.

Middleware functions can perform the following tasks:

Execute any code.
Make changes to the request and the response objects.
End the request-response cycle.
Call the next middleware in the stack.
If the current middleware function does not end the request-response cycle, it must call next() to pass control to the next middleware function. Otherwise, the request will be left hanging.

The following figure shows the elements of a middleware function call:

....

An Express application can use the following types of middleware:

1. Application-level middleware
2. Router-level middleware
3. Error-handling middleware
4. Built-in middleware
5. Third-party middleware

Every time the app receives a request, it prints the message “LOGGED” to the terminal.

### Application-level middleware

Bind application-level middleware to an instance of the app object by using the app.use() and app. METHOD() functions, where METHOD is the HTTP method of the request that the middleware function handles (such as GET, PUT, or POST) in lowercase.

This example shows a middleware function with no mount path. The function is executed every time the app receives a request.

```javascript
var express = requrie('express')
var app = express()

app.use(function(req, res, next) {
    console.log('Time: ', Date.now())
    next()
})
```

This example shows a middleware function mounted on the /user/:id path. The function is executed for any type of HTTP request on the /user/:id path.

```javascript
app.use('/user/:id', function(req, res, next) {
    console.log('Request Type: ', req.method)
    next()
})
```

This example shows a route and its handler function (middleware system). The function handles GET requests to the /user/:id path.

```javascript
qpp.get('/user/:id', function(req, res, next) {
    res.send('USER')
})
```

Here is an example of loading a series of middleware functions at a mount point, with a mount path. It illustrates a middleware sub-stack that prints request info for any type of HTTP request to the /user/:id path.

```javascript
app.use('/user/:id', function(req, res, next) {
    console.log('Request URL:', req.originalUrl)
    next()
}, function(req, res, next) {
    console.log('Request Type:', req.method)
    next()
})
```

Route handlers enable you to define multiple routes for a path. The example below defines two routes for GET requests to the /user/:id path. The second route will not cause any problems, but it will never get called because the first route ends the request-response cycle.

This example shows a middleware sub-stack that handles GET requests to the /user/:id path.

```javascript
app.get('/user/:id', function(req, res, next) {
    console.log('ID: ', req.params.id)
    next()
}, function(req, res, next) {
    res.send('User Info')
})

// handler for the /user/:id path, which prints the user ID
app.get('/user/:id', function(req, res, next) {
    res.send(req.params.id)
})
```

To skip the rest of the middleware functions from a router middleware stack, call next('route') to pass control to the next route. NOTE: next('route') will work only in middleware functions that were loaded by using the app. METHOD() or router. METHOD() functions.

This example shows a middleware sub-stack that handles GET requests to the /user/:id path.

```javascript
app.get('/user/:id', function(req, res, next) {
    // if the user ID is 0, skip to the next route
    if (req.params.id === '0') next('route')
    // otherwise pass the control to the next middleware function in this stack
    else next()
}, function(req, res, next) {
    // send a regular response
    res.send('regular')
})

// handler for the /user/:id path, which sends a special response
app.get('/user/:id', function(req, res, next) {
    res.send('special')
})
```

Middleware can also be declared in an array for reusability.

This example shows an array with a middleware sub-stack that handles GET requests to the /user/:id path

```javascript
function logOriginalUrl(req, res, next) {
    console.log('Request URL: ', req.originalUrl)
    next()
}

function logMethod(req, res, next) {
    console.log('Request Type: ', req.method)
    next()
}

var logStuff = [logOriginalUrl, logMethod]
app.get('/user/:id', logStuff, function(req, res, next) {
    res.send('User Info')
})
```

### Router-level middleware

Router-level middleware works in the same way as application-level middleware, except it is bound to an instance of express. Router().

```javascript
var router = express.Router()
```

Load router-level middleware by using the router.use() and router. METHOD() functions.

The following example code replicates the middleware system that is shown above for application-level middleware, by using router-level middleware:

```javascript
var express = require('express')
var app = express()
var router = express.Router()

// a middleware function with no mount path. This code is executed for every request to the router
router.use(function(req, res, next) {
    console.log('Time:', Date.now())
    next()
})

// a middleware sub-stack shows request info for any type of HTTP requst to the /user/:id path
router.use('/user/:id', function(req, res, next) {
    console.log('Request URL:', req.originalUrl)
    next()
}, function(req, res, next) {
    console.log('Request Type', req.method)
    next()
})

// a middleware sub-stack that handles GET requests to the /user/:id path
router.get('/user/:id', function(req, res, next) {
    // if the user ID is 0, skip to the next router
    if(req.params.id === '0') next('route')
    else next()
}, function(req, res, next) { 
    // render a reqular page
    res.render('regular')
})

// handler for the /user/:id path, which renders a special page
router.get('/user/:id', function(req, res, next) { 
    console.log('req.params.id')
    res.render('special')
})

// **mount the router on the app**
app.use('/', router)
```
To skip the rest of the router’s middleware functions, call next('router') to pass control back out of the router instance.

This example shows a middleware sub-stack that handles GET requests to the /user/:id path.

```javascript
var express = require('express');
var app = express()
var router = express.Router()

// predicate the router with a check and bail out when needed
router.use(function(req, res, next) { 
    if(!req.headers['x-auth']) return next('router')
})

router.get('/user/:id', function(req, res) { 
    res.send('hello, user!')
})

// use the router and 401 anything falling through
qpp.use('/admin', router, function(req, res) { 
    res.sendStatus(401)
})
```

### Error-handling middleware
```javascript
app.use(function(err, req, res, next) { 
    console.log(err.stack)
    res.status(500).send('Something broke!')
})
```

### Third-party middleware
```javascript
$npm install cookie-parser

var express = require('express')
var app = express()
var cookieParser = require('cookie-parser')

// load the cookie-parsing middleware
app.use(cookieParser())
```

## Middleware function myLogger

```javascript
var express = require('express')
var app = express()

var myLogger = function(req, res, next) {
    console.log('LOGGED')
    next()
}

app.use(myLogger)

app.get('/', function(req, res) {
    res.send('Hello World!')
})

app.listen(3000)
```

The order of middleware loading is important: middleware functions that are loaded first are also executed first.

## Middleware function requestTime

```javascript
var requestTime = function(req, res, next) {
    req.requestTime = Date.now()
    next()
}

var express = require('express')
var app = express()

var requestTime = function(req, res, next) {
    req.requestTime = Date.now()
    next()
}

app.use(requestTime)

app.get('/', function(req, res) {
    var responseText = 'Hello World!<br>'
    responseText += '<small>Requested at: ' + req.requestTime + '</small>'
    res.send(responseText)
})

app.listen(3000)
```

## Middleware function validateCookies

Finally, we’ll create a middleware function that validates incoming cookies and sends a 400 response if cookies are invalid.

Here’s an example function that validates cookies with an external async service.

```javascript
async function cookieValidator(cookies) {
    try {
        await externallyValidateCookies(cookies.testCookies)
    } catch {
        throw new Error('Invalid cookies')
    }
}

var express = require('express')
var cookieParser = require('cookie-parser')
var cookieValidator = require('./cookieValidator')

var app = express()

async function validateCookies(req, res, next) {
    await cookieValidator(req.cookies)
    next()
}

app.use(cookieParser())
app.use(validateCookies)

app.use(function(err, req, res, next) {
    res.status(400).send(err.message)
})

app.listen(3000)
```

## Configurable middleware

If you need your middleware to be configurable, export a function which accepts an options object or other parameters, which, then returns the middleware implementation based on the input parameters.

```javascript
module.exports = function(options) {
    return function(req, res, next) {
        // options...
        next()
    }
}

var mw = require('./my-middleware.js')
app.use(mw({
    option1: '1',
    options2: '2'
}))
```

# Overriding the Express API
The Express API consists of various methods and properties on the request and response objects. These are inherited by prototype. There are two extension points for the Express API:

The global protoypes at express.request and express.response.
App-specific prototypes at app.request and app.response.
Altering the global prototypes will affect all loaded Express apps in the same process. If desired, alterations can be made app-specific by only altering the app-specific prototypes after creating a new app.
# Methods
```javascript
app.response.sendStatus = function(statusCode, type, message) { 
    //  code is intentionally kept simple for demonstration purpose
    return this.contentType(type).status(statusCode).send(message);
}
```

The overridden method may now be used this way:

res.sendStatus(404, 'application/json', '{"error":"resource not found"}');

```javascript
res.sendStatus(404, 'application/json', '{"error": "resource not found"}')
```

# Properties
Express API中的属性为：



分配的属性（例如：req.baseUrl、req.originalUrl）

定义为getter（例如：req.secure、req.ip）

由于类别1下的属性是在当前请求-响应周期的上下文中动态分配给请求和响应对象的，因此它们的行为不能被重写。



可以使用Express API extensions API覆盖类别2下的属性。



下面的代码重写了req.ip将被导出。现在，它只返回客户端IP请求头的值。
```javascript
Object.defineProperty(app.request, 'ip', { 
    configurable: true,
    enumerable: true,
    get: function() { return this.get('Client-IP') }
})
```

# Using template engines with Express

# Error Handling
## Catching Errors
```javascript
app.get('/', function(req, res) { 
    throw new Error('BROKEN') // Express will catch this on its own
})
```

For errors returned from asynchronous functions invoked by route handlers and middleware, you must pass them to the next() function, where Express will catch and process them. For example:
```javascript
app.get('/', function(req, res, next) { 
    fs.readFile('/file-does-not-exist', function(err, data) { 
        if(err) { 
            next(err) // Pass errors to Express
        } else { 
            res.send(data)
        }
    })
})
```

如果getUserById抛出错误或拒绝，将使用抛出的错误或拒绝的值调用next。如果未提供拒绝值，则将使用Express router提供的默认错误对象调用next。



如果将任何内容传递给next（）函数（字符串“route”除外），Express会将当前请求视为错误，并将跳过所有剩余的非错误处理路由和中间件函数。



如果序列中的回调不提供数据，只提供错误，则可以按如下方式简化此代码：
```javascript
app.get('/', [
    function(req,res, next) { 
        fs.writeFile('/inaccessible-path', 'data', next)
    },
    function(req, res) P{
        res.send('OK')
    }
])
```

必须捕获路由处理程序或中间件调用的异步代码中发生的错误，并将其传递给Express进行处理。例如：

```javascript
app.get('/', function(req, res, next) { 
    setTimeout(function() { 
        try { 
            throw new Error('BROKEN')
        } catch (err) { 
            next(err)
        }
    }, 100)
})
```

由于承诺会自动捕获同步错误和被拒绝的承诺，因此您可以简单地提供next作为最终的捕获处理程序，而Express将捕获错误，因为捕获处理程序将错误作为第一个参数。



您还可以使用一系列处理程序来依赖同步错误捕获，方法是将异步代码简化为琐碎的代码。例如：

```javascript
app.get('/', [
    function(req, res, next) { 
        fs.readFile('/maybe-valid-file', 'utf-8', function(err, data) { 
            res.locals.data = data
            next(err)
        }),
        function(req, res) { 
            res.locals.data = res.locals.data.split(',')[1]
            res.send(res.locals.data)
        }
    }
])
```
上面的例子中有几个来自readFile调用的简单语句。如果readFile导致错误，那么它会将错误传递给Express，否则在链中的下一个处理程序中，您将快速返回到同步错误处理的世界。然后，上面的示例尝试处理数据。如果失败，那么同步错误处理程序将捕获它。如果您在readFile回调中完成了此处理，那么应用程序可能会退出，而Express错误处理程序将不会运行。



无论使用哪种方法，如果希望调用Express错误处理程序并使应用程序继续运行，则必须确保Express接收到错误。

## The default error handler
```javascript
function errorHandler(err, req, res, next) { 
    if(res.headerSent) { 
        return next(err)
    } 

    res.status(500)
    res.render('error', {error: err})
}
```

## Writing error handlers
Define error-handling middleware functions in the same way as other middleware functions, except error-handling functions have four arguments instead of three: (err, req, res, next). For example:

```javascript
app.use(function(err, req, res, next) { 
    console.error(err.stack)
    res.status(500).send('Something broke!')
})
```

You define error-handling middleware last, after other app.use() and routes calls; for example:
```javascript
var bodyParser = require('body-parser')
var methodOverride = require('method-override')

app.use(bodyParser.urlencoded({ 
    extended: true
}))

app.use(bodyParser.json())
app.use(methodOverride())
app.use(function(err, req, res, next) { 
    // logic
})
```
出于组织（和更高级别的框架）的目的，您可以定义几个错误处理中间件功能，就像您使用常规中间件功能一样。例如，要为使用XHR和不使用XHR的请求定义错误处理程序：

```javascript
var bodyParser = require('body-parser')
var methodOverride = require('method-override')

app.use(bodyParser.urlencoded({ 
    extended: true
}))
app.use(bodyParser.json())
app.use(methodOverride())
app.use(logErrors)
app.use(clientErrorHandler)
app.use(errorHandler)

function logErrors (err, req, res, next) {
  console.error(err.stack)
  next(err)
}
```

同样在本例中，clientErrorHandler的定义如下：；在这种情况下，错误会显式传递给下一个错误。

请注意，在错误处理函数中不调用“next”时，您负责编写（并结束）响应。否则，这些请求将被“挂起”，不符合垃圾收集的条件。

```javascript
function clientErrorHandler(err, req, res, next) { 
    if(req.xhr) { 
        res.status(500).send({error: 'Something failed!'})
    } else { 
        next(err);
    }
}
```
Implement the “catch-all” errorHandler function as follows (for example):
```javascript
function errorHandler(err, req, res, next) { 
    res.status(500)
    res.render('error', { error: err })
}
```

# Database integration
## Cassandra
Module: [cassandra-driver](https://github.com/datastax/nodejs-driver)
installation
 $ npm install cassandra-driver

```javascript
var cassandra = require('cassandra-driver')
var client = new cassandra.Client({ contactPoints: ['localhost'] })

client.execute('select key from system.local', function(err, result) { 
    if(err) throw err;
    console.log(result.rows[0]);
})
```

## Couchbase
Module: [couchnode](https://github.com/couchbase/couchnode)
installation
 $ npm install couchbase
```javascript
var couchbase = require('couchbase')
var bucket = (new couchbase.Cluster('http://localhost:8091')).openBucket('bucketName')

// add a document to a bucket
bucket.insert('document-key', { name: 'Matt', shoeSize: 13 }, function(err, result) { 
    if(err) { 
        console.log(err)
    } else { 
        console.log(result)
    }
})

// get all documents with shoe size 13
var n1ql = 'SELECT d.* FROM `bucketName` d WHERE shoeSize = $1'
var query = N1qlQuery.fromString(n1ql)
bucket.query(query, [13], function(err, result) { 
    if(err) { 
        console.log(err)
    } else { 
        console.log(result)
    }
})
```

## CouchDB
Module: [nano](https://github.com/apache/nano)
installation
 $ npm install nano
```javascript
var nano = require('nano')('http://localhost:5984')
nano.db.create('books')
var books = nano.db.use('books')

//Insert a book document in the books database
books.insert({ name: 'The Art of war' }, null, function(err, body) { 
    if(err) { 
        console.log(err)
    } else { 
        console.log(body)
    }
})

// Get a list of all books
books.list(function(err, body) { 
    if(err) { 
        console.log(err)
    } else { 
        console.log(body.rows)
    }
})

```

## LevelDB
Module: [levelup](https://github.com/Level/levelup)
installation
 $ npm install level levelup leveldown
```javascript
var levelup = require('levelup')
var db = levelup('./mydb')

db.put('name', 'LevelUP', function(err) { 
    if(err) return console.log('Ooops!', err)

    db.get('name', function(err, value) { 
        if(err) return console.log('Ooops!', err)

        console.log('name=' + value)
    })
})
```

## MySOL
Module:[mysql](https://github.com/mysqljs/mysql)
installation
 $ npm install mysql
```javascript
var mysql = require('mysql')
var connection = mysql.createConnection({ 
    host: 'localhost',
    user: 'dbuser',
    password: 's3kreee7',
    database: 'my_db'
})

connection.connect()

connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) { 
    if(err) throw err

    console.log('The solution is: ', rows[0].solution)
})

connection.end()
```

## MongoDB
Module: [mongodb](https://github.com/mongodb/node-mongodb-native)
installation
 $ npm install mongodb

1. (v2.*)
```javascript
var MongoClient = require('mongodb').MongoClient()

MongoClient.connect('mongodb://localhost:27017/animals', function(err, db) { 
    if(err) throw err
    db.collection('mammals').find().toArray(function(err, result) { 
        if(err) throw err
        console.log(result)
    })
})
```

2. (v3.*)
```javascript
var MongoClient = require('mongodb').MongoClient

MongoClient.connect('mongodb://localhost:27017/animals', function(err, client) { 
    if(err) throw err

    var db = client.db('animals')

    db.collection('mammals').find().toArray(function(err, result) { 
        if(err) throw err
        console.log(result)
    })
})
```
**If you want an object model driver for MongoDB, look at [Mongoose](https://github.com/LearnBoost/mongoose).**

## Neo4j
Module: [neo4j-driver](https://github.com/neo4j/neo4j-javascript-driver)
installation
 $ npm install neo4j-driver
```javascript
var neo4j = require('neo4j-driver')
var driver = neo4j.driver('neo4j://localhost:7687', neo4j.auth.basic('neo4j', 'letmein'))

var session = driver.session()
session.readTransaction(function(tx) { 
    return tx.run('MATCH (n) RETURN count(n) AS count')
        .then(function(res) { 
            console.log(res.records[0].get('count'))
        })
        .catch(function(error) { 
            console.log(error)
        })
})
```

## Oracle
Module: [oracledb](https://github.com/oracle/node-oracledb)
installation
**NOTE: [See installation prerequisites](https://github.com/oracle/node-oracledb#-installation)**
 $ npm install oracledb
```javascript
const oracledb = require('oracledb')
const config = { 
    user: '<your db user>',
    password: '<your db password>',
    connectString: 'localhost:1521/orcl'
}

async function getEmployee (empId) { 
    let conn

    try { 
        conn = await oracledb.getConnection(config)

        const result = await conn.execute(
            'select * from employees where employee_id = :id',
            [empId]
        )

        console.log(result.rows[0])
    } catch (err) { 
        console.log('Ouch!', err)
    } finally { 
        if(conn) { // conn assignment worked, need to close 
            await conn.close()
        }
    }
}

getEmployee(101)
```

## PostgreSOL
Module: [pg-promise](https://github.com/vitaly-t/pg-promise)
installation
 $ npm install pg-promise
```javascript
var pgp = require('pg-promise')(/* options */)
var db = pgp('postgres://username:password@host:port/database')

db.one('SELECT $1 AS value', 123)
  .then(function(data) { 
      console.log('DATA:', data.value)
  })
  .catch(function(error) { 
      console.log('ERROR:', error)
  })
``` 

## Redis
Module: [redis](https://github.com/redis/node-redis)
installation
 $ npm install redis

```javascript
var redis = require('redis')
var client = redis.createClient()

client.on('error', function(err) { 
    console.log('Error ' + err)
})

client.set('string key', 'string val', redis.print)
client.hset('hash key', 'hashtest 1', 'some value', redis.print)
client.hset(['hash key', 'hashtest 2', 'some other value'], redis.print)

client.hkeys('hash key', function(err, replies) { 
    console.log(replies.length + ' replies:')
    replies.forEach(function(reply, i) { 
        console.log('   ' + i + ': ' + reply)
    })

    client.quit()
})
```

## SQL Server
Module: [tedious](https://github.com/tediousjs/tedious)
installation
 $ npm install tedious

```javascript
var Connection = require('tedious').Connection
var Request = require('tedious').Request

var config = { 
    server: 'localhost',
    authentication: { 
        type: 'default',
        options: { 
            userName: 'your_username',
            password: 'your_password'
        }
    }
}

var connection = new Connection(config)

connection.on('connect', function(err) { 
    if(err) { 
        console.log(err)
    } else { 
        executeStatement()
    }
})

function executeStatement() { 
    const request = new Request("select 123, 'hello sqlServer!'", function(err, rowCount) { 
        if(err) { 
            console.log(err)
        } else { 
            console.log(rowCount + 'rows')
        }

        connection.close()
    })

    request.on('row', function(columns) { 
        columns.forEach(function(column) { 
            if(column.value === null) { 
                console.log('NULL')
            } else { 
                console.log(column.value)
            }
        })
    })

    connection.execSql(request)
}
```

## SQLite
Module: [sqlite3](https://github.com/TryGhost/node-sqlite3)
installation
 $ npm install sqlite3
```javascript
var sqlite3 = require('sqlite3').verbose()
var db = new sqlite3.Database(':memory:')

db.serialize(function() { 
    db.run('CREATE TABLE lorem (info TEXT)')
    var stmt = db.prepare('INSERT INTO lorem VALUES (?)')

    for(var i = 0; i < 10; i++) { 
        stmt.run('Ipsum ' + i)
    }

    stmt.finalize()

    db.each('SELECT rowid AS id, info FROM lorem', function(err, row) { 
        console.log(row.id + ': ' + row.info)
    })
})

db.close()
```

## Elasticsearch
Module: [elasticsearch](https://github.com/elastic/elasticsearch-js)
installation
 $ npm install elasticsearch
```javascript
var elasticsearch = require('elasticsearch')
var client = elasticsearch.Client({ 
    host: 'localhost:9200'
})

client.search({ 
    index: 'books',
    type: 'book',
    body: { 
        query: { 
            multi_match: { 
                query: 'express.js',
                field: ['title', 'description']
            }
        }
    }
}).then(function(response) { 
    var hits = response.hits.hits
}, function(error) { 
    console.log(error.message)
})
```


