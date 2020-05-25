#!/bin/bash

file=${1--}

mkdir -p .ebextensions

cat << EOF
{
  "option_settings": [
EOF

grep -v '^#' $file | while IFS="=" read -r key val ; do
    if [[ -n "$val" ]]; then
cat << EOF
    {
        "option_name": "$key"
        "value": "$val"
    },
EOF
    fi
done

cat << EOF
  ]
}
EOF
