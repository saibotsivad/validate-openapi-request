# validate-openapi-request

Given a complete OpenAPI definition object, this module will validate
your provided request object and return a list of errors, or an empty
list if the request object fully conforms.

Limits:

* Only supports OpenAPI version 3
* Only supports JSON body validation

## general use

```js
const validate = require('validate-openapi-request')
const definition = require('./openapi.json')

const errors = validate({ definition, request })
// errors will always be defined, length=0 if no errors
;
```

## error objects: `{ code: String, title: String, message: String, source: Object }`

### `code: String`

A programmatically usable error code, e.g. `INVALID_DATA_TYPE`.

***TODO: add full list of error codes somewhere***

### `title: String`

A human readable error title, usually the same for each error code but can be
changed or localized.

### `message: String`

A human readable error message with more context, possibly different for each
error. Usable for default user-facing error messages.

### `source: Object{ request: String, definition: String }`

An object which points to the error in the request, and the relevant section
in the OpenAPI document.

#### `request: String`

The [JSON Pointer](https://tools.ietf.org/html/rfc6901) to the property in the
request object containing the error, e.g. `/requestBody/name`.

#### `definition: String`

The [JSON Pointer](https://tools.ietf.org/html/rfc6901) to the property in the
OpenAPI definition which was used to find the error, e.g. `/components/schemas/user/properties/name`.

## api: `validate({ definition: Object, request: Object, options: Object }): Array`

The `validate` function will always return an array. If there are
any validation errors, they'll be in that array as an error object.

### `definition: Object`

This is any valid, fully resolved, OpenAPI document, version 3+.

For example:

```json
{
	"openapi": "3.0.1",
	"components": {
		"schemas": {
			// etc.
		}
	},
	"paths": {
		// etc.
	}
}
```

### `request: Object`

This is an object containing the following properties:

* `headers`
* `method` *(required)*
* `path` *(required)*
* `pathParameters`
* `query`
* `requestBody`

#### `headers: Object`

A map of header keys to header values. The presence of required header
values is case-insensitive.

#### `method: String`

The method name to match the OpenAPI method name (case sensitive), e.g. `get`.

#### `path: String`

The path string to match the OpenApi path string, e.g. `/users/{userId}`.

#### `pathParameters: Object`

The parameters already parsed from the path.

For example, if the OpenAPI path definition is `/user/{userId}` and that path
parameter is defined as a `type: 'integer'`, for a request like `/user/123`
this property would be:

```js
{
	userId: 123
}
;
```

#### `query: Object`

Query parameter styles are an opinionated thing. The implementation here
assumes that your query object is pre-parsed to whatever shape and detail
that your OpenAPI definition requires.

Although the validation method should be agnostic (please file an issue if
you find otherwise) a common approach is described here.

Two example HTTP request URLs look like:

```
GET https://site.com/users?filter[created]=2018
GET https://site.com/users?filter[created][$gt]=2017&filter[created][$lt]=2019
```

In order to make the SwaggerUI allow you to input parameters correctly, you
will need to define each square-bracket depth as a query name. For the above
example, that would look like:

```json
{
	"parameters": [{
		"name": "filter[created]",
		"in": "query",
		"type": "string",
		"description": "An ISO-8601 date fragment, limiting the date range."
	},{
		"name": "filter[created][$gt]",
		"in": "query",
		"type": "string",
		"description": "An ISO-8601 date fragment, limiting the earliest date."
	},{
		"name": "filter[created][$lt]",
		"in": "query",
		"type": "string",
		"description": "An ISO-8601 date fragment, limiting the latest date."
	}]
}
```

If a request has a query parameter not defined in the OpenAPI definition
object, the request will be considered invalid and return an error.

You can change this behaviour by setting `allowUndefinedQueryParameters`
to `true`, which will not consider undefined query parameters to be an error.

#### `requestBody: *`

The actual body of the request, post-processing.

Specifically, if the content-type is JSON, this property should be the parsed
JavaScript object. If the content-type is not JSON, this property is passed
to any custom validation function as-is.

### `options: Object`

The `options` object is not required.

#### `allowUndefinedQueryParameters: Boolean` (default `false`)

If this property is truthy, query parameters that are not defined in
the OpenAPI definition will not be considered an error.

## full example

Consider an OpenAPI definition like this, which defines:

* path parameter
* query parameter
* header parameter
* body schema

```json
{
	"openapi": "3.0.1",
	"components": {
		"schemas": {
			"user": {
				"type": "object",
				"properties": {
					"name": {
						"type": "string",
						"required": true
					}
				}
			}
		}
	},
	"paths": {
		"/users/{userId}": {
			"parameters": [{
				"name": "userId",
				"in": "path",
				"required": true,
				"type": "string"
			}],
			"put": {
				"parameters": [{
					"name": "action[id]",
					"in": "query",
					"required": true,
					"type": "string",
					"enum": [
						"baz"
					]
				},{
					"name": "my-api-key",
					"in": "header",
					"required": true
				}],
				"requestBody": {
					"content": {
						"application/json": {
							"schema": {
								"$ref": "#/components/schemas/user"
							}
						}
					}
				}
			}
		}
	}
}
```

A fully valid request object would look like this:

```json
{
	"headers": {
		"my-api-key": "supersecretkey"
	},
	"method": "put",
	"path": "/users/{userId}",
	"pathParameters": {
		"userId": "abc123"
	},
	"query": {
		"action[id]": "def456"
	},
	"requestBody": {
		"name": "Bilbo Baggins"
	}
}
```

## license

Published and released under the [Very Open License](http://veryopenlicense.com).

If you need a commercial license, [contact me here](https://davistobias.com/license?software=validate-openapi-request).
