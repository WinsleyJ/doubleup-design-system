<?php
/**
 * WP-CLI: wp dup tokens <subcommand>
 *
 * @package dup-tokens-sync
 */

defined( 'ABSPATH' ) || exit;

/**
 * Beheert de Cornerstone-globals van het DoubleUP Design System.
 */
final class Dup_Tokens_CLI {

	/**
	 * Schrijft Global Colors en Global Variables uit globals.json (idempotent).
	 *
	 * ## OPTIONS
	 *
	 * [--file=<pad>]
	 * : Pad naar globals.json. Standaard: <actieve theme>/assets/cornerstone/globals.json
	 *
	 * [--dry-run]
	 * : Toon wat er zou veranderen, zonder te schrijven.
	 *
	 * ## EXAMPLES
	 *
	 *     wp dup tokens sync
	 *     wp dup tokens sync --dry-run
	 *
	 * @param array<int, string>    $args
	 * @param array<string, string> $assoc
	 */
	public function sync( array $args, array $assoc ): void {
		$file = $assoc['file'] ?? Dup_Globals::default_source();
		$dry  = isset( $assoc['dry-run'] );
		try {
			$source = Dup_Globals::load_source( $file );
		} catch ( RuntimeException $e ) {
			WP_CLI::error( $e->getMessage() );
		}

		// Global Colors
		$before = Dup_Globals::get_colors();
		$after  = Dup_Globals::merge( $before, $source['colors'], '_id', Dup_Globals::COLOR_PREFIX );
		$this->report( 'Global Colors', $before, $after, '_id' );
		if ( ! $dry && $before !== $after ) {
			Dup_Globals::set_colors( $after );
		}

		// Global Variables (Cornerstone 7.9+)
		if ( Dup_Globals::variables_supported() ) {
			$vbefore = Dup_Globals::get_variables();
			$vafter  = Dup_Globals::merge( $vbefore, $source['variables'], 'id', Dup_Globals::VAR_PREFIX );
			$this->report( 'Global Variables', $vbefore, $vafter, 'id' );
			if ( ! $dry && $vbefore !== $vafter ) {
				Dup_Globals::set_variables( $vafter );
			}
		} else {
			WP_CLI::warning( 'Global Variables niet beschikbaar (Cornerstone 7.9+ vereist); overgeslagen.' );
		}

		WP_CLI::success( $dry ? 'Dry run: er is niets geschreven.' : 'Cornerstone-globals gesynchroniseerd.' );
	}

	/**
	 * Toont de beheerde items zoals ze nu in Cornerstone staan.
	 *
	 * @param array<int, string>    $args
	 * @param array<string, string> $assoc
	 */
	public function status( array $args, array $assoc ): void {
		$colors = array_filter( Dup_Globals::get_colors(), static fn( $c ) => str_starts_with( (string) ( $c['_id'] ?? '' ), Dup_Globals::COLOR_PREFIX ) );
		$vars   = array_filter( Dup_Globals::get_variables(), static fn( $v ) => str_starts_with( (string) ( $v['id'] ?? '' ), Dup_Globals::VAR_PREFIX ) );
		WP_CLI::log( sprintf( 'Thema: %s · %d beheerde kleuren · %d beheerde variabelen', function_exists( 'dup_theme' ) ? dup_theme() : '(child theme niet actief)', count( $colors ), count( $vars ) ) );
		if ( $colors ) {
			WP_CLI\Utils\format_items( 'table', array_values( $colors ), array( '_id', 'title', 'value' ) );
		}
		if ( $vars ) {
			WP_CLI\Utils\format_items( 'table', array_values( $vars ), array( 'id', 'value' ) );
		}
	}

	/**
	 * @param array<int, array<string, mixed>> $before
	 * @param array<int, array<string, mixed>> $after
	 */
	private function report( string $label, array $before, array $after, string $key ): void {
		$index   = static fn( array $items ) => array_column( $items, null, $key );
		$b       = $index( $before );
		$a       = $index( $after );
		$added   = array_diff_key( $a, $b );
		$removed = array_diff_key( $b, $a );
		$changed = array_filter( array_intersect_key( $a, $b ), static fn( $item, $id ) => $item !== $b[ $id ], ARRAY_FILTER_USE_BOTH );
		WP_CLI::log( sprintf( '%s: %d nieuw, %d gewijzigd, %d verwijderd, %d totaal', $label, count( $added ), count( $changed ), count( $removed ), count( $after ) ) );
	}
}
