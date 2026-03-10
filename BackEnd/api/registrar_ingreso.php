<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST");
header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);
echo $input;
$votanteId = $input['votante_id'];

$host = 'ep-patient-tree-aa8f8vne-pooler.westus3.azure.neon.tech';
$port = '5432';
$dbname = 'neondb';
$user = 'neondb_owner';
$password = 'npg_OeI8fA6aNsDg';

try {
    $pdo = new PDO("pgsql:host=$host;port=$port;dbname=$dbname;sslmode=require;options=endpoint=ep-patient-tree-aa8f8vne-pooler", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $sql = "INSERT INTO votos (votante_id) VALUES (:votante_id)";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':votante_id', $votanteId);
    $stmt->execute();

    echo json_encode(['mensaje' => '¡Voto registrado exitosamente!']);
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
