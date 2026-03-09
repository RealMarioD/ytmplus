import { ytmpConfig } from '../../ytmpConfig';

// Get all parent dependencies (supports both string and array format)
function getParentDependencies(field) {
    const dependencies = [];

    // Collect from both subCheckbox and subOption (can use both simultaneously!)
    const subCheckbox = field.settings.subCheckbox;
    const subOption = field.settings.subOption;

    if(subCheckbox) {
        const checkboxDeps = Array.isArray(subCheckbox) ? subCheckbox : [subCheckbox];
        dependencies.push(...checkboxDeps);
    }

    if(subOption) {
        const optionDeps = Array.isArray(subOption) ? subOption : [subOption];
        dependencies.push(...optionDeps);
    }

    if(dependencies.length === 0) return [];

    return dependencies.map(dep => {
        // Check for negation prefix (!)
        const inverted = dep.startsWith('!');
        if(inverted) dep = dep.slice(1); // Remove the '!'

        const parts = dep.split('.');
        const parentField = ytmpConfig.fields[parts[0]];
        const selectOption = parts.length === 2 ? parseInt(parts[1], 10) : null;
        return { parentField, selectOption, inverted };
    });
}

// Check if a specific parent field's current value meets the condition
function checkParentCondition(parentField, selectOption) {
    if(!parentField) return false;

    if(parentField.settings.type === 'checkbox')
        return parentField.value === true;
    else if(parentField.settings.type === 'customSelect')
        return parentField.node.selectedIndex === selectOption;

    return true;
}

// Recursively check if a field should be visible (ALL parent conditions must be met)
function isFieldVisible(field) {
    const dependencies = getParentDependencies(field);

    // No dependencies? Always visible
    if(dependencies.length === 0) return true;

    // Check ALL dependencies - if any fail, field is hidden
    for(const { parentField, selectOption, inverted } of dependencies) {
        // Check if parent is visible (recursive!)
        if(!isFieldVisible(parentField)) return false;

        // Parent is visible, check if specific condition is met
        let conditionMet = checkParentCondition(parentField, selectOption);

        // Invert the condition if '!' prefix was used
        if(inverted) conditionMet = !conditionMet;

        if(!conditionMet) return false;
    }

    return true;
}

// Update a field's visibility based on recursive check
function updateFieldVisibility(field) {
    field.wrapper.style.display = isFieldVisible(field) ? 'flex' : 'none';
}

// Calculate nesting depth (how many levels deep this sub is)
function getFieldDepth(field) {
    const dependencies = getParentDependencies(field);

    // No dependencies = depth 0 (not a sub)
    if(dependencies.length === 0) return 0;

    // Find the maximum depth among all parents and add 1
    let maxParentDepth = 0;
    for(const { parentField } of dependencies) {
        if(parentField) {
            const parentDepth = getFieldDepth(parentField);
            if(parentDepth > maxParentDepth)
                maxParentDepth = parentDepth;
        }
    }

    return maxParentDepth + 1;
}

export function sortSubs() {
    // Collect all fields that have sub dependencies
    const fieldsWithSubs = [];

    for(const fieldKey in ytmpConfig.fields) {
        const currentField = ytmpConfig.fields[fieldKey];
        const hasSub = currentField.settings.subCheckbox || currentField.settings.subOption;

        if(!hasSub) continue;

        fieldsWithSubs.push(currentField);

        // Calculate nesting depth and apply progressive padding
        const depth = getFieldDepth(currentField);
        const paddingPercent = 5 * depth; // 5% per level (sub=5%, sub-sub=10%, etc.)

        const currentLabel = currentField.wrapper.firstElementChild;
        currentLabel.style.paddingLeft = `${paddingPercent}%`;
        currentLabel.style.width = `${100 - paddingPercent - 30}%`; // Adjust width to compensate

        // Set initial visibility
        updateFieldVisibility(currentField);
    }

    // Add change listeners to all checkbox/select fields
    // When any field changes, update all dependent fields
    for(const fieldKey in ytmpConfig.fields) {
        const field = ytmpConfig.fields[fieldKey];

        if(field.settings.type !== 'checkbox' && field.settings.type !== 'select' && field.settings.type !== 'customSelect')
            continue;


        field.node.addEventListener('change', () => {
            // Update all fields with dependencies (recursive visibility handles the rest)
            fieldsWithSubs.forEach(subField => updateFieldVisibility(subField));
        });
    }
}