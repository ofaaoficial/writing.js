"use strict";

/**
 * AnimationWriting JavaScript Library v.1.1.2
 * https://github.com/ofaaoficial/animation-writing.js
 *
 * Copyright Oscar Amado
 * @ofaaoficial
 * Released under the MIT license
 * Date: 23/05/2020
 */

/**
 * @description
 *  EN: Getting an element or NodeList by selector.
 *  ES: Obtención de un elemento o lista de elementos por su selector.
 * @param selector: String
 * @return {nodeElement}
 */
const getElement = selector => document.querySelector(selector);

/**
 * @description
 *  EN: Function responsible for throw an Error object with a message and correction example.
 *  ES: Función encargada de lanzar un objeto de Error con un mensaje y ejemplo de correción.
 * @param message: String
 * @param example: String
 * @type {Error}
 */
const errorMessage = (message, example = '') => {
    throw new Error(`\n\n  ${message} \n ${example} \n\n`)
};

/**
 * @description
 *  EN: Global variable with the times in ms (microseconds) of the animations..
 *  ES: Variable global con los tiempos en ms (microsegundos) de las animaciones.
 */
let GLOBAL_OPTIONS = {
    times: {
        writer: 150,
        eraser: 150,
        read: 1000
    },
    infinite: false
};

/**
 * @description
 *  EN: Function to run the main animation of the Writing.js library.
 *  ES: Función para ejecutar la animación principal de la libreria Writing.js.
 * @param selector: String
 * @param arrayContent: Array
 * @param options: Object
 */
const animationWriting = async (selector, arrayContent = [], options = null) => {
    if (options && !options.times && !options.styles) {
        errorMessage('You can specify the times of the animation with a `times` attribute or styles CSS to element with attribute `styles` send an array with styles.',
            `
            {
             => times: { <=
                    writer: 150,
                    eraser: 150,
                    read: 1000
                },
                styles: ["color: white", "background: black"] <=
            `);
        GLOBAL_OPTIONS = {...options};
    }

    /**
     * @description
     *  EN: Variable with the HTML principal to which the animation will be performed.
     *  ES: Variable con el elemento principal al cual se le va a realizar la animación.
     * @type {nodeElement}
     */
    let elementHTML = getElement(selector);


    /**
     * @description
     *  EN: Array with the content to which the animation will be performed.
     *  ES: Arreglo con el contenido al cual se le va a realizar la animacion.
     * @type {nodeElement[]}
     */
    let words = [];

    /**
     * @description
     * EN: Variable that will contain the first content or word of the main element to end the animation
     *     with that word.
     * ES: Variable que contendrá el primer contenido o palabra del elemento principal para finalizar
     *     la animación con esa palabra.
     * @type {string}
     */
    let firstContent = '';

    if (options && options.styles) {
        setStyles(selector, options.styles)
    }

    words = arrayContent && arrayContent.length > 0 ? arrayContent : getWords(elementHTML);

    /**
     * @description
     * EN: Validation that the HTML element is not empty on the contrary throws an error.
     * ES: Validación de que el elemento HTML no este vacío por el contrario lanza un error.
     */
    if (!elementHTML) {
        errorMessage('You must define the selector for the existing HTML element.', '<p => id="example" <= wj-words="Here, is, the, problem..."><p>');
    }

    /**
     * @description
     * EN: The content of the HTML element is verified; if there is content save data, run the delete word animation to empty the content.
     * ES: Se verifica el contenido del elemento HTML; si hay contenido lo almacena, ejecuta la animación para vaciar el contenido.
     */
    if (elementHTML.innerHTML) {
        firstContent = elementHTML.innerHTML;
        await eraser(elementHTML);
    }

    /**
     * @description
     * EN: For each all the words in the `words (array)`  are traversed to make the animation of writing and erased each one
     *     using promises to wait for the execution.
     * ES: Recorre todas las palabras en el arreglo `words` para realizar la animación de escritura y borrado de cada `word`
     *     utilizando promesas para esperar la ejecución.
     */
    for (let word of words) {
        await writer(elementHTML, [...word]);
        await eraser(elementHTML);
    }

    /**
     * @description
     * EN: Validates if there was initial content in the HTML element else it uses the last value of the `words` array
     *     to generate the last animation with that content.
     * ES: Valida si había contenido inicial en el elemento HTML; por el contrario, utiliza el último valor del arreglo `words`
     *     para generar la última animación con ese contenido.
     */
    await writer(elementHTML, firstContent ? firstContent.split('') : words[words.length - 1]);
};

/**
 * @description
 *  EN: Function in charge of obtaining the content to be animated can be through elements with class assigned
 *      in the attribute 'wj-class' or words with the attribute 'wj-words'.
 *  ES: Función encargada de obtener el contenido que se va a animar puede ser por medio de elementos con clase
 *      asignada en el atributo 'wj-class' o palabras con el atributo 'wj-words'.
 * @param elementHTML
 * @returns {[]}
 */
const getWords = (elementHTML) => {
    const attributeWords = elementHTML.getAttribute('wj-words');
    let words = [];
    let className = `.${elementHTML.getAttribute('wj-class')}` || '.wj-word';
    /**
     * @description
     *  EN: It is validated that the attribute `words` is defined in order to run the animation.
     *  ES: Se valida que este definido el atributo `palabras` para poder ejecutar la animación.
     */
    if (attributeWords) {
        /**
         * @description
         * EN: Getting words from the `words` attribute to add them to an array.
         * ES: Obtención de palabras del atributo `words` para agregarlas en un arreglo.
         * @type {string[]}
         */
        words = attributeWords.split(',');
    } else {

        const content = getElement(className);

        if (content.length === 1) {
            errorMessage('It is recommended that you use the \'wj-words\' tag for a single word.', '<p id="example" wj-words="word"><p>');
        } else if (content.length < 1) {
            errorMessage('Items with these classes are required to run the animation.');
        }

        content.map(element => {
            words.push(element.innerText);
            element.remove();
        });
    }

    return words;
};

/**
 * @description
 * EN: This function loops through a character array to create an animation at the visual writing level, the writing time can
 *     be modified in it with the `writer-time` attribute.
 * ES: Esta función recorre un arreglo de caracteres para crear una animación a nivel visual de escritura, el tiempo de escritura
 *     puede ser modificado en el con el atributo `writer-time`.
 * @param elementHTML: NodeElement
 * @param arrayLetters: Array<String>
 * @returns {Promise<null>}
 */
const writer = (elementHTML, arrayLetters = ['n', 'o', ' ', 't', 'e', 'x', 't']) =>
    new Promise((resolve, reject) => {
        if (!elementHTML) reject('The HTML Element is required.');
        if (!Array.isArray(arrayLetters)) reject('The param arrayLetters must be an array of strings.');

        let positionArrayCharacters = 0;
        let positionArrayCharactersMax = arrayLetters.length;

        let intervalAnimationWriter = setInterval(() => {
            if (positionArrayCharacters < positionArrayCharactersMax)
                elementHTML.innerHTML += arrayLetters[positionArrayCharacters];
            else
                resolve(clearInterval(intervalAnimationWriter));

            positionArrayCharacters++;

        }, elementHTML.getAttribute('wj-writerTime') || GLOBAL_OPTIONS.times.writer);
    });

/**
 * @description
 *  EN:
 *  ES:
 * @param selector: string
 * @param ArrayDeclarations: Array<string>
 */
const setStyles = (selector, ArrayDeclarations) => {
    if (!Array.isArray(ArrayDeclarations)) return errorMessage('Is required an array with declarations of styles.', `{styles: ["color: white", "background: black"]} <=`);
    const sheet = new CSSStyleSheet();
    let properties = '';
    ArrayDeclarations.map(property => properties += `${property}; `);
    sheet.replaceSync(`${selector} {position: relative; ${properties}`);
    document.adoptedStyleSheets = [sheet];
};

/**
 * @description
 * EN: This function loops through the content of an element to create an animation at the visual level of deletion,
 *     the deletion time can be modified with the attribute `eraser-time`, it also has a waiting interval for deletion,
 *     the time of this interval can be modified in the `read-time` attribute.
 * ES: Esta función recorre el contenido de un elemento para crear una animación a nivel visual de borrado, el tiempo
 *     de borrado puede ser modificado con el atributo `eraser-time` además tiene un intervalo de espera para la
 *     eliminación, el tiempo de este intervalo puede ser modificado en el atributo `read-time`.
 * @param elementHTML: NodeElement
 * @returns {Promise<null>}
 */
const eraser = elementHTML =>
    new Promise((resolve, reject) => {
        if (!elementHTML) reject('The HTML Element is required.');

        setTimeout(() => {
            let lengthCharacters = elementHTML.innerText.length;
            let characters = elementHTML.innerText;

            let intervalAnimationEraser = setInterval(() => {
                elementHTML.innerText = characters.slice(0, lengthCharacters);

                if (lengthCharacters > 0)
                    lengthCharacters--;
                else
                    resolve(clearInterval(intervalAnimationEraser));

            }, elementHTML.getAttribute('wj-eraserTime') || GLOBAL_OPTIONS.times.eraser)
        }, elementHTML.getAttribute('wj-readTime') || GLOBAL_OPTIONS.times.read);
    });

module.exports = {
    animationWriting,
    writer,
    eraser
};
