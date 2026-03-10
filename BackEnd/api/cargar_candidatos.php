<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST");
header('Content-Type: application/json');

$host = 'ep-patient-tree-aa8f8vne-pooler.westus3.azure.neon.tech';
$port = '5432';
$dbname = 'neondb';
$user = 'neondb_owner';
$password = 'npg_OeI8fA6aNsDg';

try {
    $dsn = "pgsql:host=$host;port=$port;dbname=$dbname;sslmode=require;options=endpoint=ep-patient-tree-aa8f8vne";
    $pdo = new PDO($dsn, $user, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $sql = "SELECT id, nombre, imagen_url FROM candidatos";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();

    $candidatos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($candidatos);
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>