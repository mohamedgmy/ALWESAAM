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
 * Formula: Weight = Length × Width × Grammage × Count
 *          Raw Cost = Weight × Price per kg
 */
function calculateRaw() {
    var length = parseFloat(document.getElementById('rawLength').value) || 0;
    var width = parseFloat(document.getElementById('rawWidth').value) || 0;
    var grammage = parseFloat(document.getElementById('rawGrammage').value) || 0;
    var count = parseFloat(document.getElementById('rawCount').value) || 0;
    var price = parseFloat(document.getElementById('rawPrice').value) || 0;

    var weight = length * width * grammage * count;
    var rawTotal = weight * price;

    document.getElementById('rawWeight').textContent = weight.toFixed(2);
    document.getElementById('rawTotal').textContent = formatPrice(rawTotal);

    calculateTotal();
}

/**
 * Calculate the total cost and update the result card
 */
function calculateTotal() {
    // 1. Raw material (calculated from dimensions)
    var length = parseFloat(document.getElementById('rawLength').value) || 0;
    var width = parseFloat(document.getElementById('rawWidth').value) || 0;
    var grammage = parseFloat(document.getElementById('rawGrammage').value) || 0;
    var count = parseFloat(document.getElementById('rawCount').value) || 0;
    var price = parseFloat(document.getElementById('rawPrice').value) || 0;
    var rawValue = length * width * grammage * count * price;

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
    var threadRow = document.getElementById('resThreadRow');
    if (threadToggle.checked) {
        var threadQty = parseFloat(document.getElementById('threadQuantity').value) || 0;
        threadValue = (threadQty / 1000) * THREAD_RATE;
        threadRow.style.display = 'flex';
    } else {
        threadRow.style.display = 'none';
    }

    // 6. Mold (fixed)
    var moldValue = FIXED_MOLD;

    // 7. Glue (optional)
    var glueValue = 0;
    var glueToggle = document.getElementById('glueToggle');
    var glueRow = document.getElementById('resGlueRow');
    if (glueToggle.checked) {
        var glueQty = parseFloat(document.getElementById('glueQuantity').value) || 0;
        glueValue = (glueQty / 1000) * GLUE_RATE;
        glueRow.style.display = 'flex';
    } else {
        glueRow.style.display = 'none';
    }

    // 8. Transport (optional)
    var transportValue = 0;
    var transportToggle = document.getElementById('transportToggle');
    var transportRow = document.getElementById('resTransportRow');
    if (transportToggle.checked) {
        transportValue = parseFloat(document.getElementById('transportCost').value) || 0;
        transportRow.style.display = 'flex';
    } else {
        transportRow.style.display = 'none';
    }

    // Update result items
    document.getElementById('resRaw').textContent = formatPrice(rawValue);
    document.getElementById('resPrinting').textContent = formatPrice(printingValue);
    document.getElementById('resCellophane').textContent = formatPrice(cellophaneValue);
    document.getElementById('resPressing').textContent = formatPrice(pressingValue);
    document.getElementById('resThread').textContent = formatPrice(threadValue);
    document.getElementById('resMold').textContent = formatPrice(moldValue);
    document.getElementById('resGlue').textContent = formatPrice(glueValue);
    document.getElementById('resTransport').textContent = formatPrice(transportValue);

    // Calculate total
    var total = rawValue + printingValue + cellophaneValue + pressingValue + threadValue + moldValue + glueValue + transportValue;

    // Update total with animation
    var totalElement = document.getElementById('totalPrice');
    totalElement.style.transform = 'scale(1.1)';
    totalElement.textContent = formatPrice(total);
    setTimeout(function() {
        totalElement.style.transform = 'scale(1)';
    }, 200);
}

/**
 * Reset the entire form
 */
function resetForm() {
    // Reset raw material
    document.getElementById('rawMaterial').value = '';

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