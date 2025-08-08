const seriesData = {
  air: {
    kas: ["CXH", "CXHI"],
    kaa: ["CXH", "CXHI"],
    kaf: ["CXH", "CXHI"]
  },
  water: {
    kws: ["CXH", "CXHI"],
    kwk: ["KXH"],
    kwi: ["KXI"]
  }
};

const compressorSelectionData = {
  CXH: ["CXH01-50-199Y", "CXH01-60-230Y", "CXH01-70-264Y", "CXH01-80-298Y", "CXH51-125-468Y", "CXH51-140-538Y", "CXH91-160-620Y", "CXH01-80-298Y", "CXH01-90-340Y", "CXH01-100-370Y", "CXH51-110-398Y", "CXH91-180-702Y", "CXH91-210-810Y", "CXH91-240-912Y", "CXH91-280-1000Y", "CXH91-310-1085Y", "CXH02-70-199Y", "CXH02-80-230Y", "CXH02-90-264Y", "CXH02-100-298Y", "CXH02-120-340Y", "CXH52-110-316Y", "CXH52-125-372Y", "CXH52-140-428Y", "CXH52-160-468Y", "CXH52-180-538Y", "CXH92-180-545Y", "CXH92-210-620Y", "CXH92-240-702Y", "CXH92-280-810Y", "CXH92-300-912Y", "CXH92-310-1000Y"],
  CXHI: ["CXHI01-50-199Y", "CXHI01-60-230Y", "CXHI01-70-264Y", "CXHI01-80-298Y", "CXHI51-125-468Y", "CXHI51-140-538Y", "CXHI91-160-620Y", "CXHI01-80-298Y", "CXHI01-90-340Y", "CXHI01-100-370Y", "CXHI51-110-398Y", "CXHI91-180-702Y", "CXHI91-210-810Y", "CXHI91-240-912Y", "CXHI91-280-1000Y", "CXHI91-310-1085Y", "CXHI02-70-199Y", "CXHI02-80-230Y", "CXHI02-90-264Y", "CXHI02-100-298Y", "CXHI02-120-340Y", "CXHI52-110-316Y", "CXHI52-125-372Y", "CXHI52-140-428Y", "CXHI52-160-468Y", "CXHI52-180-538Y", "CXHI92-180-545Y", "CXHI92-210-620Y", "CXHI92-240-702Y", "CXHI92-280-810Y", "CXHI92-300-912Y", "CXHI92-310-1000Y"],
  KXI: ["KXI01-50-230Y", "KXI01-60-264Y", "KXI01-70-298Y", "KXI01-80-340Y", "KXI01-90-370Y", "KXI51-100-428Y", "KXI51-110-468Y", "KXI51-125-538Y", "KXI91-140-620Y", "KXI91-160-702Y", "KXI91-180-810Y", "KXI91-210-912Y", "KXI91-240-1000Y", "KXI91-280-1085Y", "KXI02-50-199Y"],
  KXH: ["KXH01-50-230Y", "KXH01-60-264Y", "KXH01-70-298Y", "KXH01-80-340Y", "KXH01-90-370Y", "KXH51-100-428Y", "KXH51-110-468Y", "KXH51-125-538Y", "KXH91-140-620Y", "KXH91-160-702Y", "KXH91-180-810Y", "KXH91-210-912Y", "KXH91-240-1000Y", "KXH91-280-1085Y", "KXH02-50-199Y"]
};
let currentApiResultData = null; 

// --- Chiller Calculation Form Functions ---
function showSeriesOptions() {
    const type = document.getElementById('typeSeries').value;
    const container = document.getElementById('seriesOptions');
    const seriesModelSelect = document.getElementById('seriesModel');
    const compressorSelect = document.getElementById('compressorSelection');
    const condenserLabel = document.getElementById('condenserLabel');
    const condenserInput = document.getElementById('condenserLWT');
    container.innerHTML = ''; 
    seriesModelSelect.innerHTML = '<option value="">-- Select Subtype First --</option>'; 
    compressorSelect.innerHTML = '<option value="">-- Select Compressor Family First --</option>'; 
    if (type === "air") {
        condenserLabel.textContent = "Condenser - Ambient Temperature (°C):"; 
        condenserInput.placeholder = "e.g., 35"; 
    } else if (type === "water") {
        condenserLabel.textContent = "Condenser - Entering Water Temp (°C):"; 
        condenserInput.placeholder = "e.g., 30"; 
    } else {
        condenserLabel.textContent = "Condenser leaving water  Temp (°C):"; 
        condenserInput.placeholder = "enter the value";
    }
    if (type && seriesData[type]) {
        const subTypes = Object.keys(seriesData[type]);
        let html = '<label for="seriesSubtype">Select Subtype:</label><select id="seriesSubtype" onchange="updateSeriesModel()">';
        html += '<option value="">-- Select --</option>';
        subTypes.forEach(key => { html += `<option value="${key}">${key.toUpperCase()}</option>`; });
        html += '</select>'; container.innerHTML = html;
    }
}

function updateSeriesModel() {
    const type = document.getElementById('typeSeries').value;
    const sub = document.getElementById('seriesSubtype') ? document.getElementById('seriesSubtype').value : '';
    const seriesModelSelect = document.getElementById('seriesModel');
    const compressorSelect = document.getElementById('compressorSelection');
    seriesModelSelect.innerHTML = '<option value="">-- Select --</option>';
    compressorSelect.innerHTML = '<option value="">-- Select Compressor Family First --</option>'; 
    if (type && sub && seriesData[type] && seriesData[type][sub]) {
        const uniqueModels = [...new Set(seriesData[type][sub])];
        uniqueModels.forEach(model => {
            const opt = document.createElement('option');
            opt.value = model; opt.textContent = model;
            seriesModelSelect.appendChild(opt);
        });
    }
}

function showModelOptions() {
    const selectedCompressorFamily = document.getElementById('seriesModel').value;
    const compressorSelect = document.getElementById('compressorSelection');
    compressorSelect.innerHTML = '<option value="">-- Select --</option>';
    if (compressorSelectionData[selectedCompressorFamily]) {
        compressorSelectionData[selectedCompressorFamily].forEach(model => {
            const opt = document.createElement('option');
            opt.value = model; opt.textContent = model;
            compressorSelect.appendChild(opt);
        });
    }
}

function checkEvapTemp(input){
    const value = parseFloat(input.value);
    if (value < -20) { alert("Evap LWT very low (-20°C min)"); input.value = ''; }
    else if (value > 20) { alert("Evap LWT very high (20°C max)"); input.value = ''; }
}

async function submitFormAndDisplayResults() {
    document.getElementById('technicalDataDisplay').style.display = 'none';
    const typeSeries = document.getElementById('typeSeries').value;
    const seriesSubtypeElement = document.getElementById('seriesSubtype');
    const seriesSubtype = seriesSubtypeElement ? seriesSubtypeElement.value : '';
    const seriesModel = document.getElementById('seriesModel').value; 
    const compressorSelection = document.getElementById('compressorSelection').value; 
    const refrigerant = document.getElementById('refrigerant').value;
    const powerSupply = document.getElementById('powerSupply').value;
    const evaporatorLWTStr = document.getElementById('evaporatorLWT').value;
    const condenserLWTStr = document.getElementById('condenserLWT').value; 
    const desuperheater = document.getElementById('desuperheater').value;
    let missingFields = [];
    if (!typeSeries) missingFields.push("Type of Series"); if (!seriesSubtype) missingFields.push("Series Subtype");
    if (!seriesModel) missingFields.push("Compressor Family"); if (!refrigerant) missingFields.push("Refrigerant");
    if (!powerSupply) missingFields.push("Power Supply"); if (evaporatorLWTStr === '') missingFields.push("Evaporator LWT");
    if (condenserLWTStr === '') missingFields.push("Condenser LWT/Ambient"); if (!desuperheater) missingFields.push("DE Super Heater");
    if (missingFields.length > 0) {
        alert("Please fill in all required fields: " + missingFields.join(", "));
        return;
    }
    const evaporatorLWT = parseFloat(evaporatorLWTStr); const condenserLWT = parseFloat(condenserLWTStr);
    if (isNaN(evaporatorLWT) || isNaN(condenserLWT)) {
        alert("Evaporator and Condenser temperatures must be valid numbers.");
        return;
    }
    const params = new URLSearchParams({ 
        typeSeries: typeSeries, seriesSubtype: seriesSubtype, seriesModel: seriesModel, 
        compressorSelection: compressorSelection, refrigerant: refrigerant, powerSupply: powerSupply,
        evaporatorLWT: evaporatorLWT, condenserLWT: condenserLWT, desuperheater: desuperheater
    });
    const url = `http://127.0.0.1:5000/api/calculate_chiller?${params.toString()}`;
    const calculateButton = document.getElementById('calculateButton');
    const confirmDownloadButton = document.getElementById('confirmDownloadButton');
    const resultsDisplayContainer = document.getElementById('resultsDisplayContainer');
    calculateButton.disabled = true; calculateButton.textContent = 'Calculating...';
    resultsDisplayContainer.style.display = 'none'; confirmDownloadButton.style.display = 'none';
    try {
        const response = await fetch(url);
        const responseData = await response.json(); 
        if (!response.ok) {
            const errorMsg = responseData.error ? `${responseData.error} ${responseData.details || ''}` : `HTTP error! status: ${response.status}`;
            throw new Error(errorMsg);
        }
        currentApiResultData = responseData; 
        displayResultsOnPage(responseData); 
        resultsDisplayContainer.style.display = 'block';
        confirmDownloadButton.style.display = 'inline-block';
        const envelopeCheck = responseData.envelope_check;
        if (envelopeCheck && envelopeCheck.higher_motor_required) {
            const popUpMessageToShow = envelopeCheck.motor_message || envelopeCheck.status_message || "Attention: Please review selection based on operating conditions.";
            alert(popUpMessageToShow); 
        }
    } catch (err) {
        console.error("Error fetching/processing data:", err);
        alert(`Failed to get data: ${err.message}`);
        currentApiResultData = null; 
    } finally {
        calculateButton.disabled = false; calculateButton.textContent = 'Calculate';
    }
}

function displayResultsOnPage(data) {
    const resultsContent = document.getElementById('resultsContent');
    resultsContent.innerHTML = ''; 
    if (!data || !data.inputs || !data.calculated_values || !data.envelope_check) {
        resultsContent.innerHTML = "<p>Error: Incomplete data received.</p>"; return;
    }
    const isAirCooled = data.inputs.chiller_type_series === 'air';
    const condInputLabel = isAirCooled ? "Ambient Temp Input:" : "Condenser EWT Input:";
    const displayEvapTemp = data.display_evap_calculated_sat_temp?.toFixed(2);
    const displayCondTemp = data.display_cond_calculated_sat_temp?.toFixed(2);
    let html = '<table>';
    html += `<tr><td colspan="2" class="section-header">CONFIGURATION SUMMARY</td></tr>`;
    html += `<tr><td>Chiller Type:</td><td>${data.display_chiller_type || 'N/A'}</td></tr>`;
    html += `<tr><td>Compressor Family:</td><td>${data.display_series_model_family || 'N/A'}</td></tr>`;
    html += `<tr><td>Compressor Model Selected:</td><td>${data.display_compressor_specific_model || 'N/A'}</td></tr>`;
    html += `<tr><td>Refrigerant:</td><td>${data.display_refrigerant || 'N/A'}</td></tr>`;
    html += `<tr><td>Power Supply:</td><td>${data.inputs.power_supply || 'N/A'}</td></tr>`;
    html += `<tr><td>De Super Heater:</td><td>${data.inputs.desuperheater || 'N/A'}</td></tr>`;
    html += `<tr><td colspan="2" class="section-header">INPUT TEMPERATURES</td></tr>`;
    html += `<tr><td>Evaporator LWT Input:</td><td>${data.inputs.evap_lwt_input?.toFixed(2)} °C</td></tr>`;
    html += `<tr><td>${condInputLabel}</td><td>${data.inputs.cond_lwt_input?.toFixed(2)} °C</td></tr>`;
    html += `<tr><td colspan="2" class="section-header">CALCULATED VALUES (S&D)</td></tr>`;
    html += `<tr><td>Calc. Evap. Sat. Temp (SST):</td><td>${displayEvapTemp} °C (Corr: ${data.calculated_values.evap_correction_applied?.toFixed(1)})</td></tr>`;
    html += `<tr><td>Calc. Cond. Sat. Temp (SDT):</td><td>${displayCondTemp} °C (Corr: ${data.calculated_values.cond_correction_applied?.toFixed(1)})</td></tr>`;
    html += `<tr><td colspan="2" class="section-header">ENVELOPE CHECK & ADVICE</td></tr>`;
    html += `<tr><td>Geometric Envelope Evaluated:</td><td>${data.display_envelope_type_applied || 'N/A'}</td></tr>`;
    const overallStatusClass = data.envelope_check.in_envelope ? "status-good" : "status-bad";
    html += `<tr><td>Overall Selection Status:</td><td class="${overallStatusClass}">${data.display_envelope_status_msg || 'N/A'}</td></tr>`;
    if (data.display_motor_message && data.display_motor_message !== data.display_envelope_status_msg) {
        let adviceClass = "message-note"; 
        if (!data.envelope_check.in_envelope) { adviceClass = "message-warning"; }
        html += `<tr><td>Specific Advice:</td><td class="${adviceClass}">${data.display_motor_message}</td></tr>`;
    }
    if (data.display_discharge_temp && data.display_oil_cooler_advice) {
        html += `<tr><td colspan="2" class="section-header">DISCHARGE TEMP & OIL COOLER</td></tr>`;
        html += `<tr><td>Calculated Discharge Temp:</td><td>${data.display_discharge_temp}</td></tr>`;
        let oilCoolerClass = 'message-note';
        if (data.display_oil_cooler_advice.toLowerCase().includes('required')) {
            oilCoolerClass = 'advice-critical';
        }
        html += `<tr><td>Oil Cooler Advice:</td><td class="${oilCoolerClass}">${data.display_oil_cooler_advice}</td></tr>`;
    }
    html += '</table>';
    resultsContent.innerHTML = html;
}

function generateAndDownloadPDF() { 
    if (!currentApiResultData) { alert("No data available to generate PDF."); return; }
    const data = currentApiResultData; 
    const { jsPDF } = window.jspdf; 
    const doc = new jsPDF();
    doc.setFont("Helvetica", "bold"); doc.setFontSize(18);
    doc.text("Kirloskar Chiller Selection Output", doc.internal.pageSize.getWidth() / 2, 20, { align: "center" });
    let yPos = 35; 
    const leftMargin = 15; 
    const valueOffset = 105; 
    function addLineItem(label, value, isBold = false, isAlert = false) {
        if (yPos > 270) { doc.addPage(); yPos = 20; }
        doc.setFont("Helvetica", isBold ? "bold" : "normal"); doc.setFontSize(10);
        if (isAlert) doc.setTextColor(192, 0, 0); else doc.setTextColor(0,0,0);
        doc.text(label, leftMargin, yPos);
        doc.setFont("Helvetica", "normal"); doc.setTextColor(0,0,0);
        doc.text(String(value !== undefined && value !== null ? value : 'N/A'), valueOffset, yPos);
        yPos += 7;
    }
    function addSectionHeader(title) {
        if (yPos > 260) { doc.addPage(); yPos = 20; }
        yPos += 6; 
        doc.setFont("Helvetica", "bold"); doc.setFontSize(12);
        doc.setFillColor(230, 230, 230); 
        doc.rect(leftMargin - 2, yPos - 5, doc.internal.pageSize.getWidth() - (leftMargin*2) + 4, 7, 'F');
        doc.setTextColor(0,0,0); 
        doc.text(title, leftMargin, yPos); 
        yPos += 8; 
    }
    const displayEvapTempPDF = data.display_evap_calculated_sat_temp?.toFixed(2);
    const displayCondTempPDF = data.display_cond_calculated_sat_temp?.toFixed(2);
    addSectionHeader("Configuration Summary");
    addLineItem("Chiller Type:", data.display_chiller_type);
    addLineItem("Compressor Family:", data.display_series_model_family);
    addLineItem("Compressor Model Selected:", data.display_compressor_specific_model);
    addLineItem("Refrigerant:", data.display_refrigerant);
    addLineItem("Power Supply:", data.inputs.power_supply);
    addLineItem("De Super Heater:", data.inputs.desuperheater);
    addSectionHeader("Input Temperatures");
    const isAirCooled = data.inputs.chiller_type_series === 'air';
    const condInputLabelPDF = isAirCooled ? "Ambient Temp Input:" : "Condenser EWT Input:";
    addLineItem("Evaporator LWT Input:", `${data.inputs.evap_lwt_input?.toFixed(2)} °C`);
    addLineItem(condInputLabelPDF, `${data.inputs.cond_lwt_input?.toFixed(2)} °C`);
    addSectionHeader("Calculated Values (S&D)");
    addLineItem("Calc. Evap. Sat. Temp (SST):", `${displayEvapTempPDF} °C (Corr: ${data.calculated_values.evap_correction_applied?.toFixed(1)})`);
    addLineItem("Calc. Cond. Sat. Temp (SDT):", `${displayCondTempPDF} °C (Corr: ${data.calculated_values.cond_correction_applied?.toFixed(1)})`);
    addSectionHeader("Envelope Check & Advice");
    addLineItem("Geometric Envelope Evaluated:", data.display_envelope_type_applied);
    const overallIsOut = !data.envelope_check.in_envelope; 
    addLineItem("Overall Selection Status:", data.display_envelope_status_msg, overallIsOut, overallIsOut); 
    if (data.display_motor_message) {
        const isMotorAlert = !data.envelope_check.in_envelope;
        addLineItem("Specific Advice:", data.display_motor_message, isMotorAlert, isMotorAlert); 
    }
    if (data.display_discharge_temp && data.display_oil_cooler_advice) {
        addSectionHeader("DISCHARGE TEMP & OIL COOLER");
        addLineItem("Calculated Discharge Temp:", data.display_discharge_temp);
        const isOilCoolerAlert = data.display_oil_cooler_advice.toLowerCase().includes('required');
        addLineItem("Oil Cooler Advice:", data.display_oil_cooler_advice, isOilCoolerAlert, isOilCoolerAlert);
    }
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i); 
        doc.setFontSize(8); 
        doc.setTextColor(150);
        doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.getWidth() / 2, 285, { align: 'center' });
        doc.text("Kirloskar Chiller Selection Tool", leftMargin, 285);
    }
    doc.save("Kirloskar_Chiller_Selection_Output.pdf");
}

// --- Technical Data Sheet (TDS) Functionality ---

// Main function to handle all clicks within the TDS menu
function handleTdsMenuClick(event) {
    const target = event.target.closest('a');
    if (!target) return; // Exit if the click was not on a link

    event.preventDefault(); // Stop the link from navigating by default

    const parentLi = target.parentElement;

    // Logic for expanding/collapsing parent menus
    if (parentLi.classList.contains('menu-parent')) {
        parentLi.classList.toggle('open');
        const submenu = parentLi.querySelector('ul');
        if (submenu) {
            submenu.classList.toggle('hidden');
        }
    }

    // Logic for handling clicks on the final links (leaf nodes)
    if (target.classList.contains('menu-leaf')) {
        // This was the old attribute for PDF links. We keep it for your new HTML.
        const pdfLink = target.dataset.pdfLink;
        
        // This is the attribute you used in your newest HTML file. We check for it too.
        const contentIdAsPdf = target.dataset.contentId;
        
        let finalPdfToOpen = null;

        if (pdfLink) {
            finalPdfToOpen = pdfLink;
        } else if (contentIdAsPdf && contentIdAsPdf.toLowerCase().endsWith('.pdf')) {
            finalPdfToOpen = contentIdAsPdf;
        }
        
        // If we found a PDF link in either attribute, open it.
        if (finalPdfToOpen) {
            // Hide any visible content panels in the main area
            document.getElementById('technicalDataDisplay').style.display = 'none';
            document.getElementById('resultsDisplayContainer').style.display = 'none';
            document.getElementById('confirmDownloadButton').style.display = 'none';

            // Open the PDF in a new tab
            window.open(finalPdfToOpen, '_blank');
        }
    }
}

// Attach event listeners when the page content has fully loaded
document.addEventListener('DOMContentLoaded', () => { 
  showSeriesOptions(); // Initialize the calculator form
  document.getElementById('tdsMenu').addEventListener('click', handleTdsMenuClick); // Add listener for the TDS menu
});