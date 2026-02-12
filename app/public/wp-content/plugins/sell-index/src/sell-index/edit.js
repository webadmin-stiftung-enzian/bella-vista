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
	const [svgContent, setSvgContent] = useState('');

	useEffect(() => {
		// Apartments laden
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

		// SVG laden
		fetch('/wp-content/themes/enzian/assets/files/bella-vista.svg')
			.then((response) => response.text())
			.then((svg) => {
				// Füge Klassen hinzu wie in render.php
				let modifiedSvg = svg.replace(/(<svg[^>]*class=["'])([^"']*)/, '$1$2 bella-vista-map');
				if (!modifiedSvg.includes('class=')) {
					modifiedSvg = modifiedSvg.replace(/(<svg[^>]*)>/, '$1 class="bella-vista-map parallax">');
				}
				setSvgContent(modifiedSvg);
			})
			.catch((error) => {
				console.error('Error loading SVG:', error);
			});
	}, []);

	return (
		<div {...useBlockProps()}>
			{loading ? (
				<p>{__('Lädt Apartments...', 'sell-index')}</p>
			) : (
				<>
					{svgContent ? (
						<div dangerouslySetInnerHTML={{ __html: svgContent }} />
					) : (
						<div className="bella-vista-map-placeholder">
							<p style={{ textAlign: 'center', padding: '2rem', backgroundColor: '#f0f0f0', borderRadius: '0.5rem' }}>
								{__('SVG Karte wird geladen...', 'sell-index')}
							</p>
						</div>
					)}
					<section className="sell-index">
						<table className="sell-index-table">
							<thead>
								<tr>
									<th>{__('Etage/Wohnung', 'sell-index')}</th>
									<th>{__('Zimmer', 'sell-index')}</th>
									<th>{__('Wohnfläche', 'sell-index')}</th>
									<th>{__('Terrasse/Balkon', 'sell-index')}</th>
									<th>{__('Garten', 'sell-index')}</th>
									<th>{__('Preis', 'sell-index')}</th>
									<th>{__('Grundriss', 'sell-index')}</th>
								</tr>
							</thead>
							<tbody>
								{apartments.map((apartment) => (
									<tr key={apartment.slug} id={apartment.slug}>
										<td>{apartment.details.level}</td>
										<td>{apartment.details.rooms}</td>
										<td>{apartment.details.living_space} m²</td>
										<td>
											{apartment.details.terrace_balcony === '' || apartment.details.terrace_balcony === '0' 
												? '—' 
												: `${apartment.details.terrace_balcony} m²`}
										</td>
										<td>
											{apartment.details.garden === '' || apartment.details.garden === '0' 
												? '—' 
												: `${apartment.details.garden} m²`}
										</td>
										<td>
											{apartment.details.status === 'Verfügbar' 
												? apartment.details.price 
												: apartment.details.status}
										</td>
										<td>
											{apartment.details.floor_plan_url ? (
												<a 
													className="sell-index-table-download-pdf" 
													href={apartment.details.floor_plan_url} 
													target="_blank" 
													rel="noopener noreferrer"
													aria-label={__('Grundriss ansehen', 'sell-index')}
												>
													<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-down-icon lucide-file-down">
														<path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" />
														<path d="M14 2v5a1 1 0 0 0 1 1h5" />
														<path d="M12 18v-6" />
														<path d="m9 15 3 3 3-3" />
													</svg>
												</a>
											) : (
												__('N/A', 'sell-index')
											)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</section>
				</>
			)}
		</div>
	);
}
