export default {
  async fetch(request, env) {
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>✅ Gemini AI Live!</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; text-align: center; }
        h1 { color: #10b981; font-size: 2.5em; }
        .success { background: #f0fdf4; padding: 20px; border-radius: 10px; }
      </style>
    </head>
    <body>
      <div class="success">
        <h1>🎉 DEPLOYMENT SUCCESSFUL!</h1>
        <p>Your Gemini AI app is now live on Cloudflare Worker.</p>
        <p><strong>URL:</strong> https://wispy-lake-289c.juliusgawo6.workers.dev</p>
        <p>Worker: wispy-lake-289c</p>
        <p>Time: ${new Date().toLocaleString()}</p>
      </div>
    </body>
    </html>`;
    
    return new Response(html, {
      headers: { 'Content-Type': 'text/html' }
    });
  }
}
