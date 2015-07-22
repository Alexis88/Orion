<?php
$dato = $_REQUEST['valor'];
echo json_encode(['ans' => 'El valor enviado es ' . $dato]);
?>
