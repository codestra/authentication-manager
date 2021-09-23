# @codestra/authentication-manager


## Functions

<dl>
<dt><a href="#genRandomString">genRandomString(length)</a></dt>
<dd><p>generates random string of characters i.e salt</p></dd>
<dt><a href="#createHash">createHash(password, salt)</a></dt>
<dd><p>hash password with sha512.</p></dd>
<dt><a href="#modelActivate">modelActivate(parameters)</a> ⇒ <code>Promise.&lt;string&gt;</code></dt>
<dd><p>Activates the model with the activationToken and returns the jwt.</p></dd>
<dt><a href="#modelRequestResetPassword">modelRequestResetPassword(parameters)</a> ⇒ <code>Promise.&lt;string&gt;</code></dt>
<dd><p>Will update the reset token and send an email. If the user was found, will return passwordResetToken</p></dd>
<dt><a href="#modelRequestUpdatePassword">modelRequestUpdatePassword(parameters)</a> ⇒ <code>Promise.&lt;string&gt;</code></dt>
<dd><p>Will update the reset token and send an email. If the user was found, will return the mail</p></dd>
<dt><a href="#modelResendActivation">modelResendActivation(parameters)</a> ⇒ <code>Promise.&lt;string&gt;</code></dt>
<dd><p>Request the activation token.</p></dd>
<dt><a href="#modelSignIn">modelSignIn(parameters)</a> ⇒ <code>Promise.&lt;string&gt;</code></dt>
<dd><p>Signs in the model and sends back the jwt if the account is activated.
Will also make the email lowercase before trying to find the document.</p></dd>
<dt><a href="#modelSignUp">modelSignUp(parameters)</a> ⇒ <code>Promise.&lt;{activationToken: string, _id: string}&gt;</code></dt>
<dd><p>Creates a new document based on the supplied model the email, password and other fields.
Will return the new _id and the activationtoken</p></dd>
<dt><a href="#modelVerify">modelVerify(parameters)</a> ⇒ <code>JwtPayload</code> | <code>null</code></dt>
<dd><p>Verifies the token</p></dd>
</dl>

<a name="genRandomString"></a>

## genRandomString(length)
<p>generates random string of characters i.e salt</p>


| Param | Type | Description |
| --- | --- | --- |
| length | <code>number</code> | <p>Length of the random string.</p> |

<a name="createHash"></a>

## createHash(password, salt)
<p>hash password with sha512.</p>


| Param | Type | Description |
| --- | --- | --- |
| password | <code>string</code> | <p>List of required fields.</p> |
| salt | <code>string</code> | <p>Data to be validated.</p> |

<a name="createHash..hash"></a>

### createHash~hash
<p>Gives us salt of length 16</p>

<a name="modelActivate"></a>

## modelActivate(parameters) ⇒ <code>Promise.&lt;string&gt;</code>
<p>Activates the model with the activationToken and returns the jwt.</p>

**Returns**: <code>Promise.&lt;string&gt;</code> - <p>the jwt for the authentication</p>  

| Param | Type | Description |
| --- | --- | --- |
| parameters | <code>Object</code> | <p>function parameters</p> |
| parameters.Model | <code>mongoose.Model</code> | <p>mongodb model</p> |
| parameters.variables.activationToken | <code>string</code> | <p>the activation token for which model we want to activate the account</p> |
| parameters.onCompleted | <code>function</code> | <p>callback on completed. Returns the token.</p> |

<a name="modelRequestResetPassword"></a>

## modelRequestResetPassword(parameters) ⇒ <code>Promise.&lt;string&gt;</code>
<p>Will update the reset token and send an email. If the user was found, will return passwordResetToken</p>

**Returns**: <code>Promise.&lt;string&gt;</code> - <p>returns the reset token</p>  

| Param | Type | Description |
| --- | --- | --- |
| parameters | <code>Object</code> | <p>function parameters</p> |
| parameters.Model | <code>mongoose.Model</code> | <p>mongodb model</p> |
| parameters.variables.email | <code>string</code> | <p>the email for which we want to reset the password</p> |
| parameters.onCompleted | <code>function</code> | <p>callback on completed. Returns the passwordResetToken</p> |

<a name="modelRequestUpdatePassword"></a>

## modelRequestUpdatePassword(parameters) ⇒ <code>Promise.&lt;string&gt;</code>
<p>Will update the reset token and send an email. If the user was found, will return the mail</p>

**Returns**: <code>Promise.&lt;string&gt;</code> - <p>the found email for which we want to resend the activation</p>  

| Param | Type | Description |
| --- | --- | --- |
| parameters | <code>Object</code> | <p>function parameters</p> |
| parameters.Model | <code>mongoose.Model</code> | <p>mongodb model</p> |
| parameters.variables.email | <code>string</code> | <p>the email for which we want to resend the activation</p> |
| parameters.variables.password | <code>string</code> | <p>the new password</p> |
| parameters.variables.passwordResetToken | <code>string</code> | <p>the passwordResetToken</p> |
| parameters.onCompleted | <code>function</code> | <p>callback on completed. Returns the e-mail.</p> |

<a name="modelResendActivation"></a>

## modelResendActivation(parameters) ⇒ <code>Promise.&lt;string&gt;</code>
<p>Request the activation token.</p>

**Returns**: <code>Promise.&lt;string&gt;</code> - <p>the found email for which we want to resend the activation</p>  

| Param | Type | Description |
| --- | --- | --- |
| parameters | <code>Object</code> | <p>function parameters</p> |
| parameters.Model | <code>mongoose.Model</code> | <p>mongodb model</p> |
| parameters.variables.email | <code>string</code> | <p>the email for which we want to resend the activation</p> |
| parameters.onCompleted | <code>function</code> | <p>callback on completed. Returns the activationToken.</p> |

<a name="modelSignIn"></a>

## modelSignIn(parameters) ⇒ <code>Promise.&lt;string&gt;</code>
<p>Signs in the model and sends back the jwt if the account is activated.
Will also make the email lowercase before trying to find the document.</p>

**Returns**: <code>Promise.&lt;string&gt;</code> - <p>the jwt for the authentication</p>  

| Param | Type | Description |
| --- | --- | --- |
| parameters | <code>Object</code> | <p>function parameters</p> |
| parameters.Model | <code>mongoose.Model</code> | <p>mongodb model</p> |
| parameters.variables.email | <code>string</code> | <p>the email</p> |
| parameters.variables.password | <code>string</code> | <p>the password</p> |
| parameters.onCompleted | <code>function</code> | <p>callback on completed. Returns the jwt</p> |

<a name="modelSignUp"></a>

## modelSignUp(parameters) ⇒ <code>Promise.&lt;{activationToken: string, \_id: string}&gt;</code>
<p>Creates a new document based on the supplied model the email, password and other fields.
Will return the new _id and the activationtoken</p>

**Returns**: <code>Promise.&lt;{activationToken: string, \_id: string}&gt;</code> - <p>the activationtoken and _id  as a string</p>  

| Param | Type | Description |
| --- | --- | --- |
| parameters | <code>Object</code> | <p>function parameters</p> |
| parameters.Model | <code>mongoose.Model</code> | <p>mongodb model</p> |
| parameters.variables.email | <code>string</code> | <p>the email which will be used for registration made lowercase</p> |
| parameters.variables.password | <code>string</code> | <p>the password</p> |
| parameters.onCompleted | <code>function</code> | <p>callback on completed. Returns the _id</p> |

<a name="modelVerify"></a>

## modelVerify(parameters) ⇒ <code>JwtPayload</code> \| <code>null</code>
<p>Verifies the token</p>

**Returns**: <code>JwtPayload</code> \| <code>null</code> - <p>the jwt for the authentication. If verified correctly, returns {id} so for mongoose, you need to make it _id</p>  

| Param | Type | Description |
| --- | --- | --- |
| parameters | <code>Object</code> | <p>function parameters</p> |
| parameters.token | <code>string</code> | <p>mongodb model</p> |

