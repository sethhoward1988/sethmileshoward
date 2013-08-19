<?php
/**
 * The base configurations of the WordPress.
 *
 * This file has the following configurations: MySQL settings, Table Prefix,
 * Secret Keys, WordPress Language, and ABSPATH. You can find more information
 * by visiting {@link http://codex.wordpress.org/Editing_wp-config.php Editing
 * wp-config.php} Codex page. You can get the MySQL settings from your web host.
 *
 * This file is used by the wp-config.php creation script during the
 * installation. You don't have to use the web site, you can just copy this file
 * to "wp-config.php" and fill in the values.
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'mymaclab_wrd6');

/** MySQL database username */
define('DB_USER', 'mymaclab_wrd6');

/** MySQL database password */
define('DB_PASSWORD', 'v3Q3BIJoGd');

/** MySQL hostname */
define('DB_HOST', 'localhost');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         'upzZIIOTRSJRdmc7yCCaWMvxiecmvwRJLpUvBL5zAXpSlz2iVzgJtFWXhD6fsIwV');
define('SECURE_AUTH_KEY',  'ukIfgAmEkKuXOu7xE1THpvK6Jh87y5Z9UWGZXEVbuiPmDSJyrg6IeItfBSKt2pEy');
define('LOGGED_IN_KEY',    'VCX9EAmMlX47TdZI0Hoc4vmJtiCOGPCcTxJ5W6B4RVoCkkdapVWl9W3mMkhmFDPV');
define('NONCE_KEY',        '38DWLKD9uZIcAwTL23u1SLA88JQsVNUacxComSkF0CsHlZbl5Y4phxq0kFmzvzg9');
define('AUTH_SALT',        'XXDIJo78FI7knJP9Sk4D40waXhPNCJm7Uc40fJAE4yWRAxY26E0BPsIb5fjcrATh');
define('SECURE_AUTH_SALT', 'Z2tbxu5jActtxZsNeeP8Yntf5DWrmjMPMYXsSdr82g0p5EzgqE84M2DYTsuv3PqO');
define('LOGGED_IN_SALT',   'RJrxcw5Cs6Q5Q8y4n89xnYCk7OKV5CU4hXA6M7se1OFwgDILTKXVQoaVfXHqp8bh');
define('NONCE_SALT',       '27F2nsktV8p2hOm7BDzVysBy7r4sAePUVCZlhAKctbYzlP7xKalgImDWbYeWm8um');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each a unique
 * prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wp_';

/**
 * WordPress Localized Language, defaults to English.
 *
 * Change this to localize WordPress. A corresponding MO file for the chosen
 * language must be installed to wp-content/languages. For example, install
 * de_DE.mo to wp-content/languages and set WPLANG to 'de_DE' to enable German
 * language support.
 */
define('WPLANG', '');

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 */
define('WP_DEBUG', false);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
