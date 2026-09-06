# Tabler icons (MIT), retrieved from the Iconify SVG API.
# https://iconify.design/docs/api/svg.html
$ErrorActionPreference = 'Stop'
$iconDirectory = Join-Path $PSScriptRoot '../images/icons'
New-Item -ItemType Directory -Path $iconDirectory -Force | Out-Null
$iconNames = @('command', 'moon', 'sun', 'menu-2', 'arrow-down', 'download', 'player-pause', 'player-play', 'plus', 'certificate', 'search', 'copy', 'brand-github', 'brand-linkedin', 'x', 'brand-python', 'brain', 'link', 'database', 'chart-dots', 'table', 'code', 'brand-javascript', 'brand-php', 'api', 'brand-html5', 'brand-git', 'infinity', 'git-branch')
foreach ($iconName in $iconNames) {
  $destination = Join-Path $iconDirectory ($iconName + '.svg')
  Invoke-WebRequest -Uri ('https://api.iconify.design/tabler/' + $iconName + '.svg') -OutFile $destination
}
Write-Output ('Downloaded ' + $iconNames.Count + ' Tabler icons from Iconify.')
