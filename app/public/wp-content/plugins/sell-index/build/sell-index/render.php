<?php

/**
 * PHP file to use when rendering the block type on the server to show on the front end.
 *
 * The following variables are exposed to the file:
 *     $attributes (array): The block attributes.
 *     $content (string): The block default content.
 *     $block (WP_Block): The block instance.
 *
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */

// Apartments via WP_Query abrufen
$svg_file = get_stylesheet_directory() . '/assets/files/bella-vista.svg';

$query = new WP_Query([
	'post_type' => 'apartments',
	'posts_per_page' => -1,
	'orderby' => 'title',
	'order' => 'ASC'
]);

$apartments = [];

if ($query->have_posts()) {
	while ($query->have_posts()) {
		$query->the_post();
		$post_id = get_the_ID();

		$apartments[] = [
			'slug' => get_post_field('post_name', $post_id),
			'details' => [
				'level' => get_field('apartments_level', $post_id) ?: '',
				'rooms' => get_field('apartments_rooms', $post_id) ?: '',
				'living_space' => get_field('apartments_living_space', $post_id) ?: '',
				'terrace_balcony' => get_field('apartments_terrace_balcony', $post_id) ?: '',
				'garden' => get_field('apartments_garden', $post_id) ?: '',
				'price' => get_field('apartments_price', $post_id) ?: '',
				'status' => get_field('apartments_state', $post_id) ?: '',
				'floor_plan_url' => get_field('apartments_floor_plan', $post_id)['url'] ?? ''
			]
		];
	}
	wp_reset_postdata();
}
?>
<div <?php echo get_block_wrapper_attributes(); ?>>
	<?php if (!empty($apartments)): ?>
		<?php
		if (file_exists($svg_file)) {
			$svg_content = file_get_contents($svg_file);
			// Füge dem <svg> Tag eine Klasse hinzu
			$svg_content = preg_replace('/(<svg[^>]*class=["\'])([^"\']*)/i', '$1$2 bella-vista-map', $svg_content);
			// Falls keine class-Attribut existiert, füge eines hinzu
			if (strpos($svg_content, 'class=') === false) {
				$svg_content = preg_replace('/(<svg[^>]*)>/i', '$1 class="bella-vista-map parallax">', $svg_content);
			}
			echo $svg_content;
		} else {
			echo '<!-- SVG file not found -->';
		}
		?>
		<section class="sell-index">
			<table class="sell-index-table">
				<thead>
					<tr>
						<th><?php esc_html_e('Etage/Wohnung', 'sell-index'); ?></th>
						<th><?php esc_html_e('Zimmer', 'sell-index'); ?></th>
						<th><?php esc_html_e('Wohnfläche', 'sell-index'); ?></th>
						<th><?php esc_html_e('Terrasse/Balkon', 'sell-index'); ?></th>
						<th><?php esc_html_e('Garten', 'sell-index'); ?></th>
						<th><?php esc_html_e('Preis', 'sell-index'); ?></th>
						<th><?php esc_html_e('Grundriss', 'sell-index'); ?></th>
					</tr>
				</thead>
				<tbody>
					<?php foreach ($apartments as $apartment): ?>
						<tr id=<?php echo esc_attr($apartment['slug']) ?>>
							<td><?php echo esc_html($apartment['details']['level']); ?></td>
							<td><?php echo esc_html($apartment['details']['rooms']); ?></td>
							<td><?php echo esc_html($apartment['details']['living_space']) . ' m²'; ?></td>
							<?php if ($apartment['details']['terrace_balcony'] === '' || $apartment['details']['terrace_balcony'] === "0") : ?>
								<td><?php echo esc_html('—'); ?></td>
							<?php else : ?>
								<td><?php echo esc_html($apartment['details']['terrace_balcony']) . ' m²'; ?></td>
							<?php endif; ?>
							<?php if ($apartment['details']['garden'] === '' || $apartment['details']['garden'] === "0") : ?>
								<td><?php echo esc_html('—'); ?></td>
							<?php else : ?>
								<td><?php echo esc_html($apartment['details']['garden']) . ' m²'; ?></td>
							<?php endif; ?>
							<?php if ($apartment['details']['status'] === 'Verfügbar'): ?>
								<td><?php echo esc_html($apartment['details']['price']); ?></td>
							<?php else: ?>
								<td><?php echo esc_html($apartment['details']['status']); ?></td>
							<?php endif; ?>
							<td>
								<?php if (!empty($apartment['details']['floor_plan_url'])): ?>
									<a class="sell-index-table-download-pdf" href="<?php echo esc_url($apartment['details']['floor_plan_url']); ?>" target="_blank" aria-label="<?php esc_attr_e('Grundriss ansehen', 'sell-index'); ?>">
										<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-down-icon lucide-file-down">
											<path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" />
											<path d="M14 2v5a1 1 0 0 0 1 1h5" />
											<path d="M12 18v-6" />
											<path d="m9 15 3 3 3-3" />
										</svg>
									</a>
								<?php else: ?>
									<?php esc_html_e('N/A', 'sell-index'); ?>
								<?php endif; ?>
							</td>
						</tr>
					<?php endforeach; ?>
				</tbody>
			</table>
		</section>
	<?php else: ?>
		<p><?php esc_html_e('Keine Apartments gefunden.', 'sell-index'); ?></p>
	<?php endif; ?>
</div>