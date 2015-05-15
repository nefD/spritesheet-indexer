var sheetElement = null,
    sheetImage = null,
    spriteElement = null,
    spriteRow = 0,
    spriteColumn = 0,
    spriteWidth = 16,
    spriteHeight = 16,
    sheetZoomFactor = 1.0,
    spriteZoomFactor = 2.0;


$(function() {
    $("#fileInput").change( function (e) {
        var files = e.target.files;
        if ( ! files || files.length == 0 ) return;
        var file = files[0];
        if ( ! file.type.match('image.*') ) return;
        var reader = new FileReader();
        reader.onload = function(theFile) {
            var container = $("<div></div>");
            sheetElement = $("<img>").attr( 'src', theFile.target.result );
            container.append( sheetElement );
            container.appendTo( $("div#spritesheetContainer") );
            sheetImage = new Image();
            sheetImage.src = theFile.target.result;
            setSheetZoomFactor();
            sheetElement.click( sheetClick );
        }
        if ( sheetElement ) sheetElement.remove();
        if ( spriteElement ) spriteElement.remove();
        reader.readAsDataURL(file);
    });

    $("button#zoomInSheet").click( function () {
        if ( sheetZoomFactor >= 10.00 ) return;
        sheetZoomFactor += 0.25;
        setSheetZoomFactor( sheetZoomFactor );
    });

    $("button#zoomOutSheet").click( function () {
        if ( sheetZoomFactor <= 0.25 ) return;
        sheetZoomFactor -= 0.25;
        setSheetZoomFactor( sheetZoomFactor );
    });

    $("button#zoomInSprite").click( function () {
        if ( spriteZoomFactor >= 10.00 ) return;
        spriteZoomFactor += 0.25;
        setSpriteZoomFactor( spriteZoomFactor );
    });

    $("button#zoomOutSprite").click( function () {
        if ( spriteZoomFactor <= 0.25 ) return;
        spriteZoomFactor -= 0.25;
        setSpriteZoomFactor( spriteZoomFactor );
    });

    $("#spriteWidth").change( function () {
        spriteWidth = $("#spriteWidth").val();
        clearSpriteElement();
    });

    $("#spriteHeight").change( function () {
        spriteHeight = $("#spriteHeight").val();
        clearSpriteElement();
    });

    setSheetZoomFactor( sheetZoomFactor );
    setSpriteZoomFactor( spriteZoomFactor );
});

function clearSpriteElement() {
    if ( spriteElement ) spriteElement.remove();
    $("#selectedX").text("-");
    $("#selectedY").text("-");
    $("#selectedColumn").text("-");
    $("#selectedRow").text("-");
    $("#selectedIndex").text("-");
}


function sheetClick( e ) {
    var clickX = Math.round( e.offsetX / sheetZoomFactor ),
        clickY = Math.round( e.offsetY / sheetZoomFactor),
        spriteWidth = $("#spriteWidth").val(),
        spriteHeight = $("#spriteHeight").val(),
        clickColumn = Math.floor( clickX / spriteWidth ),
        clickRow = Math.floor( clickY / spriteHeight ),
        index = clickColumn + ( clickRow * Math.ceil( sheetImage.width / spriteWidth ) );

    spriteColumn = clickColumn;
    spriteRow = clickRow;

    $("#selectedX").text( clickColumn * spriteWidth );
    $("#selectedY").text( clickRow * spriteHeight );
    $("#selectedColumn").text( clickColumn );
    $("#selectedRow").text( clickRow );
    $("#selectedIndex").text( index );

    if ( spriteElement ) spriteElement.remove();

    spriteElement = $("<div></div>");
    spriteElement.css({
        backgroundImage: "url(" + sheetImage.src + ")",
        width: spriteWidth + 'px',
        height: spriteHeight + 'px'
    });

    $("div#spriteContainer").append( spriteElement );
    setSpriteZoomFactor();
}

function setSheetZoomFactor( factor ) {
    if ( factor ) sheetZoomFactor = factor;
    var percent = sheetZoomFactor * 100;
    $("#sheetZoomFactor").text( percent + "%" );
    if ( ! sheetElement ) return;
    var newWidth = Math.round( sheetImage.width * sheetZoomFactor),
        newHeight = Math.round( sheetImage.height * sheetZoomFactor);
    sheetElement.css( { width: newWidth + "px", height: newHeight + "px" } );
}

function setSpriteZoomFactor( factor ) {
    if ( factor ) spriteZoomFactor = factor;
    var percent = spriteZoomFactor * 100;
    $("#spriteZoomFactor").text( percent + "%" );
    if ( ! spriteElement ) return;
    var newWidth = Math.round( spriteWidth * spriteZoomFactor),
        newHeight = Math.round( spriteHeight * spriteZoomFactor),
        newSheetWidth = Math.round( sheetImage.width * spriteZoomFactor),
        newSheetHeight = Math.round( sheetImage.height * spriteZoomFactor);
    var bgX = ((spriteColumn * spriteWidth) * spriteZoomFactor) * -1,
        bgY = ((spriteRow * spriteHeight) * spriteZoomFactor) * -1;
    spriteElement.css({
        width: newWidth + "px",
        height: newHeight + "px",
        backgroundSize: newSheetWidth + "px " + newSheetHeight + "px",
        backgroundPosition: bgX + "px " + bgY + "px"
    });
}