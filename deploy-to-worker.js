export default {
  async fetch(request) {
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Gemini AI App</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; text-align: center; }
        h1 { color: #10b981; }
        .container { max-width: 800px; margin: 0 auto; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>✅ Gemini AI App Live!</h1>
        <p>Deployed via Cloudflare Worker</p>
        <p><a href="https://wispy-lake-289c.juliusgawo6.workers.dev">View Live</a></p>
      </div>
    </body>
    </html>`;
    
    return new Response(html, {
      headers: { 'Content-Type': 'text/html' }
    });
  }
}
