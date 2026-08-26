Add-Type -AssemblyName System.Drawing

$outDir = Join-Path $PSScriptRoot '..\public'
$sizes = @{
  'favicon-32x32.png' = 32
  'apple-touch-icon.png' = 180
  'icon-192.png' = 192
  'icon-512.png' = 512
}

function New-RoundedRect([float]$x, [float]$y, [float]$w, [float]$h, [float]$r) {
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $d = [Math]::Min($r * 2, [Math]::Min($w, $h))
  $path.AddArc($x, $y, $d, $d, 180, 90)
  $path.AddArc($x + $w - $d, $y, $d, $d, 270, 90)
  $path.AddArc($x + $w - $d, $y + $h - $d, $d, $d, 0, 90)
  $path.AddArc($x, $y + $h - $d, $d, $d, 90, 90)
  $path.CloseFigure()
  return $path
}

function New-ScIcon([int]$size) {
  $scale = 4
  $src = $size * $scale
  $bmp = New-Object System.Drawing.Bitmap $src, $src
  $bmp.SetResolution(96, 96)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
  $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
  $g.Clear([System.Drawing.Color]::Transparent)

  $inset = 0.5 * $scale
  $radius = 8 * ($src / 32)
  $shape = New-RoundedRect $inset $inset ($src - $inset * 2) ($src - $inset * 2) $radius
  $fill = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 0, 0, 0))
  $g.FillPath($fill, $shape)
  $pen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(255, 42, 42, 42), $scale)
  $pen.Alignment = [System.Drawing.Drawing2D.PenAlignment]::Inset
  $g.DrawPath($pen, $shape)

  $fontSize = [float](13 * ($src / 32))
  $font = $null
  foreach ($name in @('Segoe UI Semibold', 'Segoe UI')) {
    try {
      $style = if ($name -eq 'Segoe UI') {
        [System.Drawing.FontStyle]::Bold
      } else {
        [System.Drawing.FontStyle]::Regular
      }
      $font = [System.Drawing.Font]::new(
        $name,
        $fontSize,
        $style,
        [System.Drawing.GraphicsUnit]::Pixel
      )
      break
    } catch {
      $font = $null
    }
  }
  if (-not $font) {
    $font = [System.Drawing.Font]::new(
      'Segoe UI',
      $fontSize,
      [System.Drawing.FontStyle]::Bold,
      [System.Drawing.GraphicsUnit]::Pixel
    )
  }

  $text = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 245, 245, 245))
  $sf = New-Object System.Drawing.StringFormat
  $sf.Alignment = [System.Drawing.StringAlignment]::Center
  $sf.LineAlignment = [System.Drawing.StringAlignment]::Center
  $rect = New-Object System.Drawing.RectangleF 0, ($src * 0.04), $src, $src
  $g.DrawString('SC', $font, $text, $rect, $sf)

  $g.Dispose()
  $shape.Dispose()
  $fill.Dispose()
  $pen.Dispose()
  $text.Dispose()
  $font.Dispose()
  $sf.Dispose()

  $out = New-Object System.Drawing.Bitmap $size, $size
  $og = [System.Drawing.Graphics]::FromImage($out)
  $og.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $og.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $og.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $og.Clear([System.Drawing.Color]::Transparent)
  $og.DrawImage($bmp, 0, 0, $size, $size)
  $og.Dispose()
  $bmp.Dispose()
  return $out
}

foreach ($entry in $sizes.GetEnumerator()) {
  $icon = New-ScIcon $entry.Value
  $path = Join-Path $outDir $entry.Key
  $icon.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $icon.Dispose()
}

$png32 = [System.IO.File]::ReadAllBytes((Join-Path $outDir 'favicon-32x32.png'))
$header = New-Object byte[] 6
$header[2] = 1
$header[4] = 1
$entry = New-Object byte[] 16
$entry[0] = 32
$entry[1] = 32
$entry[4] = 1
$entry[6] = 32
[BitConverter]::GetBytes([int]$png32.Length).CopyTo($entry, 8)
[BitConverter]::GetBytes([int]22).CopyTo($entry, 12)
$ico = New-Object byte[] (22 + $png32.Length)
[Buffer]::BlockCopy($header, 0, $ico, 0, 6)
[Buffer]::BlockCopy($entry, 0, $ico, 6, 16)
[Buffer]::BlockCopy($png32, 0, $ico, 22, $png32.Length)
[System.IO.File]::WriteAllBytes((Join-Path $outDir 'favicon.ico'), $ico)

Write-Output 'wrote clean SC icons'
