/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * All files containing `style` keyword are bundled together. The code used
 * gets applied both to the front of your site and to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './style.scss';

/**
 * Internal dependencies
 */
import Edit from './edit';
import metadata from './block.json';

const myCustomIcon = (
	<svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M2.72727 17.1905V8.14286H0L10 0L20 8.14286H17.2727V9.04762H15.4545V6.7631L10 2.32976L4.54545 6.7631V15.381H6.36364V17.1905H2.72727ZM12 19L8.18182 15.2L9.45455 13.9333L12 16.4667L17.3636 11.1286L18.6364 12.3952L12 19Z" fill="black" />
	</svg>
);

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
registerBlockType(metadata.name, {
	/**
	 * @see ./edit.js
	 */
	edit: Edit,
	...metadata, // Lädt alle Infos aus der block.json
	icon: myCustomIcon, // Überschreibt die Icon-Einstellung aus der JSON
});
