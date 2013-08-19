<?php
    require_once("DB.php");

    $dsn = array(
        'phptype'  => 'mysql',
        'username' => 'mapuser',
        'password' => 'map3298fjak20iq2303',
        'hostspec' => 'localhost',
        'database' => 'mapscrip',
    );

    $options = array(
        'persistent' => true
    );

    $db =& DB::connect($dsn, $options);
    if (DB::isError($db)) {
        die("Unable to connect to database.");
    }
    $db->setErrorHandling(PEAR_ERROR_DIE);
    // $db->query("SET NAMES 'utf-8'");
?>
