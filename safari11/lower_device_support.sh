folder="node_modules/daisyui/dist"
for file in "$folder"/*
do
    echo "$file"
    sed -i 's/hsl\((.[^";]*\)\/\(.[^";]*)\)/hsla\1,\2/g' "$file"
done

sed -i 's/hsl(var(${variable}${fallbackColorValue}) \/ ${opacityValue})/hsla(var(${variable}${fallbackColorValue}) , ${opacityValue})/g' node_modules/daisyui/src/colors/index.js
sed -i 's/\" \"/\", \"/g' node_modules/daisyui/src/colors/functions.js
sed -i 's/${h} ${s}% ${l}%/${h}, ${s}%, ${l}%/g' node_modules/@CDNA-Technologies/svelte-vitals/core-libs/theme-util.js
sed -i 's/--p:197 100% 43%;--pf:197 100% 33%;--s:197 100% 43%;--sc:0 0% 100%;--a:115 50% 41%;--af:115 50% 41%;--ac:0 0% 100%;--b1:240 21% 96%;/--p:197,100%,43%;--pf:197,100%,33%;--s:197,100%,43%;--sc:0,0%,100%;--a:115,50%,41%;--af:115,50%,41%;--ac:0,0%,100%;--b1:240,21%,96%;/g' node_modules/@CDNA-Technologies/svelte-vitals/core-libs/theme-util.js