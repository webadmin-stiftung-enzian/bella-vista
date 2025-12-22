/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps } from '@wordpress/block-editor';
import { useState, useEffect } from '@wordpress/element';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';
import apiFetch from '@wordpress/api-fetch';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit() {
	const [apartments, setApartments] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		apiFetch({ path: '/apartments/v1' })
			.then((data) => {
				setApartments(data);
				setLoading(false);
				console.log(data);
			})
			.catch((error) => {
				console.error('Error fetching apartments:', error);
				setLoading(false);
			});
	}, []);

	return (
		<div { ...useBlockProps() }>
			{loading ? (
				<p>{__('Lädt Apartments...', 'sell-index')}</p>
			) : (
				<>
					<table className="sell-index-table">
						<thead>
							<tr>
								<th>{__('Etage/Wohnung', 'sell-index')}</th>
								<th>{__('Zimmer', 'sell-index')}</th>
								<th>{__('Wohnfläche', 'sell-index')}</th>
								<th>{__('Terrasse/Balkon', 'sell-index')}</th>
								<th>{__('Garten', 'sell-index')}</th>
								<th>{__('Keller', 'sell-index')}</th>
								<th>{__('Preis', 'sell-index')}</th>
								<th>{__('Grundriss', 'sell-index')}</th>
							</tr>
						</thead>
						<tbody>
							{apartments.map((apartment) => (
								<tr key={apartment.slug}>
									<td>{apartment.details.level}</td>
									<td>{apartment.details.rooms}</td>
									<td>{apartment.details.living_space} m²</td>
									<td>{apartment.details.terrace_balcony} m²</td>
									<td>{apartment.details.garden} m²</td>
									<td>{apartment.details.basement} m²</td>
									{apartment.details.status !== 'Verfügbar' ? <td>{apartment.details.status}</td> : <td>{apartment.details.price}</td>}
									<td>{apartment.details.floor_plan_url}</td>
								</tr>
							))}
						</tbody>
					</table>	
				</>
			)}
		</div>
	);
}
