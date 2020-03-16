/**
 * AnimationWriting JavaScript Library v.0.0.1
 * https://github.com/ofaaoficial/animation-writing.js
 *
 * Copyright Oscar Amado
 * @ofaaoficial
 * Released under the MIT license
 * Date: 16/03/2020
 */

/**
 * @description
 *  EN: Getting the DOM element.
 *  ES: Obtención del elemento del DOM.
 * @param selector: String
 * @return {nodeElement}
 *
 */
const $ = selector => document.querySelector(selector);

const GLOBAL_CONFIG_ANIMATION_WRITING = {
    WRITTER_TIME_INTERVAL: 200,
    ERASER_TIME_INTERVAL: 150,
    READING_TIME_INTERVAL: 1000
};

const animationWriting = async selector => {
    /**
     * @description
     *  EN: Variable with the HTML element to which the animation will be performed.
     *  ES: Variable con el elemento HTML al cual se le va a realizar la animación.
     * @type {nodeElement}
     */
    let elementHTML = $(selector);

    /**
     * @description
     * EN: Getting words from the `words` attribute to add them to an array.
     * ES: Obtención de palabras del atributo `words` para agregarlas en un arreglo.
     * @type {string[]}
     */
    let words = elementHTML.getAttribute('words').split(',');

    /**
     * @description
     * EN: Variable que contendrá el contenido inicial del elemento HTML.
     * ES: Variable que contendra la primera palabra del elemento HTML.
     * @type {string}
     */
    let firstContent = '';

    /**
     * @description
     * EN: The content of the HTML element is verified; if there is content, run the delete word animation to empty the content.
     * ES: Se verifica el contenido del elemento HTML; si hay contenido, ejecuta la animación para vaciar el contenido.
     */
    if (elementHTML.innerHTML) {
        firstContent = elementHTML.innerHTML;
        await eraser(elementHTML);
    }

    /**
     * @description
     * EN: For each all the words in the `words (array)`  are traversed to make the animation of writing and erased each one
     *     using promises to wait for the execution.
     * ES: Se recorre todas las palabras en el arreglo `words` para realizar la animacion de escritura y borrado de cada `word`
     *     utilizando promesas para esperar la ejecucion.
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
 * EN: This function loops through a character array to create animation at the visual write level, the write time can be modified
 *     in the `GLOBAL_CONFIG_ANIMATION_WRITING.WRITTER_TIME_INTERVAL` object.
 * ES: Esta función recorre un arreglo de caracteres para crear una animación a nivel visual de escritura, el tiempo de escritura
 *     puede ser modificado en el objeto `GLOBAL_CONFIG_ANIMATION_WRITING.WRITTER_TIME_INTERVAL`.
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

        let intervalAnimationWritter = setInterval(() => {
            if (positionArrayCharacters < positionArrayCharactersMax)
                elementHTML.innerHTML += arrayLetters[positionArrayCharacters];
            else
                resolve(clearInterval(intervalAnimationWritter));

            positionArrayCharacters++;

        }, GLOBAL_CONFIG_ANIMATION_WRITING.WRITTER_TIME_INTERVAL);
    });

/**
 * @description
 * EN: This function loops through the content of an element to create an animation at the visual level of erased,
 *     the erased time can be modified in the `GLOBAL_CONFIG_ANIMATION_WRITING.ERASER_TIME_INTERVAL` object,
 *     it also has a waiting interval for the erased, the time of this interval can be modified in the
 *     `GLOBAL_CONFIG_ANIMATION_WRITING.READING_TIME_INTERVAL` object.
 * ES: Esta función recorre el contenido de un elemento para crear una animación a nivel visual de borrado, el tiempo
 *     de borrado puede ser modificado en el objeto `GLOBAL_CONFIG_ANIMATION_WRITING.EREASER_TIME_INTERVAL` además
 *     tiene un intervalo de espera para la eliminación el tiempo de este intervalo puede ser modificado en el objeto
 *     `GLOBAL_CONFIG_ANIMATION_WRITING.READING_TIME_INTERVAL`.
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

            }, GLOBAL_CONFIG_ANIMATION_WRITING.ERASER_TIME_INTERVAL)
        }, GLOBAL_CONFIG_ANIMATION_WRITING.READING_TIME_INTERVAL);
    });

module.exports = {
    $,
    writer,
    eraser,
    animationWriting,
    GLOBAL_CONFIG_ANIMATION_WRITING
};
