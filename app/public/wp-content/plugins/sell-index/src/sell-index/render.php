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

// Apartments vom API Endpunkt abrufen
$api_url = home_url('/wp-json/apartments/v1/');
$response = wp_remote_get($api_url);
$apartments = [];

if (!is_wp_error($response) && wp_remote_retrieve_response_code($response) === 200) {
	$body = wp_remote_retrieve_body($response);
	$apartments = json_decode($body, true);
}
?>
<div <?php echo get_block_wrapper_attributes(); ?>>
	<?php if (!empty($apartments)): ?>
		<table>
			<thead>
				<tr>
					<th><?php esc_html_e('Etage/Wohnung', 'sell-index'); ?></th>
					<th><?php esc_html_e('Zimmer', 'sell-index'); ?></th>
					<th><?php esc_html_e('Wohnfläche', 'sell-index'); ?></th>
					<th><?php esc_html_e('Terrasse/Balkon', 'sell-index'); ?></th>
					<th><?php esc_html_e('Garten', 'sell-index'); ?></th>
					<th><?php esc_html_e('Keller', 'sell-index'); ?></th>
					<th><?php esc_html_e('Preis', 'sell-index'); ?></th>
					<th><?php esc_html_e('Grundriss', 'sell-index'); ?></th>
				</tr>
			</thead>
			<tbody>
				<?php foreach ($apartments as $apartment): ?>
					<tr id=<?php echo esc_attr($apartment['slug']) ?>>
						<td><?php echo esc_html($apartment['details']['level']); ?></td>
						<td><?php echo esc_html($apartment['details']['rooms']); ?></td>
						<td><?php echo esc_html($apartment['details']['living_space']); ?></td>
						<td><?php echo esc_html($apartment['details']['terrace_balcony']); ?></td>
						<td><?php echo esc_html($apartment['details']['garden']); ?></td>
						<td><?php echo esc_html($apartment['details']['basement']); ?></td>
						<?php if (!$apartment['details']['status'] === 'Verfügbar'): ?>
							<td><?php esc_html_e($apartment['details']['status'], 'sell-index'); ?></td>
						<?php else: ?>
							<td><?php echo esc_html($apartment['details']['price'] . ' CHF'); ?></td>
						<?php endif; ?>
						<td>
							<?php if (!empty($apartment['details']['floor_plan_url'])): ?>
								<a href="<?php echo esc_url($apartment['details']['floor_plan_url']); ?>" target="_blank"><?php esc_html_e('View', 'sell-index'); ?></a>
							<?php else: ?>
								<?php esc_html_e('N/A', 'sell-index'); ?>
							<?php endif; ?>
						</td>
					</tr>
				<?php endforeach; ?>
			</tbody>
		</table>
	<?php else: ?>
		<p><?php esc_html_e('Keine Apartments gefunden.', 'sell-index'); ?></p>
	<?php endif; ?>
</div>