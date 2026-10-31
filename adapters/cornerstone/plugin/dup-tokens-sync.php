<?php
/**
 * Plugin Name:       DUP Tokens Sync
 * Description:       Synchroniseert het DoubleUP Design System naar Cornerstone: Global Colors en Global Variables (WP-CLI: wp dup tokens sync).
 * Version:           0.1.0
 * Requires PHP:      8.1
 * Requires at least: 6.5
 * Author:            DoubleUP
 * Text Domain:       dup-tokens-sync
 *
 * @package dup-tokens-sync
 */

defined( 'ABSPATH' ) || exit;

require_once __DIR__ . '/includes/class-dup-globals.php';

if ( defined( 'WP_CLI' ) && WP_CLI ) {
	require_once __DIR__ . '/includes/class-dup-cli.php';
	WP_CLI::add_command( 'dup tokens', 'Dup_Tokens_CLI' );
}
