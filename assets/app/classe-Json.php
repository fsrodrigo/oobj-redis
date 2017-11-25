<?php

function lerJason($url){
    header("Content-Type: application/json");
    $json_file = file_get_contents($url);
    return $arrData = json_decode($json_file); // Transforma o seu JSON
}

function tratarJsonMensagens($arrayJson){
    $jsonTratado = "";
    foreach ($arrayJson as $indiceDoArray => $valorDoArray) {
        $cnpj = substr($indiceDoArray, -14);
        @$totalMenssagens += $valorDoArray;
        $jsonTratado .= "\"$cnpj\":{$valorDoArray},";
    }
    $jsonTratado = substr($jsonTratado, 0, -1) . "}";
    $jsonTratado = "{\"99999999999999\":$totalMenssagens," . $jsonTratado; 
    echo $jsonTratado;
}

function tratarJsonMemoria($arrayJson){
    //echo $arrayJson;
    $jsonTratado = "{";
    foreach ($arrayJson as $indiceDoArray => $valorDoArray) {
        if($indiceDoArray == "used_memory"){
            $jsonTratado .= "\"$indiceDoArray\":\"$valorDoArray\",";
        }
        if($indiceDoArray == "used_memory_peak"){
            $jsonTratado .= "\"maxi_memory\":\"$valorDoArray\",";
        }
    }
    $jsonTratado = substr($jsonTratado, 0, -1) . "}"; 
    echo $jsonTratado;
}


if ($_GET["url"]==1) {
    tratarJsonMensagens(lerJason("http://redis.oobj-dfe.com.br/recebePorCnpj"));
} else if ($_GET["url"]==2){
    tratarJsonMensagens(lerJason("http://redis.oobj-dfe.com.br/respostasPorCnpj"));
} 
else if ($_GET["url"]==3) {
   tratarJsonMemoria(lerJason("http://redis.oobj-dfe.com.br/memoriaDisponivel"));
} 


?>