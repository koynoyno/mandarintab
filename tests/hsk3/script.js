#!/bin/bash

# Extract all simplified values from hsk7.js
simplified_values=$(grep -oE '"simplified": "[^"]*"' hsk7.js | cut -d '"' -f 4)

# Loop through the simplified values
for simplified_value in $simplified_values; do
    # Find the corresponding line in zhuyin7.json
    replacement_line=$(grep -E "\"simplified\": \"$simplified_value\",\"zhuyin\": \"[^\"]+\"" zhuyin7.json)

    # If a replacement line is found, replace the original line in hsk7.js
    if [[ -n "$replacement_line" ]]; then
        sed -i '' -e "s/\"simplified\": \"$simplified_value\"[[:space:]]*,[[:space:]]*/$replacement_line/g" hsk7.js
    fi
done