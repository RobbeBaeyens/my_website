var selectedFigure = "shelf";
var ghostEffect;
var imgScale = 3;

function SelectedFigureChange(value) {
    document.getElementById("figureSliderLabel").innerHTML = "Selected Figure: " + value;
    switch (value) {
        case "1":
            selectedFigure = "shelf"
            break;

        case "2":
            selectedFigure = "balloon"
            break;

        case "3":
            selectedFigure = "doughnut"
            break;

        case "4":
            selectedFigure = "chair"
            break;

        default:
            break;
    }
    console.log(selectedFigure);
}

function GhostSliderChange(value) {
    document.getElementById("ghostSliderLabel").innerHTML = "Ghost: " + value + "%";
    ghostEffect = value;
}

function ScaleSliderChange(value) {
    document.getElementById("scaleSliderLabel").innerHTML = "Scale: " + value/100;
    imgScale = value/100;
}
