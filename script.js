// ===== مطبعة الوسام — حاسبة تكلفة المنتج =====

// Fixed costs
const FIXED_MOLD = 50;
const THREAD_RATE = 50; // per 1000 units
const GLUE_RATE = 2.5; // per 1000 units

/**
 * Format a number to 2 decimal places with $ suffix
 * @param {number} value
 * @returns {string}
 */
function formatPrice(value) {
    return value.toFixed(2) + '$';
}

/**
 * Get the selected radio button value for a given name
 * @param {string} name
 * @returns {number}
 */
function getRadioValue(name) {
    const selected = document.querySelector('input[name="' + name + '"]:checked');
    return selected ? parseFloat(selected.value) : 0;
}

/**
 * Toggle thread input visibility
 */
function toggleThread() {
    var toggle = document.getElementById('threadToggle');
    var inputGroup = document.getElementById('threadInputGroup');
    var threadInput = document.getElementById('threadQuantity');

    if (toggle.checked) {
        inputGroup.style.display = 'block';
        threadInput.focus();
    } else {
        inputGroup.style.display = 'none';
        threadInput.value = '';
    }
    calculateTotal();
}

/**
 * Toggle mold (القالب) on/off
 */
function toggleMold() {
    var toggle = document.getElementById('moldToggle');
    var infoBox = document.getElementById('moldInfoBox');

    if (toggle.checked) {
        infoBox.style.display = 'block';
    } else {
        infoBox.style.display = 'none';
    }
    calculateTotal();
}

/**
 * Toggle glue input visibility
 */
function toggleGlue() {
    var toggle = document.getElementById('glueToggle');
    var inputGroup = document.getElementById('glueInputGroup');
    var glueInput = document.getElementById('glueQuantity');

    if (toggle.checked) {
        inputGroup.style.display = 'block';
        glueInput.focus();
    } else {
        inputGroup.style.display = 'none';
        glueInput.value = '';
    }
    calculateTotal();
}

/**
 * Toggle transport input visibility
 */
function toggleTransport() {
    var toggle = document.getElementById('transportToggle');
    var inputGroup = document.getElementById('transportInputGroup');
    var transportInput = document.getElementById('transportCost');

    if (toggle.checked) {
        inputGroup.style.display = 'block';
        transportInput.focus();
    } else {
        inputGroup.style.display = 'none';
        transportInput.value = '';
    }
    calculateTotal();
}

/**
 * Calculate raw material cost from dimensions
 * Formula: Weight (kg) = (Length × Width × Grammage × Count) / 1000
 *          Raw Cost = Weight × Price per kg
 * Note: Grammage is in g/m², so dividing by 1000 converts total weight to kg
 */
function calculateRaw() {
    var length = parseFloat(document.getElementById('rawLength').value) || 0;
    var width = parseFloat(document.getElementById('rawWidth').value) || 0;
    var grammage = parseFloat(document.getElementById('rawGrammage').value) || 0;
    var count = parseFloat(document.getElementById('rawCount').value) || 0;
    var price = parseFloat(document.getElementById('rawPrice').value) || 0;

    var weight = (length * width * grammage * count) / 1000;
    var rawTotal = weight * price;

    document.getElementById('rawWeight').textContent = weight.toFixed(2);
    document.getElementById('rawTotal').textContent = formatPrice(rawTotal);

    // Show/hide digit selection based on raw total
    var digitsSection = document.getElementById('digitsSelection');
    if (rawTotal > 0) {
        digitsSection.style.display = 'block';
    } else {
        digitsSection.style.display = 'none';
    }

    applyDigitSelection();
}

/**
 * Extract first N digits from a number (integer part only)
 * @param {number} value - The full raw value
 * @param {number} digits - Number of leading digits to keep (0 = full)
 * @returns {number}
 */
function extractDigits(value, digits) {
    if (digits === 0 || digits === null) return value;
    var intPart = Math.floor(Math.abs(value));
    var str = intPart.toString();
    if (digits >= str.length) return intPart;
    var extracted = parseInt(str.substring(0, digits), 10);
    return extracted;
}

/**
 * Apply the digit selection and update the adopted raw value
 */
function applyDigitSelection() {
    var length = parseFloat(document.getElementById('rawLength').value) || 0;
    var width = parseFloat(document.getElementById('rawWidth').value) || 0;
    var grammage = parseFloat(document.getElementById('rawGrammage').value) || 0;
    var count = parseFloat(document.getElementById('rawCount').value) || 0;
    var price = parseFloat(document.getElementById('rawPrice').value) || 0;
    var rawTotal = (length * width * grammage * count / 1000) * price;

    var selectedDigit = document.querySelector('input[name="digits"]:checked');
    var digitCount = selectedDigit ? parseInt(selectedDigit.value) : 0;

    var adoptedValue = extractDigits(rawTotal, digitCount);
    document.getElementById('adoptedRawValue').textContent = Math.floor(adoptedValue) + '$';

    calculateTotal();
}

/**
 * Toggle the floating summary expand/collapse
 */
function toggleSummaryExpand() {
    var summary = document.getElementById('floatingSummary');
    var details = document.getElementById('floatingSummaryDetails');
    var icon = document.getElementById('expandIcon');

    if (summary.classList.contains('expanded')) {
        summary.classList.remove('expanded');
        details.style.display = 'none';
        icon.style.transform = 'rotate(0deg)';
    } else {
        summary.classList.add('expanded');
        details.style.display = 'block';
        icon.style.transform = 'rotate(180deg)';
    }
}

/**
 * Calculate the total cost and update the floating summary
 */
function calculateTotal() {
    // 1. Raw material (use adopted digit-selected value)
    var length = parseFloat(document.getElementById('rawLength').value) || 0;
    var width = parseFloat(document.getElementById('rawWidth').value) || 0;
    var grammage = parseFloat(document.getElementById('rawGrammage').value) || 0;
    var count = parseFloat(document.getElementById('rawCount').value) || 0;
    var price = parseFloat(document.getElementById('rawPrice').value) || 0;
    var fullRawValue = (length * width * grammage * count / 1000) * price;

    // Apply digit selection
    var selectedDigit = document.querySelector('input[name="digits"]:checked');
    var digitCount = selectedDigit ? parseInt(selectedDigit.value) : 0;
    var rawValue = extractDigits(fullRawValue, digitCount);

    // 2. Printing
    var printingValue = getRadioValue('printing');

    // 3. Cellophane (price per 1000 × quantity)
    var cellophaneRate = getRadioValue('cellophane');
    var cellophaneQty = parseFloat(document.getElementById('cellophaneQuantity').value) || 0;
    var cellophaneValue = (cellophaneQty / 1000) * cellophaneRate;

    // 4. Pressing (selectable)
    var pressingValue = getRadioValue('pressing');

    // 5. Thread (optional)
    var threadValue = 0;
    var threadToggle = document.getElementById('threadToggle');
    var floatThreadRow = document.getElementById('floatThreadRow');
    if (threadToggle.checked) {
        var threadQty = parseFloat(document.getElementById('threadQuantity').value) || 0;
        threadValue = (threadQty / 1000) * THREAD_RATE;
        floatThreadRow.style.display = 'flex';
    } else {
        floatThreadRow.style.display = 'none';
    }

    // 6. Mold (optional now)
    var moldValue = 0;
    var moldToggle = document.getElementById('moldToggle');
    var floatMoldRow = document.getElementById('floatMoldRow');
    if (moldToggle.checked) {
        moldValue = FIXED_MOLD;
        floatMoldRow.style.display = 'flex';
    } else {
        floatMoldRow.style.display = 'none';
    }

    // 7. Glue (optional)
    var glueValue = 0;
    var glueToggle = document.getElementById('glueToggle');
    var floatGlueRow = document.getElementById('floatGlueRow');
    if (glueToggle.checked) {
        var glueQty = parseFloat(document.getElementById('glueQuantity').value) || 0;
        glueValue = (glueQty / 1000) * GLUE_RATE;
        floatGlueRow.style.display = 'flex';
    } else {
        floatGlueRow.style.display = 'none';
    }

    // 8. Transport (optional)
    var transportValue = 0;
    var transportToggle = document.getElementById('transportToggle');
    var floatTransportRow = document.getElementById('floatTransportRow');
    if (transportToggle.checked) {
        transportValue = parseFloat(document.getElementById('transportCost').value) || 0;
        floatTransportRow.style.display = 'flex';
    } else {
        floatTransportRow.style.display = 'none';
    }

    // Update floating summary items
    document.getElementById('floatResRaw').textContent = formatPrice(rawValue);
    document.getElementById('floatResPrinting').textContent = formatPrice(printingValue);
    document.getElementById('floatResCellophane').textContent = formatPrice(cellophaneValue);
    document.getElementById('floatResPressing').textContent = formatPrice(pressingValue);
    document.getElementById('floatResThread').textContent = formatPrice(threadValue);
    document.getElementById('floatResMold').textContent = formatPrice(moldValue);
    document.getElementById('floatResGlue').textContent = formatPrice(glueValue);
    document.getElementById('floatResTransport').textContent = formatPrice(transportValue);

    // Show/hide rows based on value > 0
    document.getElementById('floatRawRow').style.display = rawValue > 0 ? 'flex' : 'none';
    document.getElementById('floatPrintingRow').style.display = printingValue > 0 ? 'flex' : 'none';
    document.getElementById('floatCellophaneRow').style.display = cellophaneValue > 0 ? 'flex' : 'none';
    document.getElementById('floatPressingRow').style.display = pressingValue > 0 ? 'flex' : 'none';

    // Calculate total
    var total = rawValue + printingValue + cellophaneValue + pressingValue + threadValue + moldValue + glueValue + transportValue;

    // Update floating total with animation
    var floatingTotalElement = document.getElementById('floatingTotalPrice');
    floatingTotalElement.style.transform = 'scale(1.1)';
    floatingTotalElement.textContent = formatPrice(total);
    setTimeout(function() {
        floatingTotalElement.style.transform = 'scale(1)';
    }, 200);
}

/**
 * Reset the entire form
 */
function resetForm() {
    // Reset raw material fields
    document.getElementById('rawLength').value = '';
    document.getElementById('rawWidth').value = '';
    document.getElementById('rawGrammage').value = '';
    document.getElementById('rawCount').value = '';
    document.getElementById('rawPrice').value = '';
    document.getElementById('rawWeight').textContent = '0.00';
    document.getElementById('rawTotal').textContent = '0.00$';
    document.getElementById('digitsSelection').style.display = 'none';
    document.getElementById('adoptedRawValue').textContent = '0$';
    // Reset digit selection to "كامل"
    var fullDigitRadio = document.querySelector('input[name="digits"][value="0"]');
    if (fullDigitRadio) fullDigitRadio.checked = true;

    // Reset radio buttons
    var radios = document.querySelectorAll('input[type="radio"]');
    for (var i = 0; i < radios.length; i++) {
        radios[i].checked = false;
    }

    // Reset cellophane quantity
    document.getElementById('cellophaneQuantity').value = '';

    // Reset thread
    document.getElementById('threadToggle').checked = false;
    document.getElementById('threadInputGroup').style.display = 'none';
    document.getElementById('threadQuantity').value = '';

    // Reset mold
    document.getElementById('moldToggle').checked = false;
    document.getElementById('moldInfoBox').style.display = 'none';

    // Reset glue
    document.getElementById('glueToggle').checked = false;
    document.getElementById('glueInputGroup').style.display = 'none';
    document.getElementById('glueQuantity').value = '';

    // Reset transport
    document.getElementById('transportToggle').checked = false;
    document.getElementById('transportInputGroup').style.display = 'none';
    document.getElementById('transportCost').value = '';

    // Recalculate
    calculateTotal();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
    calculateTotal();
});
