
function handleMessageFromWorker(message) {

    if ((typeof message.data.funname != "undefined") && (typeof message.data.args != "undefined")) {

        // console.log("Attempting to execute function",message.data.funname,"with arguments",message.data.args);

        window[message.data.funname](message.data.args);

    } else {

        // console.log('Main thread could not resolve message from worker :',message);
        // console.log(message.data);

    }

}

var DownloadTxtFile = (function () {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    return function (args) {
        blob = new Blob([args.data],{type : 'application/text'})
        url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = args.filename;
 +       a.click();
        window.URL.revokeObjectURL(url);
    };
}());

async function Play_Loop_From_Python(args){

	var displayCanvas = document.getElementById("displayCanvas");

    var event = new Event('StopAnimationFromOutsideCanvas');
    displayCanvas.dispatchEvent(event);

    var txt = await args.JSON_data.text();
    PlotInfo = JSON.parse(txt);
    Pos = {"data":args.NPY_data,"shape":args.NPY_shape};

    var event = new Event('EnableAnimationFromOutsideCanvas');
    displayCanvas.dispatchEvent(event);


    if (document.getElementById('checkbox_DisplayLoopsDuringSearch').checked) {

        trajectoriesOn = true;
	
        document.getElementById("trajectoryButton").textContent ="Hide trails"

    } 

    var event = new Event('FinalizeAndPlayFromOutsideCanvas');
    event.DoClearScreen = args.DoClearScreen;
    event.DoXMinMax = args.DoXMinMax;

    displayCanvas.dispatchEvent(event);

    var ChoreoExecuteBtn = document.getElementById("ChoreoExecuteBtn");
    ChoreoExecuteBtn.disabled = "";
    var ChoreoDispInitStateBtn = document.getElementById("ChoreoDispInitStateBtn");
    ChoreoDispInitStateBtn.disabled = "";

    var RotSlider = $("#RotSlider").data("roundSlider");
    RotSlider.enable();

    var Python_State_Div = document.getElementById("Python_State_Div");
    Python_State_Div.innerHTML = "Ready";
    Python_State_Div.classList.add('w3-green');
    Python_State_Div.classList.remove('w3-orange');
    Python_State_Div.classList.remove('w3-red');
}


function Python_no_sol_found(args) {

	var displayCanvas = document.getElementById("displayCanvas");

    var event = new Event('EnableAnimationFromOutsideCanvas');
    displayCanvas.dispatchEvent(event);

    if (document.getElementById('checkbox_DisplayLoopsDuringSearch').checked) {

        trajectoriesOn = true;
	
        document.getElementById("trajectoryButton").textContent ="Hide trails"

    } 

    var ChoreoExecuteBtn = document.getElementById("ChoreoExecuteBtn");
    ChoreoExecuteBtn.disabled = "";
    var ChoreoDispInitStateBtn = document.getElementById("ChoreoDispInitStateBtn");
    ChoreoDispInitStateBtn.disabled = "";

    var RotSlider = $("#RotSlider").data("roundSlider");
    RotSlider.enable();

    var Python_State_Div = document.getElementById("Python_State_Div");
    Python_State_Div.innerHTML = "Ready";
    Python_State_Div.classList.add('w3-green');
    Python_State_Div.classList.remove('w3-orange');
    Python_State_Div.classList.remove('w3-red');

}


async function Set_PlotInfo_From_Python(args){

    var txt = await args.JSON_data.text();
    PlotInfo = JSON.parse(txt);

    var event = new Event('FinalizeSetOrbitFromOutsideCanvas');
    displayCanvas.dispatchEvent(event);

}

async function Plot_Loops_During_Optim_From_Python(args){

	var displayCanvas = document.getElementById("displayCanvas");

    Pos = {"data":args.NPY_data,"shape":args.NPY_shape};

    setPlotWindow(args.Current_PlotWindow);

    var send_event = new Event('DrawAllPathsFromOutsideCanvas');
    displayCanvas.dispatchEvent(send_event);

}

async function Python_Imports_Done(args){

	var displayCanvas = document.getElementById("displayCanvas");

    PythonPrint({txt:"&#10;All python packages imported&#10;"});

    var ChoreoExecuteBtn = document.getElementById("ChoreoExecuteBtn");
    ChoreoExecuteBtn.disabled = "";
    var ChoreoDispInitStateBtn = document.getElementById("ChoreoDispInitStateBtn");
    ChoreoDispInitStateBtn.disabled = "";

    var RotSlider = $("#RotSlider").data("roundSlider");
    RotSlider.enable();
    
    var Python_State_Div = document.getElementById("Python_State_Div");

    Python_State_Div.innerHTML = "Ready";
    Python_State_Div.classList.remove('w3-red');
    Python_State_Div.classList.remove('w3-orange');
    Python_State_Div.classList.add('w3-green');

    var event = new Event('EnableAnimationFromOutsideCanvas');
    displayCanvas.dispatchEvent(event);

}

pyodide_worker.addEventListener('message', handleMessageFromWorker);

function OnWindowResize(){

    var CommandBody = document.getElementById("CommandBody");
    var AllLeftTabs = document.getElementsByClassName("LeftTab");
    
    if (window.innerWidth > 1220){
        // Horizontal mode
        CommandBody.style.position = "relative";
        CommandBody.style.marginLeft = "610px";

        if (AllLeftTabs[0].classList.contains("open")) {
            CommandBody.style.bottom = "580px";
        } else {
            CommandBody.style.bottom = "710px";
        }

    } else {
        CommandBody.style.position = "";
        CommandBody.style.marginLeft = "10px";
        CommandBody.style.bottom = "0px";
    }

}

function ClickTopTabBtn(TabId) {
    var i;
    var AllTopTabBtns = document.getElementsByClassName("TopTabBtn");
    var AllMainTabs = document.getElementsByClassName("MainTab");

    for (i = 0; i < AllTopTabBtns.length; i++) { if (AllTopTabBtns[i].classList.contains(TabId)) {AllTopTabBtns[i].classList.add("w3-red");} else {AllTopTabBtns[i].classList.remove("w3-red") ;}}
    for (i = 0; i < AllMainTabs.length  ; i++) { if (AllMainTabs[i].classList.contains(TabId))   {AllMainTabs[i].style.display   = "block";} else {AllMainTabs[i].style.display   = "none"     ;}}
}

function  GeomTopTabBtn(TabId) {
    switch (TabId) {
        case 'Main': {
            ClickTopTabBtn('Main_Launch');
            break;}    
        case 'Geom': {
            ClickTopTabBtn('Geom_Bodies');
            break;}
        case 'Animation': {
            ClickTopTabBtn('Animation_Colors');
            break;}
        case 'Solver': {
            ClickTopTabBtn('Solver_Discr');
            break;}
    }
}

function ClickLeftTabBtn(TabId) {
    var i;
    var AllLeftTabBtns = document.getElementsByClassName("LeftTabBtn");
    var AllTopTab = document.getElementsByClassName("TopTab");

    for (i = 0; i < AllLeftTabBtns.length; i++) {
         if (AllLeftTabBtns[i].classList.contains(TabId)){
            AllLeftTabBtns[i].classList.add("w3-red");
        } else {
            AllLeftTabBtns[i].classList.remove("w3-red");
        }
    }
    for (i = 0; i < AllTopTab.length     ; i++) {
        if (AllTopTab[i].classList.contains(TabId)){
            AllTopTab[i].style.display     = "block" ;
        } else {
            AllTopTab[i].style.display     = "none"     ;
        }
    }
    GeomTopTabBtn(TabId);
}

var saveJSONData = (function () {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    return function (data, fileName) {
        var json = JSON.stringify(data,null,2),
            blob = new Blob([json], {type: "octet/stream"}),
            url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
    };
}());

function SaveConfigFile(){

    var ConfigDict = GatherConfigDict();
    saveJSONData(ConfigDict, "choreo_config.json");

}

function ChoreoExecuteClick() {

    if (!document.getElementById("ChoreoExecuteBtn").disabled) {

        var ChoreoExecuteBtn = document.getElementById("ChoreoExecuteBtn");
        ChoreoExecuteBtn.disabled = "disabled";
        var ChoreoDispInitStateBtn = document.getElementById("ChoreoDispInitStateBtn");
        ChoreoDispInitStateBtn.disabled = "disabled";

        var displayCanvas = document.getElementById("displayCanvas");

        PythonClearPrints();

        var Python_State_Div = document.getElementById("Python_State_Div");

        Python_State_Div.innerHTML = "Working";
        Python_State_Div.classList.add('w3-orange');
        Python_State_Div.classList.remove('w3-green');
        Python_State_Div.classList.remove('w3-red');

        if (document.getElementById('checkbox_DisplayLoopsDuringSearch').checked) {

            var RotSlider = $("#RotSlider").data("roundSlider");
            RotSlider.setValue(0);
            RotSlider.disable();

            var event = new Event('StopAnimationFromOutsideCanvas');
            displayCanvas.dispatchEvent(event);

            var event = new Event('DisableAnimationFromOutsideCanvas');
            displayCanvas.dispatchEvent(event);  

            trajectoriesOn = false;

        }

        var ConfigDict = GatherConfigDict();

        pyodide_worker.postMessage({funname:"LoadDataInWorker",args:{ConfigDict:ConfigDict}});
        pyodide_worker.postMessage({funname:"ExecutePythonFile",args:"./python_scripts/RunOnce.py"});

    }

}

function TestClick() {

}

function ChoreoSaveInitStateClick() {

    var ConfigDict = GatherConfigDict();

    pyodide_worker.postMessage({funname:"LoadDataInWorker",args:{ConfigDict:ConfigDict}});
    pyodide_worker.postMessage({funname:"ExecutePythonFile",args:"./python_scripts/Load_GUI_params_and_save_init.py"});

}

function GenerateInitStateClick() {

    PythonClearPrints();

    var ConfigDict = GatherConfigDict();

    pyodide_worker.postMessage({funname:"LoadDataInWorker",args:{ConfigDict:ConfigDict}});
    pyodide_worker.postMessage({funname:"ExecutePythonFile",args:"./python_scripts/Save_init_state.py"});

}

function GatherConfigDict() {
    /* Gathers all relevent input in the page and puts it in a dictionary */

    var ConfigDict = {};

    ConfigDict['Main_Launch'] = {};

    var speedSlider = $("#speedSlider");
    ConfigDict['Main_Launch'] ['SpeedSlider_value'] = speedSlider.slider("value");

    ConfigDict['Geom_Bodies'] = {};

    ConfigDict['Geom_Bodies'] ['MomConsImposed'] = document.getElementById('checkbox_MomCons').checked ;

    table = document.getElementById('table_body_loop');
    var ncols = table.rows[0].cells.length;

    ConfigDict['Geom_Bodies'] ['n_loops'] = ncols - 1;

    ConfigDict['Geom_Bodies'] ['mass'] = [];
    ConfigDict['Geom_Bodies'] ['nbpl'] = [];

    ConfigDict['Geom_Bodies'] ['SymType'] = [];

    for (var icol=1; icol < ncols; icol++) {

        var the_sym = {};
        
        the_sym['n'] =  parseInt(  table.rows[1].cells[icol].children[0].value,10);

        ConfigDict['Geom_Bodies'] ['nbpl'] . push( parseInt(  table.rows[1].cells[icol].children[0].value,10));
        ConfigDict['Geom_Bodies'] ['mass'] . push( parseFloat(table.rows[2].cells[icol].children[0].value)   );
        
        the_sym['name'] = table.rows[3].cells[icol].children[0].value;
        the_sym['k'] = parseInt(table.rows[4].cells[icol].children[0].value,10);
        the_sym['l'] = parseInt(table.rows[5].cells[icol].children[0].value,10);
        the_sym['m'] = parseInt(table.rows[6].cells[icol].children[0].value,10);
        the_sym['p'] = parseInt(table.rows[7].cells[icol].children[0].value,10);
        the_sym['q'] = parseInt(table.rows[8].cells[icol].children[0].value,10);

        ConfigDict['Geom_Bodies'] ['SymType'].push(the_sym);

    }


    ConfigDict['Geom_Target'] = {};

    ConfigDict['Geom_Random'] = {};
    ConfigDict['Geom_Random'] ['coeff_ampl_o']    = parseFloat(document.getElementById('input_coeff_ampl_o'   ).value   );
    ConfigDict['Geom_Random'] ['coeff_ampl_min']  = parseFloat(document.getElementById('input_coeff_ampl_min' ).value   );
    ConfigDict['Geom_Random'] ['k_infl']          = parseInt(  document.getElementById('input_k_infl'         ).value,10);
    ConfigDict['Geom_Random'] ['k_max']           = parseInt(  document.getElementById('input_k_max'          ).value,10);

    ConfigDict['Geom_Custom'] = {};

    table = document.getElementById('table_custom_sym');
    var ncols = table.rows[0].cells.length;

    ConfigDict['Geom_Custom'] ['n_custom_sym'] = ncols - 1;
    ConfigDict['Geom_Custom'] ['CustomSyms'] = [];

    for (var icol=1; icol < ncols; icol++) {

        var the_sym = {};
        
        the_sym['LoopTarget']   = parseInt( table.rows[1].cells[icol].children[0].value,10);
        the_sym['LoopSource']   = parseInt( table.rows[2].cells[icol].children[0].value,10);
        the_sym['Reflexion']    =           table.rows[3].cells[icol].children[0].value    ;
        the_sym['RotAngleNum']  = parseInt( table.rows[4].cells[icol].children[0].value,10);
        the_sym['RotAngleDen']  = parseInt( table.rows[5].cells[icol].children[0].value,10);
        the_sym['TimeRev']      =           table.rows[6].cells[icol].children[0].value    ;
        the_sym['TimeShiftNum'] = parseInt( table.rows[7].cells[icol].children[0].value,10);
        the_sym['TimeShiftDen'] = parseInt( table.rows[8].cells[icol].children[0].value,10);

        ConfigDict['Geom_Custom'] ['CustomSyms'].push(the_sym);

    }


    ConfigDict['Animation_Colors'] = {};
    ConfigDict['Animation_Colors'] ["color_method_input"] = document.getElementById("color_method_input").value;

    ConfigDict['Animation_Colors'] ["n_color"] = n_color;
    ConfigDict['Animation_Colors'] ["colorLookup"] = colorLookup;

    ConfigDict['Animation_Size'] = {};
    ConfigDict['Animation_Size'] ['checkbox_Mass_Scale']  = document.getElementById('checkbox_Mass_Scale').checked ;
    ConfigDict['Animation_Size'] ['input_body_radius']  = document.getElementById('input_body_radius').value ;
    ConfigDict['Animation_Size'] ['input_trail_width']  = document.getElementById('input_trail_width').value ;  
    ConfigDict['Animation_Size'] ['input_trail_vanish_speed']  = document.getElementById('input_trail_vanish_speed').value;

    ConfigDict['Animation_Framerate'] = {};
    ConfigDict['Animation_Framerate'] ['checkbox_Limit_FPS']  = document.getElementById('checkbox_Limit_FPS').checked  ;
    ConfigDict['Animation_Framerate'] ['input_Limit_FPS']  = parseInt(document.getElementById('input_Limit_FPS').value,10)        ;

    ConfigDict['Animation_Search'] = {};
    ConfigDict['Animation_Search'] ['DisplayLoopsDuringSearch']  = document.getElementById('checkbox_DisplayLoopsDuringSearch').checked  ;
    ConfigDict['Animation_Search'] ['DisplayBodiesDuringSearch']  = document.getElementById('checkbox_DisplayBodiesDuringSearch').checked  ;

    ConfigDict['Solver_Discr'] = {};
    ConfigDict['Solver_Discr'] ['Use_exact_Jacobian']  = document.getElementById('checkbox_exactJ').checked            ;
    ConfigDict['Solver_Discr'] ['ncoeff_init']         = parseInt(document.getElementById('input_ncoeff_init').value,10)        ;
    ConfigDict['Solver_Discr'] ['n_reconverge_it_max'] = parseInt(document.getElementById('input_n_reconverge_it_max').value,10);

    ConfigDict['Solver_Optim'] = {};

    ConfigDict['Solver_Optim'] ['krylov_method']  = document.getElementById('krylov_method').value;
    ConfigDict['Solver_Optim'] ['line_search']    = document.getElementById('linesearch_method').value;

    ConfigDict['Solver_Optim'] ['Newt_err_norm_max'] = parseFloat(document.getElementById('input_Newt_err_norm_max').value);

    ConfigDict['Solver_Loop'] = {};

    table = document.getElementById('table_cvg_loop');
    var ncols = table.rows[0].cells.length;

    ConfigDict['Solver_Loop'] ['n_optim_param'] = ncols - 1;
    ConfigDict['Solver_Loop'] ['gradtol_list'] = [];
    ConfigDict['Solver_Loop'] ['inner_maxiter_list'] = [];
    ConfigDict['Solver_Loop'] ['maxiter_list'] = [];
    ConfigDict['Solver_Loop'] ['outer_k_list'] = [];
    ConfigDict['Solver_Loop'] ['store_outer_Av_list'] = [];

    for (var icol=1; icol < ncols; icol++) {

        ConfigDict['Solver_Loop'] ['gradtol_list']       . push( parseFloat(table.rows[1].cells[icol].children[0].value   ));
        ConfigDict['Solver_Loop'] ['maxiter_list']       . push( parseInt(  table.rows[2].cells[icol].children[0].value,10));
        ConfigDict['Solver_Loop'] ['inner_maxiter_list'] . push( parseInt(  table.rows[3].cells[icol].children[0].value,10));
        ConfigDict['Solver_Loop'] ['outer_k_list']       . push( parseInt(  table.rows[4].cells[icol].children[0].value,10));
        
        ConfigDict['Solver_Loop'] ['store_outer_Av_list']. push( table.rows[5].cells[icol].children[0].value == "True");

    }

    ConfigDict['Solver_Checks'] = {};

    ConfigDict['Solver_Checks'] ['Look_for_duplicates'] = document.getElementById('checkbox_duplicates').checked;
    ConfigDict['Solver_Checks'] ['duplicate_eps']       = parseFloat(document.getElementById('input_duplicate_eps').value);
    ConfigDict['Solver_Checks'] ['Check_Escape']        = document.getElementById('checkbox_escape').checked;

    return ConfigDict;
}

function ClickLoadConfigFile(files) {
    files = [...files];
    files.forEach(LoadConfigFile);
}

function DropConfigFile(e) {
    var dt = e.dataTransfer;
    var files = dt.files;
    ClickLoadConfigFile(files);
}

function PreventDefaultDragOver(event) {
    event.preventDefault();
}

async function LoadConfigFile(the_file) {

    var txt = await the_file.text();

    var ConfigDict = JSON.parse(txt);

    LoadConfigDict(ConfigDict);

}

function LoadConfigDict(ConfigDict) {

    var displayCanvas = document.getElementById("displayCanvas");

    var table = document.getElementById('table_body_loop');
    var ncols = table.rows[0].cells.length;

    for (var icol=ncols-1; icol > 0; icol-- ) {
        deleteColumn('table_body_loop',icol);
    };

    document.getElementById('checkbox_MomCons').checked  = ConfigDict['Geom_Bodies'] ['MomConsImposed'] ;

    var n_loops = ConfigDict['Geom_Bodies'] ['n_loops'];

    for (var il=0; il < n_loops; il++) {

        ClickAddBodyLoop();

        var icol = il+1;

        table.rows[1].cells[icol].children[0].value = ConfigDict['Geom_Bodies'] ['nbpl'] [il];
        table.rows[2].cells[icol].children[0].value = ConfigDict['Geom_Bodies'] ['mass'] [il] . toString();
        table.rows[3].cells[icol].children[0].value = ConfigDict['Geom_Bodies'] ['SymType'] [il] ['name'];
        table.rows[4].cells[icol].children[0].value = ConfigDict['Geom_Bodies'] ['SymType'] [il] ['k'];
        table.rows[5].cells[icol].children[0].value = ConfigDict['Geom_Bodies'] ['SymType'] [il] ['l'];
        table.rows[6].cells[icol].children[0].value = ConfigDict['Geom_Bodies'] ['SymType'] [il] ['m'];
        table.rows[7].cells[icol].children[0].value = ConfigDict['Geom_Bodies'] ['SymType'] [il] ['p'];
        table.rows[8].cells[icol].children[0].value = ConfigDict['Geom_Bodies'] ['SymType'] [il] ['q'];
        
    }

    RedistributeClicksTableBodyLoop('table_body_loop',1,RedistributeBodyCount);

    document.getElementById('input_coeff_ampl_o'   ).value = ConfigDict['Geom_Random'] ['coeff_ampl_o']   ;
    document.getElementById('input_coeff_ampl_min' ).value = ConfigDict['Geom_Random'] ['coeff_ampl_min'] ;
    document.getElementById('input_k_infl'         ).value = ConfigDict['Geom_Random'] ['k_infl']         ;
    document.getElementById('input_k_max'          ).value = ConfigDict['Geom_Random'] ['k_max']          ;

    var table = document.getElementById('table_custom_sym');
    var ncols = table.rows[0].cells.length;

    for (var icol=ncols-1; icol > 0; icol-- ) {
        deleteColumn('table_custom_sym',icol);
    };

    var nsym = ConfigDict['Geom_Custom'] ['n_custom_sym'];

    for (var isym=0; isym < nsym; isym++) {

        ClickAddCustomSym();

        var icol = isym+1;

        table.rows[1].cells[icol].children[0].value = ConfigDict['Geom_Custom'] ['CustomSyms'] [isym] ['LoopTarget']   ;
        table.rows[2].cells[icol].children[0].value = ConfigDict['Geom_Custom'] ['CustomSyms'] [isym] ['LoopSource']   ;
        table.rows[3].cells[icol].children[0].value = ConfigDict['Geom_Custom'] ['CustomSyms'] [isym] ['Reflexion']    ;
        table.rows[4].cells[icol].children[0].value = ConfigDict['Geom_Custom'] ['CustomSyms'] [isym] ['RotAngleNum']  ;
        table.rows[5].cells[icol].children[0].value = ConfigDict['Geom_Custom'] ['CustomSyms'] [isym] ['RotAngleDen']  ;
        table.rows[6].cells[icol].children[0].value = ConfigDict['Geom_Custom'] ['CustomSyms'] [isym] ['TimeRev']      ;
        table.rows[7].cells[icol].children[0].value = ConfigDict['Geom_Custom'] ['CustomSyms'] [isym] ['TimeShiftNum'] ;
        table.rows[8].cells[icol].children[0].value = ConfigDict['Geom_Custom'] ['CustomSyms'] [isym] ['TimeShiftDen'] ;

    }

    RedistributeClicksTableBodyLoop('table_custom_sym',0);

    document.getElementById("color_method_input").value = ConfigDict['Animation_Colors'] ["color_method_input"]
    
    var n_color_old = n_color;
    for (var i_color=0;i_color<n_color_old; i_color++) {
        RemoveColor();
    }

    var n_color_new = ConfigDict['Animation_Colors'] ["n_color"];
    for (var i_color=0;i_color<n_color_new; i_color++) {
        AddColor(ConfigDict['Animation_Colors'] ["colorLookup"][i_color] );
    }

    document.getElementById('checkbox_Mass_Scale').checked  = ConfigDict['Animation_Size'] ['checkbox_Mass_Scale'];
    DoScaleSizeWithMass = ConfigDict['Animation_Size'] ['checkbox_Mass_Scale'];
    document.getElementById('input_body_radius').value = ConfigDict['Animation_Size'] ['input_body_radius'] ;
    SlideBodyRadius();
    document.getElementById('input_trail_width').value = ConfigDict['Animation_Size'] ['input_trail_width'];
    SlideTrailWidth();
    document.getElementById('input_trail_vanish_speed').value = ConfigDict['Animation_Size'] ['input_trail_vanish_speed'];
    SlideTrailTime();
    
    ExportColors();
    var send_event = new Event('ChangeColorsFromOutsideCanvas');
    displayCanvas.dispatchEvent(send_event);

    document.getElementById('checkbox_Limit_FPS').checked = ConfigDict['Animation_Framerate']['checkbox_Limit_FPS'] ;
    document.getElementById('input_Limit_FPS').value = ConfigDict['Animation_Framerate'] ['input_Limit_FPS'] 

    document.getElementById('checkbox_DisplayLoopsDuringSearch').checked = ConfigDict['Animation_Search'] ['DisplayLoopsDuringSearch'];
    if (document.getElementById('checkbox_DisplayLoopsDuringSearch').checked) {
        document.getElementById('checkbox_DisplayBodiesDuringSearch').disabled = "";
    } else {
        document.getElementById('checkbox_DisplayBodiesDuringSearch').disabled = "disabled";
    }

    document.getElementById('checkbox_DisplayBodiesDuringSearch').checked = ConfigDict['Animation_Search'] ['DisplayBodiesDuringSearch'];

    document.getElementById('checkbox_exactJ').checked         = ConfigDict['Solver_Discr'] ['Use_exact_Jacobian']  ;
    document.getElementById('input_ncoeff_init').value         = ConfigDict['Solver_Discr'] ['ncoeff_init']         ;
    document.getElementById('input_n_reconverge_it_max').value = ConfigDict['Solver_Discr'] ['n_reconverge_it_max'] ;

    SlideNReconvergeItMax();

    document.getElementById('krylov_method').value           = ConfigDict['Solver_Optim'] ['krylov_method']     ;
    document.getElementById('linesearch_method').value       = ConfigDict['Solver_Optim'] ['line_search']       ;
    document.getElementById('input_Newt_err_norm_max').value = ConfigDict['Solver_Optim'] ['Newt_err_norm_max'] ;

    var table = document.getElementById('table_cvg_loop');
    var ncols = table.rows[0].cells.length;

    for (var icol=ncols-1; icol > 0; icol-- ) {
        deleteColumn('table_cvg_loop',icol);
    };

    var n_loops = ConfigDict['Solver_Loop'] ['n_optim_param'];

    for (var il=0; il < n_loops; il++) {

        ClickAddColLoopKrylov();

        var icol = il+1;

        table.rows[1].cells[icol].children[0].value = ConfigDict['Solver_Loop'] ['gradtol_list'] [il] ;
        table.rows[2].cells[icol].children[0].value = ConfigDict['Solver_Loop'] ['maxiter_list'] [il] ;
        table.rows[3].cells[icol].children[0].value = ConfigDict['Solver_Loop'] ['inner_maxiter_list'] [il] ;
        table.rows[4].cells[icol].children[0].value = ConfigDict['Solver_Loop'] ['outer_k_list'] [il] ;

        if (ConfigDict['Solver_Loop'] ['store_outer_Av_list'] [il]) {
        table.rows[5].cells[icol].children[0].value = "True" ;
        } else {
        table.rows[5].cells[icol].children[0].value = "False" ;
        }

    }

    RedistributeClicksTableBodyLoop('table_cvg_loop',1);

    document.getElementById('checkbox_duplicates').checked = ConfigDict['Solver_Checks'] ['Look_for_duplicates'] ;
    document.getElementById('input_duplicate_eps').value   = ConfigDict['Solver_Checks'] ['duplicate_eps']       ;
    document.getElementById('checkbox_escape').checked     = ConfigDict['Solver_Checks'] ['Check_Escape']        ;

}

function SlideNReconvergeItMax() {
    var slider = document.getElementById("input_n_reconverge_it_max");
    var output = document.getElementById("display_n_reconverge_it_max");
    output.innerHTML = slider.value;
}

function OpenCloseLeftTab() {
    var i;
    var AllLeftTabs = document.getElementsByClassName("LeftTab");
    if (AllLeftTabs[0].classList.contains("open")) {CloseLeftTab();} else {OpenLeftTab();}
}

canvas_items_list= ["canvasContainer","displayCanvas","particleLayerCanvas"]

function CloseLeftTab() {
    var i;
    var AllLeftTabs        = document.getElementsByClassName("LeftTab");
    var MarginLeftTop      = document.getElementById("MarginLeftTop");
    var AllLeftTabBtns     = document.getElementsByClassName("LeftTabBtn");
    var AnimationBlock     = document.getElementById("AnimationBlock");
    var AllTopTabs         = document.getElementsByClassName("TopTab");
    var CommandBody        = document.getElementById("CommandBody");
    for (i = 0; i < AllLeftTabs.length     ; i++) {
        AllLeftTabs[i].classList.remove("open");
        AllLeftTabs[i].classList.add("closed");
        AllLeftTabs[i].style.width     = "43px"     ;
    }
    MarginLeftTop.style.marginLeft      = "43px"     ;
    for (i = 0; i < AllLeftTabBtns.length; i++) {
        AllLeftTabBtns[i].style.display     = "none";
    }
    AnimationBlock.style.marginLeft      = "0px"     ;
    for (i = 0; i < AllTopTabs.length; i++) {
        AllTopTabs[i].style.width     = "567px";
    }
    for (i = 0; i < canvas_items_list.length; i++) {
        var canvas_item = document.getElementById(canvas_items_list[i]);
        canvas_item.style.width     = "610px"     ;
        canvas_item.style.height     = "610px"     ;
    }
    if (window.innerWidth > 1220){
        CommandBody.style.bottom = "710px";
    } 
    
}

function OpenLeftTab() {
    var i;
    var AllLeftTabs        = document.getElementsByClassName("LeftTab");
    var MarginLeftTop      = document.getElementById("MarginLeftTop");
    var AllLeftTabBtns     = document.getElementsByClassName("LeftTabBtn");
    var AnimationBlock     = document.getElementById("AnimationBlock");
    var AllTopTabs         = document.getElementsByClassName("TopTab");
    var CommandBody        = document.getElementById("CommandBody");
    for (i = 0; i < AllLeftTabs.length     ; i++) {
        AllLeftTabs[i].classList.add("open");
        AllLeftTabs[i].classList.remove("closed");
        AllLeftTabs[i].style.width     = "130px"     ;
    }
    MarginLeftTop.style.marginLeft      = "130px"     ;
    for (i = 0; i < AllLeftTabBtns.length; i++) {
        AllLeftTabBtns[i].style.display     = "";
    }
    AnimationBlock.style.marginLeft      = "130px"     ;
    for (i = 0; i < AllTopTabs.length; i++) {
        AllTopTabs[i].style.width     = "480px";
    }
    for (i = 0; i < canvas_items_list.length; i++) {
        var canvas_item = document.getElementById(canvas_items_list[i]);
        canvas_item.style.width     = "480px"     ;
        canvas_item.style.height     = "480px"     ;
    }
    if (window.innerWidth > 1220){
        CommandBody.style.bottom = "580px";
    } 
}    

function deleteColumn(tableID, colnum) {
    var table = document.getElementById(tableID);
    var i;

    if (colnum < table.rows[0].cells.length) {
        for (i = 0; i < table.rows.length; i++) {
            table.rows[i].deleteCell(colnum);
        }
    }
}

function deleteLastColumn(tableId) {
    var lastCol = document.getElementById(tableId).rows[0].cells.length - 1;
    deleteColumn(tableId, lastCol);
}

function RedistributeClicksTableBodyLoop(tableid,mincol,fun_exec_end=function(){}){
    var table = document.getElementById(tableid);

    for (var icol=1; icol < table.rows[0].cells.length; icol++) {
        
        var div = table.rows[0].cells[icol].children[0];
        div.button_number = icol;
        
        div.onclick = function () {
            if (table.rows[0].cells.length > (mincol+1)) {
                deleteColumn(tableid, this.button_number);
                RedistributeClicksTableBodyLoop(tableid,mincol,fun_exec_end);
            }
        };

    }

    fun_exec_end();

}

function RedistributeBodyCount() {
    var table = document.getElementById('table_body_loop');

    var irow_n_body = 1;
    var irow_body_range = 9;
    var ibody_low = 0;
    var ibody_high = 0;                                   

    for (var icol=1; icol < table.rows[0].cells.length; icol++) {
        
        var nbody = parseInt(table.rows[irow_n_body].cells[icol].children[0].value,10);
        ibody_high = ibody_high + nbody -1 ;

        table.rows[irow_body_range].cells[icol].children[0].innerHTML = ibody_low.toString() + " - " + ibody_high.toString();

        ibody_low = ibody_high+1;
        ibody_high = ibody_low;
    }
}

function ClickAddColLoopKrylov() {
    var table = document.getElementById('table_cvg_loop');
    var newcell;
    var div,input;
    var irow, ival;
    var icol = table.rows[0].cells.length;

    var input_dict = [
        {
        "elem_class":"input", 
        "type":"text", 
        "value":["1e-1"   ,"1e-3"   ,"1e-5"   ,"1e-7"   ,"1e-9"   ,"1e-11"  ,"1e-13"  ,"1e-15"  ],
        },
        {
        "elem_class":"input", 
        "type":"number", 
        "value":["100"    ,"1000"   ,"1000"   ,"1000"   ,"500"     ,"500"    ,"300"   ,"100"    ],
        },
        {
        "elem_class":"input", 
        "type":"number", 
        "value":["30"     ,"30"     ,"50"     ,"60"     ,"70"     ,"80"     ,"100"    ,"100"    ],
        },
        {
        "elem_class":"input", 
        "type":"number", 
        "value":["5"      ,"5"      ,"5"      ,"5"      ,"5"      ,"7"      ,"7"      ,"7"      ],
        },
        {
        "elem_class":"select", 
        "class":"w3-select",  
        "innerHTML":[
            "<option value='True' selected>True</option><option value='False'>False</option>",
            "<option value='True' selected>True</option><option value='False'>False</option>",
            "<option value='True' selected>True</option><option value='False'>False</option>",
            "<option value='True' selected>True</option><option value='False'>False</option>",
            "<option value='True' selected>True</option><option value='False'>False</option>",
            "<option value='True'>True</option><option value='False' selected>False</option>",
            "<option value='True'>True</option><option value='False' selected>False</option>",
            "<option value='True'>True</option><option value='False' selected>False</option>",
        ]
        },
    ];

    n_fields = input_dict.length;
    n_default_values = input_dict[0]['value'].length;

    irow = 0;
    newcell = table.rows[irow].insertCell(icol);
    newcell.style.borderLeftStyle = 'hidden';
    newcell.style.fontSize = '16px';
    newcell.style.width = '65px';
    newcell.style.textAlign = 'center';

    div = document.createElement('button'); 
    div.classList.add("w3-button");
    div.classList.add("w3-light-grey");
    div.style.textAlign = "center";
    div.style.fontSize ="16px";
    div.style.fontWeight ="bold";
    div.innerHTML = "-";

    newcell.appendChild(div);

    for (ival = 0; ival < n_fields; ival++) {
        irow = ival + 1;
        newcell = table.rows[irow].insertCell(icol);
        newcell.style.width = '65px';
        newcell.style.textAlign = 'center';
        var idx = Math.min(icol-1,n_default_values-1);
        input = document.createElement(input_dict[ival]["elem_class"]);
        for (var [key, val] of Object.entries(input_dict[ival])){
        if (key != "elem_class"){
            if (Array.isArray(val)){
            input[key] = val[idx];
            }
            else{
            input[key] = val;
            }
        }
        input.style = "width: 53px; text-align: center;"
        }
        newcell.appendChild(input);
    }

    RedistributeClicksTableBodyLoop('table_cvg_loop',1);

}

function ClickAddBodyLoop() {
    var table = document.getElementById('table_body_loop');
    var newcell;
    var div,input;
    var irow, ival, jcol;
    var icol = table.rows[0].cells.length;

    var input_dict = [
        {
        "elem_class":"input", 
        "type":"number", 
        "value":"3",
        "min":"1",
        "oninput":"RedistributeBodyCount",
        },
        {
        "elem_class":"input", 
        "type":"text", 
        "value":"1.",
        },
        {
        "elem_class":"select", 
        "class":"w3-select",  
        "innerHTML":"<option value='C' selected>C</option><option value='D'>D</option><option value='Cp'>Cp</option><option value='Dp'>Dp</option>",
        },
        {
        "elem_class":"input", 
        "type":"number", 
        "min":"1",
        "value":"1",
        },
        {
        "elem_class":"input", 
        "type":"number", 
        "min":"0",
        "value":"1",
        },
        {
        "elem_class":"input", 
        "type":"number", 
        "min":"0",
        "value":"1",
        },
        {
        "elem_class":"input", 
        "type":"number", 
        "min":"0",
        "value":"1",
        },
        {
        "elem_class":"input", 
        "type":"number", 
        "min":"1",
        "value":"1",
        },
        {
        "elem_class":"text",
        "max-width":"60px",
        "innerHTML":"",
        },
    ];

    n_fields = input_dict.length;

    irow = 0;
    newcell = table.rows[irow].insertCell(icol);
    newcell.style.borderLeftStyle = 'hidden';
    newcell.style.fontSize = '16px';
    newcell.style.width = '60px';
    newcell.style.textAlign = 'center';

    div = document.createElement('button'); 
    div.classList.add("w3-button");
    div.classList.add("w3-light-grey");
    div.style.textAlign = "center";
    div.style.fontSize ="16px";
    div.style.fontWeight ="bold";
    div.innerHTML = "-";

    newcell.appendChild(div);

    for (ival = 0; ival < n_fields; ival++) {
        irow = ival + 1;
        newcell = table.rows[irow].insertCell(icol);
        newcell.style.width = '60px';
        newcell.style.textAlign = 'center';   
        input = document.createElement(input_dict[ival]["elem_class"]);
        for (var [key, val] of Object.entries(input_dict[ival])){
        if (key != "elem_class"){
            input[key] = val;
        }
        if (key == "oninput"){
            input[key] = window[val];
        }
        input.style = "width: 45px; text-align: center;"
        }
        newcell.appendChild(input);
    }

    RedistributeClicksTableBodyLoop('table_body_loop',1,RedistributeBodyCount);

}

function ClickAddCustomSym() {
    var table = document.getElementById('table_custom_sym');
    var newcell;
    var div,input;
    var irow, ival, jcol;
    var icol = table.rows[0].cells.length;

    var input_dict = [
        {
        "elem_class":"input", 
        "type":"number", 
        "value":"1",
        "min":"0",
        },
        {
        "elem_class":"input", 
        "type":"number", 
        "value":"0",
        "min":"0",
        },
        {
        "elem_class":"select", 
        "class":"w3-select",  
        "innerHTML":"<option value='True'>True</option><option value='False' selected>False</option>",
        },
        {
        "elem_class":"input", 
        "type":"number", 
        "value":"1",
        },
        {
        "elem_class":"input", 
        "type":"number", 
        "value":"1",
        },
        {
        "elem_class":"select", 
        "class":"w3-select",  
        "innerHTML":"<option value='True'>True</option><option value='False' selected>False</option>",
        },
        {
        "elem_class":"input", 
        "type":"number", 
        "value":"1",
        },
        {
        "elem_class":"input", 
        "type":"number", 
        "value":"1",
        }
    ];

    n_fields = input_dict.length;

    irow = 0;
    newcell = table.rows[irow].insertCell(icol);
    newcell.style.borderLeftStyle = 'hidden';
    newcell.style.fontSize = '16px';
    newcell.style.width = '65px';
    newcell.style.textAlign = 'center';

    div = document.createElement('button'); 
    div.classList.add("w3-button");
    div.classList.add("w3-light-grey");
    div.style.textAlign = "center";
    div.style.fontSize ="16px";
    div.style.fontWeight ="bold";
    div.innerHTML = "-";

    newcell.appendChild(div);

    for (ival = 0; ival < n_fields; ival++) {
        irow = ival + 1;
        newcell = table.rows[irow].insertCell(icol);
        newcell.style.width = '65px';
        newcell.style.textAlign = 'center';   
        input = document.createElement(input_dict[ival]["elem_class"]);
        for (var [key, val] of Object.entries(input_dict[ival])){
        if (key != "elem_class"){
            input[key] = val;
        }
        input.style = "width: 53px; text-align: center;"
        }
        newcell.appendChild(input);
    }

    RedistributeClicksTableBodyLoop('table_custom_sym',0);

}

var ncol_per_row_colortable = 4;

function ClickRemoveColor() {

    if (n_color > 1) {

        var displayCanvas = document.getElementById("displayCanvas");

        RemoveColor();
        ExportColors();

        var send_event = new Event('ChangeColorsFromOutsideCanvas');
        displayCanvas.dispatchEvent(send_event);

    }

}
  
function RemoveColor() {

    var table = document.getElementById('table_pick_color');

    var nrow_cur = table.rows.length;

    var icol = ((n_color -1) % ncol_per_row_colortable) ;
    var irow = Math.floor((n_color-1) / ncol_per_row_colortable) +1;

    table.rows[irow].deleteCell(icol);

    if (icol == 0) {
        table.deleteRow(irow);
    }

    n_color -= 1;

}
  
function ClickAddColor() {

    var displayCanvas = document.getElementById("displayCanvas");

    AddColor();
    ExportColors();

    var send_event = new Event('ChangeColorsFromOutsideCanvas');
    displayCanvas.dispatchEvent(send_event);
}

function AddColor(the_color) {
    var table = document.getElementById('table_pick_color');
    var newcell;
    var div,input;
    var ival;
    var color;

    var nrow_cur = table.rows.length;

    n_color += 1;

    var icol = ((n_color -1) % ncol_per_row_colortable) ;
    var irow = Math.floor((n_color-1) / ncol_per_row_colortable) +1;

    if (irow >= nrow_cur) {
        table.insertRow();
        table.rows[irow].style.borderStyle = 'hidden';
    }

    newcell = table.rows[irow].insertCell(icol);
    newcell.style.borderStyle = 'hidden';
    newcell.style.fontSize = '16px';
    newcell.style.width = '65px';
    newcell.style.textAlign = 'center';

    /* Color number text */
    div = document.createElement('div'); 
    div.style.fontSize ="16px";
    div.style.display ="inline-block";
    div.style.width ="35px";
    div.innerHTML = (n_color -1).toString()+": ";
    newcell.appendChild(div);

    /* Color input  */
    div = document.createElement('input'); 
    div.type = "color";
    div.style.display ="inline-block";
    div.style.width ="80px";
    div.classList.add("particle_color_picker");

    if (the_color !== undefined) {

        color = the_color

    } else {

        if (n_color <= colorLookup_init.length) {
            color = colorLookup_init[n_color-1]
        } else {
            color = defaultParticleColor;
        }
    
    }

    div.value = color;
    div.targetid = n_color-1;
    div.addEventListener("input", ChangeColor_Handler, true);
    newcell.appendChild(div);

}

function ExportColors() {

    colorLookup = new Array(n_color);

    var AllColorPickers = document.getElementsByClassName("particle_color_picker");

    for (var ipick=0; ipick < AllColorPickers.length ; ipick++) {

        var targetid = AllColorPickers[ipick].targetid;
        var color = AllColorPickers[ipick].value;    
        
        colorLookup[targetid] = color;

    }

}

color_method_input = document.getElementById("color_method_input");
color_method_input.addEventListener("input", color_method_input_Handler, true);

function color_method_input_Handler(event) {

    var displayCanvas = document.getElementById("displayCanvas");

    var send_event = new Event('ChangeColorsFromOutsideCanvas');
    displayCanvas.dispatchEvent(send_event);

}

function ChangeColor_Handler(event) {

    var displayCanvas = document.getElementById("displayCanvas");

    var targetid = event.path[0].targetid;
    var color = event.path[0].value;

    colorLookup[targetid] = color;
    
    var send_event = new Event('ChangeColorsFromOutsideCanvas');
    displayCanvas.dispatchEvent(send_event);

}

function ClickTopTabBtn_Animation_Framerate() {
    UpdateFPSDisplay();
    ClickTopTabBtn('Animation_Framerate');
}

function UpdateFPSDisplay() {

    var the_time = performance.now();

    if (the_time > (Last_UpdateFPSDisplay + 1000/UpdateFPSDisplay_freq)) {

        Last_UpdateFPSDisplay = the_time;

        var txt_disp = document.getElementById('Estimate_FPS_txt');
        txt_disp.innerHTML=Math.ceil(FPS_estimation).toString();
        
    }

}

function KillAndReloadWorker() {
    
    pyodide_worker.terminate();

    var ChoreoExecuteBtn = document.getElementById("ChoreoExecuteBtn");
    ChoreoExecuteBtn.disabled = "disabled";
    var ChoreoDispInitStateBtn = document.getElementById("ChoreoDispInitStateBtn");
    ChoreoDispInitStateBtn.disabled = "disabled";

    var Python_State_Div = document.getElementById("Python_State_Div");

    PythonClearPrints();
    PythonPrint({txt:"Python Killed. Reloading ...&#10;"});

    Python_State_Div.innerHTML = "Killed";
    Python_State_Div.classList.add('w3-red');
    Python_State_Div.classList.remove('w3-orange');
    Python_State_Div.classList.remove('w3-green');

    pyodide_worker = new Worker("./Pyodide_worker.js");
    pyodide_worker.addEventListener('message', handleMessageFromWorker);
    pyodide_worker.postMessage({funname:"ExecutePythonFile",args:"./python_scripts/Python_imports.py"});
}

var checkbox_Limit_FPS = document.getElementById('checkbox_Limit_FPS');
checkbox_Limit_FPS.addEventListener("change", checkbox_Limit_FPS_Handler, true);

var input_Limit_FPS = document.getElementById("input_Limit_FPS");
input_Limit_FPS.addEventListener("change", input_Limit_FPS_Handler, true);

var checkbox_Mass_Scale = document.getElementById('checkbox_Mass_Scale');
checkbox_Mass_Scale.addEventListener("change", checkbox_Mass_Scale_Handler, true);

var input_body_radius = document.getElementById("input_body_radius");
input_body_radius.addEventListener("input" , SlideBodyRadius, true);
input_body_radius.value = base_particle_size ;
input_body_radius.min   = min_base_particle_size ;
input_body_radius.max   = max_base_particle_size ;
input_body_radius.step  = 0.05 ;

var input_trail_width = document.getElementById("input_trail_width");
input_trail_width.addEventListener("input" , SlideTrailWidth, true);
input_trail_width.value = base_trailWidth ;
input_trail_width.min   = min_base_trailWidth ;
input_trail_width.max   = max_base_trailWidth ;
input_trail_width.step  = 0.05 ;

var input_trail_vanish_speed = document.getElementById("input_trail_vanish_speed");
input_trail_vanish_speed.addEventListener("input" , SlideTrailTime, true);
input_trail_vanish_speed.value = base_trail_vanish_speed ;
input_trail_vanish_speed.min   = min_base_trail_vanish_speed ;
input_trail_vanish_speed.max   = max_base_trail_vanish_speed ;
input_trail_vanish_speed.step  = 0.05 ;

SlideTrailTime();

function SlideBodyRadius(event) {
    // console.log(input_body_radius.value);
    base_particle_size = input_body_radius.value;
}

function SlideTrailWidth(event) {
    // console.log(input_trail_width.value);
    base_trailWidth = input_trail_width.value;
}

function SlideTrailTime(event) {
    // console.log(input_trail_vanish_speed.value);
    base_trail_vanish_speed = input_trail_vanish_speed.value;
    FadeInvFrequency = 1/(1000*(base_trail_vanish_speed*base_trail_vanish_speed));
}

function checkbox_Mass_Scale_Handler(event) {

    var displayCanvas = document.getElementById("displayCanvas");

    DoScaleSizeWithMass = event.currentTarget.checked;
    
    var event = new Event('RemakeParticlesFromOutsideCanvas');
    displayCanvas.dispatchEvent(event);

}

function input_Limit_FPS_Handler() {

    Elapsed_Time_During_Animation = 0;
    n_valid_dt_animation = 0;

    FPS_limit = input_Limit_FPS.value;

    anim_schedule_time = performance.now()

}

function checkbox_Limit_FPS_Handler(event) {
    
    if (event.currentTarget.checked) {
        input_Limit_FPS.disabled = "";
        Do_Limit_FPS = true;
    } else {
        input_Limit_FPS.disabled = "disabled";
        Do_Limit_FPS = false;
    }

    input_Limit_FPS_Handler();

}

var checkbox_Cookie = document.getElementById('checkbox_Cookie');
checkbox_Cookie.addEventListener("change", checkbox_Cookie_Handler, true);

var Save_Cookie_Btn = document.getElementById('Save_Cookie_Btn');
var Load_Cookie_Btn = document.getElementById('Load_Cookie_Btn');

var Cookie_Message = document.getElementById('Cookie_Message');

var cookie_name = "choreo_GUI"

function checkbox_Cookie_Handler(event) {

    if (event.currentTarget.checked) {

        Save_Cookie_Btn.disabled = "";
        Load_Cookie_Btn.disabled = "";

    } else {

        Save_Cookie_Btn.disabled = "disabled";
        Load_Cookie_Btn.disabled = "disabled";

        txt = LoadCookie(cookie_name);

        if (txt == "") {

            IssueCookieMessage("There is no cookie on your device.");

        } else {

            DeleteCookie(cookie_name);
            IssueCookieMessage("Cookie deleted !");

        }
    }

}

async function IssueCookieMessage(message,keep_up) {

    Cookie_Message.innerHTML = message;

    if (keep_up !== undefined) {
    } else {
        setTimeout(function(){IssueCookieMessage("",true)}, 3000);
    }

}

function SaveCookieClick(event) {

    var ConfigDict = GatherConfigDict();

    var cookie_value = JSON.stringify(ConfigDict,null,0)
    var cookie_lifetime = 365;

    SaveCookie(cookie_name, cookie_value, cookie_lifetime);

    IssueCookieMessage("Cookie saved !");
}

function LoadCookieClick(event) {

    success = DealWithCookie();
    if (success) {
        IssueCookieMessage("Cookie loaded !");
    } else {
        IssueCookieMessage("Cookie not found !");
    }

}

function SaveCookie(name, value, time_expires_days) {
    var d = new Date();
    d.setTime(d.getTime() + (time_expires_days*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function DealWithCookie() {

    var txt = LoadCookie(cookie_name);

    if (txt == "") {
    
        return false;

    } else {

        checkbox_Cookie.checked = true;
        Save_Cookie_Btn.disabled = "";
        Load_Cookie_Btn.disabled = "";    

        var ConfigDict = JSON.parse(txt);

        LoadConfigDict(ConfigDict);

        return true;

    }

}

function LoadCookie(name) {
let head = name + "=";
let decodedCookie = decodeURIComponent(document.cookie);
let ca = decodedCookie.split(';');
for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
    c = c.substring(1);
    }
    if (c.indexOf(head) == 0) {
    return c.substring(head.length, c.length);
    }
}
return "";
}

function DeleteCookie(name) {
    if( LoadCookie( name ) ) {
        document.cookie = name + "=" +
            ";path=/"+
            ";expires=Thu, 01 Jan 1970 00:00:01 GMT";
    }
}

Python_textarea = document.getElementById("Python_textarea");

function PythonClearPrints() {
    Python_textarea.innerHTML = "";
}

function PythonPrint(args) {

    var the_height = parseInt(Python_textarea.style.height, 10);
    var is_at_bottom = (Python_textarea.scrollHeight - Python_textarea.scrollTop < (the_height + 10));

    Python_textarea.innerHTML += args.txt + "&#10;";

    if (is_at_bottom) {
        Python_textarea.scrollTop = Python_textarea.scrollHeight;
    }

}

var checkbox_DisplayLoopsDuringSearch = document.getElementById('checkbox_DisplayLoopsDuringSearch');
checkbox_DisplayLoopsDuringSearch.addEventListener("change", checkbox_DisplayLoopsDuringSearchHandler, true);

var checkbox_DisplayBodiesDuringSearch = document.getElementById('checkbox_DisplayBodiesDuringSearch');
checkbox_DisplayBodiesDuringSearch.addEventListener("change", checkbox_DisplayBodiesDuringSearchHandler, true);

function checkbox_DisplayLoopsDuringSearchHandler(event) {

    if (event.currentTarget.checked) {

        checkbox_DisplayBodiesDuringSearch.disabled = "";

    } else {

        checkbox_DisplayBodiesDuringSearch.checked = false;
        checkbox_DisplayBodiesDuringSearch.disabled = "disabled";
        
    }

}

function checkbox_DisplayBodiesDuringSearchHandler(event) {

}


