<?php
// Test van Dup_Globals::merge zonder WordPress: beheerde items vooraan, overige items ongemoeid.
define( 'ABSPATH', __DIR__ );
require __DIR__ . '/../plugin/includes/class-dup-globals.php';

$fail = 0;
$assert = function ( bool $ok, string $msg ) use ( &$fail ) {
	echo ( $ok ? '  ✔ ' : '  ✖ ' ) . $msg . PHP_EOL;
	if ( ! $ok ) { $fail++; }
};

$existing = array(
	array( '_id' => 'editor-red', 'title' => 'Rood (redacteur)', 'value' => '#f00' ),
	array( '_id' => 'dup-text', 'title' => 'Oud', 'value' => '#000' ),
	array( '_id' => 'dup-weg', 'title' => 'Vervallen', 'value' => '#111' ),
);
$managed = array(
	array( '_id' => 'dup-text', 'title' => 'Tekst', 'value' => 'var(--a)' ),
	array( '_id' => 'dup-bg', 'title' => 'Achtergrond', 'value' => 'var(--b)' ),
);
$out = Dup_Globals::merge( $existing, $managed, '_id', 'dup-' );
$assert( array_column( $out, '_id' ) === array( 'dup-text', 'dup-bg', 'editor-red' ), 'volgorde: beheerd eerst, daarna eigen items' );
$assert( $out[0]['value'] === 'var(--a)', 'beheerd item wordt bijgewerkt' );
$assert( ! in_array( 'dup-weg', array_column( $out, '_id' ), true ), 'vervallen beheerd item verdwijnt' );
$assert( $out[2] === $existing[0], 'item van redacteur blijft ongewijzigd' );
$again = Dup_Globals::merge( $out, $managed, '_id', 'dup-' );
$assert( $again === $out, 'idempotent: tweede keer geen wijziging' );

$vars = Dup_Globals::merge( array( array( 'id' => 'mijn-var', 'value' => '1px' ) ), array( array( 'id' => 'ds-space-md', 'value' => 'var(--x)' ) ), 'id', 'ds-' );
$assert( array_column( $vars, 'id' ) === array( 'ds-space-md', 'mijn-var' ), 'variabelen: zelfde regels' );

exit( $fail ? 1 : 0 );
