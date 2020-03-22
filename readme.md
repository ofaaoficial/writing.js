# ⌨ Writing Animation JS
![Animation example Writing.js](https://media.giphy.com/media/L3RWwKBVdHxSR7krOH/giphy.gif)
## 🛠 Instalation
Below are some of the most common ways to include `writing.js`.

### Browser
#### Script tag
```html 
<script src="https://unpkg.com/writing.js"></script>
```

### Node
To include writing.js in Node, first install with npm.
```
$ npm i writing.js
```

### Babel / ES6
`Babel` is a next generation JavaScript compiler. 
One of the features is the ability to use ES6/ES2015 modules now, even though browsers do not yet support this feature natively.
```javascript 
import {animationWriting} from 'writing.js';
```

### Browserify / Webpack / ES5
There are several ways to use Browserify and Webpack. For more information on using these tools, please refer to the corresponding project's documention. In the script, including writing.js will usually look like this...
```javascript 
const animationWriting = require('writing.js');
```

## 🤔 How to usage?
To use `writing.js` in your website.
### Option 1
 * Create an HTML element to which the animation will be executed and add the attribute `wj-words` with the words separated with the comma character `,` which will be animated.
 * Now simply add the `javascript` in the `<body>` element of your document.
 * Finally run the `animationWriting(selector)` function, sending a `string` with the `selector` of the element to which you want to run the animation.

[Codepen: example option 1](https://codepen.io/ofaaoficial/pen/abOjvGK)
 
### Option 2
  * Create an HTML element to which the animation will be executed.
  * Now simply add the `javascript` in the `<body>` element of your document.
  * finally call the function `animationWriting(selector, words[])`, sending a `string` with the `selector` of the element to which you want to run the animation and as a `second parameter` send an `array` with the content to animate.
  * It is possible to send a `third parameter` with an object to modify the animation times.
```html
<script>
    animationWriting('#example', [
      'mundo',
      'wêreld',
        ...          
    ], {
        times: {
           writer: 150, // (ms)
           eraser: 150, // (ms)
           read: 1000 // (ms)
        }
    });
</script>
```

[Codepen: example option 2](https://codepen.io/ofaaoficial/pen/eYNLexR)
   
 That is all!

## 😋 Example
Now some examples, you can see some examples of the implementation and use of the library in the `/examples`.

* Create an HTML element to which the animation will be executed and add the attribute `wj-words`.
```html
<html>
    <head> ... </head>
    <body>
        ...

        <!--
            EN: Element to which the animation with the attribute `wj-words` will be executed.
            ES: Elemento al cual se le va a ejecutar la animación con el atributo `wj-words`.
         -->
        <h2>Hello <span id="example" wj-words="mundo, wêreld, свят, svět, 世界, עולם, विश्व, جهان, Мир">world</span>!</h2>
        
        ...    
    </body>
</html>
```

* Add the javascript in the body.
```html
<html>
    <head> ... </head>
    <body>
        ...
       
        <h2>Hello <span id="example" wj-words="mundo, wêreld, свят, svět, 世界, עולם, विश्व, جهان, Мир">world</span>!</h2>
                        
        <!--
            EN: Add library in the `body` of the document.
            ES: Agregar librería en el `body` del documento.
         -->         
        <script src="https://unpkg.com/writing.js"></script>
            
        ...    
    </body>
</html>
```

* Run the `animationWriting(selector)` function.
```html
<html>
    <head> ... </head>
    <body>
        ...      
        <h2>Hello <span id="example" wj-words="mundo, wêreld, свят, svět, 世界, עולם, विश्व, جهان, Мир">world</span>!</h2>                
                   
        <script src="https://unpkg.com/writing.js"></script>
        <script>
            /**
             * @description
             *  EN: This is the only line that we need to make it work it would release it,
             *      we call the function and send as parameter a string with the selector of
             *      the element to which the animation will be executed.
             *  ES: Esta es la única línea que necesitamos para hacer funcionar la liberaría,
             *      llamamos la función y enviamos como parámetro un string con el selector
             *      del elemento al cual se le va a ejecutar la animación.
             */
            animationWriting('#example');
        </script>    
    </body>
</html>
```

`Now just enjoy the magic. 🤓` 

## License 🔥
Copyright © 2020-present [Oscar Amado](https://github.com/ofaaoficial) 🧔
