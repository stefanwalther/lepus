## Classes

<dl>
<dt><a href="#Lepus">Lepus</a></dt>
<dd></dd>
</dl>

## Members

<dl>
<dt><a href="#Topology">Topology</a></dt>
<dd><p>Topologies.</p>
</dd>
<dt><a href="#ValidatorTopology">ValidatorTopology</a></dt>
<dd><p>Validator for topology files.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#value">value()</a> ⇒ <code>Promise</code></dt>
<dd><p>Connect to RabbitMQ.</p>
<p>Very similar to amqp.connect, but with the big difference, that if the connection
fails, the operation will retry as defined in opts.retry_behavior.</p>
<p>Furthermore, in case there is already an existing connection available, this will be returned.
No new connection will be established.</p>
</dd>
<dt><a href="#value">value()</a></dt>
<dd><p>Validate the topology file:</p>
<ul>
<li>The file has to exist</li>
<li>The file has to be either a .yml or a .json file</li>
</ul>
<p>This method does not validate the content of the file.</p>
</dd>
<dt><a href="#value">value(connectionDef)</a></dt>
<dd><p>ConnectionDef can be either a string or based on the schema.</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#rabbitConnectionDef">rabbitConnectionDef</a> : <code>string</code></dt>
<dd><p>RabbitMQ Server definition.</p>
<p>Note: passing the Connection definition as an object is not supported, yet.</p>
</dd>
<dt><a href="#options">options</a> : <code>object</code></dt>
<dd><p>Options</p>
</dd>
<dt><a href="#retry_behavior">retry_behavior</a> : <code>object</code></dt>
<dd><p>Retry behavior in case RabbitMQ is not available.</p>
</dd>
</dl>

<a name="Lepus"></a>

## Lepus
**Kind**: global class  
<a name="Topology"></a>

## Topology
Topologies.

**Kind**: global variable  
<a name="ValidatorTopology"></a>

## ValidatorTopology
Validator for topology files.

**Kind**: global variable  
<a name="value"></a>

## value() ⇒ <code>Promise</code>
Connect to RabbitMQ.

Very similar to amqp.connect, but with the big difference, that if the connection
fails, the operation will retry as defined in opts.retry_behavior.

Furthermore, in case there is already an existing connection available, this will be returned.
No new connection will be established.

**Kind**: global function  
**Returns**: <code>Promise</code> - - Returns the promise as defined for amqplib.connect  

| Param | Type | Description |
| --- | --- | --- |
| connOpts.server | [<code>rabbitConnectionDef</code>](#rabbitConnectionDef) | Connection information for the server. |
| connOpts.retry_behavior | [<code>retry_behavior</code>](#retry_behavior) | Retry behavior for establishing the connection. |

<a name="value"></a>

## value()
Validate the topology file:
- The file has to exist
- The file has to be either a .yml or a .json file

This method does not validate the content of the file.

**Kind**: global function  
<a name="value"></a>

## value(connectionDef)
ConnectionDef can be either a string or based on the schema.

**Kind**: global function  

| Param |
| --- |
| connectionDef | 

<a name="rabbitConnectionDef"></a>

## rabbitConnectionDef : <code>string</code>
RabbitMQ Server definition.

Note: passing the Connection definition as an object is not supported, yet.

**Kind**: global typedef  
<a name="options"></a>

## options : <code>object</code>
Options

**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| retry_behavior | [<code>retry_behavior</code>](#retry_behavior) | Behavior how to retry connecting to the server in case of failure. |

<a name="retry_behavior"></a>

## retry_behavior : <code>object</code>
Retry behavior in case RabbitMQ is not available.

**Kind**: global typedef  
**Read only**: true  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| retries | <code>number</code> | The maximum amount of times to retry the operation. Defaults to 10. |
| enabled | <code>boolean</code> | Whether retry is enabled at all or not (defaults to true); setting to false is equal to keeping [retry_behavior](#retry_behavior) empty. |
| interval | <code>number</code> | Interval in ms. |
| times | <code>number</code> | Amount of times the given operation should be retried. |
| attempts | <code>number</code> | Readonly, current amount of attempts. |

