<?php

// enable SVG uploads
function cc_mime_types($mimes)
{
    $mimes['svg'] = 'image/svg+xml';
    return $mimes;
}
add_filter('upload_mimes', 'cc_mime_types');

// Add editor styles
function enzian_editor_styles()
{
    add_editor_style('assets/styles/style.css');
    add_editor_style('assets/styles/sell-index.css');
}
add_action('after_setup_theme', 'enzian_editor_styles');

// ACF Google Maps API Key setzen
function my_acf_google_map_api($api)
{
    $api['key'] = 'AIzaSyAXRY70-7Z9a82LKiSTf2D0GevIfdowI38';
    return $api;
}
add_filter('acf/fields/google_map/api', 'my_acf_google_map_api');

function render_svg_map()
{
    $svg_file = get_stylesheet_directory() . '/assets/files/map.svg';
    if (file_exists($svg_file)) {
        return '<figure class="wp-block-image size-full wp-container-content-1ed81c1b">' . file_get_contents($svg_file) . '</figure>';
    } else {
        return '<figure><!-- SVG file not found --></figure>';
    }
}

add_shortcode('render_svg_map', 'render_svg_map');

add_action('acf/include_fields', function () {
    if (! function_exists('acf_add_local_field_group')) {
        return;
    }

    acf_add_local_field_group(array(
        'key' => 'group_69491060b39b1',
        'title' => 'apartments',
        'fields' => array(
            array(
                'key' => 'field_69491061cf033',
                'label' => 'Etage / Wohnung',
                'name' => 'apartments_level',
                'aria-label' => '',
                'type' => 'text',
                'instructions' => '',
                'required' => 0,
                'conditional_logic' => 0,
                'wrapper' => array(
                    'width' => '',
                    'class' => '',
                    'id' => '',
                ),
                'default_value' => '',
                'maxlength' => '',
                'allow_in_bindings' => 0,
                'placeholder' => '',
                'prepend' => '',
                'append' => '',
            ),
            array(
                'key' => 'field_69491100cf034',
                'label' => 'Zimmer',
                'name' => 'apartments_rooms',
                'aria-label' => '',
                'type' => 'text',
                'instructions' => '',
                'required' => 0,
                'conditional_logic' => 0,
                'wrapper' => array(
                    'width' => '',
                    'class' => '',
                    'id' => '',
                ),
                'default_value' => '',
                'min' => '',
                'max' => '',
                'allow_in_bindings' => 0,
                'placeholder' => '',
                'step' => '',
                'prepend' => '',
                'append' => '',
            ),
            array(
                'key' => 'field_694911d6fc884',
                'label' => 'Wohnfläche in m²',
                'name' => 'apartments_living_space',
                'aria-label' => '',
                'type' => 'text',
                'instructions' => '',
                'required' => 0,
                'conditional_logic' => 0,
                'wrapper' => array(
                    'width' => '',
                    'class' => '',
                    'id' => '',
                ),
                'default_value' => '',
                'min' => '',
                'max' => '',
                'allow_in_bindings' => 0,
                'placeholder' => '',
                'step' => '',
                'prepend' => '',
                'append' => '',
            ),
            array(
                'key' => 'field_69491324fc886',
                'label' => 'Balkon/Terrasse in m²',
                'name' => 'apartments_terrace_balcony',
                'aria-label' => '',
                'type' => 'text',
                'instructions' => '',
                'required' => 0,
                'conditional_logic' => 0,
                'wrapper' => array(
                    'width' => '',
                    'class' => '',
                    'id' => '',
                ),
                'default_value' => '',
                'min' => '',
                'max' => '',
                'allow_in_bindings' => 0,
                'placeholder' => '',
                'step' => '',
                'prepend' => '',
                'append' => '',
            ),
            array(
                'key' => 'field_69491272fc885',
                'label' => 'Garten in m²',
                'name' => 'apartments_garden',
                'aria-label' => '',
                'type' => 'text',
                'instructions' => '',
                'required' => 0,
                'conditional_logic' => 0,
                'wrapper' => array(
                    'width' => '',
                    'class' => '',
                    'id' => '',
                ),
                'default_value' => '',
                'min' => '',
                'max' => '',
                'allow_in_bindings' => 0,
                'placeholder' => '',
                'step' => '',
                'prepend' => '',
                'append' => '',
            ),
            array(
                'key' => 'field_69491653e4028',
                'label' => 'Keller in m²',
                'name' => 'apartments_basement',
                'aria-label' => '',
                'type' => 'text',
                'instructions' => '',
                'required' => 0,
                'conditional_logic' => 0,
                'wrapper' => array(
                    'width' => '',
                    'class' => '',
                    'id' => '',
                ),
                'default_value' => '',
                'min' => '',
                'max' => '',
                'allow_in_bindings' => 0,
                'placeholder' => '',
                'step' => '',
                'prepend' => '',
                'append' => '',
            ),
            array(
                'key' => 'field_6949139a3570e',
                'label' => 'Verkaufsstatus',
                'name' => 'apartments_state',
                'aria-label' => '',
                'type' => 'select',
                'instructions' => '',
                'required' => 0,
                'conditional_logic' => 0,
                'wrapper' => array(
                    'width' => '',
                    'class' => '',
                    'id' => '',
                ),
                'choices' => array(
                    'Auf Anfrage' => 'Auf Anfrage',
                    'Reserviert' => 'Reserviert',
                    'Verkauft' => 'Verkauft',
                    'Verfügbar' => 'Verfügbar',
                ),
                'default_value' => false,
                'return_format' => 'label',
                'multiple' => 0,
                'allow_null' => 0,
                'allow_in_bindings' => 0,
                'ui' => 0,
                'ajax' => 0,
                'placeholder' => '',
                'create_options' => 0,
                'save_options' => 0,
            ),
            array(
                'key' => 'field_694917e645f7f',
                'label' => 'Preis in CHF',
                'name' => 'apartments_price',
                'aria-label' => '',
                'type' => 'text',
                'instructions' => '',
                'required' => 0,
                'conditional_logic' => array(
                    array(
                        array(
                            'field' => 'field_6949139a3570e',
                            'operator' => '==',
                            'value' => 'Verfügbar',
                        ),
                    ),
                ),
                'wrapper' => array(
                    'width' => '',
                    'class' => '',
                    'id' => '',
                ),
                'default_value' => '',
                'maxlength' => '',
                'allow_in_bindings' => 0,
                'placeholder' => '',
                'prepend' => '',
                'append' => '',
            ),
            array(
                'key' => 'field_694913b53570f',
                'label' => 'Grundriss',
                'name' => 'apartments_floor_plan',
                'aria-label' => '',
                'type' => 'file',
                'instructions' => '',
                'required' => 0,
                'conditional_logic' => 0,
                'wrapper' => array(
                    'width' => '',
                    'class' => '',
                    'id' => '',
                ),
                'return_format' => 'array',
                'library' => 'all',
                'min_size' => '',
                'max_size' => '',
                'mime_types' => '',
                'allow_in_bindings' => 0,
            ),
        ),
        'location' => array(
            array(
                array(
                    'param' => 'post_type',
                    'operator' => '==',
                    'value' => 'apartments',
                ),
            ),
        ),
        'menu_order' => 0,
        'position' => 'normal',
        'style' => 'default',
        'label_placement' => 'top',
        'instruction_placement' => 'label',
        'hide_on_screen' => '',
        'active' => true,
        'description' => '',
        'show_in_rest' => 1,
        'display_title' => '',
    ));
});

add_action('init', function () {
    register_post_type('apartments', array(
        'labels' => array(
            'name' => 'Apartments',
            'singular_name' => 'Apartment',
            'menu_name' => 'Apartments',
            'all_items' => 'All Apartments',
            'edit_item' => 'Edit Apartment',
            'view_item' => 'View Apartment',
            'view_items' => 'View Apartments',
            'add_new_item' => 'Add New Apartment',
            'add_new' => 'Add New Apartment',
            'new_item' => 'New Apartment',
            'parent_item_colon' => 'Parent Apartment:',
            'search_items' => 'Search Apartments',
            'not_found' => 'No apartments found',
            'not_found_in_trash' => 'No apartments found in Trash',
            'archives' => 'Apartment Archives',
            'attributes' => 'Apartment Attributes',
            'insert_into_item' => 'Insert into apartment',
            'uploaded_to_this_item' => 'Uploaded to this apartment',
            'filter_items_list' => 'Filter apartments list',
            'filter_by_date' => 'Filter apartments by date',
            'items_list_navigation' => 'Apartments list navigation',
            'items_list' => 'Apartments list',
            'item_published' => 'Apartment published.',
            'item_published_privately' => 'Apartment published privately.',
            'item_reverted_to_draft' => 'Apartment reverted to draft.',
            'item_scheduled' => 'Apartment scheduled.',
            'item_updated' => 'Apartment updated.',
            'item_link' => 'Apartment Link',
            'item_link_description' => 'A link to a apartment.',
        ),
        'public' => true,
        'show_in_rest' => true,
        'menu_icon' => 'dashicons-admin-post',
        'supports' => array(
            0 => 'title',
            1 => 'editor',
            2 => 'thumbnail',
            3 => 'custom-fields',
        ),
        'delete_with_user' => false,
    ));
});

// Custom REST API Endpunkt für Apartments registrieren
add_action('rest_api_init', function () {
    register_rest_route('apartments', '/v1', [
        'methods' => 'GET',
        'callback' => 'get_apartments_with_acf',
        'permission_callback' => '__return_true'
    ]);

    register_rest_route('apartments', '/v1/(?P<id>\\d+)', [
        'methods' => 'GET',
        'callback' => 'get_single_apartment_with_acf',
        'permission_callback' => '__return_true',
        'args' => [
            'id' => [
                'validate_callback' => function ($param, $request, $key) {
                    return is_numeric($param);
                }
            ]
        ]
    ]);
});

// Alle Apartments mit ACF-Feldern abrufen
function get_apartments_with_acf($request)
{
    $args = [
        'post_type' => 'apartments',
        'posts_per_page' => -1,
        'post_status' => 'publish',
        'orderby' => 'title',
        'order' => 'ASC'
    ];

    // Filter nach Status
    $status = $request->get_param('status');
    if ($status) {
        $args['meta_query'] = [
            [
                'key' => 'apartments_state',
                'value' => $status,
                'compare' => '='
            ]
        ];
    }

    $query = new WP_Query($args);
    $apartments = [];

    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            $post_id = get_the_ID();

            // Grundriss-Datei verarbeiten
            $floor_plan = get_field('apartments_floor_plan', $post_id);
            $floor_plan_url = is_array($floor_plan) && isset($floor_plan['url']) ? $floor_plan['url'] : null;

            $apartments[] = [
                'id' => $post_id,
                'title' => get_the_title(),
                'slug' => get_post_field('post_name', $post_id),
                'content' => get_the_content(),
                'excerpt' => get_the_excerpt(),
                'date' => get_the_date('c'),
                'modified' => get_the_modified_date('c'),
                'featured_image' => get_the_post_thumbnail_url($post_id, 'full'),
                'details' => [
                    'level' => get_field('apartments_level', $post_id),
                    'rooms' => get_field('apartments_rooms', $post_id),
                    'living_space' => get_field('apartments_living_space', $post_id),
                    'terrace_balcony' => get_field('apartments_terrace_balcony', $post_id),
                    'garden' => get_field('apartments_garden', $post_id),
                    'basement' => get_field('apartments_basement', $post_id),
                    'status' => get_field('apartments_state', $post_id),
                    'price' => get_field('apartments_price', $post_id),
                    'floor_plan_url' => $floor_plan_url
                ]
            ];
        }
        wp_reset_postdata();
    }

    return new WP_REST_Response($apartments, 200);
}

// Einzelnes Apartment mit ACF-Feldern abrufen
function get_single_apartment_with_acf($request)
{
    $post_id = $request['id'];

    $post = get_post($post_id);

    if (!$post || $post->post_type !== 'apartments' || $post->post_status !== 'publish') {
        return new WP_Error('not_found', 'Apartment nicht gefunden', ['status' => 404]);
    }

    // Grundriss-Datei verarbeiten
    $floor_plan = get_field('apartments_floor_plan', $post_id);
    $floor_plan_data = null;
    if (is_array($floor_plan) && isset($floor_plan['url'])) {
        $floor_plan_data = [
            'url' => $floor_plan['url'],
            'filename' => $floor_plan['filename'],
            'filesize' => $floor_plan['filesize'],
            'mime_type' => $floor_plan['mime_type']
        ];
    }

    $apartment = [
        'id' => $post_id,
        'title' => get_the_title($post_id),
        'slug' => $post->post_name,
        'content' => apply_filters('the_content', $post->post_content),
        'excerpt' => get_the_excerpt($post_id),
        'date' => get_the_date('c', $post_id),
        'modified' => get_the_modified_date('c', $post_id),
        'featured_image' => get_the_post_thumbnail_url($post_id, 'full'),
        'details' => [
            'level' => get_field('apartments_level', $post_id),
            'rooms' => get_field('apartments_rooms', $post_id),
            'living_space' => get_field('apartments_living_space', $post_id),
            'terrace_balcony' => get_field('apartments_terrace_balcony', $post_id),
            'garden' => get_field('apartments_garden', $post_id),
            'basement' => get_field('apartments_basement', $post_id),
            'status' => get_field('apartments_state', $post_id),
            'price' => get_field('apartments_price', $post_id),
            'floor_plan' => $floor_plan_data
        ]
    ];

    return new WP_REST_Response($apartment, 200);
}

// Funktion, um Kartendaten anhand des Titels abzurufen
function get_map_data_by_name($map_title = 'Map 1')
{
    // 1. WP_Query startet
    $args = array(
        'post_type'  => 'maps',
        'title'      => $map_title,
        'posts_per_page' => 1
    );

    $query = new WP_Query($args);
    $all_locations = [];

    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();

            // 2. Repeater-Felder abgreifen
            $locations = get_field('locations');
            if ($locations) {
                foreach ($locations as $location) {
                    $all_locations[] = [
                        'title' => $location['locations_title'],
                        'description' => $location['locations_description'],
                        'lat'  => $location['locations_coordinates']['lat'],
                        'lng'  => $location['locations_coordinates']['lng']
                    ];
                }
            }
        }
        wp_reset_postdata();
    }
    return $all_locations;
}

// Enqueue Styles and Scripts
add_action('wp_enqueue_scripts', function () {
    wp_enqueue_style(
        'sell-index',
        get_stylesheet_directory_uri() . '/assets/styles/sell-index.css',
        [],
        filemtime(get_stylesheet_directory() . '/assets/styles/sell-index.css')
    );

    wp_enqueue_style(
        "stylesheet",
        get_stylesheet_directory_uri() . '/assets/styles/style.css',
        [],
        filemtime(get_stylesheet_directory() . '/assets/styles/style.css')
    );

    wp_enqueue_script(
        'sell-index',
        get_stylesheet_directory_uri() . '/assets/scripts/sell-index.js',
        [],
        filemtime(get_stylesheet_directory() . '/assets/scripts/sell-index.js'),
        true
    );

    wp_enqueue_script(
        'nav',
        get_stylesheet_directory_uri() . '/assets/scripts/nav.js',
        [],
        filemtime(get_stylesheet_directory() . '/assets/scripts/nav.js'),
        true
    );

    wp_enqueue_script(
        'details-animation',
        get_stylesheet_directory_uri() . '/assets/scripts/details-animation.js',
        [],
        filemtime(get_stylesheet_directory() . '/assets/scripts/details-animation.js'),
        true
    );

    // GSAP Library
    wp_enqueue_script(
        'gsap',
        'https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js',
        [],
        '3.12.5',
        true
    );

    // GSAP ScrollTrigger Plugin
    wp_enqueue_script(
        'gsap-scrolltrigger',
        'https://cdn.jsdelivr.net/npm/gsap@3/dist/ScrollTrigger.min.js',
        array('gsap'),
        '3.12.5',
        true
    );

    // GSAP ScrollToPlugin
    wp_enqueue_script(
        'gsap-scrollto',
        'https://cdn.jsdelivr.net/npm/gsap@3/dist/ScrollToPlugin.min.js',
        array('gsap'),
        '3.12.5',
        true
    );

    // GSAP Draggable Plugin
    wp_enqueue_script(
        'gsap-draggable',
        'https://cdn.jsdelivr.net/npm/gsap@3/dist/Draggable.min.js',
        array('gsap'),
        '3.12.5',
        true
    );

    wp_enqueue_script(
        'smooth-scroll',
        get_stylesheet_directory_uri() . '/assets/scripts/smooth-scroll.js',
        array('gsap', 'gsap-scrolltrigger', 'gsap-scrollto'),
        filemtime(get_stylesheet_directory() . '/assets/scripts/smooth-scroll.js'),
        true
    );

    wp_enqueue_script(
        'counter',
        get_stylesheet_directory_uri() . '/assets/scripts/counter.js',
        array('gsap'), // GSAP als Dependency
        filemtime(get_stylesheet_directory() . '/assets/scripts/counter.js'),
        true
    );

    wp_enqueue_script(
        'parallax',
        get_stylesheet_directory_uri() . '/assets/scripts/parallax.js',
        array('gsap', 'gsap-scrolltrigger'), // GSAP + ScrollTrigger als Dependencies
        filemtime(get_stylesheet_directory() . '/assets/scripts/parallax.js'),
        true
    );

    wp_enqueue_script(
        'map',
        get_stylesheet_directory_uri() . '/assets/scripts/map.js',
        array('gsap', 'gsap-draggable'),
        filemtime(get_stylesheet_directory() . '/assets/scripts/map.js'),
        true
    );
});

// Erstelle Shortcode um eine Karte anzuzeigen
function render_map_shortcode($atts)
{
    $atts = shortcode_atts(array(
        'width' => '100%',
        'height' => '600px',
        'zoom' => '17',
    ), $atts, 'render_map');

    // Erstelle das Div-Element für die Karte mit fester ID
    return '<div id="map-canvas" data-zoom="' . esc_attr($atts['zoom']) . '" style="width:' . esc_attr($atts['width']) . '; height:' . esc_attr($atts['height']) . ';"></div>';
}
add_shortcode('render_map', 'render_map_shortcode');

// Enqueue Block Editor Assets (Format Filter)
function my_theme_enqueue_format_assets()
{
    wp_enqueue_script(
        'my-custom-format',
        get_template_directory_uri() . '/assets/scripts/format-filter.js',
        array('wp-rich-text', 'wp-element', 'wp-editor', 'wp-format-library'),
        filemtime(get_template_directory() . '/assets/scripts/format-filter.js')
    );
}
add_action('enqueue_block_editor_assets', 'my_theme_enqueue_format_assets');
