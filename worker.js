export default {
  async fetch(request, env) {
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>✅ Gemini AI LIVE!</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; text-align: center; background: #f0fdf4; }
        h1 { color: #10b981; font-size: 2.5em; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🎉 LIVE ON CLOUDFLARE!</h1>
        <p><strong>Worker:</strong> wispy-lake-289c</p>
        <p><strong>URL:</strong> https://wispy-lake-289c.juliusgawo6.workers.dev</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        <p>✅ Your app is deployed and working!</p>
      </div>
    </body>
    </html>`;
    
    return new Response(html, {
      headers: { 'Content-Type': 'text/html' }
    });
  }
}
