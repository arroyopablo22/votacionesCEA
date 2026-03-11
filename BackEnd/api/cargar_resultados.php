<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST");
header('Content-Type: application/json');

$env = parse_ini_file(__DIR__ . '/../.env');

$host = $env['DB_HOST'];
$port = $env['DB_PORT'];
$dbname = $env['DB_NAME'];
$user = $env['DB_USER'];
$password = $env['DB_PASSWORD'];
$endpoint = $env['DB_ENDPOINT'];


try {
    $pdo = new PDO("pgsql:host=$host;port=$port;dbname=$dbname;sslmode=require;options=endpoint=ep-patient-tree-aa8f8vne-pooler", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $sql = "SELECT candidatos.nombre, COUNT(votos.votante_id) AS total_votos FROM votos INNER JOIN candidatos ON votos.candidato_id = candidatos.id GROUP BY candidatos.id, candidatos.nombre ORDER BY total_votos DESC;";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();

    $candidatos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($candidatos);
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>