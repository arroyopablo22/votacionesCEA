<?php
header("Content-Type: application/json");

echo json_encode([
    "mensaje" => "API del sistema de votaciones funcionando",
    "endpoints" => [
        "/api/cargar_estudiantes.php",
        "/api/votar.php"
    ]
]);
?>