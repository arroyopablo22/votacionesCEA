<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST");
header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);
echo $input;
$votanteId = $input['votante_id'];

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

    $sql = "INSERT INTO votos (votante_id) VALUES (:votante_id)";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':votante_id', $votanteId);
    $stmt->execute();

    echo json_encode(['mensaje' => '¡Voto registrado exitosamente!']);
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
