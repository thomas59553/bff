<?php

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "bff";

// Créer une connexion
$conn = new mysqli($servername, $username, $password, $dbname);

// Vérifier la connexion
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT dc.*, c.hauteur AS HauteurCarton 
FROM detail_conditionnement dc
LEFT JOIN cartons c ON dc.`Modèle Carton` = c.reference
WHERE dc.`nom produit` IS NOT NULL";
$result = $conn->query($sql);

if (!$result) {
    die("Query failed: " . $conn->error);
}

$products = array();
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        if ($row['Composition']) {
            $row['Composition'] = json_decode($row['Composition'], true); // Décoder le champ Composition
        }
        if ($row['Gallerie']) {
            $row['Gallerie'] = json_decode($row['Gallerie'], true); // Décoder le champ Gallerie
        }
        if ($row['Palettisation']) {
            $palettisation = json_decode($row['Palettisation'], true); // Décoder le champ Palettisation
            // Renommer les clés L, l et H
            if (isset($palettisation['L'])) {
                $palettisation['Longueur'] = $palettisation['L'];
                unset($palettisation['L']);
            }
            if (isset($palettisation['l'])) {
                $palettisation['Largeur'] = $palettisation['l'];
                unset($palettisation['l']);
            }
            if (isset($palettisation['H'])) {
                $palettisation['Hauteur Max'] = $palettisation['H'];
                unset($palettisation['H']);
            }
            $row['Palettisation'] = $palettisation; // Réassigner le champ Palettisation
        }
        $products[] = $row;
    }
} else {
    echo json_encode(array("message" => "No products found"));
    exit;
}

$conn->close();

header('Content-Type: application/json');
echo json_encode($products);
?>
