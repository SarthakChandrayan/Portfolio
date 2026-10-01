Add-Type -AssemblyName System.Drawing

# Renders public/og.png, the 1200x630 link-preview image used by Open Graph / Twitter.
$root = Join-Path $PSScriptRoot '..'
$out = Join-Path $root 'public\og.png'
$avatarPath = Join-Path $root 'public\avatar-lg.jpg'

$w = 1200
$h = 630
$bmp = New-Object System.Drawing.Bitmap $w, $h
$bmp.SetResolution(96, 96)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$g.Clear([System.Drawing.Color]::Black)

function Color([int]$r, [int]$gr, [int]$b, [int]$a = 255) {
  [System.Drawing.Color]::FromArgb($a, $r, $gr, $b)
}

# Faint dot grid, matching the site background.
$dot = New-Object System.Drawing.SolidBrush (Color 255 255 255 14)
for ($x = 24; $x -lt $w; $x += 32) {
  for ($y = 24; $y -lt $h; $y += 32) { $g.FillEllipse($dot, $x, $y, 2, 2) }
}

# Avatar, cropped to a circle with a thin ring.
$avatar = [System.Drawing.Image]::FromFile($avatarPath)
$size = 220
$ax = 96
$ay = 120
$clip = New-Object System.Drawing.Drawing2D.GraphicsPath
$clip.AddEllipse($ax, $ay, $size, $size)
$g.SetClip($clip)
$side = [Math]::Min($avatar.Width, $avatar.Height)
$src = New-Object System.Drawing.Rectangle (($avatar.Width - $side) / 2), (($avatar.Height - $side) / 2), $side, $side
$g.DrawImage($avatar, (New-Object System.Drawing.Rectangle $ax, $ay, $size, $size), $src, [System.Drawing.GraphicsUnit]::Pixel)
$g.ResetClip()
$ring = New-Object System.Drawing.Pen (Color 255 255 255 60), 3
$g.DrawEllipse($ring, $ax - 4, $ay - 4, $size + 8, $size + 8)
$avatar.Dispose()

# Text block.
$tx = 372
$white = New-Object System.Drawing.SolidBrush (Color 245 245 245)
$muted = New-Object System.Drawing.SolidBrush (Color 163 163 163)
$subtle = New-Object System.Drawing.SolidBrush (Color 115 115 115)
$green = New-Object System.Drawing.SolidBrush (Color 63 185 80)

$mono = New-Object System.Drawing.Font 'Consolas', 20
$name = New-Object System.Drawing.Font 'Segoe UI Semibold', 52
$title = New-Object System.Drawing.Font 'Segoe UI', 30
$body = New-Object System.Drawing.Font 'Segoe UI', 22

$g.DrawString('@SarthakChandrayan', $mono, $subtle, $tx, 128)
$g.DrawString('Sarthak Chandrayan', $name, $white, $tx - 6, 156)
$g.DrawString('Full-Stack Engineer', $title, $muted, $tx, 244)
$sep = ' ' + [char]0x00B7 + ' '
$g.DrawString(('TypeScript', 'Node.js', 'React', 'React Native', 'Next.js', 'AI') -join $sep, $body, $subtle, $tx, 300)

# Decorative contribution strip.
$levels = @(
  (Color 22 27 34), (Color 14 68 41), (Color 0 109 50), (Color 38 166 65), (Color 57 211 83)
)
$cell = 14
$gap = 4
$cols = 50
$gy = 420
$rand = New-Object System.Random 7
for ($c = 0; $c -lt $cols; $c++) {
  for ($r = 0; $r -lt 5; $r++) {
    $lv = $rand.Next(0, 5)
    if ($c -lt 8 -and $lv -gt 1) { $lv = 1 }
    $brush = New-Object System.Drawing.SolidBrush $levels[$lv]
    $g.FillRectangle($brush, 96 + $c * ($cell + $gap), $gy + $r * ($cell + $gap), $cell, $cell)
    $brush.Dispose()
  }
}

$g.FillEllipse($green, 96, 546, 10, 10)
$g.DrawString('sarthakchandrayan.com', $mono, $muted, 114, 536)

$bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$bmp.Dispose()
Write-Output "wrote $out"
