<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST");
header('Content-Type: application/json');
$grado = $_GET['grado'];

$host = 'ep-patient-tree-aa8f8vne-pooler.westus3.azure.neon.tech';
$port = '5432';
$dbname = 'neondb';
$user = 'neondb_owner';
$password = 'npg_OeI8fA6aNsDg';

try {
    $pdo = new PDO("pgsql:host=$host;port=$port;dbname=$dbname;sslmode=require;options=endpoint=ep-patient-tree-aa8f8vne-pooler", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $sql = "SELECT id, nombre FROM votantes WHERE activo = true AND grado = :grado";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':grado', $grado);
    $stmt->execute();

    $estudiantes = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($estudiantes);
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
