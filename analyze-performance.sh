#!/bin/bash

# 🚀 SCRIPT DE ANÁLISE DE PERFORMANCE DEVELOPMENT
# Script para análise rápida de performance em ambiente de desenvolvimento

echo "🔍 ANALISANDO PERFORMANCE DA LANDING PAGE SOLUCTIONS..."
echo "=================================================="

# Verificar se o arquivo index.html existe
if [ ! -f "index.html" ]; then
    echo "❌ Arquivo index.html não encontrado!"
    exit 1
fi

echo ""
echo "📊 ANÁLISE DE RECURSOS E OTIMIZAÇÕES:"
echo "------------------------------------"

# Analisar duplicações de recursos
echo "🔍 Verificando duplicações de recursos..."

# Fontes duplicadas
font_count=$(grep -c "googleapis.com" index.html)
echo "   📝 Google Fonts carregadas: $font_count vezes"

# Scripts externos
script_count=$(grep -c "cdnjs.cloudflare.com" index.html)
echo "   📜 Scripts CDNJS: $script_count"

# CSS externos
css_count=$(grep -c "rel=\"stylesheet\"" index.html)
echo "   🎨 CSS externos: $css_count"

echo ""
echo "🎯 OTIMIZAÇÕES IMPLEMENTADAS:"
echo "----------------------------"

# Verificar preconnections
preconnect_count=$(grep -c "rel=\"preconnect\"" index.html)
echo "   🔗 Preconnections: $preconnect_count"

# Verificar carregamento diferido
deferred_css=$(grep -c "media=\"print\"" index.html)
echo "   ⏳ CSS diferido: $deferred_css"

# Verificar JavaScript crítico
critical_js=$(grep -c "js/critical.js" index.html)
echo "   ⚡ JavaScript crítico: $critical_js"

echo ""
echo "📁 ANÁLISE DE ARQUIVOS:"
echo "----------------------"

# Tamanhos de arquivos
echo "   📄 Tamanhos dos arquivos principais:"
if [ -f "index.html" ]; then
    size=$(du -h index.html | cut -f1)
    echo "      - index.html: $size"
fi

if [ -f "index-optimized.html" ]; then
    size=$(du -h index-optimized.html | cut -f1)
    echo "      - index-optimized.html: $size"
fi

if [ -f "css/main.css" ]; then
    size=$(du -h css/main.css | cut -f1)
    echo "      - main.css: $size"
fi

if [ -f "css/main-critical.css" ]; then
    size=$(du -h css/main-critical.css | cut -f1)
    echo "      - main-critical.css: $size"
fi

if [ -f "css/main-optimized.css" ]; then
    size=$(du -h css/main-optimized.css | cut -f1)
    echo "      - main-optimized.css: $size"
fi

if [ -f "js/main.js" ]; then
    size=$(du -h js/main.js | cut -f1)
    echo "      - main.js: $size"
fi

if [ -f "js/critical.js" ]; then
    size=$(du -h js/critical.js | cut -f1)
    echo "      - critical.js: $size"
fi

echo ""
echo "🔧 VERIFICAÇÕES DE PERFORMANCE:"
echo "------------------------------"

# Verificar CSS crítico inline
inline_css=$(grep -c "<style>" index.html)
echo "   🎨 CSS inline crítico: $inline_css blocos"

# Verificar async/defer nos scripts
async_scripts=$(grep -c "async" index.html)
defer_scripts=$(grep -c "defer" index.html)
echo "   📜 Scripts async: $async_scripts"
echo "   📜 Scripts defer: $defer_scripts"

# Verificar lazy loading
lazy_images=$(grep -c "loading=\"lazy\"" index.html 2>/dev/null || echo "0")
echo "   🖼️  Imagens com lazy loading: $lazy_images"

# Verificar meta tags de performance
viewport_meta=$(grep -c "viewport" index.html)
echo "   📱 Meta viewport: $viewport_meta"

echo ""
echo "📋 RECOMENDAÇÕES DE DESENVOLVIMENTO:"
echo "-----------------------------------"

# Verificações específicas para desenvolvimento
echo "   ✅ IMPLEMENTADO:"

if grep -q "preconnect" index.html; then
    echo "      - Preconnections para domínios externos"
fi

if grep -q "css/main-critical.css" index.html; then
    echo "      - CSS crítico separado"
fi

if grep -q "js/critical.js" index.html; then
    echo "      - JavaScript crítico otimizado"
fi

if grep -q "media=\"print\"" index.html; then
    echo "      - Carregamento diferido de CSS não-crítico"
fi

echo ""
echo "   🎯 PRÓXIMOS PASSOS PARA DESENVOLVIMENTO:"
echo "      1. Testar em dispositivos móveis reais"
echo "      2. Verificar Network tab no DevTools"
echo "      3. Executar Lighthouse audit"
echo "      4. Monitorar Core Web Vitals"

echo ""
echo "🚀 COMANDOS ÚTEIS PARA DESENVOLVIMENTO:"
echo "--------------------------------------"
echo "   # Iniciar servidor local:"
echo "   python3 -m http.server 8000"
echo ""
echo "   # Análise Lighthouse (Chrome):"
echo "   npx lighthouse http://localhost:8000 --output html --output-path lighthouse-report.html"
echo ""
echo "   # Verificar tamanho comprimido:"
echo "   gzip -c index.html | wc -c"

echo ""
echo "✨ ANÁLISE CONCLUÍDA!"
echo "==================="
