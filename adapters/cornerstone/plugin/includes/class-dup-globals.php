<?php
/**
 * Lezen en schrijven van Cornerstone-globals, volgens de theme.co-documentatie:
 * - Global Colors: wp_option `cornerstone_color_items` = wp_slash( json_encode( [ { title, value, _id } ] ) )
 *   (theme.co/docs/color-manager).
 * - Global Variables (Cornerstone 7.9+): stack-waarde `cs_theme_variables` = [ { id, value } ] via
 *   cs_stack_get_value() / cs_stack_set_value() (theme.co/docs/global-variables).
 *
 * Beheerd worden alleen items met een eigen prefix (kleuren `dup-`, variabelen `ds-`).
 * Items die redacteuren zelf toevoegen blijven ongemoeid.
 *
 * @package dup-tokens-sync
 */

defined( 'ABSPATH' ) || exit;

final class Dup_Globals {

	public const COLOR_OPTION   = 'cornerstone_color_items';
	public const VARIABLES_KEY  = 'cs_theme_variables';
	public const COLOR_PREFIX   = 'dup-';
	public const VAR_PREFIX     = 'ds-';

	/** Standaardlocatie van globals.json: in de actieve (child) theme. */
	public static function default_source(): string {
		return get_stylesheet_directory() . '/assets/cornerstone/globals.json';
	}

	/**
	 * @return array{colors: array<int, array{_id: string, title: string, value: string}>, variables: array<int, array{id: string, value: string}>}
	 */
	public static function load_source( string $file ): array {
		if ( ! is_readable( $file ) ) {
			throw new RuntimeException( "globals.json niet gevonden: {$file} (draai de build van adapters/cornerstone)" );
		}
		$data = json_decode( (string) file_get_contents( $file ), true );
		if ( ! is_array( $data ) || ! isset( $data['colors'], $data['variables'] ) ) {
			throw new RuntimeException( "Ongeldig globals.json: {$file}" );
		}
		foreach ( $data['colors'] as $c ) {
			if ( ! str_starts_with( (string) ( $c['_id'] ?? '' ), self::COLOR_PREFIX ) ) {
				throw new RuntimeException( 'Kleur zonder prefix ' . self::COLOR_PREFIX . ': ' . wp_json_encode( $c ) );
			}
		}
		foreach ( $data['variables'] as $v ) {
			if ( ! str_starts_with( (string) ( $v['id'] ?? '' ), self::VAR_PREFIX ) ) {
				throw new RuntimeException( 'Variabele zonder prefix ' . self::VAR_PREFIX . ': ' . wp_json_encode( $v ) );
			}
		}
		return $data;
	}

	/** @return array<int, array<string, mixed>> */
	public static function get_colors(): array {
		$raw   = get_option( self::COLOR_OPTION, '' );
		$items = is_string( $raw ) && '' !== $raw ? json_decode( $raw, true ) : ( is_array( $raw ) ? $raw : array() );
		return is_array( $items ) ? array_values( $items ) : array();
	}

	/** @param array<int, array<string, mixed>> $items */
	public static function set_colors( array $items ): void {
		update_option( self::COLOR_OPTION, wp_slash( wp_json_encode( array_values( $items ) ) ) );
	}

	public static function variables_supported(): bool {
		return function_exists( 'cs_stack_get_value' ) && function_exists( 'cs_stack_set_value' );
	}

	/** @return array<int, array<string, mixed>> */
	public static function get_variables(): array {
		if ( ! self::variables_supported() ) {
			return array();
		}
		$items = cs_stack_get_value( self::VARIABLES_KEY );
		return is_array( $items ) ? array_values( $items ) : array();
	}

	/** @param array<int, array<string, mixed>> $items */
	public static function set_variables( array $items ): void {
		cs_stack_set_value( self::VARIABLES_KEY, array_values( $items ) );
	}

	/**
	 * Voegt beheerde items samen met bestaande: eigen items (prefix) worden vervangen in de volgorde
	 * van de bron en vooraan gezet; overige items blijven in hun volgorde staan.
	 *
	 * @param array<int, array<string, mixed>> $existing
	 * @param array<int, array<string, mixed>> $managed
	 * @return array<int, array<string, mixed>>
	 */
	public static function merge( array $existing, array $managed, string $key, string $prefix ): array {
		$others = array_values(
			array_filter(
				$existing,
				static fn( $item ) => ! str_starts_with( (string) ( $item[ $key ] ?? '' ), $prefix )
			)
		);
		return array_merge( array_values( $managed ), $others );
	}
}
