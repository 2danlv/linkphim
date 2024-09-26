<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <style>
        h3.title{
            font-size:16px;
            margin-top: 10px;
        }
        .col-3 {
            padding: 0 12px;
            margin-bottom:20px;
        }
        img {
            max-width: 100%;
        }
    </style>
</head>
<body>
<div class="container">

    <?php 
    
    // Read the JSON file
$json = file_get_contents('http://fs.fshare.uk:5244/d/movies/DataMovies/ThuvienCine/thuviencine_movies_extract_full_new_convert.json'); 

// Check if the file was read successfully
if ($json === false) {
    die('Error reading the JSON file');
}




 
    
    // Decode the JSON data into a PHP array
$data = json_decode($json, true);
// Check if the JSON was decoded successfully
if ($json === null) {
    die('Error decoding the JSON file');
}

// Example: Accessing and printing some specific data
foreach ($data as $movie) {?>
<div class="row">
<div class="col-3">
<?php
    echo '<img src="' . $movie['info']['poster'] . '" alt="' . $movie['name'] . ' poster">';
    ?>
    </div>
    <div class="col-9">
    <?php
    echo '<h3 class="title">' . $movie['name'] . '</h3>';
    echo '<p>' . $movie['info']['plot'] . '</p>';
    
    foreach ($movie['seasons'] as $season) {
        echo '<h4>Season ' . $season['season'] . '</h4>';
        foreach ($season['episodes'] as $episode) {
            echo '<p>Episode ' . $episode['episode'] . ': <a href="' . $episode['video'] . '" target="_blank">' . $episode['name'] . '</a></p>';
        }
    }
    
    ?>
    </div>
    </div>
<?php }
?>
</div>
</body>
</html>