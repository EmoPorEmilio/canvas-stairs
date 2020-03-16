
StairConstants = {}

StairConstants.DEFAULT_FONT = "Arial";
StairConstants.DEFAULT_BACKGROUND_COLOR = "#ffffff";

//TREADS
StairConstants.TREAD_MIN_HEIGHT_PXS = 30;
StairConstants.TREAD_MAX_HEIGHT_PXS = 40;
StairConstants.DEFAULT_TREAD_FILL_COLOR = '#e0d9c9';
StairConstants.DEFAULT_TREAD_STROKE_COLOR = '#5e5a56';
StairConstants.DEFAULT_TREAD_TEXT_COLOR = '#641616';
StairConstants.FEATURE_TREAD_HEIGHT = 6/5; //Rest step height is equals to regular step height multiplied by this constant
StairConstants.FEATURE_TREAD_WIDTH = 6/5; //Rest step width is equals to regular step width multiplied by this constant

//POSTS
StairConstants.POSTS_SIZE = 20;
StairConstants.DEFAULT_POST_FILL_COLOR = '#caba7e';
StairConstants.DEFAULT_POST_STROKE_COLOR = '#5e5a56';
StairConstants.DEFAULT_POST_TEXT_COLOR = '#837038';

//BALLUSTRADES
StairConstants.BALUSTRADE_WIDTH = 10;
StairConstants.DEFAULT_BALLUSTRADE_PRIMARY_FILL_COLOR = '#caba7e';
StairConstants.DEFAULT_BALLUSTRADE_SECONDARY_FILL_COLOR = '#b39f79';
StairConstants.DEFAULT_BALLUSTRADE_STROKE_COLOR = '#5e5a56';

//CANVAS
//REGULAR
StairConstants.PROPORTION_MIN_WIDTH_TO_CANVAS_WIDTH = 0.3;
StairConstants.PROPORTION_MAX_WIDTH_TO_CANVAS_WIDTH = 0.5;

//QUARTERTURN
StairConstants.PROPORTION_QUARTERTURN_MIN_WIDTH_TO_CANVAS_WIDTH = 1;
StairConstants.PROPORTION_QUARTERTURN_FLIGHT1_MIN_WIDTH_TO_CANVAS_WIDTH = 0.25;
StairConstants.PROPORTION_QUARTERTURN_FLIGHT1_MAX_WIDTH_TO_CANVAS_WIDTH = 0.35;

// HALFTURN
StairConstants.PROPORTION_HALFTURN_MIN_WIDTH_TO_CANVAS_WIDTH = 1;

//MEASURES
StairConstants.BOTTOM_MEASURE_TAG_HEIGHT = 60;
StairConstants.TOP_MEASURE_TAG_START_Y = 0;
StairConstants.DOUBLETURN_TOP_MEASURE_HEIGHT = 20;
StairConstants.SIDE_MEASURE_TAG_WIDTH = 60;

Stairs = {}

Stairs.StairTypeEnum = {
    REGULAR: 'regular',
    QUARTERTURN: 'quarterturn', 
    HALFTURN: 'halfturn',
    DOUBLETURN: 'doubleturn'
};

Stairs.options = {}
Stairs.options.treads = {}

Stairs.debug = {}

Stairs.init = function(canvas,config){
    Stairs.loadOptions(canvas,config);
    Stairs.draw(canvas);
}

Stairs.dataEnum = {
    MISSING_DATA : 0,
    NON_FUNCTIONAL_DATA : 1,
    FUNCTIONAL_DATA : 2
}

Stairs.loadOptions = function (canvas,config){
    switch(Stairs.checkConfig(config)){
        case Stairs.dataEnum.MISSING_DATA: 
            console.log("Missing Data");
           break;
        case Stairs.dataEnum.NON_FUNCTIONAL_DATA: 
            console.log("Not correct data.");
            break;
        case Stairs.dataEnum.FUNCTIONAL_DATA: 
            Stairs.setOptions(config,canvas);
            break;
    }
}

Stairs.checkConfig = function(config){   
    //Checks if every required attribute was provided
    if(config && config.minHeight && config.maxHeight && config.minWidth && config.maxWidth){
        return Stairs.dataEnum.FUNCTIONAL_DATA;
    }
    else{
        return Stairs.dataEnum.MISSING_DATA;
    }
}

Stairs.setOptions = function(config){
    Stairs.config = config;

    Stairs.canvas = canvas;

    Stairs.options.type = config.type;

    switch(Stairs.options.type){
        case Stairs.StairTypeEnum.REGULAR: 
            Stairs.setRegularStairsOptions(config);
            break;
        case Stairs.StairTypeEnum.QUARTERTURN: 
            Stairs.setQuarterturnStairsOptions(config);
            break;
        case Stairs.StairTypeEnum.HALFTURN: 
            Stairs.setHalfturnStairsOptions(config);
            break;
        case Stairs.StairTypeEnum.DOUBLETURN: 
            Stairs.setDoubleturnStairsOptions(config);
            break;
    }

    Stairs.options.backgroundColor = config.backgroundColor || StairConstants.DEFAULT_BACKGROUND_COLOR;
    Stairs.options.font = config.font || StairConstants.DEFAULT_FONT;

    //Feature tread
    Stairs.options.featureTread = {};
    if(config.featureTread){
        Stairs.options.featureTread.left = parseInt(config.featureTread.left);
        Stairs.options.featureTread.right = parseInt(config.featureTread.right);
    }
    Stairs.featureTreadEnabled = false;
    Stairs.doubleFeatureTreadEnabled = false;

    if(Stairs.options.featureTread.left || Stairs.options.featureTread.right){
        Stairs.featureTreadEnabled = true;
        if(Stairs.options.featureTread.left >= 3 || Stairs.options.featureTread.right >= 3){
            Stairs.doubleFeatureTreadEnabled = true;
        }
    }

    Stairs.centerX = Stairs.canvas.width / 2;
}

Stairs.setRegularStairsOptions = function(config){
    // mms of the stairs (for printing purposes)
    Stairs.printMMWidth = parseInt(config.treads.width);
    Stairs.printMMHeight = parseInt(config.treads.height * Math.max((config.treads.amount - 1), 0));
    
    Stairs.options.treads.amount = parseInt(config.treads.amount);

    Stairs.minWidthPx = parseInt(Stairs.canvas.width * StairConstants.PROPORTION_MIN_WIDTH_TO_CANVAS_WIDTH);
    Stairs.maxWidthPx = parseInt(Stairs.canvas.width * StairConstants.PROPORTION_MAX_WIDTH_TO_CANVAS_WIDTH);

    //Treads
    Stairs.options.treads.width = Stairs.linearConversion(parseInt(config.treads.width), parseInt(config.minWidth), parseInt(config.maxWidth) * StairConstants.FEATURE_TREAD_WIDTH, Stairs.minWidthPx, Stairs.maxWidthPx);
    Stairs.options.treads.height = Stairs.linearConversion(parseInt(config.treads.height), parseInt(config.minHeight), parseInt(config.maxHeight), StairConstants.TREAD_MIN_HEIGHT_PXS, StairConstants.TREAD_MAX_HEIGHT_PXS);

    Stairs.options.treads.fillColor = config.treads.fillColor || StairConstants.DEFAULT_TREAD_FILL_COLOR;
    Stairs.options.treads.strokeColor = config.treads.strokeColor || StairConstants.DEFAULT_TREAD_STROKE_COLOR;
    Stairs.options.treads.textColor = config.treads.textColor || StairConstants.DEFAULT_TREAD_TEXT_COLOR;

    //Posts
    Stairs.options.posts = {};
    if(config.posts){
        Stairs.options.posts.topLeft = (config.posts.topLeft=="true" || config.posts.topLeft === true)? true : false;
        Stairs.options.posts.topRight = (config.posts.topRight=="true" || config.posts.topRight === true)? true : false;
        Stairs.options.posts.bottomLeft = (config.posts.bottomLeft=="true" || config.posts.bottomLeft === true)? true : false;
        Stairs.options.posts.bottomRight = (config.posts.bottomRight=="true" || config.posts.bottomRight === true)? true : false;
        Stairs.options.posts.fillColor = config.posts.fillColor || StairConstants.DEFAULT_POST_FILL_COLOR;
        Stairs.options.posts.strokeColor = config.posts.strokeColor || StairConstants.DEFAULT_POST_STROKE_COLOR;
        Stairs.options.posts.textColor = config.posts.textColor || StairConstants.DEFAULT_POST_TEXT_COLOR;
    }

    //Ballustrades
    Stairs.options.ballustrades = {};
    if(config.ballustrades){
        Stairs.options.ballustrades.left = (config.ballustrades.left=="true" || config.ballustrades.left === true)? true : false;
        Stairs.options.ballustrades.right = (config.ballustrades.right=="true" || config.ballustrades.right === true)? true : false;
        Stairs.options.ballustrades.primaryFillColor = config.ballustrades.primaryFillColor || StairConstants.DEFAULT_BALLUSTRADE_PRIMARY_FILL_COLOR;
        Stairs.options.ballustrades.secondaryFillColor = config.ballustrades.secondaryFillColor || StairConstants.DEFAULT_BALLUSTRADE_SECONDARY_FILL_COLOR;
        Stairs.options.ballustrades.strokeColor = config.ballustrades.strokeColor || StairConstants.DEFAULT_BALLUSTRADE_STROKE_COLOR;
    }
    //Canvas height should fit number of treads. Feature tread is StairConstants.FEATURE_TREAD_HEIGHT bigger than regular tread
    Stairs.maxHeight = (Stairs.options.treads.height * (Stairs.options.treads.amount - 1)) + Stairs.options.treads.height * StairConstants.FEATURE_TREAD_HEIGHT;
    Stairs.canvas.height = Stairs.maxHeight + StairConstants.POSTS_SIZE + 1 + StairConstants.BOTTOM_MEASURE_TAG_HEIGHT;
}


Stairs.setQuarterturnStairsOptions = function(config){

    // left or right
    Stairs.options.direction = config.direction;

    // range for the complete stairs drawing
    Stairs.minWidthPx = Stairs.canvas.width * StairConstants.PROPORTION_QUARTERTURN_MIN_WIDTH_TO_CANVAS_WIDTH - StairConstants.SIDE_MEASURE_TAG_WIDTH;
    Stairs.maxWidthPx = Stairs.canvas.width - StairConstants.SIDE_MEASURE_TAG_WIDTH;

    // width height in MM, for printing purposes.
    Stairs.printMMWidth = parseInt(config.flight1Treads.width) + parseInt(config.treadHeight) * parseInt(Math.max(config.flight2Treads.amount - 1, 0));
    Stairs.printMMHeight = parseInt(config.treadHeight) * parseInt(config.flight1Treads.amount) + parseInt(config.flight2Treads.width);

    // max-min width of the first flight (vertical)
    var minWidthFlight1 = StairConstants.PROPORTION_QUARTERTURN_FLIGHT1_MIN_WIDTH_TO_CANVAS_WIDTH * (Stairs.canvas.width - StairConstants.SIDE_MEASURE_TAG_WIDTH);
    var maxWidthFlight1 = StairConstants.PROPORTION_QUARTERTURN_FLIGHT1_MAX_WIDTH_TO_CANVAS_WIDTH * (Stairs.canvas.width - StairConstants.SIDE_MEASURE_TAG_WIDTH);

    // thread options for each flight
    Stairs.options.flight1Treads = {};
    Stairs.options.flight2Treads = {};

    // width of the flight in px
    Stairs.options.flight1Treads.amount = parseInt(config.flight1Treads.amount);
    Stairs.options.flight1Treads.width = Stairs.linearConversion(parseInt(config.flight1Treads.width), parseInt(config.minWidth), parseInt(config.maxWidth) * StairConstants.FEATURE_TREAD_WIDTH, minWidthFlight1, maxWidthFlight1);

    // stairs height is constrained by the second flight count (because horizontal space is fixed)
    minTreadHeight = (Stairs.minWidthPx - Stairs.options.flight1Treads.width) / (config.flight2Treads.maxAmount);
    maxTreadHeight = (Stairs.maxWidthPx - Stairs.options.flight1Treads.width) / (config.flight2Treads.maxAmount);
   
    // interpolate treadHeight
    Stairs.options.treadHeight = Math.min(StairConstants.TREAD_MAX_HEIGHT_PXS, Stairs.linearConversion(parseInt(config.treadHeight), parseInt(config.minHeight), parseInt(config.maxHeight), minTreadHeight, maxTreadHeight));

    Stairs.options.flight1Treads.fillColor = config.flight1Treads.fillColor || StairConstants.DEFAULT_TREAD_FILL_COLOR;
    Stairs.options.flight1Treads.strokeColor = config.flight1Treads.strokeColor || StairConstants.DEFAULT_TREAD_STROKE_COLOR;
    Stairs.options.flight1Treads.textColor = config.flight1Treads.textColor || StairConstants.DEFAULT_TREAD_TEXT_COLOR;

    // flight 2 width and height
    Stairs.options.flight2Treads.amount = parseInt(config.flight2Treads.amount);
    Stairs.options.flight2Treads.width = Stairs.linearConversion(parseInt(config.flight2Treads.width), parseInt(config.minWidth), parseInt(config.maxWidth) * StairConstants.FEATURE_TREAD_WIDTH, minWidthFlight1, maxWidthFlight1);

    Stairs.options.flight2Treads.fillColor = config.flight1Treads.fillColor || StairConstants.DEFAULT_TREAD_FILL_COLOR;
    Stairs.options.flight2Treads.strokeColor = config.flight1Treads.strokeColor || StairConstants.DEFAULT_TREAD_STROKE_COLOR;
    Stairs.options.flight2Treads.textColor = config.flight1Treads.textColor || StairConstants.DEFAULT_TREAD_TEXT_COLOR;

    Stairs.options.turnTreadsAmount = parseInt(config.turnTreadsAmount);

    // width of the stair
    Stairs.widthPx = Stairs.options.flight1Treads.width + Stairs.options.treadHeight * Stairs.options.flight2Treads.amount + StairConstants.SIDE_MEASURE_TAG_WIDTH;

    // set posts configuration
    Stairs.options.posts = {};
    if (config.posts){
        Stairs.options.posts.turnTopLeft = (config.posts.turnTopLeft=="true" || config.posts.turnTopLeft === true)? true : false;
        Stairs.options.posts.turnTopRight = (config.posts.turnTopRight=="true" || config.posts.turnTopRight === true)? true : false;
        Stairs.options.posts.turnBottom = (config.posts.turnBottom=="true" || config.posts.turnBottom === true)? true : false;
        Stairs.options.posts.flight1BottomLeft = (config.posts.flight1BottomLeft=="true" || config.posts.flight1BottomLeft === true)? true : false;
        Stairs.options.posts.flight1BottomRight = (config.posts.flight1BottomRight=="true" || config.posts.flight1BottomRight === true)? true : false;
        Stairs.options.posts.flight2Top = (config.posts.flight2Top=="true" || config.posts.flight2Top === true)? true : false;
        Stairs.options.posts.flight2Bottom = (config.posts.flight2Bottom=="true" || config.posts.flight2Bottom === true)? true : false;
        Stairs.options.posts.fillColor = config.posts.fillColor || StairConstants.DEFAULT_POST_FILL_COLOR;
        Stairs.options.posts.strokeColor = config.posts.strokeColor || StairConstants.DEFAULT_POST_STROKE_COLOR;
        Stairs.options.posts.textColor = config.posts.textColor || StairConstants.DEFAULT_POST_TEXT_COLOR;
    }

    // ballustrades configuration
    Stairs.options.ballustrades = {};
    if(config.ballustrades){
        Stairs.options.ballustrades.flight1Outside = (config.ballustrades.flight1Outside=="true" || config.ballustrades.flight1Outside === true)? true : false;
        Stairs.options.ballustrades.flight1Inside = (config.ballustrades.flight1Inside=="true" || config.ballustrades.flight1Inside === true)? true : false;
        Stairs.options.ballustrades.flight2Outside = (config.ballustrades.flight2Outside=="true" || config.ballustrades.flight2Outside === true)? true : false;
        Stairs.options.ballustrades.flight2Inside = (config.ballustrades.flight2Inside=="true" || config.ballustrades.flight2Inside === true)? true : false;
        Stairs.options.ballustrades.turnTop = (config.ballustrades.turnTop=="true" || config.ballustrades.turnTop === true)? true : false;
        Stairs.options.ballustrades.turnSide = (config.ballustrades.turnSide=="true" || config.ballustrades.turnSide === true)? true : false;
        Stairs.options.ballustrades.primaryFillColor = config.ballustrades.primaryFillColor || StairConstants.DEFAULT_BALLUSTRADE_PRIMARY_FILL_COLOR;
        Stairs.options.ballustrades.secondaryFillColor = config.ballustrades.secondaryFillColor || StairConstants.DEFAULT_BALLUSTRADE_SECONDARY_FILL_COLOR;
        Stairs.options.ballustrades.strokeColor = config.ballustrades.strokeColor || StairConstants.DEFAULT_BALLUSTRADE_STROKE_COLOR;
    }

    //Canvas height should fit number of treads. Feature tread is StairConstants.FEATURE_TREAD_HEIGHT bigger than regular tread
    Stairs.maxHeight = (Stairs.options.treadHeight * (Stairs.options.flight1Treads.amount)) + Stairs.options.treadHeight * StairConstants.FEATURE_TREAD_HEIGHT + Stairs.options.flight2Treads.width;
    Stairs.canvas.height = Stairs.maxHeight + StairConstants.POSTS_SIZE + 1 + StairConstants.BOTTOM_MEASURE_TAG_HEIGHT;
}

Stairs.setHalfturnStairsOptions = function(config){

    Stairs.options.direction = config.direction;

    // maximum and minimum values for the complete stairs 
    Stairs.minWidthPx = Stairs.canvas.width * StairConstants.PROPORTION_HALFTURN_MIN_WIDTH_TO_CANVAS_WIDTH - StairConstants.SIDE_MEASURE_TAG_WIDTH * 2;
    Stairs.maxWidthPx = Stairs.canvas.width - StairConstants.SIDE_MEASURE_TAG_WIDTH * 2;

    // width-height in MM, for printing purposes.
    Stairs.printMMWidth = parseInt(config.flight1Treads.width) + parseInt(config.treadHeight) * parseInt(config.flight2Treads.amount) + parseInt(config.flight3Treads.width);
    Stairs.printMMHeight1 = parseInt(config.treadHeight) * parseInt(config.flight1Treads.amount) + parseInt(config.flight2Treads.width);
    Stairs.printMMHeight2 = parseInt(config.treadHeight) * parseInt(config.flight3Treads.amount) + parseInt(config.flight2Treads.width);
    
    // treads
    var minWidthFlight1 = StairConstants.PROPORTION_QUARTERTURN_FLIGHT1_MIN_WIDTH_TO_CANVAS_WIDTH * (Stairs.canvas.width - StairConstants.SIDE_MEASURE_TAG_WIDTH * 2);
    var maxWidthFlight1 = StairConstants.PROPORTION_QUARTERTURN_FLIGHT1_MAX_WIDTH_TO_CANVAS_WIDTH * (Stairs.canvas.width - StairConstants.SIDE_MEASURE_TAG_WIDTH * 2);

    Stairs.options.flight1Treads = {};
    Stairs.options.flight2Treads = {};
    Stairs.options.flight3Treads = {};

    // vertical flights configuration
    Stairs.options.flight1Treads.amount = parseInt(config.flight1Treads.amount);
    Stairs.options.flight1Treads.width = Stairs.linearConversion(parseInt(config.flight1Treads.width), parseInt(config.minWidth), parseInt(config.maxWidth) * StairConstants.FEATURE_TREAD_WIDTH, minWidthFlight1, maxWidthFlight1);
    Stairs.options.flight3Treads.width = Stairs.linearConversion(parseInt(config.flight3Treads.width), parseInt(config.minWidth), parseInt(config.maxWidth) * StairConstants.FEATURE_TREAD_WIDTH, minWidthFlight1, maxWidthFlight1);

    // maximum and minimum tread height
    //minTreadHeight = Math.min((Stairs.minWidthPx - Stairs.options.flight1Treads.width - Stairs.options.flight3Treads.width) / (config.flight2Treads.maxAmount), Stairs.options.flight1Treads.width * StairConstants.QUARTERTURN_TREAD_MIN_HEIGHT_RATIO_PXS);
    //maxTreadHeight = Math.min((Stairs.maxWidthPx - Stairs.options.flight1Treads.width - Stairs.options.flight3Treads.width) / (config.flight2Treads.maxAmount), Stairs.options.flight1Treads.width * StairConstants.QUARTERTURN_TREAD_MAX_HEIGHT_RATIO_PXS);
    minTreadHeight = (Stairs.minWidthPx - Stairs.options.flight1Treads.width - Stairs.options.flight3Treads.width) / (config.flight2Treads.maxAmount);
    maxTreadHeight = (Stairs.maxWidthPx - Stairs.options.flight1Treads.width - Stairs.options.flight3Treads.width) / (config.flight2Treads.maxAmount);

    // interpolate treadHeight
    Stairs.options.treadHeight = Math.min(StairConstants.TREAD_MAX_HEIGHT_PXS, Stairs.linearConversion(parseInt(config.treadHeight), parseInt(config.minHeight), parseInt(config.maxHeight), minTreadHeight, maxTreadHeight));

    Stairs.options.flight1Treads.fillColor = config.flight1Treads.fillColor || StairConstants.DEFAULT_TREAD_FILL_COLOR;
    Stairs.options.flight1Treads.strokeColor = config.flight1Treads.strokeColor || StairConstants.DEFAULT_TREAD_STROKE_COLOR;
    Stairs.options.flight1Treads.textColor = config.flight1Treads.textColor || StairConstants.DEFAULT_TREAD_TEXT_COLOR;

    Stairs.options.flight2Treads.amount = parseInt(config.flight2Treads.amount);
    Stairs.options.flight2Treads.width = Stairs.linearConversion(parseInt(config.flight2Treads.width), parseInt(config.minWidth), parseInt(config.maxWidth) * StairConstants.FEATURE_TREAD_WIDTH, minWidthFlight1, maxWidthFlight1);

    Stairs.options.flight2Treads.fillColor = config.flight1Treads.fillColor || StairConstants.DEFAULT_TREAD_FILL_COLOR;
    Stairs.options.flight2Treads.strokeColor = config.flight1Treads.strokeColor || StairConstants.DEFAULT_TREAD_STROKE_COLOR;
    Stairs.options.flight2Treads.textColor = config.flight1Treads.textColor || StairConstants.DEFAULT_TREAD_TEXT_COLOR;

    Stairs.options.flight3Treads.amount = parseInt(config.flight3Treads.amount);

    Stairs.options.flight3Treads.fillColor = config.flight3Treads.fillColor || StairConstants.DEFAULT_TREAD_FILL_COLOR;
    Stairs.options.flight3Treads.strokeColor = config.flight3Treads.strokeColor || StairConstants.DEFAULT_TREAD_STROKE_COLOR;
    Stairs.options.flight3Treads.textColor = config.flight3Treads.textColor || StairConstants.DEFAULT_TREAD_TEXT_COLOR;

    Stairs.options.turn1TreadsAmount = parseInt(config.turn1TreadsAmount);
    Stairs.options.turn2TreadsAmount = parseInt(config.turn2TreadsAmount);

    // width in pixels of the complete stairs
    Stairs.widthPx = Stairs.options.flight1Treads.width + Stairs.options.flight3Treads.width + Stairs.options.treadHeight * Stairs.options.flight2Treads.amount + StairConstants.SIDE_MEASURE_TAG_WIDTH * 2;

    //Posts
    Stairs.options.posts = {};
    if (config.posts){
        Stairs.options.posts.turn1TopLeft = (config.posts.turn1TopLeft=="true" || config.posts.turn1TopLeft === true)? true : false;
        Stairs.options.posts.turn1TopRight = (config.posts.turn1TopRight=="true" || config.posts.turn1TopRight === true)? true : false;
        Stairs.options.posts.turn1Bottom = (config.posts.turn1Bottom=="true" || config.posts.turn1Bottom === true)? true : false;
        Stairs.options.posts.turn2TopLeft = (config.posts.turn2TopLeft=="true" || config.posts.turn2TopLeft === true)? true : false;
        Stairs.options.posts.turn2TopRight = (config.posts.turn2TopRight=="true" || config.posts.turn2TopRight === true)? true : false;
        Stairs.options.posts.turn2Bottom = (config.posts.turn2Bottom=="true" || config.posts.turn2Bottom === true)? true : false;
        Stairs.options.posts.flight1BottomLeft = (config.posts.flight1BottomLeft=="true" || config.posts.flight1BottomLeft === true)? true : false;
        Stairs.options.posts.flight1BottomRight = (config.posts.flight1BottomRight=="true" || config.posts.flight1BottomRight === true)? true : false;
        Stairs.options.posts.flight3Left = (config.posts.flight3Left=="true" || config.posts.flight3Left === true)? true : false;
        Stairs.options.posts.flight3Right = (config.posts.flight3Right=="true" || config.posts.flight3Right === true)? true : false;
        Stairs.options.posts.fillColor = config.posts.fillColor || StairConstants.DEFAULT_POST_FILL_COLOR;
        Stairs.options.posts.strokeColor = config.posts.strokeColor || StairConstants.DEFAULT_POST_STROKE_COLOR;
        Stairs.options.posts.textColor = config.posts.textColor || StairConstants.DEFAULT_POST_TEXT_COLOR;
    }

    //Ballustrades
    Stairs.options.ballustrades = {};
    if(config.ballustrades){
        Stairs.options.ballustrades.flight1Outside = (config.ballustrades.flight1Outside=="true" || config.ballustrades.flight1Outside === true)? true : false;
        Stairs.options.ballustrades.flight1Inside = (config.ballustrades.flight1Inside=="true" || config.ballustrades.flight1Inside === true)? true : false;
        Stairs.options.ballustrades.flight2Outside = (config.ballustrades.flight2Outside=="true" || config.ballustrades.flight2Outside === true)? true : false;
        Stairs.options.ballustrades.flight2Inside = (config.ballustrades.flight2Inside=="true" || config.ballustrades.flight2Inside === true)? true : false;
        Stairs.options.ballustrades.flight3Outside = (config.ballustrades.flight3Outside=="true" || config.ballustrades.flight3Outside === true)? true : false;
        Stairs.options.ballustrades.flight3Inside = (config.ballustrades.flight3Inside=="true" || config.ballustrades.flight3Inside === true)? true : false;
        Stairs.options.ballustrades.turn1Top = (config.ballustrades.turn1Top=="true" || config.ballustrades.turn1Top === true)? true : false;
        Stairs.options.ballustrades.turn1Side = (config.ballustrades.turn1Side=="true" || config.ballustrades.turn1Side === true)? true : false;
        Stairs.options.ballustrades.turn2Top = (config.ballustrades.turn2Top=="true" || config.ballustrades.turn2Top === true)? true : false;
        Stairs.options.ballustrades.turn2Side = (config.ballustrades.turn2Side=="true" || config.ballustrades.turn2Side === true)? true : false;
        Stairs.options.ballustrades.primaryFillColor = config.ballustrades.primaryFillColor || StairConstants.DEFAULT_BALLUSTRADE_PRIMARY_FILL_COLOR;
        Stairs.options.ballustrades.secondaryFillColor = config.ballustrades.secondaryFillColor || StairConstants.DEFAULT_BALLUSTRADE_SECONDARY_FILL_COLOR;
        Stairs.options.ballustrades.strokeColor = config.ballustrades.strokeColor || StairConstants.DEFAULT_BALLUSTRADE_STROKE_COLOR;
    }
    //Canvas height should fit number of treads. Feature tread is StairConstants.FEATURE_TREAD_HEIGHT bigger than regular tread
    Stairs.maxHeight = Stairs.options.treadHeight * Math.max(Stairs.options.flight1Treads.amount,Stairs.options.flight3Treads.amount) + Stairs.options.treadHeight * StairConstants.FEATURE_TREAD_HEIGHT + Stairs.options.flight2Treads.width;
    Stairs.maxHeight1 = Stairs.options.treadHeight * (Stairs.options.flight1Treads.amount) + Stairs.options.treadHeight * StairConstants.FEATURE_TREAD_HEIGHT + Stairs.options.flight2Treads.width;
    Stairs.maxHeight2 = Stairs.options.treadHeight * (Stairs.options.flight3Treads.amount + 1) + Stairs.options.flight2Treads.width;
    Stairs.canvas.height = Stairs.maxHeight + StairConstants.POSTS_SIZE + 1 + StairConstants.BOTTOM_MEASURE_TAG_HEIGHT ;

    if(Stairs.options.flight2Treads.amount == 0 ){
        if(Stairs.options.turn1TreadsAmount == 1 && Stairs.options.turn2TreadsAmount == 1){
            Stairs.fuseTurns = true;   //if those conditions are met, there should only be one fused turn
        }
        if(Stairs.options.ballustrades.flight1Inside || Stairs.options.ballustrades.flight3Inside){
            if(Stairs.options.flight1Treads.amount > Stairs.options.flight3Treads.amount){
                Stairs.options.ballustrades.flight3Inside = false;
            }
            else{
                Stairs.options.ballustrades.flight1Inside = false;
            }
            //without this, the ballustrades are drawn twice, overlapping
        }
    }
}

Stairs.setDoubleturnStairsOptions = function(config){
    // range for the complete stairs drawing

    Stairs.minWidthPx = Stairs.canvas.width * StairConstants.PROPORTION_QUARTERTURN_MIN_WIDTH_TO_CANVAS_WIDTH - StairConstants.SIDE_MEASURE_TAG_WIDTH;
    Stairs.maxWidthPx = Stairs.canvas.width - StairConstants.SIDE_MEASURE_TAG_WIDTH;

    // width height in MM, for printing purposes.
    Stairs.printMMWidth = parseInt(config.flight1Treads.width) + parseInt(config.treadHeight) * (parseInt(config.flight2Treads.left.amount) + parseInt(config.flight2Treads.right.amount));
    Stairs.printMMHeight = parseInt(config.treadHeight) * parseInt(config.flight1Treads.amount) + parseInt(config.flight2Treads.width);
    Stairs.printMMWidthFlight1 = parseInt(config.flight1Treads.width);

    // max-min width of the first flight (vertical)
    var minWidthFlight1 = StairConstants.PROPORTION_QUARTERTURN_FLIGHT1_MIN_WIDTH_TO_CANVAS_WIDTH * (Stairs.canvas.width - StairConstants.SIDE_MEASURE_TAG_WIDTH);
    var maxWidthFlight1 = StairConstants.PROPORTION_QUARTERTURN_FLIGHT1_MAX_WIDTH_TO_CANVAS_WIDTH * (Stairs.canvas.width - StairConstants.SIDE_MEASURE_TAG_WIDTH);

    Stairs.options.turnTreadsAmount = 1;

    // thread options for each flight
    Stairs.options.flight1Treads = {};
    Stairs.options.flight2Treads = {};
    Stairs.options.flight2Treads.left = {};
    Stairs.options.flight2Treads.right = {};
    Stairs.options.flight2Treads.left.maxAmount = config.flight2Treads.left.maxAmount;
    Stairs.options.flight2Treads.right.maxAmount = config.flight2Treads.right.maxAmount;

    // width of the flight in px
    Stairs.options.flight1Treads.amount = parseInt(config.flight1Treads.amount);
    Stairs.options.flight1Treads.width = Stairs.linearConversion(parseInt(config.flight1Treads.width), parseInt(config.minWidth), parseInt(config.maxWidth) * StairConstants.FEATURE_TREAD_WIDTH, minWidthFlight1, maxWidthFlight1);

    // stairs height is constrained by the second flight count (because horizontal space is fixed)
    minTreadHeight = (Stairs.minWidthPx - Stairs.options.flight1Treads.width) / (config.flight2Treads.left.maxAmount + config.flight2Treads.right.maxAmount);
    maxTreadHeight = (Stairs.maxWidthPx - Stairs.options.flight1Treads.width) / (config.flight2Treads.left.maxAmount + config.flight2Treads.right.maxAmount);
   
    // interpolate treadHeight
    Stairs.options.treadHeight = Math.min(StairConstants.TREAD_MAX_HEIGHT_PXS, Stairs.linearConversion(parseInt(config.treadHeight), parseInt(config.minHeight), parseInt(config.maxHeight), minTreadHeight, maxTreadHeight));

    Stairs.options.flight1Treads.fillColor = config.flight1Treads.fillColor || StairConstants.DEFAULT_TREAD_FILL_COLOR;
    Stairs.options.flight1Treads.strokeColor = config.flight1Treads.strokeColor || StairConstants.DEFAULT_TREAD_STROKE_COLOR;
    Stairs.options.flight1Treads.textColor = config.flight1Treads.textColor || StairConstants.DEFAULT_TREAD_TEXT_COLOR;

    // flight 2 width and height
    Stairs.options.flight2Treads.left.amount = parseInt(config.flight2Treads.left.amount);
    Stairs.options.flight2Treads.right.amount = parseInt(config.flight2Treads.right.amount);
    Stairs.options.flight2Treads.left.width = Stairs.options.flight2Treads.left.amount * Stairs.options.treadHeight;
    Stairs.options.flight2Treads.right.width = Stairs.options.flight2Treads.right.amount * Stairs.options.treadHeight; 
    Stairs.options.flight2Treads.width = Stairs.linearConversion(parseInt(config.flight2Treads.width), parseInt(config.minWidth), parseInt(config.maxWidth) * StairConstants.FEATURE_TREAD_WIDTH, minWidthFlight1, maxWidthFlight1);

    Stairs.options.flight2Treads.fillColor = config.flight1Treads.fillColor || StairConstants.DEFAULT_TREAD_FILL_COLOR;
    Stairs.options.flight2Treads.strokeColor = config.flight1Treads.strokeColor || StairConstants.DEFAULT_TREAD_STROKE_COLOR;
    Stairs.options.flight2Treads.textColor = config.flight1Treads.textColor || StairConstants.DEFAULT_TREAD_TEXT_COLOR;

    // width of the stair
    Stairs.widthPx = Stairs.options.flight1Treads.width + Stairs.options.treadHeight * (Stairs.options.flight2Treads.left.amount + Stairs.options.flight2Treads.right.amount) + StairConstants.SIDE_MEASURE_TAG_WIDTH;

    // set posts configuration
    Stairs.options.posts = {};
    if (config.posts){
        Stairs.options.posts.flight1BottomLeft = (config.posts.flight1BottomLeft=="true" || config.posts.flight1BottomLeft === true)? true : false;
        Stairs.options.posts.flight1BottomRight = (config.posts.flight1BottomRight=="true" || config.posts.flight1BottomRight === true)? true : false;
        Stairs.options.posts.turnTopLeft = (config.posts.turnTopLeft=="true" || config.posts.turnTopLeft === true)? true : false;
        Stairs.options.posts.turnTopRight = (config.posts.turnTopRight=="true" || config.posts.turnTopRight === true)? true : false;
        Stairs.options.posts.leftFlightTop = (config.posts.leftFlightTop=="true" || config.posts.leftFlightTop === true)? true : false;
        Stairs.options.posts.leftFlightBottom = (config.posts.leftFlightBottom=="true" || config.posts.leftFlightBottom === true)? true : false;
        Stairs.options.posts.rightFlightTop = (config.posts.rightFlightTop=="true" || config.posts.rightFlightTop === true)? true : false;
        Stairs.options.posts.rightFlightBottom = (config.posts.rightFlightBottom=="true" || config.posts.rightFlightBottom === true)? true : false;
        Stairs.options.posts.fillColor = config.posts.fillColor || StairConstants.DEFAULT_POST_FILL_COLOR;
        Stairs.options.posts.strokeColor = config.posts.strokeColor || StairConstants.DEFAULT_POST_STROKE_COLOR;
        Stairs.options.posts.textColor = config.posts.textColor || StairConstants.DEFAULT_POST_TEXT_COLOR;
    }

    // ballustrades configuration
    Stairs.options.ballustrades = {};
    if(config.ballustrades){
        Stairs.options.ballustrades.flight1Left = (config.ballustrades.flight1Left=="true" || config.ballustrades.flight1Left === true)? true : false;
        Stairs.options.ballustrades.flight1Right = (config.ballustrades.flight1Right=="true" || config.ballustrades.flight1Right === true)? true : false;
        Stairs.options.ballustrades.leftFlightTop = (config.ballustrades.leftFlightTop=="true" || config.ballustrades.leftFlightTop === true)? true : false;
        Stairs.options.ballustrades.leftFlightBottom = (config.ballustrades.leftFlightBottom=="true" || config.ballustrades.leftFlightBottom === true)? true : false;
        Stairs.options.ballustrades.rightFlightTop = (config.ballustrades.rightFlightTop=="true" || config.ballustrades.rightFlightTop === true)? true : false;
        Stairs.options.ballustrades.rightFlightBottom = (config.ballustrades.rightFlightBottom=="true" || config.ballustrades.rightFlightBottom === true)? true : false;
        Stairs.options.ballustrades.turnTop = (config.ballustrades.turnTop=="true" || config.ballustrades.turnTop === true)? true : false;
        Stairs.options.ballustrades.primaryFillColor = config.ballustrades.primaryFillColor || StairConstants.DEFAULT_BALLUSTRADE_PRIMARY_FILL_COLOR;
        Stairs.options.ballustrades.secondaryFillColor = config.ballustrades.secondaryFillColor || StairConstants.DEFAULT_BALLUSTRADE_SECONDARY_FILL_COLOR;
        Stairs.options.ballustrades.strokeColor = config.ballustrades.strokeColor || StairConstants.DEFAULT_BALLUSTRADE_STROKE_COLOR;
    }

    //Canvas height should fit number of treads. Feature tread is StairConstants.FEATURE_TREAD_HEIGHT bigger than regular tread
    Stairs.maxHeight = (Stairs.options.treadHeight * (Stairs.options.flight1Treads.amount)) + Stairs.options.treadHeight * StairConstants.FEATURE_TREAD_HEIGHT + Stairs.options.flight2Treads.width;
    Stairs.canvas.height = Stairs.maxHeight + StairConstants.POSTS_SIZE + 1 + StairConstants.BOTTOM_MEASURE_TAG_HEIGHT;
}

Stairs.linearConversion = function(originalValue,oldMin,oldMax,newMin,newMax){
    var oldRange = (oldMax - oldMin)
    if (oldRange == 0){
        return newMax;
    }
    else{
        newRange = (newMax - newMin);
        return (Math.floor((((originalValue - oldMin) * newRange) / oldRange) + newMin));
    }
}

Stairs.draw = function(canvas){
    var context = canvas.getContext('2d');
    var y = Stairs.maxHeight;
    switch (Stairs.options.type){
        case Stairs.StairTypeEnum.REGULAR: 
            var treads = Stairs.options.treads;
            var posts = Stairs.options.posts;
            var ballustrades = Stairs.options.ballustrades;
        
            //Start fresh
            context.clearRect(0,0,canvas.width,canvas.height);
            context.save();
            context.fillStyle = Stairs.options.backgroundColor;
            context.fillRect(0,0,canvas.width,canvas.height);
            context.restore();
        
            Stairs.drawMeasures(context);
            Stairs.drawTreads(context,y,treads);
            Stairs.drawBallustrades(context,treads,ballustrades);
            Stairs.drawPosts(context,treads,posts);
            break;
        case Stairs.StairTypeEnum.QUARTERTURN: 
            // translation to center (always draw the stair in the center)
            var translateX = (Stairs.canvas.width - Stairs.widthPx) / 2;
            if (Stairs.options.direction == 'left'){
                translateX = -translateX;
            }
            var treads = {};
            treads.flight1Treads = Stairs.options.flight1Treads;
            treads.flight1Treads.height = Stairs.options.treadHeight;
            treads.flight2Treads = Stairs.options.flight2Treads;
            treads.flight2Treads.height = Stairs.options.treadHeight;
            var posts = Stairs.options.posts;
            var ballustrades = Stairs.options.ballustrades;

            //Start fresh
            context.clearRect(0,0,canvas.width,canvas.height);
            context.save();
            context.fillStyle = Stairs.options.backgroundColor;
            context.fillRect(0, 0, canvas.width,canvas.height);
            context.restore();

            context.save();
            context.translate(translateX,0);
            Stairs.drawTreads(context, y, treads);
            Stairs.drawBallustradeQuarterturn(context)
            Stairs.drawPostsQuarterturn(context,treads,posts);
            Stairs.drawQuarterturnMeasures(context);
            context.restore();
            break;
        case Stairs.StairTypeEnum.HALFTURN: 
            // translation to center (always draw the stair in the center)
            var translateX = (Stairs.canvas.width - Stairs.widthPx) / 2;
            if (Stairs.options.direction == 'left'){
                translateX = -translateX;
            }

            var y = Stairs.maxHeight1;
            var treads = {};
            treads.flight1Treads = Stairs.options.flight1Treads;
            treads.flight1Treads.height = Stairs.options.treadHeight;
            treads.flight2Treads = Stairs.options.flight2Treads;
            treads.flight2Treads.height = Stairs.options.treadHeight;
            treads.flight3Treads = Stairs.options.flight3Treads;
            treads.flight3Treads.height = Stairs.options.treadHeight;
            var posts = Stairs.options.posts;
            var ballustrades = Stairs.options.ballustrades;
        
            //Start fresh
            context.clearRect(0,0,canvas.width,canvas.height);
            context.save();
            context.fillStyle = Stairs.options.backgroundColor;
            context.fillRect(0,0,canvas.width,canvas.height);
            context.restore();
        
            context.save();
            context.translate(translateX,0);
            Stairs.drawTreads(context,y,treads);
            Stairs.drawBallustradeHalfturn(context)
            Stairs.drawPostsHalfturn(context);
            Stairs.drawHalfturnMeasures(context);
            context.restore();
            break;
        case Stairs.StairTypeEnum.DOUBLETURN: 
            // translation to center (always draw the stair in the center)
            var leftRightDif = Stairs.options.flight2Treads.left.width - Stairs.options.flight2Treads.right.width;
            var translateX = leftRightDif / 2;

            var y = Stairs.maxHeight;
            var treads = {};
            treads.flight1Treads = Stairs.options.flight1Treads;
            treads.flight1Treads.height = Stairs.options.treadHeight;
            treads.flight2Treads = Stairs.options.flight2Treads;
            treads.flight2Treads.height = Stairs.options.treadHeight;
            var posts = Stairs.options.posts;
            var ballustrades = Stairs.options.ballustrades;
        
            //Start fresh
            context.clearRect(0,0,canvas.width,canvas.height);
            context.save();
            context.fillStyle = Stairs.options.backgroundColor;
            context.fillRect(0,0,canvas.width,canvas.height);
            context.restore();
        
            context.save();
            context.translate(translateX, StairConstants.DOUBLETURN_TOP_MEASURE_HEIGHT);
            Stairs.drawTreads(context,y,treads);
            Stairs.drawBallustradeDoubleturn(context);
            Stairs.drawPostsDoubleturn(context);
            Stairs.drawDoubleturnMeasures(context);
            context.restore();
            break;
    }
}

//*Treads functions*//

Stairs.drawTreads = function(context, y, treads){
    var startingTread = 1;
    switch(Stairs.options.type){
        case Stairs.StairTypeEnum.REGULAR:     
            var positionX = Stairs.centerX - treads.width/2;
            if(Stairs.doubleFeatureTreadEnabled){
                var positionY1 = y - treads.height * StairConstants.FEATURE_TREAD_HEIGHT;
                var positionY2 = y - treads.height * StairConstants.FEATURE_TREAD_HEIGHT - treads.height;
                Stairs.drawDoubleFeatureTread(treads,context, positionX, positionY1, positionY2, treads.width, treads.height * StairConstants.FEATURE_TREAD_HEIGHT, treads.height, 1);
                y -= treads.height * StairConstants.FEATURE_TREAD_HEIGHT + 1;
                y -= treads.height;
                startingTread += 2;
            }
            else if(Stairs.featureTreadEnabled){
                Stairs.drawSingleFeatureTread(treads, context, positionX, y - treads.height * StairConstants.FEATURE_TREAD_HEIGHT, treads.width, treads.height * StairConstants.FEATURE_TREAD_HEIGHT, 1);
                y -= treads.height * StairConstants.FEATURE_TREAD_HEIGHT + 1;
                startingTread++;
            }
            for(var s = startingTread; s < treads.amount; s++){
                Stairs.drawRegularTread(treads,context, positionX, y - treads.height, treads.width, treads.height, s);
                y -= treads.height;
            }
            Stairs.drawTopTread(treads,context, positionX, y - treads.height, treads.width, treads.height, treads.amount);
            break;
        case Stairs.StairTypeEnum.QUARTERTURN: 
            var flight1Treads = treads.flight1Treads;
            var flight2Treads = treads.flight2Treads;
            // account for possible feature tread y modification
            var startY = Stairs.calculateStartY(y);
            Stairs.startY1 = startY.y1;
            Stairs.startY2 = startY.y2;

            // position X measures the center of the stairs
            var flight1LeftX = StairConstants.SIDE_MEASURE_TAG_WIDTH;
            if (Stairs.options.direction == 'left'){
                flight1LeftX = Stairs.canvas.width - (flight1Treads.width + StairConstants.SIDE_MEASURE_TAG_WIDTH);
            }

            // draw start of feature tread
            if (Stairs.doubleFeatureTreadEnabled){
                var positionY1 = y - flight1Treads.height * StairConstants.FEATURE_TREAD_HEIGHT;
                var positionY2 = y - flight1Treads.height * StairConstants.FEATURE_TREAD_HEIGHT - flight1Treads.height;
                Stairs.drawDoubleFeatureTread(flight1Treads,context, flight1LeftX, positionY1, positionY2, flight1Treads.width, flight1Treads.height * StairConstants.FEATURE_TREAD_HEIGHT, flight1Treads.height, 1);
                y -= flight1Treads.height * StairConstants.FEATURE_TREAD_HEIGHT + 1;
                y -= flight1Treads.height;
                startingTread += 2;
            }
            else if(Stairs.featureTreadEnabled){
                Stairs.drawSingleFeatureTread(flight1Treads,context, flight1LeftX, y - flight1Treads.height * StairConstants.FEATURE_TREAD_HEIGHT, flight1Treads.width, flight1Treads.height * StairConstants.FEATURE_TREAD_HEIGHT, 1);
                y -= flight1Treads.height * StairConstants.FEATURE_TREAD_HEIGHT + 1;
                startingTread++;
            }
            // draw remaining of flight 1
            for(var s = startingTread; s <= flight1Treads.amount; s++){
                Stairs.drawRegularTread(flight1Treads, context, flight1LeftX, y - flight1Treads.height, flight1Treads.width, flight1Treads.height, s);
                y -= flight1Treads.height;
            }
            y -= flight2Treads.width;
            // draw turning flight
            Stairs.drawTurnTread(flight2Treads, context, Stairs.options.turnTreadsAmount, flight1LeftX, y, flight1Treads.width, flight2Treads.width, s);
            s += Stairs.options.turnTreadsAmount;

            // save flight 1 x positions to draw posts and ballustrades
            Stairs.startX1 = flight1LeftX;
            Stairs.startX2 = flight1LeftX + flight1Treads.width;            

            var treadLeftX = 0;
            switch(Stairs.options.direction){
                case 'left':
                    // draw tread starting from the right area 
                    treadLeftX = flight1LeftX - flight2Treads.height;
                    for(var t = s; t < flight2Treads.amount + s - 1; t++){
                        Stairs.drawRegularTread(flight2Treads,context, treadLeftX, y, flight2Treads.height, flight2Treads.width, t);
                        treadLeftX -= flight2Treads.height;
                    }
                    Stairs.drawTopTread(flight2Treads,context, treadLeftX, y, flight2Treads.height, flight2Treads.width, t);
                    treadLeftX += flight2Treads.height;
                    break;
                case 'right':
                    treadLeftX = flight1LeftX + flight1Treads.width;
                    for(var t = s; t < flight2Treads.amount + s - 1; t++){
                        Stairs.drawRegularTread(flight2Treads,context, treadLeftX, y, flight2Treads.height, flight2Treads.width, t);
                        treadLeftX += flight2Treads.height;
                    }
                    Stairs.drawTopTread(flight2Treads,context, treadLeftX, y, flight2Treads.height, flight2Treads.width, t);
                    break;
            }
            Stairs.endX = treadLeftX; // end of the stair 
            Stairs.endY1 = y;
            Stairs.endY2 = y + flight2Treads.width;
            break;
        case Stairs.StairTypeEnum.HALFTURN:    
            var flight1Treads = treads.flight1Treads;
            var flight2Treads = treads.flight2Treads;
            var flight3Treads = treads.flight3Treads;
            var startY = Stairs.calculateStartY(y);
            Stairs.startY1 = startY.y1;
            Stairs.startY2 = startY.y2;

            // position X measures the center of the stairs
            var flight1LeftX = StairConstants.SIDE_MEASURE_TAG_WIDTH;
            if (Stairs.options.direction == 'left'){
                flight1LeftX = Stairs.canvas.width - (flight1Treads.width + StairConstants.SIDE_MEASURE_TAG_WIDTH);
            }

            if (Stairs.doubleFeatureTreadEnabled){
                var positionY1 = y - flight1Treads.height * StairConstants.FEATURE_TREAD_HEIGHT;
                var positionY2 = y - flight1Treads.height * StairConstants.FEATURE_TREAD_HEIGHT - flight1Treads.height;
                Stairs.drawDoubleFeatureTread(flight1Treads,context, flight1LeftX, positionY1, positionY2, flight1Treads.width, flight1Treads.height * StairConstants.FEATURE_TREAD_HEIGHT, flight1Treads.height, 1);
                y -= flight1Treads.height * StairConstants.FEATURE_TREAD_HEIGHT + 1;
                y -= flight1Treads.height;
                startingTread += 2;
            }
            else if(Stairs.featureTreadEnabled){
                Stairs.drawSingleFeatureTread(flight1Treads,context, flight1LeftX, y - flight1Treads.height * StairConstants.FEATURE_TREAD_HEIGHT, flight1Treads.width, flight1Treads.height * StairConstants.FEATURE_TREAD_HEIGHT, 1);
                y -= flight1Treads.height * StairConstants.FEATURE_TREAD_HEIGHT + 1;
                startingTread++;
            }
            for(var s = startingTread; s <= flight1Treads.amount; s++){
                Stairs.drawRegularTread(flight1Treads,context, flight1LeftX, y - flight1Treads.height, flight1Treads.width, flight1Treads.height, s);
                y -= flight1Treads.height;
            }
            y -= flight2Treads.width;
            //if both turns have only 1 tread and there are no flight 2 treads, there is a single turn tread
            if (Stairs.fuseTurns){
                Stairs.startX1 = flight1LeftX;
                Stairs.startX2 = flight1LeftX + flight1Treads.width;
                Stairs.insideTurnX1 = flight1LeftX + flight1Treads.width;
                Stairs.outsideTurnX1 = flight1LeftX + flight1Treads.width;
                Stairs.insideTurnY = y + flight2Treads.width;
                Stairs.outsideTurnY = y;
    
                var positionX = 0;
                switch(Stairs.options.direction){
                    case 'left':
                        positionX = flight1LeftX - flight2Treads.height;
                        var t = s;
                        positionX += flight2Treads.height;
                        positionX -= flight3Treads.width;
                        Stairs.insideTurnX2 = positionX + flight3Treads.width;
                        Stairs.outsideTurnX2 = positionX;
                        Stairs.drawTurnTread(flight2Treads, context, Stairs.options.turn1TreadsAmount, positionX, y, flight1Treads.width + flight3Treads.width, flight2Treads.width, t, true);
                        break;
                    case 'right':
                        var t = s;
                        var positionX = flight1LeftX + flight1Treads.width;
                        Stairs.insideTurnX2 = positionX;
                        Stairs.outsideTurnX2 = positionX + flight3Treads.width;
                        Stairs.drawTurnTread(flight2Treads, context, Stairs.options.turn1TreadsAmount, flight1LeftX, y, flight1Treads.width + flight3Treads.width, flight2Treads.width, t, true);
                        t += Stairs.options.turn2TreadsAmount -1;
                        break;
                }
            }
            else{
                Stairs.drawTurnTread(flight2Treads, context, Stairs.options.turn1TreadsAmount, flight1LeftX, y, flight1Treads.width, flight2Treads.width, s);
                s += Stairs.options.turn1TreadsAmount;
                Stairs.startX1 = flight1LeftX;
                Stairs.startX2 = flight1LeftX + flight1Treads.width;
                Stairs.insideTurnX1 = flight1LeftX + flight1Treads.width;
                Stairs.outsideTurnX1 = flight1LeftX + flight1Treads.width;
                Stairs.insideTurnY = y + flight2Treads.width;
                Stairs.outsideTurnY = y;
    
                var positionX = 0;
                switch(Stairs.options.direction){
                    case 'left':
                        positionX = flight1LeftX - flight2Treads.height;
                        for(var t = s; t < flight2Treads.amount + s; t++){
                            Stairs.drawRegularTread(flight2Treads,context, positionX, y, flight2Treads.height, flight2Treads.width, t);
                            positionX -= flight2Treads.height;
                        }
                        positionX += flight2Treads.height;
                        positionX -= flight3Treads.width;
                        Stairs.insideTurnX2 = positionX + flight3Treads.width;
                        Stairs.outsideTurnX2 = positionX;
                        Stairs.drawTurnTread(flight2Treads, context, Stairs.options.turn2TreadsAmount, positionX, y, flight3Treads.width, flight2Treads.width, t, true);
                        break;
                    case 'right':
                        var positionX = flight1LeftX + flight1Treads.width;
                        for(var t = s; t < flight2Treads.amount + s; t++){
                            Stairs.drawRegularTread(flight2Treads,context, positionX, y, flight2Treads.height, flight2Treads.width, t);
                            positionX += flight2Treads.height;
                        }
                        Stairs.insideTurnX2 = positionX;
                        Stairs.outsideTurnX2 = positionX + flight3Treads.width;
                        Stairs.drawTurnTread(flight2Treads, context, Stairs.options.turn2TreadsAmount, positionX, y, flight3Treads.width, flight2Treads.width, t, true);
                        break;
                }
            }
            Stairs.flight2Y = y;
            y += flight2Treads.width;

            for (var f = t + Stairs.options.turn2TreadsAmount; f < t + Stairs.options.turn2TreadsAmount + flight3Treads.amount; f++){
                Stairs.drawRegularTread(flight3Treads, context, positionX, y, flight3Treads.width, flight3Treads.height, f);
                y += flight3Treads.height;
            }

            Stairs.drawTopTread(flight3Treads,context, positionX, y, flight3Treads.width, flight3Treads.height, f);
            if(Stairs.options.direction == 'right'){
                Stairs.insideEndX = positionX;
                Stairs.outsideEndX = positionX + flight3Treads.width;
                Stairs.endX = positionX + flight3Treads.width;
            }
            else{
                Stairs.endX = positionX;
                Stairs.insideEndX = positionX + flight3Treads.width;
                Stairs.outsideEndX = positionX;
            }
            Stairs.endY = y;
            Stairs.endY1 = y;
            Stairs.endY2 = y + flight2Treads.width;
            break;
        
        case Stairs.StairTypeEnum.QUARTERTURN: 
            var flight1Treads = treads.flight1Treads;
            var flight2Treads = treads.flight2Treads;
            // account for possible feature tread y modification
            var startY = Stairs.calculateStartY(y);
            Stairs.startY1 = startY.y1;
            Stairs.startY2 = startY.y2;

            // position X measures the center of the stairs
            var flight1LeftX = StairConstants.SIDE_MEASURE_TAG_WIDTH;
            if (Stairs.options.direction == 'left'){
                flight1LeftX = Stairs.canvas.width - (flight1Treads.width + StairConstants.SIDE_MEASURE_TAG_WIDTH);
            }

            // draw start of feature tread
            if (Stairs.doubleFeatureTreadEnabled){
                var positionY1 = y - flight1Treads.height * StairConstants.FEATURE_TREAD_HEIGHT;
                var positionY2 = y - flight1Treads.height * StairConstants.FEATURE_TREAD_HEIGHT - flight1Treads.height;
                Stairs.drawDoubleFeatureTread(flight1Treads,context, flight1LeftX, positionY1, positionY2, flight1Treads.width, flight1Treads.height * StairConstants.FEATURE_TREAD_HEIGHT, flight1Treads.height, 1);
                y -= flight1Treads.height * StairConstants.FEATURE_TREAD_HEIGHT + 1;
                y -= flight1Treads.height;
                startingTread += 2;
            }
            else if(Stairs.featureTreadEnabled){
                Stairs.drawSingleFeatureTread(flight1Treads,context, flight1LeftX, y - flight1Treads.height * StairConstants.FEATURE_TREAD_HEIGHT, flight1Treads.width, flight1Treads.height * StairConstants.FEATURE_TREAD_HEIGHT, 1);
                y -= flight1Treads.height * StairConstants.FEATURE_TREAD_HEIGHT + 1;
                startingTread++;
            }
            // draw remaining of flight 1
            for(var s = startingTread; s <= flight1Treads.amount; s++){
                Stairs.drawRegularTread(flight1Treads, context, flight1LeftX, y - flight1Treads.height, flight1Treads.width, flight1Treads.height, s);
                y -= flight1Treads.height;
            }
            y -= flight2Treads.width;
            // draw turning flight
            Stairs.drawTurnTread(flight2Treads, context, Stairs.options.turnTreadsAmount, flight1LeftX, y, flight1Treads.width, flight2Treads.width, s);
            s += Stairs.options.turnTreadsAmount;

            // save flight 1 x positions to draw posts and ballustrades
            Stairs.startX1 = flight1LeftX;
            Stairs.startX2 = flight1LeftX + flight1Treads.width;            

            var treadLeftX = 0;
            switch(Stairs.options.direction){
                case 'left':
                    // draw tread starting from the right area 
                    treadLeftX = flight1LeftX - flight2Treads.height;
                    for(var t = s; t < flight2Treads.amount + s - 1; t++){
                        Stairs.drawRegularTread(flight2Treads,context, treadLeftX, y, flight2Treads.height, flight2Treads.width, t);
                        treadLeftX -= flight2Treads.height;
                    }
                    Stairs.drawTopTread(flight2Treads,context, treadLeftX, y, flight2Treads.height, flight2Treads.width, t);
                    treadLeftX += flight2Treads.height;
                    break;
                case 'right':
                    treadLeftX = flight1LeftX + flight1Treads.width;
                    for(var t = s; t < flight2Treads.amount + s - 1; t++){
                        Stairs.drawRegularTread(flight2Treads,context, treadLeftX, y, flight2Treads.height, flight2Treads.width, t);
                        treadLeftX += flight2Treads.height;
                    }
                    Stairs.drawTopTread(flight2Treads,context, treadLeftX, y, flight2Treads.height, flight2Treads.width, t);
                    break;
            }
            Stairs.endX = treadLeftX; // end of the stair 
            Stairs.endY1 = y;
            Stairs.endY2 = y + flight2Treads.width;
            break;
        case Stairs.StairTypeEnum.DOUBLETURN:
            var flight1Treads = treads.flight1Treads;
            var flight2Treads = treads.flight2Treads;
            // account for possible feature tread y modification
            var startY = Stairs.calculateStartY(y);
            Stairs.startY1 = startY.y1;
            Stairs.startY2 = startY.y2;

            // position X measures the center of the stairs
            var flight1LeftX = Stairs.centerX - flight1Treads.width/2;

            // draw start of feature tread
            if (Stairs.doubleFeatureTreadEnabled){
                var positionY1 = y - flight1Treads.height * StairConstants.FEATURE_TREAD_HEIGHT;
                var positionY2 = y - flight1Treads.height * StairConstants.FEATURE_TREAD_HEIGHT - flight1Treads.height;
                Stairs.drawDoubleFeatureTread(flight1Treads,context, flight1LeftX, positionY1, positionY2, flight1Treads.width, flight1Treads.height * StairConstants.FEATURE_TREAD_HEIGHT, flight1Treads.height, 1);
                y -= flight1Treads.height * StairConstants.FEATURE_TREAD_HEIGHT + 1;
                y -= flight1Treads.height;
                startingTread += 2;
            }
            else if(Stairs.featureTreadEnabled){
                Stairs.drawSingleFeatureTread(flight1Treads,context, flight1LeftX, y - flight1Treads.height * StairConstants.FEATURE_TREAD_HEIGHT, flight1Treads.width, flight1Treads.height * StairConstants.FEATURE_TREAD_HEIGHT, 1);
                y -= flight1Treads.height * StairConstants.FEATURE_TREAD_HEIGHT + 1;
                startingTread++;
            }
            // draw remaining of flight 1
            for(var s = startingTread; s <= flight1Treads.amount; s++){
                Stairs.drawRegularTread(flight1Treads, context, flight1LeftX, y - flight1Treads.height, flight1Treads.width, flight1Treads.height, s);
                y -= flight1Treads.height;
            }
            y -= flight2Treads.width;
            // draw turning flight
            Stairs.drawTurnTread(flight2Treads, context, Stairs.options.turnTreadsAmount, flight1LeftX, y, flight1Treads.width, flight2Treads.width, s);
            s += Stairs.options.turnTreadsAmount;

            // save flight 1 x positions to draw posts and ballustrades
            Stairs.startX1 = flight1LeftX;
            Stairs.startX2 = flight1LeftX + flight1Treads.width;            

            var treadLeftX = 0;            
            // draw tread starting from the right area 
            treadLeftX = flight1LeftX - flight2Treads.height;
            for(var t = s; t < flight2Treads.left.amount + s - 1; t++){
                Stairs.drawRegularTread(flight2Treads,context, treadLeftX, y, flight2Treads.height, flight2Treads.width, t);
                treadLeftX -= flight2Treads.height;
            }
            Stairs.drawTopTread(flight2Treads,context, treadLeftX, y, flight2Treads.height, flight2Treads.width, t);
            treadLeftX += flight2Treads.height;

            Stairs.leftEndY = y;
            Stairs.leftEndX = treadLeftX; // left end of the stair 
            //s = t + 1;

            treadLeftX = flight1LeftX + flight1Treads.width;
            for(var t = s; t < flight2Treads.right.amount + s - 1; t++){
                Stairs.drawRegularTread(flight2Treads,context, treadLeftX, y, flight2Treads.height, flight2Treads.width, t);
                treadLeftX += flight2Treads.height;
            }
            Stairs.drawTopTread(flight2Treads,context, treadLeftX, y, flight2Treads.height, flight2Treads.width, t);

            Stairs.rightEndX = treadLeftX; // right end of the stair 
            Stairs.rightEndY1 = y;
            break;
    }
}

Stairs.drawSingleFeatureTread = function (treads,context, x, y, width, height, tag){
    var isLeftCurtail = (Stairs.options.featureTread.left == 1);
    var isLeftBullnose = (Stairs.options.featureTread.left == 2);
    var isRightCurtail = (Stairs.options.featureTread.right == 1);
    var isRightBullnose = (Stairs.options.featureTread.right == 2);

    context.save();

    context.fillStyle = treads.fillColor;
    context.strokeStyle = treads.strokeColor;

    context.beginPath();
    context.moveTo(x,y);
    context.lineTo(x + width, y);

    if(isRightCurtail){
        context.arc(x + width, y + height/2, height/2, -Math.PI/2, Math.PI/2);
    }
    else if(isRightBullnose){
        context.lineTo(x + width, y + height/2);
        context.arc(x + width - height/2, y + height/2, height/2, 0, Math.PI/2);
    }
    else{
        context.lineTo(x + width, y + height);
    }

    if(isLeftCurtail){
        context.lineTo(x, y + height);
        context.arc(x, y + height/2, height/2, Math.PI/2, 3*Math.PI/2);
    }
    else if(isLeftBullnose){
        context.lineTo(x + height/2, y + height);
        context.arc(x + height/2, y + height/2, height/2, Math.PI/2, Math.PI);
        context.lineTo(x, y);
    }
    else{
        context.lineTo(x, y + height);
        context.lineTo(x, y);
    }
    context.stroke();
    context.fill();

    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.font = 3*treads.height/10 + "px " + Stairs.options.font;
    context.fillStyle = treads.textColor;
    context.fillText(tag, x + width/2, y + height/2 +1);

    context.restore();
}

Stairs.drawDoubleFeatureTread = function (treads, context, x, y1, y2, width, height1, height2, tag){
    var isLeftCurtail = (Stairs.options.featureTread.left == 1);
    var isLeftBullnose = (Stairs.options.featureTread.left == 2);
    var isRightCurtail = (Stairs.options.featureTread.right == 1);
    var isRightBullnose = (Stairs.options.featureTread.right == 2);
    var isLeftDoubleCurtail = (Stairs.options.featureTread.left == 3);
    var isLeftDoubleBullnose = (Stairs.options.featureTread.left == 4);
    var isRightDoubleCurtail = (Stairs.options.featureTread.right == 3);
    var isRightDoubleBullnose = (Stairs.options.featureTread.right == 4);

    context.save();

    context.fillStyle = treads.fillColor;
    context.strokeStyle = treads.strokeColor;


    //First, draw the first tread
    context.beginPath();
    context.moveTo(x + width, y2);

    if(isRightDoubleCurtail || isRightDoubleBullnose){
        context.arc(x + width, y1 + (height1 - height2)/2, height1/2 + height2/2, 3*Math.PI/2, Math.PI/2);
    }
    else if(isRightCurtail){
        context.lineTo(x + width, y1);
        context.arc(x + width, y1 + height1/2, height1/2,  3*Math.PI/2, Math.PI/2);
    }
    else if(isRightBullnose){
        context.lineTo(x + width, y1 + height1/2);
        context.arc(x + width - height1/2, y1 + height1/2, height1/2, 0, Math.PI/2);
    }
    else{
        context.lineTo(x + width, y1 + height1);
    }

    if(isLeftDoubleCurtail || isLeftDoubleBullnose){
        context.lineTo(x, y1 + height1);
        context.arc(x, y1 + (height1 - height2)/2, height1/2 + height2/2, Math.PI/2, 3*Math.PI/2);
    }
    else if(isLeftCurtail){
        context.lineTo(x, y1 + height1);
        context.arc(x, y1 + height1/2, height1/2,  Math.PI/2, 3*Math.PI/2);
        context.lineTo(x, y2);
    }
    else if(isLeftBullnose){
        context.lineTo(x + height1/2, y1 + height1);
        context.arc(x + height1/2, y1 + height1/2, height1/2, Math.PI/2, Math.PI);
        context.lineTo(x, y2);
    }
    else{
        context.lineTo(x, y1+height1);
        context.lineTo(x, y2);
    }
    context.stroke();
    context.fill();

    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.font = 3*treads.height/10 + "px " + Stairs.options.font;
    context.fillStyle = treads.textColor;
    context.fillText(tag, x + width/2, y1 + height1/2 +1);
    
    //Then, draw the second tread

    context.fillStyle = treads.fillColor;
    context.beginPath();
    context.moveTo(x,y2);
    context.lineTo(x + width, y2);

    if(isRightDoubleCurtail){
        context.arc(x + width, y2 + height2/2, height2/2, -Math.PI/2, Math.PI/2);
    }
    else if(isRightDoubleBullnose){
        context.lineTo(x + width, y2 + height2/2);
        context.arc(x + width - height2/2, y2 + height2/2, height2/2, 0, Math.PI/2);
    }
    else{
        context.lineTo(x + width, y2 + height2);
    }

    if(isLeftDoubleCurtail){
        context.lineTo(x, y2 + height2);
        context.arc(x, y2 + height2/2, height2/2, Math.PI/2, 3*Math.PI/2);
    }
    else if(isLeftDoubleBullnose){
        context.lineTo(x + height2/2, y2 + height2);
        context.arc(x + height2/2, y2 + height2/2, height2/2, Math.PI/2, Math.PI);
        context.lineTo(x, y2);
    }
    else{
        context.lineTo(x, y2 + height2);
        context.lineTo(x, y2);
    }
    context.stroke();
    context.fill();

    context.fillStyle = treads.textColor;
    context.fillText(tag +1, x + width/2, y1 - height2/2 + 1);

    context.restore();
}

Stairs.drawRegularTread = function (treads, context, x, y, width, height, tag){
    context.save();

    context.fillStyle = treads.fillColor;
    context.strokeStyle = treads.strokeColor;

    context.clearRect(x, y, width, height);
    context.strokeRect(x, y, width, height);
    context.fillRect(x, y, width, height);

    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.font = 3 * treads.height / 10 + "px " + Stairs.options.font;
    context.fillStyle = treads.textColor;
    context.fillText(tag, x + width/2, y + (height/2) + 1);

    context.restore();
}

Stairs.drawTopTread = function (treads, context, x, y, width, height, tag){
    context.save();
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.font = 3*treads.height/10 + "px " + Stairs.options.font;
    context.fillStyle = treads.textColor;
    context.fillText(tag, x + width/2, y + height/2 +1);
    context.restore();
}

Stairs.drawTurnTread = function (treads, context, amount, x, y, width, height, tag, mirrored){
    context.save();
    context.fillStyle = treads.fillColor;
    context.strokeStyle = treads.strokeColor;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.font =  3*treads.height/10 + "px " + Stairs.options.font;
    context.lineWidth = 1;
    context.clearRect(x, y, width, height);
    context.strokeRect(x,y,width,height);
    context.fillStyle = treads.fillColor;
    context.fillRect(x,y,width,height);
    context.fillStyle = treads.textColor;
    var direction = Stairs.options.direction;
    if (mirrored){
        if(direction == 'left'){
            direction = 'right';
        }
        else{
            direction = 'left';
        }
    }
    // draw depending on the number of treads
    switch(amount){
        case 1: 
            context.fillText(tag, x + width/2, y + height/2 +1);
            break;
        case 2:
            if(mirrored){
                tag += 1;
            }
            switch(direction){
                case 'left': 
                    context.beginPath();
                    context.moveTo(x,y+height);
                    context.lineTo(x+width, y);
                    context.stroke();
                    context.fillText(tag, x+width/2, y+3*height/4);
                    if(mirrored){
                        tag--;
                    }
                    else{
                        tag++;
                    }
                    context.fillText(tag, x+width/4, y+height/2 + 1)
                    break;

                case 'right' : 
                    context.beginPath();
                    context.moveTo(x,y);
                    context.lineTo(x+width, y+height);
                    context.stroke();
                    context.fillText(tag, x+width/2, y+3*height/4);
                    if(mirrored){
                        tag--;
                    }
                    else{
                        tag++;
                    }
                    context.fillText(tag, x+3*width/4, y+height/2 +1)
                break;
            }
            break;
        case 3:
            if(mirrored){
                tag += 2;
            }
            switch(direction){
                case 'left' : 
                context.beginPath();
                context.moveTo(x,y+height);
                var y1 = height/2;
                context.lineTo(x+width, y+y1);
                context.fillText(tag, x + width/2, y+height-y1/4 +1);
                if(mirrored){
                    tag--;
                }
                else{
                    tag++;
                }

                var x1 = width/2;
                context.moveTo(x+x1,y);
                context.lineTo(x, y+height);
                context.stroke();

                context.fillText(tag, x + width/2, y+height/2 +1);
                if(mirrored){
                    tag--;
                }
                else{
                    tag++;
                }
                context.fillText(tag, x + x1/4, y+height/2 + 1);
                break;

                case 'right' : 
                context.beginPath();
                context.moveTo(x+width,y+height);
                var y1 = height/2;
                context.lineTo(x, y+y1);
                context.fillText(tag, x + width/2, y+height-y1/4 +1);
                if(mirrored){
                    tag--;
                }
                else{
                    tag++;
                }

                var x1 = width/2;
                context.moveTo(x+width,y+height);
                context.lineTo(x+x1, y);
                context.stroke();
                context.fillText(tag, x + width/2, y+height/2 +1);
                if(mirrored){
                    tag--;
                }
                else{
                    tag++;
                }
                context.fillText(tag, x + width - x1/4, y+height/2 + 1);
                break;
            }
        break;
    }
    context.restore();
}

//* Posts functions *//
Stairs.drawPosts = function(context,treads,posts){
    context.save();
    context.strokeStyle = Stairs.options.posts.strokeColor;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.font = "bold " +2 * StairConstants.POSTS_SIZE/3 + "px " + Stairs.options.font;
    var tag = 1;
    var leftStartingY = treads.height - StairConstants.POSTS_SIZE/2;
    var rightStartingY = treads.height - StairConstants.POSTS_SIZE/2;
    var leftFinishY = Stairs.maxHeight - StairConstants.POSTS_SIZE/2;
    var rightFinishY = Stairs.maxHeight - StairConstants.POSTS_SIZE/2;
    var featureTread = Stairs.options.featureTread;
    var positions = Stairs.dealWithYPositions(treads,featureTread,leftStartingY,rightStartingY,leftFinishY,rightFinishY);
    leftStartingY = positions.leftStartingY;
    rightStartingY = positions.rightStartingY;
    leftFinishY = positions.leftFinishY;
    rightFinishY = positions.rightFinishY;

    if(posts.topLeft){
        Stairs.drawPost(tag, Stairs.centerX - treads.width/2 - StairConstants.POSTS_SIZE/2, leftStartingY, context);
        tag++;
    }
    if(posts.topRight){
        Stairs.drawPost(tag, Stairs.centerX + treads.width/2 - StairConstants.POSTS_SIZE/2, rightStartingY, context);
        tag++;
    }
    if(posts.bottomLeft){
        Stairs.drawPost(tag, Stairs.centerX - treads.width/2 - StairConstants.POSTS_SIZE/2, leftFinishY, context);
        tag++;
    }
    if(posts.bottomRight){
        Stairs.drawPost(tag, Stairs.centerX + treads.width/2 - StairConstants.POSTS_SIZE/2, rightFinishY, context);
        tag++;
    }
    context.restore();
};

Stairs.dealWithYPositions = function(treads,featureTread,leftStartingY,rightStartingY,leftFinishY,rightFinishY){
    var left = featureTread.left;
    var right = featureTread.right;    
    var height = treads.height;
    var featureHeight = treads.height * StairConstants.FEATURE_TREAD_HEIGHT;

    /*
    if(left == 0 && right == 0){
        leftStartingY += height * (StairConstants.FEATURE_TREAD_HEIGHT - 1);
        rightStartingY += height * (StairConstants.FEATURE_TREAD_HEIGHT - 1);
    }
    */

    switch(left){
        case 0 : break;
        case 1 : leftFinishY-= featureHeight;
                 break;
        case 2 : leftFinishY-= featureHeight;
                 break;
        case 3 : leftFinishY-= (featureHeight + height);
                 break;
        case 4 : leftFinishY-= (featureHeight + height);
                 break;
    }

    switch(right){
        case 0 : break;
        case 1 : rightFinishY-= featureHeight;
                 break;
        case 2 : rightFinishY-= featureHeight;
                 break;
        case 3 : rightFinishY-= (featureHeight + height);
                 break;
        case 4 : rightFinishY-= (featureHeight + height);
                 break;
    }

    return ({leftStartingY : leftStartingY, rightStartingY : rightStartingY, leftFinishY : leftFinishY, rightFinishY : rightFinishY})
}
Stairs.drawPost = function(tag, x, y, context){
    context.save();
    context.fillStyle = Stairs.options.posts.fillColor;
    context.fillRect(x, y,  StairConstants.POSTS_SIZE,  StairConstants.POSTS_SIZE);
    context.strokeRect(x, y,  StairConstants.POSTS_SIZE,  StairConstants.POSTS_SIZE);
    context.fillStyle = Stairs.options.posts.textColor;
    context.fillText(tag, x + StairConstants.POSTS_SIZE/2, y + StairConstants.POSTS_SIZE/2 + 1);
    context.restore();
}

//*Ballustrade Functions*//

Stairs.drawBallustrades = function(context,treads,ballustrades){
    context.save();
    var rightStartingY = treads.height - 5;
    var leftStartingY = treads.height - 5;
    var rightHeight = Stairs.maxHeight + 10;
    var leftHeight = Stairs.maxHeight + 10;
    var featureTread = Stairs.options.featureTread;
    var positions = Stairs.dealWithYPositions(treads,featureTread,leftStartingY,rightStartingY,leftHeight,rightHeight);
    leftStartingY = positions.leftStartingY;
    rightStartingY = positions.rightStartingY;
    leftHeight = positions.leftFinishY - leftStartingY;
    rightHeight = positions.rightFinishY - rightStartingY;

    Stairs.drawBallustrade(Stairs.centerX - treads.width/2 - StairConstants.BALUSTRADE_WIDTH/2, leftStartingY, leftHeight,context, ballustrades.left);
    Stairs.drawBallustrade(Stairs.centerX + treads.width/2 - StairConstants.BALUSTRADE_WIDTH/2, rightStartingY, rightHeight,context, ballustrades.right);
    context.restore();
}

Stairs.drawBallustrade = function(x, y, height, context, drawOrnaments){
    context.save();
    context.fillStyle = Stairs.options.ballustrades.primaryFillColor;
    context.strokeStyle = Stairs.options.ballustrades.strokeColor;
    context.fillRect(x, y, StairConstants.BALUSTRADE_WIDTH, height);
    context.strokeRect(x, y, StairConstants.BALUSTRADE_WIDTH, height);
    if(drawOrnaments){
        Stairs.drawBallustradeOrnaments(context, x, y, StairConstants.BALUSTRADE_WIDTH, height);
    }
    context.restore();
}

Stairs.drawBallustradeOrnaments = function(context, x, y, width, height){
    context.save();
    var ornamentSize = width/2;
    context.fillStyle = Stairs.options.ballustrades.secondaryFillColor;
    context.strokeStyle = Stairs.options.ballustrades.strokeColor;

    var positionY = y + 5;
    var positionX = x + width/2 - ornamentSize/2;

    while(positionY + ornamentSize < (y + height)){
        context.fillRect(positionX, positionY, ornamentSize, ornamentSize);
        context.strokeRect(positionX, positionY, ornamentSize, ornamentSize);
        positionY += ornamentSize * 4;
    }

    context.restore();
}

Stairs.drawBallustradeQuarterturn = function(context){
    context.save();
    context.fillStyle = Stairs.options.ballustrades.primaryFillColor;
    context.strokeStyle = Stairs.options.ballustrades.strokeColor;
    var startX1 = Stairs.startX1;
    var startX2 = Stairs.startX2;
    var startY1 = Stairs.startY1;
    var startY2 = Stairs.startY2;
    var isRight = Stairs.options.direction == 'right';
    var endX = Stairs.endX;
    var endY1 = Stairs.endY1;
    var endY2 = Stairs.endY2;
    var flight1Outside = Stairs.options.ballustrades.flight1Outside;
    var flight1Inside = Stairs.options.ballustrades.flight1Inside;
    var flight2Outside = Stairs.options.ballustrades.flight2Outside;
    var flight2Inside = Stairs.options.ballustrades.flight2Inside;
    var turnSide = Stairs.options.ballustrades.turnSide;
    var turnTop = Stairs.options.ballustrades.turnTop;

    var rightSign = 1;
    if(isRight){
        var pivot = startX1;
        startX1 = startX2;
        startX2 = pivot;

        pivot = startY1;
        startY1 = startY2;
        startY2 = pivot;
        rightSign = -1;
    }

    //inside balustrade
    context.beginPath();
    context.moveTo(startX1 - StairConstants.BALUSTRADE_WIDTH/2, startY1 + StairConstants.BALUSTRADE_WIDTH/2);
    context.lineTo(startX1 + StairConstants.BALUSTRADE_WIDTH/2, startY1 + StairConstants.BALUSTRADE_WIDTH/2);
    context.lineTo(startX1 + StairConstants.BALUSTRADE_WIDTH/2, endY2 - (StairConstants.BALUSTRADE_WIDTH/2 * rightSign));
    context.lineTo(endX + StairConstants.BALUSTRADE_WIDTH/2, endY2 - (StairConstants.BALUSTRADE_WIDTH/2 * rightSign));
    context.lineTo(endX + StairConstants.BALUSTRADE_WIDTH/2, endY2 - StairConstants.BALUSTRADE_WIDTH/2);
    context.lineTo(endX - StairConstants.BALUSTRADE_WIDTH/2, endY2 - StairConstants.BALUSTRADE_WIDTH/2);
    context.lineTo(endX - StairConstants.BALUSTRADE_WIDTH/2, endY2 + (StairConstants.BALUSTRADE_WIDTH/2) * rightSign);
    context.lineTo(endX - StairConstants.BALUSTRADE_WIDTH/2, endY2 + (StairConstants.BALUSTRADE_WIDTH/2) * rightSign);
    context.lineTo(startX1 - StairConstants.BALUSTRADE_WIDTH/2, endY2 + (StairConstants.BALUSTRADE_WIDTH/2) * rightSign);
    context.lineTo(startX1 - StairConstants.BALUSTRADE_WIDTH/2, startY1 + StairConstants.BALUSTRADE_WIDTH/2);
    context.stroke();
    context.fill();

    //outside balustrade
    context.beginPath();
    context.moveTo(startX2 - StairConstants.BALUSTRADE_WIDTH/2, startY2 + StairConstants.BALUSTRADE_WIDTH/2);
    context.lineTo(startX2 + StairConstants.BALUSTRADE_WIDTH/2, startY2 + StairConstants.BALUSTRADE_WIDTH/2);
    context.lineTo(startX2 + StairConstants.BALUSTRADE_WIDTH/2, endY1 - (StairConstants.BALUSTRADE_WIDTH/2 * rightSign));
    context.lineTo(endX + StairConstants.BALUSTRADE_WIDTH/2, endY1 - (StairConstants.BALUSTRADE_WIDTH/2 * rightSign));
    context.lineTo(endX + StairConstants.BALUSTRADE_WIDTH/2, endY1 - StairConstants.BALUSTRADE_WIDTH/2);
    context.lineTo(endX - StairConstants.BALUSTRADE_WIDTH/2, endY1 - StairConstants.BALUSTRADE_WIDTH/2);
    context.lineTo(endX - StairConstants.BALUSTRADE_WIDTH/2, endY1 + (StairConstants.BALUSTRADE_WIDTH/2) * rightSign);
    context.lineTo(endX - StairConstants.BALUSTRADE_WIDTH/2, endY1 + (StairConstants.BALUSTRADE_WIDTH/2) * rightSign);
    context.lineTo(startX2 - StairConstants.BALUSTRADE_WIDTH/2, endY1 + (StairConstants.BALUSTRADE_WIDTH/2) * rightSign);
    context.lineTo(startX2 - StairConstants.BALUSTRADE_WIDTH/2, startY2 + StairConstants.BALUSTRADE_WIDTH/2);
    context.stroke();
    context.fill();

    if(flight1Outside){
        Stairs.drawBallustradeQuarterturnOrnaments(context, startX2 - StairConstants.BALUSTRADE_WIDTH/2, startX2 + StairConstants.BALUSTRADE_WIDTH/2, 
            startY2 + StairConstants.BALUSTRADE_WIDTH/2, startY2 + StairConstants.BALUSTRADE_WIDTH/2,
            endX + StairConstants.BALUSTRADE_WIDTH/2, endX + StairConstants.BALUSTRADE_WIDTH/2, 
            endY2 - StairConstants.BALUSTRADE_WIDTH/2, endY2 + StairConstants.BALUSTRADE_WIDTH/2);
    }
    if(flight1Inside){
        Stairs.drawBallustradeQuarterturnOrnaments(context, startX1 - StairConstants.BALUSTRADE_WIDTH/2, startX1 + StairConstants.BALUSTRADE_WIDTH/2, 
            startY1 + StairConstants.BALUSTRADE_WIDTH/2, startY1 + StairConstants.BALUSTRADE_WIDTH/2,
            endX + StairConstants.BALUSTRADE_WIDTH/2, endX + StairConstants.BALUSTRADE_WIDTH/2, 
            endY2 - StairConstants.BALUSTRADE_WIDTH/2, endY2 + StairConstants.BALUSTRADE_WIDTH/2);
    }
    if(flight2Inside){
        Stairs.drawBallustradeQuarterturnOrnaments(context, endX - StairConstants.BALUSTRADE_WIDTH/2, endX - StairConstants.BALUSTRADE_WIDTH/2, 
            endY2 - StairConstants.BALUSTRADE_WIDTH/2, endY2 + StairConstants.BALUSTRADE_WIDTH/2,
            startX1 + StairConstants.BALUSTRADE_WIDTH/2, startX1 + StairConstants.BALUSTRADE_WIDTH/2, 
            startY2 - StairConstants.BALUSTRADE_WIDTH/2, startY2 + StairConstants.BALUSTRADE_WIDTH/2);
    }
    if(flight2Outside){
        Stairs.drawBallustradeQuarterturnOrnaments(context, endX - StairConstants.BALUSTRADE_WIDTH/2, endX - StairConstants.BALUSTRADE_WIDTH/2, 
            endY1 - StairConstants.BALUSTRADE_WIDTH/2, endY1 + StairConstants.BALUSTRADE_WIDTH/2,
            startX1 + StairConstants.BALUSTRADE_WIDTH/2, startX1 + StairConstants.BALUSTRADE_WIDTH/2, 
            startY1 - StairConstants.BALUSTRADE_WIDTH/2, startY1 + StairConstants.BALUSTRADE_WIDTH/2);
    }
    if(turnTop){
        Stairs.drawBallustradeQuarterturnOrnaments(context, startX1 - StairConstants.BALUSTRADE_WIDTH/2, startX1 - StairConstants.BALUSTRADE_WIDTH/2, 
            endY1 - StairConstants.BALUSTRADE_WIDTH/2, endY1 + StairConstants.BALUSTRADE_WIDTH/2,
            startX2 + StairConstants.BALUSTRADE_WIDTH/2, startX2 + StairConstants.BALUSTRADE_WIDTH/2, 
            startY1 - StairConstants.BALUSTRADE_WIDTH/2, startY1 + StairConstants.BALUSTRADE_WIDTH/2);
    }
    if(turnSide){
        Stairs.drawBallustradeQuarterturnOrnaments(context, startX2 - StairConstants.BALUSTRADE_WIDTH/2, startX2 + StairConstants.BALUSTRADE_WIDTH/2, 
            endY2 + StairConstants.BALUSTRADE_WIDTH/2, endY2 + StairConstants.BALUSTRADE_WIDTH/2,
            endX + StairConstants.BALUSTRADE_WIDTH/2, endX + StairConstants.BALUSTRADE_WIDTH/2, 
            endY1 - StairConstants.BALUSTRADE_WIDTH/2, endY1 + StairConstants.BALUSTRADE_WIDTH/2);
    }
    context.restore();
}

Stairs.drawBallustradeQuarterturnOrnaments = function(context, startX1, startX2, startY1, startY2, endX1, endX2, endY1, endY2){
    context.save();
    var position = 'vertical';
    if(startX1 == startX2){
        position = 'horizontal';
        var isRight = Stairs.options.direction == 'right';
    }
    
    var ornamentSize = (startX2-startX1)/2;

    context.fillStyle = Stairs.options.ballustrades.secondaryFillColor;
    context.strokeStyle = Stairs.options.ballustrades.strokeColor;

    var positionX = startX1 + ornamentSize/2;
    var positionY = startY1 - ornamentSize*2;

    switch(position){
        case 'vertical':
            while((positionY + ornamentSize) > endY2){
                context.fillRect(positionX, positionY, ornamentSize, ornamentSize);
                context.strokeRect(positionX, positionY, ornamentSize, ornamentSize);
                positionY -= (ornamentSize * 4);
            }
            break;
        case 'horizontal':
            ornamentSize = (startY2-startY1)/2;
            positionY = startY1 + ornamentSize/2;
            if(isRight){
                while((positionX + ornamentSize) > endX2){
                    context.fillRect(positionX, positionY, ornamentSize, ornamentSize);
                    context.strokeRect(positionX, positionY, ornamentSize, ornamentSize);
                    positionX -= (ornamentSize * 4);
                }
            }
            else{
                while((positionX + ornamentSize) < endX2){
                    context.fillRect(positionX, positionY, ornamentSize, ornamentSize);
                    context.strokeRect(positionX, positionY, ornamentSize, ornamentSize);
                    positionX += (ornamentSize * 4);
                }
            }
            break;
    }
    context.restore();
}


Stairs.drawBallustradeHalfturn = function(context){
    context.save();
    context.fillStyle = Stairs.options.ballustrades.primaryFillColor;
    context.strokeStyle = Stairs.options.ballustrades.strokeColor;
    var startX1 = Stairs.startX1;
    var startX2 = Stairs.startX2;
    var startY1 = Stairs.startY1;
    var startY2 = Stairs.startY2;
    var insideTurnY = Stairs.insideTurnY;
    var endY = Stairs.endY;
    var insideTurnX2 = Stairs.insideTurnX2;
    var outsideTurnY = Stairs.outsideTurnY;
    var outsideTurnX2 = Stairs.outsideTurnX2;
    var isRight = Stairs.options.direction == 'right';
    var insideEndX = Stairs.insideEndX;
    var outsideEndX = Stairs.outsideEndX;
    var flight1Outside = Stairs.options.ballustrades.flight1Outside;
    var flight1Inside = Stairs.options.ballustrades.flight1Inside;
    var flight2Outside = Stairs.options.ballustrades.flight2Outside;
    var flight2Inside = Stairs.options.ballustrades.flight2Inside;
    var flight3Outside = Stairs.options.ballustrades.flight3Outside;
    var flight3Inside = Stairs.options.ballustrades.flight3Inside;
    var turn1Side = Stairs.options.ballustrades.turn1Side;
    var turn1Top = Stairs.options.ballustrades.turn1Top;
    var turn2Side = Stairs.options.ballustrades.turn2Side;
    var turn2Top = Stairs.options.ballustrades.turn2Top;

    var rightSign = 1;
    if(isRight){
        var pivot = startX1;
        startX1 = startX2;
        startX2 = pivot;

        pivot = startY1;
        startY1 = startY2;
        startY2 = pivot;
        rightSign = -1;
    }

    //inside balustrade
    context.beginPath();
    context.moveTo(startX1 - StairConstants.BALUSTRADE_WIDTH/2, startY1 + StairConstants.BALUSTRADE_WIDTH/2);
    context.lineTo(startX1 + StairConstants.BALUSTRADE_WIDTH/2, startY1 + StairConstants.BALUSTRADE_WIDTH/2);
    context.lineTo(startX1 + StairConstants.BALUSTRADE_WIDTH/2, insideTurnY - (StairConstants.BALUSTRADE_WIDTH/2 * rightSign));
    context.lineTo(insideTurnX2 - StairConstants.BALUSTRADE_WIDTH/2, insideTurnY - (StairConstants.BALUSTRADE_WIDTH/2 * rightSign));
    context.lineTo(insideEndX - StairConstants.BALUSTRADE_WIDTH/2, endY + StairConstants.BALUSTRADE_WIDTH/2);
    context.lineTo(insideEndX + StairConstants.BALUSTRADE_WIDTH/2, endY + StairConstants.BALUSTRADE_WIDTH/2);
    context.lineTo(insideEndX + StairConstants.BALUSTRADE_WIDTH/2, endY - (StairConstants.BALUSTRADE_WIDTH/2) * rightSign);
    context.lineTo(insideEndX + StairConstants.BALUSTRADE_WIDTH/2, endY - (StairConstants.BALUSTRADE_WIDTH/2) * rightSign);
    context.lineTo(insideTurnX2 + StairConstants.BALUSTRADE_WIDTH/2, insideTurnY + (StairConstants.BALUSTRADE_WIDTH/2 * rightSign));
    context.lineTo(startX1 - StairConstants.BALUSTRADE_WIDTH/2, insideTurnY + (StairConstants.BALUSTRADE_WIDTH/2 * rightSign));
    context.lineTo(startX1 - StairConstants.BALUSTRADE_WIDTH/2, startY1 + StairConstants.BALUSTRADE_WIDTH/2);
    context.stroke();
    context.fill();
    //outside balustrade
    context.beginPath();
    context.moveTo(startX2 - StairConstants.BALUSTRADE_WIDTH/2, startY2 + StairConstants.BALUSTRADE_WIDTH/2);
    context.lineTo(startX2 + StairConstants.BALUSTRADE_WIDTH/2, startY2 + StairConstants.BALUSTRADE_WIDTH/2);
    context.lineTo(startX2 + StairConstants.BALUSTRADE_WIDTH/2, outsideTurnY - (StairConstants.BALUSTRADE_WIDTH/2 * rightSign));
    context.lineTo(outsideTurnX2 - StairConstants.BALUSTRADE_WIDTH/2, outsideTurnY - (StairConstants.BALUSTRADE_WIDTH/2 * rightSign));
    context.lineTo(outsideEndX - StairConstants.BALUSTRADE_WIDTH/2, endY + StairConstants.BALUSTRADE_WIDTH/2);
    context.lineTo(outsideEndX + StairConstants.BALUSTRADE_WIDTH/2, endY + StairConstants.BALUSTRADE_WIDTH/2);
    context.lineTo(outsideTurnX2 + StairConstants.BALUSTRADE_WIDTH/2, outsideTurnY + (StairConstants.BALUSTRADE_WIDTH/2 * rightSign));
    context.lineTo(startX2 - StairConstants.BALUSTRADE_WIDTH/2, outsideTurnY + (StairConstants.BALUSTRADE_WIDTH/2 * rightSign));
    context.lineTo(startX2 - StairConstants.BALUSTRADE_WIDTH/2, startY2 + StairConstants.BALUSTRADE_WIDTH/2);
    context.stroke();
    context.fill();

    if(flight1Inside){
        Stairs.drawBallustradeQuarterturnOrnaments(context, startX1 - StairConstants.BALUSTRADE_WIDTH/2, startX1 + StairConstants.BALUSTRADE_WIDTH/2, 
            startY1 + StairConstants.BALUSTRADE_WIDTH/2, startY1 + StairConstants.BALUSTRADE_WIDTH/2,
            startX1 - StairConstants.BALUSTRADE_WIDTH/2, startX1 + StairConstants.BALUSTRADE_WIDTH/2, 
            insideTurnY + StairConstants.BALUSTRADE_WIDTH/2, insideTurnY + StairConstants.BALUSTRADE_WIDTH/2);
    }
    if(flight1Outside){
        Stairs.drawBallustradeQuarterturnOrnaments(context, startX2 - StairConstants.BALUSTRADE_WIDTH/2, startX2 + StairConstants.BALUSTRADE_WIDTH/2, 
            startY2 + StairConstants.BALUSTRADE_WIDTH/2, startY2 + StairConstants.BALUSTRADE_WIDTH/2,
            startX2 + StairConstants.BALUSTRADE_WIDTH/2, startX2 + StairConstants.BALUSTRADE_WIDTH/2, 
            insideTurnY + StairConstants.BALUSTRADE_WIDTH/2, insideTurnY + StairConstants.BALUSTRADE_WIDTH/2);
    }
    if(turn1Side){
        Stairs.drawBallustradeQuarterturnOrnaments(context, outsideEndX - StairConstants.BALUSTRADE_WIDTH/2, outsideEndX + StairConstants.BALUSTRADE_WIDTH/2, 
            insideTurnY - StairConstants.BALUSTRADE_WIDTH/2, insideTurnY - StairConstants.BALUSTRADE_WIDTH/2,
            outsideEndX + StairConstants.BALUSTRADE_WIDTH/2, outsideEndX + StairConstants.BALUSTRADE_WIDTH/2, 
            outsideTurnY + StairConstants.BALUSTRADE_WIDTH/2, outsideTurnY + StairConstants.BALUSTRADE_WIDTH/2);
    }
    if(turn1Top){
        Stairs.drawBallustradeQuarterturnOrnaments(context, outsideEndX + StairConstants.BALUSTRADE_WIDTH * rightSign, outsideEndX + StairConstants.BALUSTRADE_WIDTH * rightSign, 
            outsideTurnY - StairConstants.BALUSTRADE_WIDTH/2, outsideTurnY + StairConstants.BALUSTRADE_WIDTH/2,
            insideTurnX2, insideTurnX2, 
            outsideTurnY - StairConstants.BALUSTRADE_WIDTH/2, outsideTurnY + StairConstants.BALUSTRADE_WIDTH/2);
    }
    if(flight2Outside){
        Stairs.drawBallustradeQuarterturnOrnaments(context, insideTurnX2 + StairConstants.BALUSTRADE_WIDTH/2 * rightSign, insideTurnX2 + StairConstants.BALUSTRADE_WIDTH/2* rightSign, 
            outsideTurnY - StairConstants.BALUSTRADE_WIDTH/2, outsideTurnY + StairConstants.BALUSTRADE_WIDTH/2,
            startX1 + StairConstants.BALUSTRADE_WIDTH/2, startX1 + StairConstants.BALUSTRADE_WIDTH/2, 
            outsideTurnY - StairConstants.BALUSTRADE_WIDTH/2, outsideTurnY + StairConstants.BALUSTRADE_WIDTH/2);
    }
    if(flight2Inside){
        Stairs.drawBallustradeQuarterturnOrnaments(context, insideTurnX2 + StairConstants.BALUSTRADE_WIDTH/2 * rightSign, insideTurnX2 + StairConstants.BALUSTRADE_WIDTH/2* rightSign, 
            insideTurnY - StairConstants.BALUSTRADE_WIDTH/2, insideTurnY + StairConstants.BALUSTRADE_WIDTH/2,
            startX1 + StairConstants.BALUSTRADE_WIDTH/2 * rightSign, startX1 + StairConstants.BALUSTRADE_WIDTH/2 * rightSign, 
            insideTurnY - StairConstants.BALUSTRADE_WIDTH/2, insideTurnY + StairConstants.BALUSTRADE_WIDTH/2);
    }
    if(turn2Side){
        Stairs.drawBallustradeQuarterturnOrnaments(context, startX2 - StairConstants.BALUSTRADE_WIDTH/2, startX2 + StairConstants.BALUSTRADE_WIDTH/2, 
            insideTurnY - StairConstants.BALUSTRADE_WIDTH/2, insideTurnY - StairConstants.BALUSTRADE_WIDTH/2,
            startX2 + StairConstants.BALUSTRADE_WIDTH/2, startX2 + StairConstants.BALUSTRADE_WIDTH/2, 
            outsideTurnY + StairConstants.BALUSTRADE_WIDTH/2, outsideTurnY + StairConstants.BALUSTRADE_WIDTH/2);
    }
    if(turn2Top){
        Stairs.drawBallustradeQuarterturnOrnaments(context, startX1 - StairConstants.BALUSTRADE_WIDTH/2, startX1 - StairConstants.BALUSTRADE_WIDTH/2, 
            outsideTurnY - StairConstants.BALUSTRADE_WIDTH/2, outsideTurnY + StairConstants.BALUSTRADE_WIDTH/2,
            startX2 + StairConstants.BALUSTRADE_WIDTH/2, startX2 + StairConstants.BALUSTRADE_WIDTH/2, 
            outsideTurnY - StairConstants.BALUSTRADE_WIDTH/2, outsideTurnY + StairConstants.BALUSTRADE_WIDTH/2);
    }
    if(flight3Inside){
        Stairs.drawBallustradeQuarterturnOrnaments(context, insideEndX - StairConstants.BALUSTRADE_WIDTH/2, insideEndX + StairConstants.BALUSTRADE_WIDTH/2, 
            endY - StairConstants.BALUSTRADE_WIDTH/2, endY - StairConstants.BALUSTRADE_WIDTH/2,
            insideEndX + StairConstants.BALUSTRADE_WIDTH/2, insideEndX + StairConstants.BALUSTRADE_WIDTH/2, 
            insideTurnY + StairConstants.BALUSTRADE_WIDTH/2, insideTurnY + StairConstants.BALUSTRADE_WIDTH/2);
    }
    if(flight3Outside){
        Stairs.drawBallustradeQuarterturnOrnaments(context, outsideEndX - StairConstants.BALUSTRADE_WIDTH/2, outsideEndX + StairConstants.BALUSTRADE_WIDTH/2, 
            endY - StairConstants.BALUSTRADE_WIDTH/2, endY - StairConstants.BALUSTRADE_WIDTH/2,
            outsideEndX + StairConstants.BALUSTRADE_WIDTH/2, outsideEndX + StairConstants.BALUSTRADE_WIDTH/2, 
            insideTurnY + StairConstants.BALUSTRADE_WIDTH/2, insideTurnY + StairConstants.BALUSTRADE_WIDTH/2);
    }
    context.restore();
}


Stairs.drawBallustradeDoubleturn = function(context){
    context.save();
    context.fillStyle = Stairs.options.ballustrades.primaryFillColor;
    context.strokeStyle = Stairs.options.ballustrades.strokeColor;
    var startX1 = Stairs.startX1;
    var startX2 = Stairs.startX2;
    var startY1 = Stairs.startY1;
    var startY2 = Stairs.startY2;
    var leftEndX = Stairs.leftEndX;
    var endY = Stairs.leftEndY;
    var rightEndX = Stairs.rightEndX;
    var flight1Left = Stairs.options.ballustrades.flight1Left;
    var flight1Right = Stairs.options.ballustrades.flight1Right;
    var leftFlightTop = Stairs.options.ballustrades.leftFlightTop;
    var leftFlightBottom = Stairs.options.ballustrades.leftFlightBottom;
    var rightFlightTop = Stairs.options.ballustrades.rightFlightTop;
    var rightFlightBottom = Stairs.options.ballustrades.rightFlightBottom;
    var turnTop = Stairs.options.ballustrades.turnTop;

    //bottom left ballustrades
    context.beginPath();
    context.moveTo(startX1 - StairConstants.BALUSTRADE_WIDTH/2, startY1 + StairConstants.BALUSTRADE_WIDTH/2);
    context.lineTo(startX1 + StairConstants.BALUSTRADE_WIDTH/2, startY1 + StairConstants.BALUSTRADE_WIDTH/2);
    context.lineTo(startX1 + StairConstants.BALUSTRADE_WIDTH/2, endY + Stairs.options.flight2Treads.width - StairConstants.BALUSTRADE_WIDTH/2);
 
    context.lineTo(leftEndX - StairConstants.BALUSTRADE_WIDTH/2, endY + Stairs.options.flight2Treads.width - StairConstants.BALUSTRADE_WIDTH/2);
    context.lineTo(leftEndX - StairConstants.BALUSTRADE_WIDTH/2, endY + Stairs.options.flight2Treads.width + StairConstants.BALUSTRADE_WIDTH/2);
    context.lineTo(startX1 - StairConstants.BALUSTRADE_WIDTH/2, endY + Stairs.options.flight2Treads.width + StairConstants.BALUSTRADE_WIDTH/2);
    context.lineTo(startX1 - StairConstants.BALUSTRADE_WIDTH/2, startY1 + StairConstants.BALUSTRADE_WIDTH/2);
    context.stroke();
    context.fill();
    
    //top ballustrades
    context.beginPath();
    context.lineTo(leftEndX - StairConstants.BALUSTRADE_WIDTH/2, endY + StairConstants.BALUSTRADE_WIDTH/2);
    context.lineTo(rightEndX + StairConstants.BALUSTRADE_WIDTH/2, endY + StairConstants.BALUSTRADE_WIDTH/2);
    context.lineTo(rightEndX + StairConstants.BALUSTRADE_WIDTH/2, endY - StairConstants.BALUSTRADE_WIDTH/2);
    context.lineTo(leftEndX - StairConstants.BALUSTRADE_WIDTH/2, endY - StairConstants.BALUSTRADE_WIDTH/2);
    context.lineTo(leftEndX - StairConstants.BALUSTRADE_WIDTH/2, endY + StairConstants.BALUSTRADE_WIDTH/2);
    context.stroke();
    context.fill();

    //bottom right ballustrades
    context.beginPath();
    context.lineTo(rightEndX + StairConstants.BALUSTRADE_WIDTH/2, endY + Stairs.options.flight2Treads.width - StairConstants.BALUSTRADE_WIDTH/2);
    context.lineTo(startX2 - StairConstants.BALUSTRADE_WIDTH/2, endY + Stairs.options.flight2Treads.width - StairConstants.BALUSTRADE_WIDTH/2);
    context.lineTo(startX2 - StairConstants.BALUSTRADE_WIDTH/2, startY2 + StairConstants.BALUSTRADE_WIDTH/2);
    context.lineTo(startX2 + StairConstants.BALUSTRADE_WIDTH/2, startY2 + StairConstants.BALUSTRADE_WIDTH/2);
    context.lineTo(startX2 + StairConstants.BALUSTRADE_WIDTH/2, endY + Stairs.options.flight2Treads.width + StairConstants.BALUSTRADE_WIDTH/2);
    context.lineTo(rightEndX + StairConstants.BALUSTRADE_WIDTH/2, endY + Stairs.options.flight2Treads.width + StairConstants.BALUSTRADE_WIDTH/2);
    context.lineTo(rightEndX + StairConstants.BALUSTRADE_WIDTH/2, endY + Stairs.options.flight2Treads.width - StairConstants.BALUSTRADE_WIDTH/2);
    context.stroke();
    context.fill();
    if(flight1Left){
        Stairs.drawBallustradeDoubleturnOrnaments(context, startX1 - StairConstants.BALUSTRADE_WIDTH/2, startX1 + StairConstants.BALUSTRADE_WIDTH/2, 
            startY1 + StairConstants.BALUSTRADE_WIDTH/2, startY1 + StairConstants.BALUSTRADE_WIDTH/2,
            startX1 - StairConstants.BALUSTRADE_WIDTH/2, startX1 + StairConstants.BALUSTRADE_WIDTH/2, 
            endY + Stairs.options.flight2Treads.width + StairConstants.BALUSTRADE_WIDTH/2, endY + Stairs.options.flight2Treads.width + StairConstants.BALUSTRADE_WIDTH/2);
    }
    if(flight1Right){
        Stairs.drawBallustradeDoubleturnOrnaments(context, startX2 - StairConstants.BALUSTRADE_WIDTH/2, startX2 + StairConstants.BALUSTRADE_WIDTH/2, 
            startY2 + StairConstants.BALUSTRADE_WIDTH/2, startY2 + StairConstants.BALUSTRADE_WIDTH/2,
            startX2 + StairConstants.BALUSTRADE_WIDTH/2, startX2 + StairConstants.BALUSTRADE_WIDTH/2, 
            endY + Stairs.options.flight2Treads.width + StairConstants.BALUSTRADE_WIDTH/2, endY + Stairs.options.flight2Treads.width + StairConstants.BALUSTRADE_WIDTH/2);
    }
    if(turnTop){
        Stairs.drawBallustradeDoubleturnOrnaments(context, startX1 + StairConstants.BALUSTRADE_WIDTH/2, startX1 + StairConstants.BALUSTRADE_WIDTH/2, 
            endY - StairConstants.BALUSTRADE_WIDTH/2, endY + StairConstants.BALUSTRADE_WIDTH/2,
            startX2 + StairConstants.BALUSTRADE_WIDTH/2, startX2 + StairConstants.BALUSTRADE_WIDTH/2, 
            endY + StairConstants.BALUSTRADE_WIDTH/2, endY + StairConstants.BALUSTRADE_WIDTH/2);
    }
    if(leftFlightTop){
        Stairs.drawBallustradeDoubleturnOrnaments(context, leftEndX + StairConstants.BALUSTRADE_WIDTH/2, leftEndX + StairConstants.BALUSTRADE_WIDTH/2, 
            endY - StairConstants.BALUSTRADE_WIDTH/2, endY + StairConstants.BALUSTRADE_WIDTH/2,
            startX1, startX1, 
            endY + StairConstants.BALUSTRADE_WIDTH/2, endY + StairConstants.BALUSTRADE_WIDTH/2);
    }
    if(leftFlightBottom){
        Stairs.drawBallustradeDoubleturnOrnaments(context, leftEndX + StairConstants.BALUSTRADE_WIDTH/2, leftEndX + StairConstants.BALUSTRADE_WIDTH/2, 
            endY + Stairs.options.flight2Treads.width - StairConstants.BALUSTRADE_WIDTH/2, endY + Stairs.options.flight2Treads.width  + StairConstants.BALUSTRADE_WIDTH/2,
            startX1 - StairConstants.BALUSTRADE_WIDTH/2, startX1- StairConstants.BALUSTRADE_WIDTH/2, 
            endY + Stairs.options.flight2Treads.width  + StairConstants.BALUSTRADE_WIDTH/2, endY + Stairs.options.flight2Treads.width  + StairConstants.BALUSTRADE_WIDTH/2);
    }
    if(rightFlightTop){
        Stairs.drawBallustradeDoubleturnOrnaments(context, startX2 + StairConstants.BALUSTRADE_WIDTH/2, startX2 + StairConstants.BALUSTRADE_WIDTH/2, 
            endY - StairConstants.BALUSTRADE_WIDTH/2, endY + StairConstants.BALUSTRADE_WIDTH/2,
            rightEndX + StairConstants.BALUSTRADE_WIDTH/2, rightEndX + StairConstants.BALUSTRADE_WIDTH/2, 
            endY, endY + StairConstants.BALUSTRADE_WIDTH/2);
    }
    if(rightFlightBottom){
        Stairs.drawBallustradeDoubleturnOrnaments(context, startX2 + StairConstants.BALUSTRADE_WIDTH/2, startX2 + StairConstants.BALUSTRADE_WIDTH/2, 
            endY + Stairs.options.flight2Treads.width - StairConstants.BALUSTRADE_WIDTH/2, endY + Stairs.options.flight2Treads.width  + StairConstants.BALUSTRADE_WIDTH/2,
            rightEndX + StairConstants.BALUSTRADE_WIDTH/2, rightEndX + StairConstants.BALUSTRADE_WIDTH/2, 
            endY + Stairs.options.flight2Treads.width, endY + Stairs.options.flight2Treads.width  + StairConstants.BALUSTRADE_WIDTH/2);
    }
    context.restore();
}

Stairs.drawBallustradeDoubleturnOrnaments = function(context, startX1, startX2, startY1, startY2, endX1, endX2, endY1, endY2){
    context.save();
    var position = 'vertical';
    if(startX1 == startX2){
        position = 'horizontal';
    }
    context.fillStyle = Stairs.options.ballustrades.secondaryFillColor;
    context.strokeStyle = Stairs.options.ballustrades.strokeColor;

    switch(position){
        case 'vertical':
        var ornamentSize = (startX2-startX1)/2;
            var positionX = startX1 + ornamentSize/2;
            var positionY = startY1 - ornamentSize*2;
            while((positionY + ornamentSize) > endY2){
                context.fillRect(positionX, positionY, ornamentSize, ornamentSize);
                context.strokeRect(positionX, positionY, ornamentSize, ornamentSize);
                positionY -= (ornamentSize * 4);
            }
            break;
        case 'horizontal':
            var ornamentSize = (startY2-startY1)/2;
            var positionX = startX1 + ornamentSize/2;
            var positionY = startY1 + ornamentSize/2;
            while((positionX + ornamentSize) < endX2){
                context.fillRect(positionX, positionY, ornamentSize, ornamentSize);
                context.strokeRect(positionX, positionY, ornamentSize, ornamentSize);
                positionX += (ornamentSize * 4);
            }
            break;
    }
    context.restore();
}


Stairs.drawPostsDoubleturn = function(context){
    context.save();
    context.fillStyle = Stairs.options.ballustrades.primaryFillColor;
    context.strokeStyle = Stairs.options.ballustrades.strokeColor;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.font = "bold " +2 * StairConstants.POSTS_SIZE/3 + "px " + Stairs.options.font;
    var startX1 = Stairs.startX1;
    var startX2 = Stairs.startX2;
    var startY1 = Stairs.startY1;
    var startY2 = Stairs.startY2;
    var leftEndX = Stairs.leftEndX;
    var endY = Stairs.leftEndY;
    var rightEndX = Stairs.rightEndX;

    var flight1BottomLeft = Stairs.options.posts.flight1BottomLeft;
    var flight1BottomRight = Stairs.options.posts.flight1BottomRight;
    var turnTopLeft = Stairs.options.posts.turnTopLeft;
    var turnTopRight = Stairs.options.posts.turnTopRight;
    var leftFlightTop = Stairs.options.posts.leftFlightTop;
    var leftFlightBottom = Stairs.options.posts.leftFlightBottom;
    var rightFlightTop = Stairs.options.posts.rightFlightTop;
    var rightFlightBottom = Stairs.options.posts.rightFlightBottom;

    var tag = 1;

    if(flight1BottomLeft){
        Stairs.drawPost(tag, startX1 - StairConstants.POSTS_SIZE/2, startY1 - StairConstants.POSTS_SIZE/2, context);
        tag++;
    }
    if(flight1BottomRight){
        Stairs.drawPost(tag, startX2 - StairConstants.POSTS_SIZE/2, startY2 - StairConstants.POSTS_SIZE/2, context);
        tag++;
    }
    //Mandatory??
    Stairs.drawPost(tag, startX2 - StairConstants.POSTS_SIZE/2, endY + Stairs.options.flight2Treads.width - StairConstants.POSTS_SIZE/2, context);
    tag++;

    if(rightFlightBottom){
        Stairs.drawPost(tag, rightEndX - StairConstants.POSTS_SIZE/2, endY + Stairs.options.flight2Treads.width - StairConstants.POSTS_SIZE/2, context);
        tag++;
    }
    if(rightFlightTop){
        Stairs.drawPost(tag, rightEndX - StairConstants.POSTS_SIZE/2, endY - StairConstants.POSTS_SIZE/2, context);
        tag++;
    }
    if(turnTopRight){
        Stairs.drawPost(tag, startX2 - StairConstants.POSTS_SIZE/2, endY - StairConstants.POSTS_SIZE/2, context);
        tag++;
    }
    if(turnTopLeft){
        Stairs.drawPost(tag, startX1 - StairConstants.POSTS_SIZE/2, endY - StairConstants.POSTS_SIZE/2, context);
        tag++;
    }
    if(leftFlightTop){
        Stairs.drawPost(tag, leftEndX - StairConstants.POSTS_SIZE/2, endY - StairConstants.POSTS_SIZE/2, context);
        tag++;
    }
    if(leftFlightBottom){
        Stairs.drawPost(tag, leftEndX - StairConstants.POSTS_SIZE/2, endY + Stairs.options.flight2Treads.width - StairConstants.POSTS_SIZE/2, context);
        tag++;
    }
    //Mandatory??
    Stairs.drawPost(tag, startX1 - StairConstants.POSTS_SIZE/2, endY + Stairs.options.flight2Treads.width - StairConstants.POSTS_SIZE/2, context);
    tag++;
    
    context.restore();
}

Stairs.drawPostsQuarterturn = function(context){
    context.save();
    context.fillStyle = Stairs.options.ballustrades.primaryFillColor;
    context.strokeStyle = Stairs.options.ballustrades.strokeColor;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.font = "bold " +2 * StairConstants.POSTS_SIZE/3 + "px " + Stairs.options.font;
    var startX1 = Stairs.startX1;
    var startX2 = Stairs.startX2;
    var startY1 = Stairs.startY1;
    var startY2 = Stairs.startY2;
    var isRight = Stairs.options.direction == 'right';
    var endX = Stairs.endX;
    var endY1 = Stairs.endY1;
    var endY2 = Stairs.endY2;
    var outside = Stairs.options.ballustrades.outside;
    var inside = Stairs.options.ballustrades.inside;
    var tag = 1;

    var turnTopLeft = Stairs.options.posts.turnTopLeft;
    var turnTopRight = Stairs.options.posts.turnTopRight;
    var turnBottom = Stairs.options.posts.turnBottom;
    var flight1BottomLeft = Stairs.options.posts.flight1BottomLeft;
    var flight1BottomRight = Stairs.options.posts.flight1BottomRight;
    var flight2Top = Stairs.options.posts.flight2Top;
    var flight2Bottom = Stairs.options.posts.flight2Bottom;


    var rightSign = 1;
    if(isRight){
        var pivot = startX1;
        startX1 = startX2;
        startX2 = pivot;

        pivot = startY1;
        startY1 = startY2;
        startY2 = pivot;
        rightSign = -1;

        pivot = flight1BottomLeft;
        flight1BottomLeft = flight1BottomRight;
        flight1BottomRight = pivot;

        pivot = turnTopLeft;
        turnTopLeft = turnTopRight;
        turnTopRight = pivot;
    }

    Stairs.drawPost(tag, startX1 - StairConstants.POSTS_SIZE/2, endY2 - StairConstants.POSTS_SIZE/2, context);
    tag++;

    if(flight1BottomLeft){
        Stairs.drawPost(tag, startX1 - StairConstants.POSTS_SIZE/2, startY1 - StairConstants.POSTS_SIZE/2, context);
        tag++;
    }
    
    if(flight1BottomRight){
        Stairs.drawPost(tag, startX2 - StairConstants.POSTS_SIZE/2, startY2 - StairConstants.POSTS_SIZE/2, context);
        tag++;
    }

    if(turnBottom){
        Stairs.drawPost(tag, startX2 - StairConstants.POSTS_SIZE/2, endY2 - StairConstants.POSTS_SIZE/2, context);
        tag++;
    }

    if(turnTopRight){
        Stairs.drawPost(tag, startX2 - StairConstants.POSTS_SIZE/2, endY1 - StairConstants.POSTS_SIZE/2, context);
        tag++;
    }

    if(turnTopLeft){
        Stairs.drawPost(tag, startX1 - StairConstants.POSTS_SIZE/2, endY1 - StairConstants.POSTS_SIZE/2, context);
        tag++;
    }

    if(flight2Top){
        Stairs.drawPost(tag, endX - StairConstants.POSTS_SIZE/2, endY1 - StairConstants.POSTS_SIZE/2, context);
        tag++;
    }

    if(flight2Bottom){
        Stairs.drawPost(tag, endX - StairConstants.POSTS_SIZE/2, endY2 - StairConstants.POSTS_SIZE/2, context);
        tag++;
    }
    context.restore();
}


Stairs.drawPostsHalfturn = function(context){
    context.save();
    context.fillStyle = Stairs.options.ballustrades.primaryFillColor;
    context.strokeStyle = Stairs.options.ballustrades.strokeColor;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.font = "bold " +2 * StairConstants.POSTS_SIZE/3 + "px " + Stairs.options.font;
    var startX1 = Stairs.startX1;
    var startX2 = Stairs.startX2;
    var startY1 = Stairs.startY1;
    var startY2 = Stairs.startY2;
    var insideTurnY = Stairs.insideTurnY;
    var endY = Stairs.endY;
    var outsideTurnY = Stairs.outsideTurnY;
    var isRight = Stairs.options.direction == 'right';
    var insideEndX = Stairs.insideEndX;
    var outsideEndX = Stairs.outsideEndX;
    var tag = 1;

    var turn1TopLeft = Stairs.options.posts.turn1TopLeft;
    var turn1TopRight = Stairs.options.posts.turn1TopRight;
    var turn1Bottom = Stairs.options.posts.turn1Bottom;
    var turn2TopLeft = Stairs.options.posts.turn2TopLeft;
    var turn2TopRight = Stairs.options.posts.turn2TopRight;
    var turn2Bottom = Stairs.options.posts.turn2Bottom;
    var flight1BottomLeft = Stairs.options.posts.flight1BottomLeft;
    var flight1BottomRight = Stairs.options.posts.flight1BottomRight;
    var flight3Right = Stairs.options.posts.flight3Right;
    var flight3Left = Stairs.options.posts.flight3Left;

    var pivotStartX1 = startX1;
    var pivotStartX2 = startX2;

    var pivotInsideX = insideEndX;
    var pivotOutsideX = outsideEndX;

    if(isRight){
        pivotStartX1 = startX2;
        pivotStartX2 = startX1;
        pivotInsideX = outsideEndX;
        pivotOutsideX = insideEndX;
    }

    if(flight1BottomLeft){
        Stairs.drawPost(tag, startX1 - StairConstants.POSTS_SIZE/2, startY1 - StairConstants.POSTS_SIZE/2, context);
        tag++;
    }
    
    if(flight1BottomRight){
        Stairs.drawPost(tag, startX2 - StairConstants.POSTS_SIZE/2, startY2 - StairConstants.POSTS_SIZE/2, context);
        tag++;
    }

    if(turn1Bottom){
        Stairs.drawPost(tag, pivotStartX2 - StairConstants.POSTS_SIZE/2, insideTurnY - StairConstants.POSTS_SIZE/2, context);
        tag++;
    }

    if(turn1TopRight){
        Stairs.drawPost(tag, startX2 - StairConstants.POSTS_SIZE/2, outsideTurnY - StairConstants.POSTS_SIZE/2, context);
        tag++;
    }

    if(turn1TopLeft){
        Stairs.drawPost(tag, startX1 - StairConstants.POSTS_SIZE/2, outsideTurnY - StairConstants.POSTS_SIZE/2, context);
        tag++;
    }

    if(turn2TopRight){
        Stairs.drawPost(tag, pivotInsideX - StairConstants.POSTS_SIZE/2, outsideTurnY - StairConstants.POSTS_SIZE/2, context);
        tag++;
    }

    if(turn2TopLeft){
        Stairs.drawPost(tag, pivotOutsideX - StairConstants.POSTS_SIZE/2, outsideTurnY - StairConstants.POSTS_SIZE/2, context);
        tag++;
    }

    if(turn2Bottom){
        Stairs.drawPost(tag, outsideEndX - StairConstants.POSTS_SIZE/2, insideTurnY - StairConstants.POSTS_SIZE/2, context);
        tag++;
    }

    if(flight3Left){
        Stairs.drawPost(tag, pivotOutsideX - StairConstants.POSTS_SIZE/2, endY - StairConstants.POSTS_SIZE/2, context);
        tag++;
    }
    
    if(flight3Right){
        Stairs.drawPost(tag, pivotInsideX - StairConstants.POSTS_SIZE/2, endY - StairConstants.POSTS_SIZE/2, context);
        tag++;
    }

    if(Stairs.options.flight2Treads.amount == 0){
        Stairs.drawPost(tag, insideEndX - StairConstants.POSTS_SIZE, insideTurnY - StairConstants.POSTS_SIZE/2, context);
        tag++;
        Stairs.drawPost(tag, pivotStartX1, insideTurnY - StairConstants.POSTS_SIZE/2, context);
        tag++;
    }
    else{
        Stairs.drawPost(tag, insideEndX - StairConstants.POSTS_SIZE/2, insideTurnY - StairConstants.POSTS_SIZE/2, context);
        tag++;
        Stairs.drawPost(tag, pivotStartX1 - StairConstants.POSTS_SIZE/2, insideTurnY - StairConstants.POSTS_SIZE/2, context);
        tag++;
    }

    context.restore();
}

/* Measures Functions */

Stairs.drawMeasures = function(context){
    context.save();
    var treads = Stairs.options.treads;
    var startingY = treads.height;
    var bottom_measure_y_position = Stairs.canvas.height - StairConstants.BOTTOM_MEASURE_TAG_HEIGHT;

    context.fillStyle = Stairs.options.treads.textColor;
    context.strokeStyle = Stairs.options.treads.textColor;
    context.lineWidth = 0.5;

    if(!Stairs.featureTreadEnabled){
        startingY += treads.height / 5;
        //height += treads.height;
    }

    //Draw measure lines

    //Height measure
    context.setLineDash([5, treads.amount]);
    context.beginPath();
    context.moveTo(Stairs.centerX + treads.width + 0.5, startingY);
    context.lineTo(Stairs.centerX + treads.width + 0.5, Stairs.maxHeight);
    strokeXTimes(context,5);

    context.setLineDash([9, 9]);

    context.beginPath();
    context.moveTo(Stairs.centerX + treads.width/2, startingY + 0.5);
    context.lineTo(Stairs.centerX + treads.width +15, startingY + 0.5);
    strokeXTimes(context,5);

    context.beginPath();
    context.moveTo(Stairs.centerX + treads.width/2, Stairs.maxHeight + 0.1);
    context.lineTo(Stairs.centerX + treads.width +15, Stairs.maxHeight + 0.1);
    strokeXTimes(context,5);

    //Width measure

    context.setLineDash([5, treads.amount]);
    context.beginPath();
    context.moveTo(Stairs.centerX - treads.width/2, bottom_measure_y_position + 0.5);
    context.lineTo(Stairs.centerX + treads.width/2, bottom_measure_y_position + 0.5);
    strokeXTimes(context,5);

    context.setLineDash([4, 4]);

    context.beginPath();
    context.moveTo(Stairs.centerX - treads.width/2 + 0.5, bottom_measure_y_position - 10);
    context.lineTo(Stairs.centerX - treads.width/2 + 0.5, bottom_measure_y_position + 10);
    strokeXTimes(context,5);

    context.beginPath();
    context.moveTo(Stairs.centerX + treads.width/2 + 0.5, bottom_measure_y_position - 10);
    context.lineTo(Stairs.centerX + treads.width/2 + 0.5, bottom_measure_y_position + 10);
    strokeXTimes(context,5);

    //Measures text
    context.textBaseline = 'middle';
    context.font = "12px " + Stairs.options.font;
    context.textAlign = 'center';
    context.fillText("(w) " + Stairs.printMMWidth + "mm", Stairs.centerX, bottom_measure_y_position + 20);
    
    context.textAlign = 'left';
    context.translate(Stairs.centerX + treads.width + 20, Stairs.maxHeight/2);
    context.rotate(Math.PI/2);
    context.fillText("(a) " + Stairs.printMMHeight + "mm", 0,0);


    context.restore();
}


Stairs.drawQuarterturnMeasures = function(context){
    context.save();
    var flight1Treads = Stairs.options.flight1Treads;
    var flight2Treads = Stairs.options.flight2Treads;

    var bottom_measure_y_position = Stairs.canvas.height - StairConstants.BOTTOM_MEASURE_TAG_HEIGHT;

    var startX1 = Stairs.startX1;
    var startX2 = Stairs.startX2;
    var endX = Stairs.endX;

    var startY1 = Stairs.startY1;
    var startY2 = Stairs.startY2;
    var endY1 = Stairs.endY1;
    var endY2 = Stairs.endY2;
    
    // x coordinate of the height measure
    var heightMeasureX = Stairs.canvas.width - StairConstants.SIDE_MEASURE_TAG_WIDTH * 0.5 + 0.5;

    if (Stairs.options.direction == 'left'){
        var pivot = startX1;
        startX1 = startX2;
        startX2 = pivot;
    }
    else{
        heightMeasureX = StairConstants.SIDE_MEASURE_TAG_WIDTH * 0.5 + 0.5;
    }

    context.fillStyle = Stairs.options.treads.textColor;
    context.strokeStyle = Stairs.options.treads.textColor;
    context.lineWidth = 0.5;

    //Draw measure lines

    //Height measure
    context.setLineDash([5, 10]);
    context.beginPath();
    context.moveTo(heightMeasureX, endY1);
    context.lineTo(heightMeasureX, Stairs.maxHeight);
    strokeXTimes(context,5);

    context.setLineDash([4, 4]);

    context.beginPath();
    context.moveTo(heightMeasureX - 10, endY1 + 0.5);
    context.lineTo(heightMeasureX + 10, endY1 + 0.5);
    strokeXTimes(context,5);

    context.beginPath();
    context.moveTo(heightMeasureX - 10, Stairs.maxHeight + 0.1);
    context.lineTo(heightMeasureX + 10, Stairs.maxHeight + 0.1);
    strokeXTimes(context,5);

    // Width measure
    context.setLineDash([5, flight2Treads.amount + 1]);
    context.beginPath();
    context.moveTo(startX1, bottom_measure_y_position + 0.5);
    context.lineTo(endX, bottom_measure_y_position + 0.5);
    strokeXTimes(context,5);

    context.setLineDash([4, 4]);

    context.beginPath();
    context.moveTo(startX1 + 0.5, bottom_measure_y_position - 10);
    context.lineTo(startX1, bottom_measure_y_position + 10);
    strokeXTimes(context,5);

    context.beginPath();
    context.moveTo(endX + 0.5, bottom_measure_y_position - 10);
    context.lineTo(endX + 0.5, bottom_measure_y_position + 10);
    strokeXTimes(context,5);

    //Measures text
    context.textBaseline = 'middle';
    context.font = "12px " + Stairs.options.font;
    context.textAlign = 'center';
    context.fillText("(b) " + Stairs.printMMWidth + "mm", (startX1 + endX)/2, bottom_measure_y_position + 20);
    
    context.textAlign = 'left';
    context.translate(heightMeasureX + 10, Stairs.maxHeight/2);
    context.rotate(Math.PI/2);
    context.fillText("(a) " + Stairs.printMMHeight + "mm", 0,0);


    context.restore();
}

Stairs.drawHalfturnMeasures = function(context){
    context.save();
    var flight1Treads = Stairs.options.flight1Treads;
    var flight2Treads = Stairs.options.flight2Treads;
    var flight3Treads = Stairs.options.flight3Treads;

    var bottom_measure_y_position = Stairs.canvas.height - StairConstants.BOTTOM_MEASURE_TAG_HEIGHT;

    var startX1 = Stairs.startX1;
    var startX2 = Stairs.startX2;
    var endX = Stairs.endX;

    var heightMeasure1Y = Stairs.maxHeight1;
    var heightMeasure2Y = Stairs.maxHeight2 + 7;

    var heightMeasureX1 = Stairs.canvas.width - StairConstants.SIDE_MEASURE_TAG_WIDTH * 0.5 + 0.5;
    var heightMeasureEndY = Stairs.flight2Y;
    var heightMeasureX2 = endX + StairConstants.SIDE_MEASURE_TAG_WIDTH * 0.5 + 0.5;

    if(Stairs.options.direction == 'left'){
        var pivot = startX1;
        startX1 = startX2;
        startX2 = pivot;
        heightMeasureX2 = endX - StairConstants.SIDE_MEASURE_TAG_WIDTH * 0.5 + 0.5;
    }
    else{
        heightMeasureX1 = StairConstants.SIDE_MEASURE_TAG_WIDTH * 0.5 + 0.5;
    }

    context.fillStyle = Stairs.options.treads.textColor;
    context.strokeStyle = Stairs.options.treads.textColor;
    context.lineWidth = 0.5;

    //Draw measure lines

    //First Height measure
    context.setLineDash([5, 10]);
    context.beginPath();
    context.moveTo(heightMeasureX1, heightMeasure1Y);
    context.lineTo(heightMeasureX1, heightMeasureEndY);
    strokeXTimes(context,5);

    context.setLineDash([4, 4]);

    context.beginPath();
    context.moveTo(heightMeasureX1 - 10, heightMeasure1Y + 0.5);
    context.lineTo(heightMeasureX1 + 10, heightMeasure1Y + 0.5);
    strokeXTimes(context,5);

    context.beginPath();
    context.moveTo(heightMeasureX1 - 10, heightMeasureEndY + 0.1);
    context.lineTo(heightMeasureX1 + 10, heightMeasureEndY + 0.1);
    strokeXTimes(context,5);

    //Second Height measure
    context.setLineDash([5, 10]);
    context.beginPath();
    context.moveTo(heightMeasureX2, heightMeasure2Y);
    context.lineTo(heightMeasureX2, heightMeasureEndY);
    strokeXTimes(context,5);

    context.setLineDash([4, 4]);

    context.beginPath();
    context.moveTo(heightMeasureX2 - 10, heightMeasure2Y + 0.5);
    context.lineTo(heightMeasureX2 + 10, heightMeasure2Y + 0.5);
    strokeXTimes(context,5);

    context.beginPath();
    context.moveTo(heightMeasureX2 - 10, heightMeasureEndY + 0.1);
    context.lineTo(heightMeasureX2 + 10, heightMeasureEndY + 0.1);
    strokeXTimes(context,5);

    // Width measure
    context.setLineDash([5, 10]);
    context.beginPath();
    context.moveTo(startX1, bottom_measure_y_position + 0.5);
    context.lineTo(endX, bottom_measure_y_position + 0.5);
    strokeXTimes(context,5);

    context.setLineDash([4, 4]);

    context.beginPath();
    context.moveTo(startX1 + 0.5, bottom_measure_y_position - 10);
    context.lineTo(startX1, bottom_measure_y_position + 10);
    strokeXTimes(context,5);

    context.beginPath();
    context.moveTo(endX + 0.5, bottom_measure_y_position - 10);
    context.lineTo(endX + 0.5, bottom_measure_y_position + 10);
    strokeXTimes(context,5);

    //Measures text
    context.textBaseline = 'middle';
    context.font = "12px " + Stairs.options.font;
    context.textAlign = 'center';
    context.fillText("(b) " + Stairs.printMMWidth + "mm", (startX1 + endX)/2, bottom_measure_y_position + 20);
    
    context.textAlign = 'left';
    context.save();
    context.translate(heightMeasureX1 + 10, Stairs.maxHeight/2);
    context.rotate(Math.PI/2);
    context.fillText("(a) " + Stairs.printMMHeight1 + "mm", 0,0);
    context.restore()
    context.save();
    context.translate(heightMeasureX2 + 10, Stairs.maxHeight/2);
    context.rotate(Math.PI/2);
    context.fillText("(c) " + Stairs.printMMHeight2 + "mm", 0, 25);
    context.restore()


    context.restore();
}


Stairs.drawDoubleturnMeasures = function(context){
    context.save();
    var bottom_measure_y_position = Stairs.canvas.height - StairConstants.BOTTOM_MEASURE_TAG_HEIGHT;
    var top_measure_y_position = StairConstants.TOP_MEASURE_TAG_START_Y;

    var startX1 = Stairs.startX1;
    var startX2 = Stairs.startX2;
    var startY = Math.max(Stairs.startY1,Stairs.startY2);
    var endY = Stairs.leftEndY;
    var endX1 = Stairs.leftEndX;
    var endX2 = Stairs.rightEndX;
    var heightMeasureX = Stairs.canvas.width / 2 - Stairs.options.flight2Treads.left.width - Stairs.options.flight1Treads.width/2;

    context.fillStyle = Stairs.options.treads.textColor;
    context.strokeStyle = Stairs.options.treads.textColor;
    context.lineWidth = 0.5;

    //Draw measure lines

    //Height measure
    context.setLineDash([5, 10]);
    context.beginPath();
    context.moveTo(heightMeasureX, endY);
    context.lineTo(heightMeasureX, startY);
    strokeXTimes(context,5);

    context.setLineDash([4, 4]);

    context.beginPath();
    context.moveTo(heightMeasureX - 10, endY + 0.5);
    context.lineTo(heightMeasureX + 10, endY + 0.5);
    strokeXTimes(context,5);

    context.beginPath();
    context.moveTo(heightMeasureX - 10, startY + 0.1);
    context.lineTo(heightMeasureX + 10, startY + 0.1);
    strokeXTimes(context,5);

    // Width measure
    context.setLineDash([5, 10]);
    context.beginPath();
    context.moveTo(endX1, top_measure_y_position + 0.5);
    context.lineTo(endX2, top_measure_y_position + 0.5);
    strokeXTimes(context,5);

    context.setLineDash([4, 4]);

    context.beginPath();
    context.moveTo(endX1 + 0.5, top_measure_y_position - 10);
    context.lineTo(endX1, top_measure_y_position + 10);
    strokeXTimes(context,5);

    context.beginPath();
    context.moveTo(endX2 + 0.5, top_measure_y_position - 10);
    context.lineTo(endX2 + 0.5, top_measure_y_position + 10);
    strokeXTimes(context,5);

    // Width flight1 measure
    context.setLineDash([5, 10]);
    context.beginPath();
    context.moveTo(startX1, bottom_measure_y_position + 10 + 0.5);
    context.lineTo(startX2, bottom_measure_y_position + 10 + 0.5);
    strokeXTimes(context,5);

    context.setLineDash([4, 4]);

    context.beginPath();
    context.moveTo(startX1 + 0.5, bottom_measure_y_position + 5);
    context.lineTo(startX1, bottom_measure_y_position + 20);
    strokeXTimes(context,5);

    context.beginPath();
    context.moveTo(startX2 + 0.5, bottom_measure_y_position + 0);
    context.lineTo(startX2 + 0.5, bottom_measure_y_position + 20);
    strokeXTimes(context,5);
    
    //Measures text
    context.textBaseline = 'middle';
    context.font = "12px " + Stairs.options.font;
    context.textAlign = 'center';

    // top measure
    context.fillText("(b) " + Stairs.printMMWidth + "mm", (startX1 + startX2)/2, top_measure_y_position + 20);

    // bottom measure (flight 1)
    context.fillText("(c) " + Stairs.printMMWidthFlight1 + "mm", (startX1 + startX2)/2, bottom_measure_y_position + 25);
    
    context.textAlign = 'left';
    context.save();
    context.translate(heightMeasureX + 10, Stairs.maxHeight/2);
    context.rotate(Math.PI/2);
    context.fillText("(a) " + Stairs.printMMHeight + "mm", 0,0);
    context.restore()


    context.restore();
}

function strokeXTimes (context,x){
    for(var i = 0; i < x; i++){
        context.stroke();
    }
}

Stairs.export = function (format, greyscale){
    var canvas = Stairs.canvas;
    if(format){
        if (format == 'jpeg'){
            if(greyscale){
                return Stairs.createGreyscaleCanvas().toDataURL("image/jpeg");
            }
            else{
                return canvas.toDataURL("image/jpeg");
            }
        }
        else if (format == 'png'){
            if(greyscale){
                return Stairs.createGreyscaleCanvas().toDataURL("image/png");
            }
            else{
                return canvas.toDataURL("image/png");
            }
        }
    }
    if(greyscale){
        return Stairs.createGreyscaleCanvas().toDataURL("image/png");
    }
    else{
        return canvas.toDataURL("image/png");
    }
}

Stairs.createGreyscaleCanvas = function(){
    var previousConfig = Stairs.config;
    var config = {};
    if(Stairs.options.type == 'regular'){
        config = {
            type : 'regular',
            backgroundColor : '#ffffff',
            font: Stairs.config.font,
            treads : {
                amount : Stairs.config.treads.amount,
                width : Stairs.config.treads.width, // in millimiters
                height : Stairs.config.treads.height, // in millimiters
                fillColor :'#ffffff', //optional
                strokeColor : '#000000', //optional
                textColor : '#000000' //optional
            },
            posts : {
                topLeft : Stairs.config.posts.topLeft, //optional: default false
                topRight : Stairs.config.posts.topRight, //optional: default false
                bottomLeft : Stairs.config.posts.bottomLeft, //optional: default false
                bottomRight : Stairs.config.posts.bottomRight, //optional: default false
                fillColor : '#ffffff', //optional
                strokeColor : '#000000', //optional
                textColor : '#000000' //optional
            },
            ballustrades : {
                left : Stairs.config.ballustrades.left, //optional: default false
                right : Stairs.config.ballustrades.right, //optional: default false
                primaryFillColor : '#ffffff', //optional
                secondaryFillColor : '#ffffff', //optional
                strokeColor : '#000000', //optional
            },
            featureTread : {
                left : Stairs.config.featureTread.left, //0: none 1: curtail 2: bullnose 3: double going curtail plus single curtail 4: double going curtail plus bullnose
                right : Stairs.config.featureTread.right, //0: none 1: curtail 2: bullnose 3: double going curtail plus single curtail 4: double going curtail plus bullnose
            },
            minHeight : Stairs.config.minHeight,  // in millimiters
            maxHeight : Stairs.config.maxHeight,  // in millimiters
            minWidth : Stairs.config.minWidth, // in millimiters
            maxWidth : Stairs.config.maxWidth  // in millimiters
        }
    }
    else if(Stairs.options.type == 'quarterturn'){
        config = {
            type : 'quarterturn',
            backgroundColor : '#ffffff',
            direction: Stairs.config.direction,
            font: Stairs.config.font,
            treadHeight: Stairs.config.treadHeight,
            flight1Treads : {
                amount : Stairs.config.flight1Treads.amount,
                width : Stairs.config.flight1Treads.width, // in millimiters
                fillColor :'#ffffff', //optional
                strokeColor : '#000000', //optional
                textColor : '#000000' //optional
            },
            turnTreadsAmount : Stairs.config.turnTreadsAmount,
            flight2Treads : {
                maxAmount : Stairs.config.flight2Treads.maxAmount,
                amount : Stairs.config.flight2Treads.amount,
                width : Stairs.config.flight2Treads.width, // in millimiters
                fillColor :'#ffffff', //optional
                strokeColor : '#000000', //optional
                textColor : '#000000' //optional
            },
            posts : {
                turnTopLeft : Stairs.config.posts.turnTopLeft, //optional: default false
                turnTopRight : Stairs.config.posts.turnTopRight, //optional: default false
                turnBottom : Stairs.config.posts.turnBottom, //optional: default false
                flight1BottomLeft : Stairs.config.posts.flight1BottomLeft, //optional: default false
                flight1BottomRight : Stairs.config.posts.flight1BottomRight, //optional: default false
                flight2Top : Stairs.config.posts.flight2Top, //optional: default false
                flight2Bottom : Stairs.config.posts.flight2Bottom, //optional: default false
                fillColor : '#ffffff', //optional
                strokeColor : '#000000', //optional
                textColor : '#000000' //optional
            },
            ballustrades : {
                flight1Outside : Stairs.config.ballustrades.flight1Outside, //optional: default false
                flight1Inside : Stairs.config.ballustrades.flight1Inside, //optional: default false
                flight2Outside : Stairs.config.ballustrades.flight2Outside, //optional: default false
                flight2Inside : Stairs.config.ballustrades.flight2Inside, //optional: default false
                turnTop : Stairs.config.ballustrades.turnTop, //optional: default false
                turnSide : Stairs.config.ballustrades.turnSide, //optional: default false
                primaryFillColor : '#ffffff', //optional
                secondaryFillColor : '#ffffff', //optional
                strokeColor : '#000000', //optional
            },
            featureTread : {
                left : Stairs.config.featureTread.left, //0: none 1: curtail 2: bullnose 3: double going curtail plus single curtail 4: double going curtail plus bullnose
                right : Stairs.config.featureTread.right, //0: none 1: curtail 2: bullnose 3: double going curtail plus single curtail 4: double going curtail plus bullnose
            },
            minHeight : Stairs.config.minHeight,  // in millimiters
            maxHeight : Stairs.config.maxHeight,  // in millimiters
            minWidth : Stairs.config.minWidth, // in millimiters
            maxWidth : Stairs.config.maxWidth  // in millimiters
        }
    }
    else if(Stairs.options.type == 'halfturn'){
        config = {
            type : 'halfturn',
            direction: Stairs.config.direction,
            backgroundColor : '#ffffff',
            font: Stairs.config.font,
            treadHeight: Stairs.config.treadHeight,
            flight1Treads : {
                amount : Stairs.config.flight1Treads.amount,
                width : Stairs.config.flight1Treads.width, // in millimiters
                fillColor :'#ffffff', //optional
                strokeColor : '#000000', //optional
                textColor : '#000000' //optional
            },
            turn1TreadsAmount : Stairs.config.turn1TreadsAmount,
            flight2Treads : {
                maxAmount : Stairs.config.flight2Treads.maxAmount,
                amount : Stairs.config.flight2Treads.amount,
                width : Stairs.config.flight2Treads.width, // in millimiters
                fillColor :'#ffffff', //optional
                strokeColor : '#000000', //optional
                textColor : '#000000' //optional
            },
            turn2TreadsAmount : Stairs.config.turn2TreadsAmount,
            flight3Treads : {
                maxAmount : Stairs.config.flight3Treads.maxAmount,
                amount : Stairs.config.flight3Treads.amount,
                width : Stairs.config.flight3Treads.width, // in millimiters
                fillColor :'#ffffff', //optional
                strokeColor : '#000000', //optional
                textColor : '#000000' //optional
            },
            posts : {
                turn1TopLeft : Stairs.config.posts.turn1TopLeft, //optional: default false
                turn1TopRight : Stairs.config.posts.turn1TopRight, //optional: default false
                turn1Bottom : Stairs.config.posts.turn1Bottom, //optional: default false
                turn2TopLeft : Stairs.config.posts.turn2TopLeft, //optional: default false
                turn2TopRight : Stairs.config.posts.turn2TopRight, //optional: default false
                turn2Bottom : Stairs.config.posts.turn2Bottom, //optional: default false
                flight1BottomLeft : Stairs.config.posts.flight1BottomLeft, //optional: default false
                flight1BottomRight : Stairs.config.posts.flight1BottomRight, //optional: default false
                flight3Left : Stairs.config.posts.flight3Left, //optional: default false
                flight3Right : Stairs.config.posts.flight3Right, //optional: default false
                fillColor : '#ffffff', //optional
                strokeColor : '#000000', //optional
                textColor : '#000000' //optional
            },
            ballustrades : {
                flight1Outside : Stairs.config.ballustrades.flight1Outside, //optional: default false
                flight1Inside : Stairs.config.ballustrades.flight1Inside, //optional: default false
                flight2Outside : Stairs.config.ballustrades.flight2Outside, //optional: default false
                flight2Inside : Stairs.config.ballustrades.flight2Inside, //optional: default false
                flight3Outside : Stairs.config.ballustrades.flight3Outside, //optional: default false
                flight3Inside : Stairs.config.ballustrades.flight3Inside, //optional: default false
                turn1Top : Stairs.config.ballustrades.turn1Top, //optional: default false
                turn1Side : Stairs.config.ballustrades.turn1Side, //optional: default false
                turn2Top : Stairs.config.ballustrades.turn2Top, //optional: default false
                turn2Side : Stairs.config.ballustrades.turn2Side, //optional: default false
                primaryFillColor : '#ffffff', //optional
                secondaryFillColor : '#ffffff', //optional
                strokeColor : '#000000', //optional
            },
            featureTread : {
                left : Stairs.config.featureTread.left, //0: none 1: curtail 2: bullnose 3: double going curtail plus single curtail 4: double going curtail plus bullnose
                right : Stairs.config.featureTread.right, //0: none 1: curtail 2: bullnose 3: double going curtail plus single curtail 4: double going curtail plus bullnose
            },
            minHeight : Stairs.config.minHeight,  // in millimiters
            maxHeight : Stairs.config.maxHeight,  // in millimiters
            minWidth : Stairs.config.minWidth, // in millimiters
            maxWidth : Stairs.config.maxWidth  // in millimiters
        }
    }
    else if(Stairs.options.type == 'halfturn'){
        config = {
            type : 'halfturn',
            direction: Stairs.config.direction,
            backgroundColor : '#ffffff',
            font: Stairs.config.font,
            treadHeight: Stairs.config.treadHeight,
            flight1Treads : {
                amount : Stairs.config.flight1Treads.amount,
                width : Stairs.config.flight1Treads.width, // in millimiters
                fillColor :'#ffffff', //optional
                strokeColor : '#000000', //optional
                textColor : '#000000' //optional
            },
            turn1TreadsAmount : Stairs.config.turn1TreadsAmount,
            flight2Treads : {
                maxAmount : Stairs.config.flight2Treads.maxAmount,
                amount : Stairs.config.flight2Treads.amount,
                width : Stairs.config.flight2Treads.width, // in millimiters
                fillColor :'#ffffff', //optional
                strokeColor : '#000000', //optional
                textColor : '#000000' //optional
            },
            turn2TreadsAmount : Stairs.config.turn2TreadsAmount,
            flight3Treads : {
                maxAmount : Stairs.config.flight3Treads.maxAmount,
                amount : Stairs.config.flight3Treads.amount,
                width : Stairs.config.flight3Treads.width, // in millimiters
                fillColor :'#ffffff', //optional
                strokeColor : '#000000', //optional
                textColor : '#000000' //optional
            },
            posts : {
                turn1TopLeft : Stairs.config.posts.turn1TopLeft, //optional: default false
                turn1TopRight : Stairs.config.posts.turn1TopRight, //optional: default false
                turn1Bottom : Stairs.config.posts.turn1Bottom, //optional: default false
                turn2TopLeft : Stairs.config.posts.turn2TopLeft, //optional: default false
                turn2TopRight : Stairs.config.posts.turn2TopRight, //optional: default false
                turn2Bottom : Stairs.config.posts.turn2Bottom, //optional: default false
                flight1BottomLeft : Stairs.config.posts.flight1BottomLeft, //optional: default false
                flight1BottomRight : Stairs.config.posts.flight1BottomRight, //optional: default false
                flight3Left : Stairs.config.posts.flight3Left, //optional: default false
                flight3Right : Stairs.config.posts.flight3Right, //optional: default false
                fillColor : '#ffffff', //optional
                strokeColor : '#000000', //optional
                textColor : '#000000' //optional
            },
            ballustrades : {
                flight1Outside : Stairs.config.ballustrades.flight1Outside, //optional: default false
                flight1Inside : Stairs.config.ballustrades.flight1Inside, //optional: default false
                flight2Outside : Stairs.config.ballustrades.flight2Outside, //optional: default false
                flight2Inside : Stairs.config.ballustrades.flight2Inside, //optional: default false
                flight3Outside : Stairs.config.ballustrades.flight3Outside, //optional: default false
                flight3Inside : Stairs.config.ballustrades.flight3Inside, //optional: default false
                turn1Top : Stairs.config.ballustrades.turn1Top, //optional: default false
                turn1Side : Stairs.config.ballustrades.turn1Side, //optional: default false
                turn2Top : Stairs.config.ballustrades.turn2Top, //optional: default false
                turn2Side : Stairs.config.ballustrades.turn2Side, //optional: default false
                primaryFillColor : '#ffffff', //optional
                secondaryFillColor : '#ffffff', //optional
                strokeColor : '#000000', //optional
            },
            featureTread : {
                left : Stairs.config.featureTread.left, //0: none 1: curtail 2: bullnose 3: double going curtail plus single curtail 4: double going curtail plus bullnose
                right : Stairs.config.featureTread.right, //0: none 1: curtail 2: bullnose 3: double going curtail plus single curtail 4: double going curtail plus bullnose
            },
            minHeight : Stairs.config.minHeight,  // in millimiters
            maxHeight : Stairs.config.maxHeight,  // in millimiters
            minWidth : Stairs.config.minWidth, // in millimiters
            maxWidth : Stairs.config.maxWidth  // in millimiters
        }
    }
    else if(Stairs.options.type == 'doubleturn'){
        config = {
            type : 'doubleturn',
            backgroundColor : '#ffffff',
            font: Stairs.config.font,
            treadHeight: Stairs.config.treadHeight,
            flight1Treads : {
                amount : Stairs.config.flight1Treads.amount,
                width : Stairs.config.flight1Treads.width, // in millimiters
                fillColor :'#ffffff', //optional
                strokeColor : '#000000', //optional
                textColor : '#000000' //optional
            },
            flight2Treads : {
                left: {
                    maxAmount : Stairs.config.flight2Treads.left.maxAmount,
                    amount : Stairs.config.flight2Treads.left.amount,
                },
                right: {
                    maxAmount : Stairs.config.flight2Treads.right.maxAmount,
                    amount : Stairs.config.flight2Treads.right.amount,
                },
                width : Stairs.config.flight2Treads.width, // in millimiters
                fillColor :'#ffffff', //optional
                strokeColor : '#000000', //optional
                textColor : '#000000' //optional
            },
            posts : {
                flight1BottomLeft : Stairs.config.posts.flight1BottomLeft, //optional: default false
                flight1BottomRight : Stairs.config.posts.flight1BottomRight, //optional: default false
                turnTopLeft : Stairs.config.posts.turnTopLeft, //optional: default false
                turnTopRight : Stairs.config.posts.turnTopRight, //optional: default false
                leftFlightTop : Stairs.config.posts.leftFlightTop, //optional: default false
                leftFlightBottom : Stairs.config.posts.leftFlightBottom, //optional: default false
                rightFlightTop : Stairs.config.posts.rightFlightTop, //optional: default false
                rightFlightBottom : Stairs.config.posts.rightFlightBottom, //optional: default false
                fillColor : '#ffffff', //optional
                strokeColor : '#000000', //optional
                textColor : '#000000' //optional
            },
            ballustrades : {
                flight1Left : Stairs.config.ballustrades.flight1Left, //optional: default false
                flight1Right : Stairs.config.ballustrades.flight1Right, //optional: default false
                leftFlightTop : Stairs.config.ballustrades.leftFlightTop, //optional: default false
                leftFlightBottom : Stairs.config.ballustrades.leftFlightBottom, //optional: default false
                rightFlightTop : Stairs.config.ballustrades.rightFlightTop, //optional: default false
                rightFlightBottom : Stairs.config.ballustrades.rightFlightBottom, //optional: default false
                turnTop : Stairs.config.ballustrades.turnTop, //optional: default false
                primaryFillColor : '#ffffff', //optional
                secondaryFillColor : '#ffffff', //optional
                strokeColor : '#000000', //optional
            },
            featureTread : {
                left : Stairs.config.featureTread.left, //0: none 1: curtail 2: bullnose 3: double going curtail plus single curtail 4: double going curtail plus bullnose
                right : Stairs.config.featureTread.right, //0: none 1: curtail 2: bullnose 3: double going curtail plus single curtail 4: double going curtail plus bullnose
            },
            minHeight : Stairs.config.minHeight,  // in millimiters
            maxHeight : Stairs.config.maxHeight,  // in millimiters
            minWidth : Stairs.config.minWidth, // in millimiters
            maxWidth : Stairs.config.maxWidth  // in millimiters
        }
    }
    var canvas = document.createElement('canvas');
    canvas.width = Stairs.canvas.width;
    canvas.height = Stairs.canvas.height;
    Stairs.init(canvas,config);
    Stairs.init(Stairs.canvas,previousConfig);
    return canvas;
}

Stairs.calculateStartY = function(y, type){
    var isLeftCurtail = (Stairs.options.featureTread.left == 1);
    var isLeftBullnose = (Stairs.options.featureTread.left == 2);
    var isRightCurtail = (Stairs.options.featureTread.right == 1);
    var isRightBullnose = (Stairs.options.featureTread.right == 2);
    var isLeftDoubleCurtail = (Stairs.options.featureTread.left == 3);
    var isLeftDoubleBullnose = (Stairs.options.featureTread.left == 4);
    var isRightDoubleCurtail = (Stairs.options.featureTread.right == 3);
    var isRightDoubleBullnose = (Stairs.options.featureTread.right == 4);

    var y1 = y;
    var y2 = y;

    if(isLeftDoubleCurtail || isLeftDoubleBullnose){
        y1 -= (Stairs.options.flight1Treads.height * StairConstants.FEATURE_TREAD_HEIGHT + Stairs.options.flight1Treads.height)
    }
    if(isRightDoubleCurtail || isRightDoubleBullnose){
        y2 -= (Stairs.options.flight1Treads.height * StairConstants.FEATURE_TREAD_HEIGHT + Stairs.options.flight1Treads.height)
    }
    if(isLeftCurtail || isLeftBullnose){
        y1 -= Stairs.options.flight1Treads.height;
    }
    if(isRightCurtail || isRightBullnose){
        y2 -= Stairs.options.flight1Treads.height;
    }

    return ({y1 : y1, y2: y2});
}

Stairs.animation = function(type){
    switch(type){
        case Stairs.StairTypeEnum.HALFTURN:
            if(Stairs.debug.leftFeatureTread == undefined){
                Stairs.debug.leftFeatureTread = 0;
            }
            else if(Stairs.debug.leftFeatureTread < 4){
                Stairs.debug.leftFeatureTread++;
            }
            else{
                if(Stairs.debug.rightFeatureTread == undefined){
                    Stairs.debug.rightFeatureTread = 0;
                }
                else if(Stairs.debug.rightFeatureTread < 4){
                    Stairs.debug.rightFeatureTread++;
                }
            }

            if(Stairs.debug.rightFeatureTread == 4 && Stairs.debug.leftFeatureTread == 4){
                if(Stairs.debug.leftFlightTreadAmount == undefined){
                    Stairs.debug.leftFlightTreadAmount = 0;
                }
                else if(Stairs.debug.leftFlightTreadAmount < Stairs.options.flight2Treads.left.maxAmount){
                    Stairs.debug.leftFlightTreadAmount++;
                }
                else{
                    if(Stairs.debug.rightFlightTreadAmount == undefined){
                        Stairs.debug.rightFlightTreadAmount = 0;
                    }
                    else if(Stairs.debug.rightFlightTreadAmount < Stairs.options.flight2Treads.right.maxAmount){
                        Stairs.debug.rightFlightTreadAmount++;
                    }
                    else{
                        if(Stairs.debug.flight1TreadAmount == undefined){
                            Stairs.debug.flight1TreadAmount = 4;
                        }
                        else if(Stairs.debug.flight1TreadAmount < 10){
                            Stairs.debug.flight1TreadAmount++;
                        }
                        else{
                            Stairs.debug.interval = clearInterval();
                            Stairs.debug.interval = setInterval(function(){
                                Stairs.animation('halfturn');
                            },50);
                        }
                    }
                }
            }
                var config = {
                type: 'halfturn',
                direction: 'left',
                backgroundColor : '#f4f0e7',
                font: 'Varela Round',
                treadHeight: 150, // in millimeters
                flight1Treads : {
                    amount : Stairs.debug.halfturn.flight1TreadAmount,
                    width : 2200, // in millimeters
                    fillColor : '#e0d9c9', //optional
                    strokeColor : '#5e5a56', //optional
                    textColor : '#641616' //optional
                },
                turn1TreadsAmount : 3,
                flight2Treads : {
                    maxAmount : 6,
                    amount : Stairs.debug.halfturn.flight2TreadAmount ,
                    width : 2200, // in millimeters
                    fillColor : '#e0d9c9', //optional
                    strokeColor : '#5e5a56', //optional
                    textColor : '#641616' //optional
                },
                turn2TreadsAmount : 2,
                flight3Treads : {
                    amount : Stairs.debug.halfturn.flight3TreadAmount ,
                    width : 2200, // in millimeters
                    fillColor : '#e0d9c9', //optional
                    strokeColor : '#5e5a56', //optional
                    textColor : '#641616' //optional
                },
                posts : {
                    flight1BottomLeft : true, //optional: default false
                    flight1BottomRight : true, //optional: default false
                    turn1TopLeft : true, //optional: default false
                    turn1TopRight : true, //optional: default false
                    turn1Bottom : true, // for outside post. inside bottom post is not optional
                    turn2TopLeft : true, //optional: default false
                    turn2TopRight : true, //optional: default false
                    turn2Bottom : true, // for outside post. inside bottom post is not optional
                    flight3Left : true, //optional: default false
                    flight3Right : true, //optional: default false
                    fillColor : '#caba7e', //optional
                    strokeColor : '#5e5a56', //optional
                    textColor : '#837038' //optional
                },
                ballustrades : {
                    flight1Outside: true, //optional: default false
                    flight1Inside: true, //optional: default false
                    flight2Outside: true, //optional: default false
                    flight2Inside: true, //optional: default false
                    flight3Outside: true, //optional: default false
                    flight3Inside: true, //optional: default false
                    turn1Top: true, //optional: default false
                    turn1Side: true, //optional: default false
                    turn2Top: true, //optional: default false
                    turn2Side: true, //optional: default false
                    primaryFillColor : '#caba7e', //optional
                    secondaryFillColor : '#b39f79', //optional
                    strokeColor : '#5e5a56', //optional
                },
                featureTread : {
                    left : Stairs.debug.halfturn.leftFeatureTread, //0: none 1: curtail 2: bullnose 3: double going curtail plus single curtail 4: double going curtail plus bullnose
                    right : Stairs.debug.halfturn.rightFeatureTread, //0: none 1: curtail 2: bullnose 3: double going curtail plus single curtail 4: double going curtail plus bullnose
                },
                minHeight : 50,  // in millimeters
                maxHeight : 300,  // in millimeters
                minWidth : 1700, // in millimeters
                maxWidth : 2200  // in millimeters
            }
            Stairs.init(Stairs.canvas, config);
            break;

        case Stairs.StairTypeEnum.DOUBLETURN:
            if(Stairs.debug.doubleturn.leftFeatureTread == undefined){
                Stairs.debug.doubleturn.leftFeatureTread = 0;
            }
            else if(Stairs.debug.doubleturn.leftFeatureTread < 4){
                Stairs.debug.doubleturn.leftFeatureTread++;
            }
            else{
                if(Stairs.debug.doubleturn.rightFeatureTread == undefined){
                    Stairs.debug.doubleturn.rightFeatureTread = 0;
                }
                else if(Stairs.debug.doubleturn.rightFeatureTread < 4){
                    Stairs.debug.doubleturn.rightFeatureTread++;
                }
            }

            if(Stairs.debug.doubleturn.rightFeatureTread == 4 && Stairs.debug.doubleturn.leftFeatureTread == 4){
                if(Stairs.debug.doubleturn.leftFlightTreadAmount == undefined){
                    Stairs.debug.doubleturn.leftFlightTreadAmount = 0;
                }
                else if(Stairs.debug.doubleturn.leftFlightTreadAmount < Stairs.options.flight2Treads.left.maxAmount){
                    Stairs.debug.doubleturn.leftFlightTreadAmount++;
                }
                else{
                    if(Stairs.debug.doubleturn.rightFlightTreadAmount == undefined){
                        Stairs.debug.doubleturn.rightFlightTreadAmount = 0;
                    }
                    else if(Stairs.debug.doubleturn.rightFlightTreadAmount < Stairs.options.flight2Treads.right.maxAmount){
                        Stairs.debug.doubleturn.rightFlightTreadAmount++;
                    }
                    else{
                        if(Stairs.debug.doubleturn.flight1TreadAmount == undefined){
                            Stairs.debug.doubleturn.flight1TreadAmount = 4;
                        }
                        else if(Stairs.debug.doubleturn.flight1TreadAmount < 10){
                            Stairs.debug.doubleturn.flight1TreadAmount++;
                        }
                        else{
                            Stairs.debug.interval = clearInterval();
                            Stairs.debug.interval = setInterval(function(){
                                Stairs.debugAllCases('halfturn');
                            },50);
                        }
                    }
                }
            }
            var config = {
                type: 'doubleturn',
                backgroundColor : '#f4f0e7',
                font: 'Varela Round',
                treadHeight: 150, // in millimeters
                flight1Treads : {
                    amount : Stairs.debug.doubleturn.flight1TreadAmount,
                    width : 2200, // in millimeters
                    fillColor : '#e0d9c9', //optional
                    strokeColor : '#5e5a56', //optional
                    textColor : '#641616' //optional
                },
                flight2Treads : {
                    left : {
                        maxAmount : 4,
                        amount : Stairs.debug.doubleturn.leftFlightTreadAmount
                    },
                    right : {
                        maxAmount : 4,
                        amount : Stairs.debug.doubleturn.rightFlightTreadAmount

                    },
                    width : 2200, // in millimeters
                    fillColor : '#e0d9c9', //optional
                    strokeColor : '#5e5a56', //optional
                    textColor : '#641616' //optional
                },
                posts : {
                    flight1BottomLeft : true, //optional: default false
                    flight1BottomRight : true, //optional: default false
                    turnTopLeft : true, //optional: default false
                    turnTopRight : true, //optional: default false
                    //turnBottom are both required?
                    leftFlightTop : true,
                    leftFlightBottom : true,
                    rightFlightTop : true,
                    rightFlightBottom : true,
                    fillColor : '#caba7e', //optional
                    strokeColor : '#5e5a56', //optional
                    textColor : '#837038' //optional
                },
                ballustrades : {
                    flight1Left: true, //optional: default false
                    flight1Right: true, //optional: default false
                    leftFlightTop: true, //optional: default false
                    leftFlightBottom: true, //optional: default false
                    rightFlightTop: true, //optional: default false
                    rightFlightBottom: true, //optional: default false
                    turnTop: true, //optional: default false
                    primaryFillColor : '#caba7e', //optional
                    secondaryFillColor : '#b39f79', //optional
                    strokeColor : '#5e5a56', //optional
                },
                featureTread : {
                    left : Stairs.debug.doubleturn.leftFeatureTread, //0: none 1: curtail 2: bullnose 3: double going curtail plus single curtail 4: double going curtail plus bullnose
                    right : Stairs.debug.doubleturn.rightFeatureTread, //0: none 1: curtail 2: bullnose 3: double going curtail plus single curtail 4: double going curtail plus bullnose
                },
                minHeight : 50,  // in millimeters
                maxHeight : 300,  // in millimeters
                minWidth : 1700, // in millimeters
                maxWidth : 2200  // in millimeters
            }
            Stairs.init(Stairs.canvas, config);
            break;
    }
}