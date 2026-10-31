<?php
/**
 * DUP Pro Child — laadt het DoubleUP Design System in Themeco Pro.
 *
 * - Thema op <html data-theme="…">; standaard "doubleup", te wijzigen met de constante DUP_THEME
 *   of het filter 'dup_theme'. Showcase: DUP_SHOWCASE = true laadt alle thema's.
 * - Kleurmodus: volgt het systeem, of de keuze van de bezoeker (data-color-scheme op <html>,
 *   onthouden in localStorage). Wisselaar: shortcode [dup_color_scheme_toggle].
 * - Assets in assets/ worden gebouwd door adapters/cornerstone/build.mjs (niet in git).
 *
 * @package dup-pro-child
 */

defined( 'ABSPATH' ) || exit;

/** Actief thema (slug uit packages/tokens/src/themes). */
function dup_theme(): string {
	$theme = defined( 'DUP_THEME' ) ? DUP_THEME : 'doubleup';
	$theme = (string) apply_filters( 'dup_theme', $theme );
	return preg_match( '/^[a-z0-9-]+$/', $theme ) ? $theme : 'doubleup';
}

/** Showcase-modus: alle thema's laden zodat secties met eigen data-theme werken. */
function dup_showcase(): bool {
	return (bool) apply_filters( 'dup_showcase', defined( 'DUP_SHOWCASE' ) && DUP_SHOWCASE );
}

/** URL + versie (bestandshash) van een asset; null als het bestand ontbreekt. */
function dup_asset( string $path ): ?array {
	$file = get_stylesheet_directory() . '/assets/' . $path;
	if ( ! is_readable( $file ) ) {
		return null;
	}
	return array( get_stylesheet_directory_uri() . '/assets/' . $path, substr( md5_file( $file ), 0, 10 ) );
}

/** Stylesheets: fonts → thema-tokens → referentiecomponenten. Ook in de Cornerstone-preview. */
function dup_enqueue_assets(): void {
	$theme  = dup_theme();
	$styles = array(
		'dup-fonts'  => 'fonts/' . ( 'voorbeeld' === $theme ? 'source-serif-4.css' : 'archivo.css' ),
		'dup-tokens' => dup_showcase() ? 'css/all-themes.css' : "css/themes/{$theme}.css",
		'dup-css'    => 'css/dup.css',
	);
	if ( dup_showcase() ) {
		foreach ( array( 'mona-sans', 'bricolage-grotesque', 'source-serif-4' ) as $font ) {
			$styles[ "dup-fonts-{$font}" ] = "fonts/{$font}.css";
		}
	}
	$deps = array();
	foreach ( $styles as $handle => $path ) {
		$asset = dup_asset( $path );
		if ( ! $asset ) {
			continue;
		}
		wp_enqueue_style( $handle, $asset[0], $deps, $asset[1] );
		$deps = array( $handle );
	}
	$toggle = dup_asset( 'js/color-scheme.js' );
	if ( $toggle ) {
		wp_enqueue_script( 'dup-color-scheme', $toggle[0], array(), $toggle[1], array( 'strategy' => 'defer' ) );
	}
}
add_action( 'wp_enqueue_scripts', 'dup_enqueue_assets', 20 );

/** <html data-theme="…"> */
add_filter(
	'language_attributes',
	static function ( string $output ): string {
		return $output . ' data-theme="' . esc_attr( dup_theme() ) . '"';
	}
);

/** <body class="… dup-document"> */
add_filter(
	'body_class',
	static function ( array $classes ): array {
		$classes[] = 'dup-document';
		return $classes;
	}
);

/**
 * Vroeg in <head>: opgeslagen kleurmodus toepassen vóór de eerste paint (geen flits).
 * Zonder opgeslagen keuze volgt de site prefers-color-scheme (via de thema-CSS).
 */
add_action(
	'wp_head',
	static function (): void {
		echo "<meta name=\"color-scheme\" content=\"light dark\">\n";
		echo "<script>try{var s=localStorage.getItem('dup-color-scheme');if(s==='light'||s==='dark'){document.documentElement.setAttribute('data-color-scheme',s);}}catch(e){}</script>\n";
	},
	1
);

/** Shortcode [dup_color_scheme_toggle]: knop die licht/donker wisselt (werkt met assets/js/color-scheme.js). */
add_shortcode(
	'dup_color_scheme_toggle',
	static function (): string {
		return '<button type="button" class="dup-button dup-button--subtle" data-dup-color-scheme-toggle aria-pressed="false">'
			. '<span data-label-light>' . esc_html__( 'Donkere modus', 'dup-pro-child' ) . '</span>'
			. '<span data-label-dark hidden>' . esc_html__( 'Lichte modus', 'dup-pro-child' ) . '</span>'
			. '</button>';
	}
);
