# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).
****
## Initial Setup

Install all dependencies:
```shell
npm install
```
##### ***If you have issues installing `bcryptjs`, refer to [npm Install Issues](#npm-Install-Issues)***
<br>
Run the development web server:

```shell
node express_server.js
```
Open web browser and enter the default URL:
```browser
http://localhost:8080/
```
When finished, shut the server down with `control + c`.
****
## Final Product

!["TinyApp Register Page"](https://github.com/Nolan-E/tinyapp/blob/master/docs/TinyApp_Register.png?raw=true)
!["TinyApp Login Page"](https://github.com/Nolan-E/tinyapp/blob/master/docs/TinyApp_Login.png?raw=true)
!["TinyApp URL Index Page"](https://github.com/Nolan-E/tinyapp/blob/master/docs/TinyApp_URLs.png?raw=true)
!["TinyApp URL Edit Page"](https://github.com/Nolan-E/tinyapp/blob/master/docs/TinyApp_URLedit.png?raw=true)
!["TinyApp New URL Page"](https://github.com/Nolan-E/tinyapp/blob/master/docs/TinyApp_URLnew.png?raw=true)

## Additional Features
Added the following additional routes:
- Catch-all `GET` route: Redirect non-useful requests:
  ```javascript
  app.get('*', (req, res) => {
    res.redirect('/login');
  });
  ```
- Catch-all `POST` route: Status code & redirect non-useful requests:
  ```javascript
  app.post('*', (req, res) => {
    res.status(400).redirect('/login');
  });
  ```
- Unit testing done for all helper functions. Test suite can be found in the [test](/test) directory.
****
## Dependencies

- Node.js
- Express
- EJS
- bcryptjs
- body-parser
- cookie-session
****
## npm Install Issues
This TinyApp uses the `bcryptjs` package for encryption by default. If you have issues installing, try `bcrypt`  package, locked to 2.0.0 by using the following install method:
```shell
npm install -E bcrypt@2.0.0
```
After installing `bcrypt`, open up the **[`express_server.js`](express_server.js)** file and replace `bcryptjs` with `bcrypt`, as shown below:
```javascript
// before: using bcryptjs
const bcrypt = require('bcryptjs');
// after: using bcrypt
const bcrypt = require('bcrypt');
```
****
## Known Issues
- Collapsible navbar button for smaller devices does not work properly. Will be fixed in later commit. Please use full browser size for the time being.
****
## Future Updates
- Implement error message on the browser HTML while redirecting to /login when no user is logged in and the /urls page is requested.
- Error status code pages (400, 403, 404, etc.) render in EJS templates instead of basic html error page.
- Add Analytics & Method Override "stretch" features.
****
## References & Acknowledgements
This project was developed by [Nolan-E](https://github.com/Nolan-E) in tandem with [Just-Hosam](https://github.com/Just-Hosam) as an ever valuable second set of eyes for debugging and a sounding board for reasoning through problems.